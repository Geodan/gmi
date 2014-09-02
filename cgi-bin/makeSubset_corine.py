#!/usr/bin/python
print 'Content-type: text/plain\n'

# Import modules for CGI handling
import os,cgi, cgitb
#import daemon
#from daemon import createDaemon

#import libs
import time
import sys
import json
import psycopg2
import os
import settings

#os.chdir("/var/www/wildfire/output")

def updateStatus(runid, status, percentage):
	query = """
		UPDATE administration.runs SET (status, percentage, lastupdate)
		= (%s, %s, now())
		WHERE id = %s"""
	data = (status, percentage, runid, )
	cur.execute(query, data )
	conn.commit()
	return


def main():
	runid = result[0]
		
	updateStatus(runid, "running", 10)
	
	#Stap 1: Maak raster ahv landgebruik aan
	query = """
		SET work_mem TO 1200000;
SET maintenance_work_mem TO 1200000;
DROP SEQUENCE IF EXISTS counter;
CREATE SEQUENCE counter;

DROP TABLE IF EXISTS model_wildfire.terrein_%s;
CREATE TABLE  model_wildfire.terrein_%s AS (
WITH selectionbox AS (
	SELECT 
	run, St_Transform(geom, 3035) geom FROM administration.params_makesubset WHERE run = %s
)
,dump AS (
SELECT 
	nextval('counter') As gid,
	c.corine_name typelandgebruik, 
	c.corine_id typelandgebruik_c1, 
	c.fuel_id,
	d.description,
	d.carrier,
	d.climate,
	ST_Transform(
		(ST_Dump(ST_Intersection(a.geom, b.geom))).geom -- Dump to get rid of geomcollection after intersection
		,900913
	)::geometry(Polygon,900913) geom --typemodded to register correctly in geom_columns
	,b.run
FROM corine.corinelc_2006 a, selectionbox b, administration.corine2fuel c
LEFT JOIN administration.fuelmodels d ON (c.fuel_id = d.id)
	WHERE ST_Intersects(a.geom,b.geom)
	AND a.code_06::Text = c.corine_id::Text
)
SELECT * FROM dump WHERE ST_GeometryType(geom) = 'ST_Polygon'
)
;
ALTER TABLE model_wildfire.terrein_%s ADD PRIMARY KEY (gid);
	"""
	data = (runid,runid,runid,runid ) #TODO, make nicer with 1 param
	cur.execute(query, data )
	conn.commit()
	gs_host = settings.gs_host
	gs_port = settings.gs_port
	#TODO: error checking
	curlstring = 'curl -v -u modeluser:modeluser -XPOST -H "Content-type: text/xml" -d "<featureType><name>terrein_'+str(runid)+'</name></featureType>" http://' + gs_host + ':'+ gs_port + '/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes'	
	os.system(curlstring)
	curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<featureType><nativeCRS>epsg:900913</nativeCRS><enabled>true</enabled></featureType>" http://'+gs_host+':'+gs_port+'/geoserver/rest/workspaces/model_wildfire/datastores/landuse/featuretypes/terrein_'+str(runid)
	os.system(curlstring)
	#Freakin bug, you have to add 'enabled': http://comments.gmane.org/gmane.comp.gis.geoserver.user/26753
	curlstring = 'curl -v -u modeluser:modeluser -XPUT -H "Content-type: text/xml" -d "<layer><defaultStyle><name>corine</name></defaultStyle><enabled>true</enabled></layer>" http://'+gs_host+':'+gs_port+'/geoserver/rest/layers/model_wildfire:terrein_'+str(runid)
	os.system(curlstring)
	
	updateStatus(runid, "finished", 100)
	return
	       
#Set postgres connection
#conn_params = "host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser"
conn_params = settings.conn_params
conn = psycopg2.connect(conn_params)
cur = conn.cursor()

#Define some params
	
#Get the first available scheduled run
query = """
	SELECT a.id
	FROM administration.runs a 
	LEFT JOIN administration.params_makesubset b
	ON (a.id = b.run)
	WHERE a.status = 'scheduled'
	AND a.model = 3
	ORDER BY a.id
	LIMIT 1;
	"""
cur.execute(query )
result = cur.fetchone()

if (result):
	main()

