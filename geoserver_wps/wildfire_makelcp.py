from geoserver.wps import process
from com.ziclix.python.sql import zxJDBC
jdbc_url = "jdbc:postgresql://192.168.40.5:3389/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='MakeLcp',
  description='Build landscape file',
  inputs={
  	'userid' : (int, 'User ID'),
    'terreinid': (int,'Terrein ID'),
    'landscapename': (str,'Name of landscape')
  },
  outputs={
  	'string': (str,'JSON string')
  }
)

def run(userid, terreinid, landscapename):

	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	query = """
			INSERT INTO administration.runs ("user", model, status, percentage, lastupdate) VALUES (?,?,?, ?, now());
		"""
	data = [1,4,"scheduled",0]
	cur.execute(query, data)
	conn.commit()
	query = """SELECT MAX(id) FROM administration.runs;"""
	cur.execute(query)
	result = cur.fetchone()
	runid = result[0]
	
	query = """
		INSERT INTO administration.params_makelcp 
		(run, terrein_id, terrein_name)
		VALUES
		(?, ?, ?);
	"""
	data = [runid,terreinid,landscapename]
	cur.execute(query, data )
	conn.commit()
	
	
	import subprocess
	p = subprocess.Popen(['/usr/bin/curl','-u', 'demo:demo','http://model.geodan.nl/main/gmi/cgi-bin/makeLcp.py'])
	p.daemon = True
	
	return '{"runid":'+str(runid)+',"status":"scheduled","percentage":0}' 
