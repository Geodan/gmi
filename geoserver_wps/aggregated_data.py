from geoserver.wps import process
from com.vividsolutions.jts.geom import Geometry
from com.ziclix.python.sql import zxJDBC
jdbc_url = "jdbc:postgresql://postgres:5432/data_overheid"
username = "osm"
password = "osm"
driver = "org.postgresql.Driver"

@process(
  title='AggregatedData',
  description='List of entities within geometry',
  inputs={
  	'geom': (Geometry,'De geom om entities binnen te zoeken'),
  	'srid': (str,'SRID'),
  	'datasets': (str,'Lijst van datasets csv')
  },
  outputs={
  	'string': (str,'JSON string')
  }
)

def run(geom, srid, datasets):

	#Connect to postgres
	conn = zxJDBC.connect(jdbc_url,username, password, driver)
	cur = conn.cursor()
	data = datasets.split(',')
	if (len(data) > 0):
		query = "(SELECT a.type, count(a.geom), st_asgeojson(st_geometryfromtext('"+geom+"', "+srid+")) FROM data."+data[0]+" as a RIGHT JOIN (SELECT st_geometryfromtext('"+geom+"', "+srid+") as geom)as b ON ST_Intersects(a.geom, b.geom) GROUP BY a.type)"
		cur.execute(query)
		results = []
		geom = ""
		for record in cur:
			geom = record[2]
			results.append('"'+str(record[0])+'":'+str(record[1]))
		results_out = ','.join(results)
		return '{"geometry":'+geom+',"payload":[{"dataset":"dataoverheid","errorcode":0,"errormessage":"","description":"Aantal vestigingen van scholen","stats":{'+results_out+'}}]}'
	else:
		return '{"geometry":'+geom+',"payload":[{"dataset":"'+datasets[0]+'","errorcode":1,"errormessage":"Geen geldige dataset","description":"","stats":{}}]}'