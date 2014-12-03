from geoserver.wps import process

from com.ziclix.python.sql import zxJDBC
jdbc_url = "jdbc:postgresql://192.168.40.5:3389/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='StartRun',
  description='Start a model run',
  inputs={
  	'userid': (int, 'User ID'),
  	'name': (str, 'Name of run'),
	'fuelmodel': (int, 'id of terrein'),
	'geom': (str, 'WKT geom of firestart'),
	'windstring': (str, 'windstring'),
	'weatherstring': (str, 'weatherstring'),
	'startmonth': (int, 'Starting month [1-12]'),
	'startday': (int, 'starting day of month [1-7]'), 
	'starthour': (int, 'start time of fire [eg: 1400]'),
	'stoplines': (str, 'WKT geom of stoplines')
  },
  outputs={
  	'string': (str,'JSON string')
  }
)

def run(userid,geom, name, fuelmodel, weatherstring, windstring, startmonth, startday, starthour, stoplines):
	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	query = """
		INSERT INTO administration.runs ("user", model, status, percentage, lastupdate) VALUES (?,?,?,?, now());
	"""
	data = [1,5,"scheduled",0]
	cur.execute(query, data)
	conn.commit()
	query = """SELECT MAX(id) FROM administration.runs;"""
	cur.execute(query)
	result = cur.fetchone()
	runid = result[0]

	cur = conn.cursor()
	query = """
		INSERT INTO administration.params_farsiterun 
		(run, name, fuelmodel, point, weatherstring, windstring, startmonth, startday, starthour, stoplines)
		VALUES
		(?,?,?,?,?,?,?,?,?,?);
	"""
	data = [runid,name,fuelmodel,geom,weatherstring,windstring,startmonth,startday,starthour, stoplines]
	cur.execute(query, data )
	conn.commit()
	
	runid_out = runid
	modelname = 'farsiteRun'
	status_out = "scheduled"
	percentage_out = 0
	
	import subprocess
	p = subprocess.Popen(['/usr/bin/curl','-u','demo:demo', 'http://model.geodan.nl/main/gmi/cgi-bin/farsiteRun.py'])
	return '{"runid":%i,"status":"%s", "percentage":%i}' % (runid_out,status_out, percentage_out)
