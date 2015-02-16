#!/usr/bin/python
print 'Content-type: text/plain\n'

# Import modules for CGI handling
from org.firelab.farsite.data import *
from org.firelab.farsite.api import *

import os,cgi, cgitb
#import daemon
#import libs
import time
import sys
import json
import psycopg2
import os
import subprocess
import shutil
import settings 

class farsiteRun():
	def updateStatus(self,runid, status, percentage, lastmsg):
		query = """
			UPDATE administration.runs SET (status, lastmsg, percentage, lastupdate)
			= (%s, %s, %s, now())
			WHERE id = %s"""
		data = (status, lastmsg, percentage, runid, )
		self.cur.execute(query, data )
		self.conn.commit()
		return
	
	
	def main(self,result):
		runid = result[0]
		cur = self.cur	
		self.updateStatus(runid, "running", 10, "Klaarzetten data")
		
		#CREATE OUTPUT DIR
		outdir = '/var/data/wildfire/fires/%s/' % runid
		if not os.path.exists(outdir):
			os.makedirs(outdir)
		os.chdir(outdir) #Go into output directory
		query = "SELECT point, weatherstring, windstring, startmonth, startday, starthour, fuelmodel, name, stoplines FROM administration.params_farsiterun WHERE run = %s;"
		data = (runid, )
		cur.execute(query, data )
		res = cur.fetchone()
		wktString = str(res[0])
		weatherString = str(res[1])
		windString = str(res[2])
		startMonth = str(res[3]).zfill(2)
		startDay   = str(res[4]).zfill(2)
		startHour  = str(res[5]).zfill(4)
		startMin   = str(0).zfill(2)
		fuelmodel  = str(res[6])
		name 	   = str(res[7])
		wktStopline =str(res[8])
		endMonth   = startMonth
		endDay     = startDay
		endHour    = str(int(startHour) + 600).zfill(4)
		endMin 	   = str(0).zfill(2)
		if (int(endHour) > 2300):
			endDay = str(int(endDay) + 1)
			endHour = str(int(endHour) - 2400)
		
		#COPY CORRECT FUELMODEL
		lcpfrom = '/var/data/wildfire/fuelmodels/%s/landscape.lcp' % fuelmodel
		lcpto = outdir + '/LANDSCAPE.LCP'
		shutil.copy2(lcpfrom, lcpto)
		
		fmsfrom = '/var/www/main/gmi/defaults/Low.FMS' 
		fmsto = outdir + '/LOW.FMS'
		shutil.copy2(fmsfrom, fmsto)
		
		#WRITE OUT WINDSTRING FROM POSTGRES
		windfile = '%s/WIND.WND' % outdir
		f = open(windfile, 'w')
		f.write("METRIC\n")
		windArr = windString.replace('),(',');(').split(';')
		for o in windArr:
			f.write(o.replace('(','').replace(')','').replace(',',' ') + '\r\n')
		f.close()
		
		#WRITE OUT WEATHERSTRING FROM POSTGRES
		weatherfile = '%s/WEATHER.WTR' % outdir
		f = open(weatherfile, 'w')
		f.write("METRIC\r\n")
		weatherArr = weatherString.replace('),(',');(').split(';')
		for o in weatherArr:
			f.write(o.replace('(','').replace(')','').replace(',',' ') + '\r\n')
		f.close()
		
		
		
		#WRITE OUT VECTOR FROM POSTGRES
		vectorfile = '%s/IGNITION.VCT' % outdir
		f = open(vectorfile, 'w')
		vcttype = 'unknown'
		counter = 1
		stringarray = wktString.split('!')
		for string in stringarray:
		    # * FIND GEOM TYPE
		    if (string.find('POINT') > -1):
		        vcttype = 'point'
		        f.write('601\r\n')
		    elif (string.find('LINESTRING') > -1):
		        vcttype = 'line'
		        f.write('0000000000' + str(counter) + '\r\n')
		        counter = counter+1
		    geomArr = string.replace('POINT(','').replace('LINESTRING(','').replace(')','').split(',')
		    for coordinate in geomArr:
		        numbers = coordinate.split(' ')
		        for number in numbers:
		            f.write(str(int(round(float(number),0))) + ' ')
		        f.write('\r\n')
		    f.write('END\r\n')
		f.write('END') #Why 2 times??
		f.close()
		
		#Write out stopline
		pgserver_host = settings.pgserver_host #'192.168.40.5'
		pgserver_port = settings.pgserver_port #'3389'
		pgserver_user = settings.pgserver_user #'modeluser'
		sqlstring = 'WITH arr As (SELECT regexp_split_to_array(stoplines,\'!\') arr FROM administration.params_farsiterun  WHERE run = '+str(runid)+'),series AS (SELECT generate_series(1,array_length(arr,1)) c FROM arr)SELECT ST_GeometryFromText(arr[c]) geom FROM series, arr'
		callstring = 'ogr2ogr -f "ESRI Shapefile" '+str(outdir)+'barriers.shp -overwrite PG:"host='+pgserver_host+' port='+pgserver_port+' user=modeluser dbname=research password=modeluser" -sql "' + sqlstring + '"'
		#"SELECT ST_GeometryFromText(stoplines) FROM administration.params_farsiterun  WHERE run = '+str(runid)+'"'
		print callstring
		subprocess.call(callstring, shell=True)
		
		#TT: Starting new version from here...
		outdir = os.path.join('/var/data/wildfire/fires/', str(runid))
		
		cfg = FarsiteConfig()
		
		# Required input files
		cfg.setFuelMoistureFname(os.path.join(outdir, 'LOW.FMS'))
		cfg.addWeatherFname(os.path.join(outdir, 'WEATHER.WTR'))
		cfg.addWindFname(os.path.join(outdir, 'WIND.WND'))
		cfg.setLandscapeFname(os.path.join(outdir, 'LANDSCAPE.LCP'))
		cfg.setAdjustmentFname(os.path.join(settings.defaults_path, 'Factor_1.ADJ'))
		#bpd = BurnPeriodDataset()
		#bpd.getData().insert(BurnPeriod(int(startMonth),int(startDay)-2))
		#bpd.getData().insert(BurnPeriod(int(startMonth),int(startDay)-1))
		#bpd.getData().insert(BurnPeriod(int(startMonth),int(startDay),800,2359))
		#bpd.getData().insert(BurnPeriod(int(startMonth),int(startDay),800,2359))
		#cfg.setBurnPeriodData(bpd)
		#cfg.setBurnPeriodFname(os.path.join(indir, 'ashley.bpd'))
		
		print 'setup model parameters'
		params = ModelParameters()
		params.setUnits(METRIC)
		params.setTimestep(15)
		params.setPrimaryVis(30)
		params.setSecondaryVis(60)
		params.setPerimeterRes(60) #60
		params.setDistanceRes(30) #30
		cfg.setModelParameters(params)
		
		print 'setup fire behavior options'
		fb = FireBehaviorOptions()
		fb.setCrownfire(False)
		fb.setCrownDensityLink(False)
		fb.setTorchingEmbers(False)
		fb.setSpotGrowth(False)
		fb.setConstantBacking(False)
		fb.setFireDistanceChk(True)
		cfg.setFireBehavior(fb)

		print 'set post frontal options'
		pf = PostFrontalOptions()
		pf.setEnabled(False)
		cfg.setPostFrontal(pf)

		print 'duration options'
		dur = DurationOptions()
		dur.setConditioning(int(startMonth),int(startDay) - 5 )
		dur.setStart(int(startMonth), int(startDay), int(startHour[:2]), int(startHour[2:]))
		dur.setStop( int(endMonth), int(endDay), int(endHour[:2]), int(endHour[2:]))
		cfg.setDuration(dur)

		# setup the highway as a barrier
		highway = ShapefileBarrier()
		highway.setFileName(os.path.join(outdir, 'barriers.shp'))
		cfg.addBarrierFile(highway)

		print 'ignition data'
		ign = Ignition()
		ign.setFile(os.path.join(outdir, 'IGNITION.VCT'))
		ign.setType(Ignition.LINE)
		cfg.setIgnition(ign)

		print 'output options'
		output = OutputOptions()
		output.setUnits(METRIC)
		output.setShapeFile(os.path.join(outdir, 'results.shp'), True, OutputOptions.LINES)
		#output.setRasterFile(os.path.join(outdir, 'ash_raster'), OutputOptions.ARC)
		#output.clearRasters()
		#output.addRaster(OutputOptions.TIME_OF_ARRIVAL)
		#output.addRaster(OutputOptions.FIRELINE_INTENSITY)
		#output.addRaster(OutputOptions.RATE_OF_SPREAD)
		output.setBarriersSep(True);  
		output.setLogFiles(True)
		cfg.setOutputs(output)

		print 'load data from named files'
		cfg.loadAllFiles()
		
		print 'start the simulation'
		ctl = FarsiteControl.getInstance(outdir)
		ctl.initialize(cfg)
		ctl.saveSettings(os.path.join(outdir, 'Settings.txt'))
		print 'Settings have been saved'
		              
		timestep = 0
		state = ctl.simulateNext()
		print "Completed timestep: ", timestep
		while (((state == FarsiteControl.SUSPENDED) or (state == FarsiteControl.RUNNING)) and timestep < 100):
			state = ctl.simulateNext()
			timestep += 1
			print "Completed timestep: ", timestep
			self.updateStatus(runid, "running", 10 + (timestep), "Exporteren uitvoer")
		ctl.terminate()
		print 'finished'

		self.updateStatus(runid, "running", 60, "Exporteren uitvoer")
		pgserver_host = settings.pgserver_host #'192.168.40.5'
		pgserver_port = settings.pgserver_port #'3389'
		pgserver_user = settings.pgserver_user #'modeluser'
		callstring = 'ogr2ogr -f "PostgreSQL" PG:"host='+pgserver_host+' port='+pgserver_port+' user=modeluser dbname=research password=modeluser" -nln result_'+str(runid)+' -lco schema=model_wildfire -lco OVERWRITE=YES '+str(outdir)+'/results.shp'
		subprocess.call(callstring, shell=True)	
		print callstring
		#Simplify the geometry and remove enclave fires
		query = """
			DELETE FROM model_wildfire.result_%s WHERE fire_type = 'Enclave Fire';
			UPDATE model_wildfire.result_%s SET wkb_geometry = ST_SimplifyPreserveTopology(wkb_geometry,10);
			"""
		self.updateStatus(runid, "running", 60, "Verwijder enclave fire")
		try:
			data = (runid, runid, )
			cur.execute(query, data )
			self.updateStatus(runid, "running", 70, "Trying")
		except e:
			self.updateStatus(runid, "running", 70, "Caught")
		#result = cur.fetchone()
		self.updateStatus(runid, "running", 70, "Verwerken uitvoer")
		#TODO: error checking
		#Create layersource
		curlstring = 'curl -v -u modeluser:modeluser -XPOST -H "Content-type: text/xml" -d "<featureType><name>result_'+str(runid)+'</name></featureType>" http://'+settings.gs_host+':'+settings.gs_port+'/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes'	
		os.system(curlstring)
		#Create layer
		curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<featureType><title>'+name+'</title></featureType>" 		http://'+settings.gs_host+':'+settings.gs_port+'/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes/result_'+str(runid)
		os.system(curlstring)
		#Add CRS to layer
		curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<featureType><nativeCRS>EPSG:28992</nativeCRS></featureType>" http://'+settings.gs_host+':'+settings.gs_port+'/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes/result_'+str(runid)
		os.system(curlstring)
		#Add srs to layer
		curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<featureType><srs>EPSG:28992</srs><enabled>true</enabled></featureType>" http://'+settings.gs_host+':'+settings.gs_port+'/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes/result_'+str(runid)
		os.system(curlstring)
		#Freakin bug, you have to add 'enabled': http://comments.gmane.org/gmane.comp.gis.geoserver.user/26753
		curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<layer><defaultStyle><name>isochrones</name></defaultStyle><enabled>true</enabled></layer>" http://'+settings.gs_host+':'+settings.gs_port+'/geoserver/rest/layers/model_wildfire:result_'+str(runid)
		os.system(curlstring)
		
		self.updateStatus(runid, "finished", 100, "Model klaar")
		return
	
	def start(self):
		#Set postgres connection
		#conn_params = "host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser"
		conn_params = settings.conn_params
		conn = psycopg2.connect(conn_params)
		cur = conn.cursor()
		self.conn = conn
		self.cur = cur
		self.conn_params = conn_params
		#Get the first available scheduled run
		query = """
			SELECT a.id
			FROM administration.runs a 
			WHERE a.status = 'scheduled'
			AND a.model = 5
			ORDER BY a.id
			LIMIT 1;
			"""
		cur.execute(query )
		result = cur.fetchone()
		
		if (result):
			self.main(result)
if __name__ == "__main__":
	obj = farsiteRun()
	obj.start()
	print('not to be run as standalone')

