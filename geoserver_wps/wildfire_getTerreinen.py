from geoserver.wps import process
from com.ziclix.python.sql import zxJDBC
jdbc_url = "jdbc:postgresql://192.168.40.5:3389/research"
username = "modeluser"
password = "modeluser"
driver = "org.postgresql.Driver"

@process(
  title='GetTerreinen',
  description='Get list of terrains',
  inputs={},
  outputs={
  	'string': (str,'JSON string')
  }
)

def run():

	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	query = "(SELECT a.run, b.terrein_name FROM administration.params_makesubset a INNER JOIN administration.params_makelcp b ON (a.run = b.terrein_id))"
	cur.execute(query)
	runids = []
	names = []
	for record in cur:
		runids.append(str(record[0]))
		names.append(str(record[1]))
	runids_out = ','.join(runids)
	terreinnames_out = '","'.join(names)
	return '{"runids":['+ runids_out +'],"terreinnames":["'+terreinnames_out+'"]}' 
