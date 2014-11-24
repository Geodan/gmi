from geoserver.wps import process

@process(
  title='Test WPS',
  description='None..',
  inputs={
    'name': (str,'Name of process')
  },
  outputs={
  	'name': (str,'Name of process')
  	#,'bogus': (str,'Bogus')
  }
)

def run(name):
	return name
	#return name

