from geoserver.wps import process
from com.ziclix.python.sql import zxJDBC
jdbc_url = "jdbc:postgresql://192.168.40.5:3389/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='MakeSubset',
  description='Create terrain subset for wildfire model',
  inputs={
  	'userid': (int,'Id of user'),
    'name': (str,'Name of subset'),
    'upper':(float, 'Upper lat'),
    'lower':(float, 'Lower lat'),
    'left': (float, 'Left lon'),
    'right':(float, 'Right lon')
  },
  #outputs={
  #  'runid': (int, 'Run id'),
  #  'status': (str, 'Status'),  
  #  'percentage': (int, 'Percentage')
  #}
  outputs={'string':(str,'String')}
)


def run(userid, name, upper, lower, left, right):
	
	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	
	cur = conn.cursor()
	query = """
		INSERT INTO administration.runs ("user", model, status, percentage, lastupdate) VALUES (?,?,?,?, now());
	"""
	data = [1,3,"scheduled",0]
	cur.execute(query, data)
	conn.commit()
	query = """SELECT MAX(id) FROM administration.runs;"""
	cur.execute(query)
	result = cur.fetchone()
	runid = result[0]
	
	cur = conn.cursor()
	query = """
		INSERT INTO administration.params_makesubset 
		(run, name, geom)
		VALUES
		(?, ?,
		ST_SetSrid(ST_MakeBox2D(
				ST_Transform(ST_SetSrid(ST_Point(?, ?),3857),28992), 
				ST_Transform(ST_SetSrid(ST_Point(?, ?),3857),28992)
			),28992)
		);
	"""
	data = [runid, name, left, lower, right, upper]
	cur.execute(query, data )
	conn.commit()
	
	import subprocess
	#p = subprocess.Popen(['/usr/bin/python','/var/www/wildfire/python/makeSubset.py'])
	p = subprocess.Popen(['/usr/bin/curl','-u', 'demo:demo','http://model.geodan.nl/main/gmi/cgi-bin/makeSubset.py'])
	p.daemon = True

	return '{"runid":'+str(runid)+',"status":"scheduled","percentage":0}'
