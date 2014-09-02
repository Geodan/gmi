#!/usr/bin/python
print 'Content-type: text/plain\n'

# Import modules for CGI handling
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
		outdir = '/var/data/wildfire/fires/%s' % runid
		if not os.path.exists(outdir):
			os.makedirs(outdir)
		os.chdir(outdir) #Go into output directory
		query = "SELECT point, weatherstring, windstring, startmonth, startday, starthour, fuelmodel, name FROM administration.params_farsiterun WHERE run = %s;"
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
		endMonth   = startMonth
		endDay     = startDay
		endHour    = str(int(startHour) + 600).zfill(4)
		endMin 	   = str(0).zfill(2)
		if (int(endHour) > 2300):
			endDay = str(int(endDay) + 1)
			endHour = str(int(endHour) - 2400)
		
		#COPY CORRECT FUELMODEL
		lcpfrom = '/var/data/wildfire/fuelmodels/%s/landscape.lcp' % fuelmodel
		lcpto = outdir + '/landscape.LCP'
		shutil.copy2(lcpfrom, lcpto)
		
		#WRITE OUT WINDSTRING FROM POSTGRES
		windfile = outdir + '/wind.WND'
		f = open(windfile, 'w')
		f.write("METRIC\n")
		windArr = windString.replace('),(',');(').split(';')
		for o in windArr:
			f.write(o.replace('(','').replace(')','').replace(',',' ') + '\n')
		f.close()
		
		#WRITE OUT WEATHERSTRING FROM POSTGRES
		weatherfile = '%s/weather.WTH' % outdir
		f = open(weatherfile, 'w')
		f.write("METRIC\n")
		weatherArr = weatherString.replace('),(',');(').split(';')
		for o in weatherArr:
			f.write(o.replace('(','').replace(')','').replace(',',' ') + '\n')
		f.close()
		
		
		
		#WRITE OUT VECTOR FROM POSTGRES
		vectorfile = '%s/ignition.VCT' % outdir
		f = open(vectorfile, 'w')
		vcttype = 'unknown'
		# * FIND GEOM TYPE
		if (wktString.find('POINT') > -1):
			vcttype = 'point'
			f.write('601\n')
		elif (wktString.find('LINESTRING') > -1):
			vcttype = 'line'
			f.write('1\n')
		geomArr = wktString.replace('POINT(','').replace('LINESTRING(','').replace(')','').split(',')
		for coordinate in geomArr:
			numbers = coordinate.split(' ')
			for number in numbers:
				f.write(str(int(round(float(number),0))) + ' ')
			f.write('\n')
		f.write('END\n')
		f.write('END') #Why 2 times??
		f.close()
		
		
		
		#WRITE OUT SETTINGS FILE
		f = open(outdir + '/runSettings.txt', 'w')
		f.write("""
			version=42
			adjustmentfile=%(defaultsdir)sFactor_1.ADJ
			fuelmoisturefile=%(defaultsdir)sLow.FMS
			fuelmodelfile=
			weatherfile0=%(outdir)s/weather.WTH
			windFile0=%(outdir)s/wind.WND
			landscapefile=%(outdir)s/landscape.LCP
			burnperiodefile=
			timestep=0.25
			visiblestep=0.5h
			secondaryvisiblestep=1h
			perimeterresolution=60m
			distanceresolution=30
			enablecrownfire=false
			linkcrowndensityandcover=false
			embersfromtorchingtrees=true
			enablespotfiregrowth=false
			nwnsbackingros=false
			distanceChecking=fireLevel
			simulatePostFrontalCombustion=false
			fuelInputOption=absent
			calculationPrecision=normal
			useConditioningPeriod = true
			conditMonth = %(startMonth)s
			conditDay = %(startDay)s
			startMonth = %(startMonth)s
			startDay = %(startDay)s
			startHour = %(startHour)s
			startMin = %(startMin)s
			endMonth = %(endMonth)s
			endDay = %(endDay)s
			endHour = %(endHour)s
			endMin = %(endMin)s
			ignitionFile = %(outdir)s/ignition.VCT
			ignitionFileType = %(vcttype)s
			# point or line
			vectMake = false
			# Therefore we don't need the vectorFilename property
			shapeMake = true
			shapeFile = %(outdir)s/results.shp
			rastMake = false
			rasterFilename = %(outdir)s/results_raster
			#Now explicitly set ALL raster options..do not rely on defaults
			rast_arrivaltime = true
			rast_fireIntensity = true
			rast_spreadRate = true
			rast_flameLength = false
			rast_heatPerArea = false
			rast_crownFire = false
			rast_fireDirection = false
			rast_reactionIntensity = false
			""" % {'defaultsdir': settings.defaults_path,'outdir': outdir,'vcttype': vcttype,'startMonth':startMonth,'startDay':startDay,'startHour':startHour,'startMin':startMin,'endMonth':endMonth,'endDay':endDay,'endHour':endHour,'endMin':endMin})
		f.close()
		
		###############################################
		#REPLACE THIS BY NEW FARSITE BATCH
		#Actual run
		#url = 'http://192.168.40.11/wildfire/cgi-bin/farsite_service'
		#curlstring = 'curl -G -d "id='+str(runid)+'&coords=' + point + '&template='+template+'&weather='+ weatherString +'&wind=' + windString + '&day='+startDay+'&month='+startMonth+'&hour='+startHour+'&min=00&interval=1&duration=6" ' + url

		callstring = settings.farsite_path +' ' + outdir + '/runSettings.txt'
		killstring = "sleep 30 && kill `ps -C farsite | awk '{ print $1 }' | grep -v PID`" 
		
		
		try:
			subprocess.Popen(killstring, shell=True) #This will kill all farsite processes within x seconds
			output = subprocess.check_output(settings.farsite_path + ' '+outdir+'/runSettings.txt',shell=True)
			if (output): #Any output is an error
				error = (output[:150] + '..')
				self.updateStatus(runid, "error", 20, "Error in farsite: " + error)
				return
		except subprocess.CalledProcessError, e:
			self.updateStatus(runid, "error", 20, e.output)
			return
		except:
			self.updateStatus(runid, "error", 20, "Error in farsite")
			return
		self.updateStatus(runid, "running", 20, "Exporteren uitvoer")
		pgserver_host = settings.pgserver_host #'192.168.40.5'
		pgserver_port = settings.pgserver_port #'3389'
		pgserver_user = settings.pgserver_user #'modeluser'
		callstring = 'ogr2ogr -f "PostgreSQL" PG:"host='+pgserver_host+' port='+pgserver_port+' user=modeluser dbname=research password=modeluser" -nln result_'+str(runid)+' -lco schema=model_wildfire -lco OVERWRITE=YES '+str(outdir)+'/results.shp'
		subprocess.call(callstring, shell=True)	
		
		#Simplify the geometry and remove enclave fires
		query = """
			DELETE FROM model_wildfire.result_%s WHERE fire_type = 'Enclave Fire';
			UPDATE model_wildfire.result_%s SET wkb_geometry = ST_SimplifyPreserveTopology(wkb_geometry,10);
			"""
		self.updateStatus(runid, "running", 30, "Verwijder enclave fire")
		try:
			data = (runid, runid, )
			cur.execute(query, data )
			self.updateStatus(runid, "running", 40, "Trying")
		except e:
			self.updateStatus(runid, "running", 40, "Caught")
		#result = cur.fetchone()
		self.updateStatus(runid, "running", 50, "Verwerken uitvoer")
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

