from geoserver.wps import process
from com.ziclix.python.sql import zxJDBC
import json

jdbc_url = "jdbc:postgresql://192.168.40.5:3389/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='getRunInfo',
  description='Get information on run',
  inputs={
  	  'runid': (int,'Run ID') 
  },
  outputs={
  	'string': (str,'JSON string')
  }
)

def run(runid):

	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	query = """SELECT a.id, a.status, b.name, a.percentage 
		FROM administration.runs a 
		LEFT JOIN administration.models b ON (a.model = b.id)
		WHERE a.id = ?"""
	data = [runid]
	cur.execute(query,data)
	result = cur.fetchone()
	status = str(result[1])
	modelname = str(result[2])
	percentage = str(result[3])
	
	if ( modelname == 'makeSubset'):
		query = "SELECT id, name, run, St_AsGeoJson(geom) geom FROM administration.params_makesubset WHERE run = ?"
	elif (modelname == 'makeLcp'):
		query = "SELECT * FROM administration.params_makelcp WHERE run = ?"
	elif (modelname == 'farsiteRun'):
		query = "SELECT * FROM administration.params_farsiterun WHERE run = ?"
	else:
		return '{"runid":'+ runid +',"params":["'+params+'"]}'
	cur.execute(query,data)
	r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
	one = True
	r = (r[0] if r else None) if one else r
	cur.connection.close()
	params = json.dumps(r)	
	
	return '{"runid":'+ str(runid) +',"status":"'+ status +'","percentage":'+ percentage +',"params":['+str(params)+']}' 
