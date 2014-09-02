#!/usr/bin/python
print 'Content-type: text/plain\n\n'

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
import settings
#from apscheduler.scheduler import Scheduler

#os.chdir("/var/www/wildfire/output")


class makeLcp():
	def updateStatus(self,runid, status, percentage):
		query = """
			UPDATE administration.runs SET (status, percentage, lastupdate)
			= (%(status)s, %(percentage)s, now())
			WHERE id = %(runid)s"""
		
		data = ({'status':status, 'percentage':percentage, 'runid':runid} )
		self.cur.execute(query, data )
		self.conn.commit()
		return
	
	
	def main(self):
		
		runid = self.runid
		terreinid = self.result[1]
		self.updateStatus(runid, "running", 10)
		print('running 10')
		
		#Stap 1: Maak raster ahv landgebruik aan
		query = """
		DROP SEQUENCE IF EXISTS counter;
	CREATE SEQUENCE counter;
	
	DROP TABLE IF EXISTS model_wildfire.fuelmodel_%(runid)s;
	CREATE TABLE model_wildfire.fuelmodel_%(runid)s As
	
	
	 WITH /** Eerst een canvas laag aan de hand waarvan we de overige lagen uitlijnen **/
	canvas AS ( 
		SELECT 
		 ST_AddBand(
			ST_MakeEmptyRaster(100, 100, 0, 0, 5, -5, 0, 0, 28992)
			--ST_MakeEmptyRaster(
			--	foo1.rast -- op basis van het ahn raster
			--) 
		 ,'8BUI'::text,0) As rast
			--FROM 
			--	(SELECT rast FROM dems.ahn1 LIMIT 1) As foo1
	),
	/** Voeg de geometrieen van gelijke typen samen **/
	collections As (
		SELECT 
			CASE -- Laat alle xxx 3 meter uitsteken
				WHEN fuel_id > 999 THEN ST_Collect(St_Buffer(geom, 3))
				ELSE ST_Collect(geom)
			END As geom, 
			typelandgebruik, 
			fuel_id
		FROM model_wildfire.terrein_%(terreinid)s
		GROUP BY typelandgebruik, fuel_id
		
	)
	/** Stamp rasters uit de geometrieen. Voor elke type 1 **/
	,layers As(
		SELECT nextval('counter') As rid,typelandgebruik, fuel_id,
			ST_AsRaster(geom, 
				canvas.rast
				,'8BUI',fuel_id,0
			) rast
		FROM collections, canvas
	)
	
	SELECT 1 As rid, 
	ST_Union(rast) rast 
	FROM layers;
	SELECT AddRasterConstraints('model_wildfire', 'fuelmodel_%(runid)s'::name, 'rast'::name);
		"""
		data = ({'runid':runid,'terreinid':terreinid})
		self.cur.execute(query,data )
		self.conn.commit()
	
		#Stap 3: Maak ahn raster aan op basis van box 
		query = """
	DROP TABLE IF EXISTS model_wildfire.ahn1_%(runid)s;
	CREATE TABLE model_wildfire.ahn1_%(runid)s As
	WITH 
	fuelmodext As (
		SELECT ST_SetSrid(ST_Extent(rast::geometry),28992) extent 
		FROM model_wildfire.fuelmodel_%(runid)s
	),
	
	mosaic As (
	SELECT ST_Union(a.rast) rast 
		FROM dems.ahn1 a, fuelmodext x
		WHERE ST_Intersects(a.rast,x.extent)
	)
	
	SELECT 1 AS rid, ST_Clip(a.rast, extent, true) rast
	FROM mosaic a,
	fuelmodext b;
	
	
	UPDATE model_wildfire.ahn1_%(runid)s SET rast = ST_Reclass(rast,1,'
			-3.4028234663853e+38--30.0:-999--999, 
			-30.0-0.0:-30-0, 
			0.0-254.0:0-254', 
		'32BF',-999);
	
	DROP TABLE IF EXISTS model_wildfire.ahn1_utm_%(runid)s;
	CREATE TABLE model_wildfire.ahn1_utm_%(runid)s As
	SELECT 1 As rid, ST_Resample(rast, 32631) rast FROM model_wildfire.ahn1_%(runid)s;
	
	--SLOPE
	DROP TABLE IF EXISTS model_wildfire.slope_%(runid)s;
	CREATE TABLE model_wildfire.slope_%(runid)s As
	SELECT 1 As rid, ST_Reclass(ST_Slope(rast,1,'32BF'),'0-1:0-90','32BF') rast FROM model_wildfire.ahn1_%(runid)s;
	--ASPECT
	DROP TABLE IF EXISTS model_wildfire.aspect_%(runid)s;
	CREATE TABLE model_wildfire.aspect_%(runid)s As
	SELECT 1 As rid, ST_Reclass(ST_Aspect(rast,1,'32BF'),'0-6.2832:0-360','32BF') rast FROM model_wildfire.ahn1_%(runid)s;
SELECT AddRasterConstraints('model_wildfire', 'ahn1_%(runid)s'::name, 'rast'::name);
		"""
		data = ({'runid':runid})
		#TT: Disabled the use of DEMS (no AHN data available)
		#self.cur.execute(query,data )
		#self.conn.commit()
		
		#Stap 4: Maak lege raster aan op basis van bovenstaande terrein raster
		query = """
	DROP TABLE IF EXISTS model_wildfire.emptyraster_%(runid)s;
	CREATE TABLE model_wildfire.emptyraster_%(runid)s As
	
	WITH /** Eerst een canvas laag aan de hand waarvan we de overige lagen uitlijnen **/
	canvas AS ( 
		SELECT 
		 ST_AddBand(
			ST_MakeEmptyRaster(
				rast
			) 
		 ,'8BUI'::text,0) As rast
			FROM (SELECT rast FROM model_wildfire.fuelmodel_%(runid)s) As foo
	)	
	
	SELECT 1 As rid, rast FROM canvas;
	SELECT AddRasterConstraints('model_wildfire', 'emptyraster_%(runid)s'::name, 'rast'::name);
		"""
		data = ({'runid':runid})
		self.cur.execute(query,data )
		self.conn.commit()
		
		self.updateStatus(runid, "running", 50)
		print('starting gdal')
		#FUEL
		sys.stdout.flush()
		subprocess.call(self.gdal_translate_path + " -of AAIGrid -a_nodata -999 -outsize 100% 100% \"PG:host="+settings.pgserver_host+" port="+settings.pgserver_port+" dbname=research user=modeluser password=modeluser schema=model_wildfire table=fuelmodel_"+str(runid)+"\" "+ self.output_path + "/fuelmodel.asc", shell=True)      
		#ELEV
		#subprocess.call(self.gdal_translate_path + " -of AAIGrid -a_nodata -999 -outsize 100% 100% \"PG:host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser schema=model_wildfire table=ahn1_"+str(runid)+"\" " + self.output_path + "/ahn1.asc", shell=True)
		#SLOPE
		#subprocess.call(self.gdal_translate_path + " -of AAIGrid -a_nodata -999 -outsize 100% 100% \"PG:host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser schema=model_wildfire table=slope_"+str(runid)+"\" " + self.output_path + "/slope.asc", shell=True)
		#ASPECT
		#subprocess.call(self.gdal_translate_path + " -of AAIGrid -a_nodata -999 -outsize 100% 100% \"PG:host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser schema=model_wildfire table=aspect_"+str(runid)+"\" " + self.output_path + "/aspect.asc", shell=True)
		#EMPTY RASTER
		subprocess.call(self.gdal_translate_path + " -of AAIGrid -a_nodata -999 -outsize 100% 100% \"PG:host="+settings.pgserver_host+" port="+settings.pgserver_port+" dbname=research user=modeluser password=modeluser schema=model_wildfire table=emptyraster_"+str(runid)+"\" " + self.output_path + "/emptyraster.asc", shell=True)
		#Some unneeded steps
		#subprocess.call(self.gdal_translate_path + " -of GTiff  " + self.output_path+ "/fuelmodel.asc " + self.output_path + "/fuelmodel.tiff", shell=True)
		#subprocess.call(self.gdalwarp_path + " -overwrite -s_srs epsg:28992 -t_srs epsg:900913 " + self.output_path + "/fuelmodel.tiff " + self.output_path + "/fuelmodel_900913.tiff", shell=True)
		#subprocess.call(self.gdal_translate_path + " -of AAIGrid -outsize 100% 100% \"PG:host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser schema=model_wildfire table=ahn1_"+str(runid)+"\" " + self.output_path + "/ahn1.asc", shell=True)
		#subprocess.call(self.gdal_translate_path + " -a_nodata -999 -of GTiff  " + self.output_path + "/ahn1.asc " + self.output_path + "/ahn1.tiff", shell=True)
		#subprocess.call(self.gdalwarp_path + " -overwrite -srcnodata -999 -dstnodata -999 -s_srs epsg:28992 -t_srs epsg:900913 " + self.output_path + "/ahn1.tiff " + self.output_path + "/ahn1_900913.tiff", shell=True)
		self.updateStatus(runid, "running", 75)
		#LANDSCAPE INCLUDING ELEVATION
		#subprocess.call(self.lcpmake_path + " -landscape " + self.output_path + "/landscape -elevation " + self.output_path + "/ahn1.asc -slope " + self.output_path + "/slope.asc -aspect " + self.output_path + "/aspect.asc -fuel " + self.output_path + "/fuelmodel.asc -cover " + self.output_path + "/emptyraster.asc -latitude 90", shell=True)
		#LANDSCAPE EXCLUDING ELEVATION
		subprocess.call(self.lcpmake_path + " -landscape " + self.output_path + "/landscape -elevation " + self.output_path + "/emptyraster.asc -slope " + self.output_path + "/emptyraster.asc -aspect " + self.output_path + "/emptyraster.asc -fuel " + self.output_path + "/fuelmodel.asc -cover " + self.output_path + "/emptyraster.asc -latitude 90", shell=True)
		self.updateStatus(runid, "finished", 100)
		print('done')
		return
	
	def start(self):
		#Set postgres connection
		#conn_params = "host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser"
		conn_params = settings.conn_params
		self.conn = psycopg2.connect(conn_params)
		self.cur = self.conn.cursor()
		
		
			
		#Get the first available scheduled run
		query = """
			SELECT a.id,b.terrein_id
			FROM administration.runs a 
			LEFT JOIN administration.params_makelcp b
			ON (a.id = b.run)
			WHERE a.status = 'scheduled'
			AND a.model = 4
			ORDER BY a.id
			LIMIT 1;
			"""
		self.cur.execute(query )
		self.result = self.cur.fetchone()
		if (self.result):
			print 'Starting main'
			self.runid = self.result[0] 
			#Define some params
			#self.gdal_translate_path = '/usr/local/bin/gdal_translate'
			#self.gdalwarp_path = '/usr/local/bin/gdalwarp'
			#self.lcpmake_path = '/var/www/wildfire/bin/lcpmake'
			#self.farsite_path = '/var/www/wildfire/bin/farsite4'
			self.gdal_translate_path = settings.gdal_translate_path
			self.gdalwarp_path = settings.gdalwarp_path
			self.lcpmake_path = settings.lcpmake_path
			self.farsite_path = settings.farsite_path
			self.output_path  = settings.output_basepath + 'fuelmodels/' + str(self.runid)
			if not os.path.exists(self.output_path):			
				os.mkdir(self.output_path)
			self.main()       
		else:
			print 'No process to run'

obj = makeLcp()
obj.start() 
