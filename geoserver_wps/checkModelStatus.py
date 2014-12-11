from geoserver.wps import process

from com.ziclix.python.sql import zxJDBC
#jdbc_url = "jdbc:postgresql://postgres:5432/research"
jdbc_url = "jdbc:postgresql://localhost:5432/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='CheckModelStatus',
  description='Check status of running model',
  inputs={
    'runid': (int,'ID of process')
  },
  outputs={
  	'string': (str,'JSON string')
  }
)

def run(runid):
	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	query = """SELECT a.status, a.percentage, b.name as modelname, a.lastmsg, a.lastupdate, c.name as owner
		FROM administration.runs a 
		LEFT JOIN administration.models b ON (a.model = b.id) 
		LEFT JOIN administration.users c ON (a.user = c.id)
		WHERE a.id = ?"""
	data = [runid]
	cur.execute(query,data)
	result = cur.fetchone()
	cur.close()
	conn.close()
	status = result[0]
	percentage = result[1]
	modelname = result[2]
	lastmsg = result[3]
	lastupdate = result[4]
	owner = result[5]
	
	return '{"runid":%i,"status":"%s", "percentage":%i,"modelname":"%s", "lastmessage":"%s", "lastupdate":"%s","owner":"%s"}' % (runid,status, percentage, modelname, lastmsg.replace("\n", "\\n"), lastupdate, owner)
