gmi
===

Geodan's model interfaces using GeoExt


Things to be done by hand:
1. Put the geoserver_wps scripts on the right geoserver data directory
2. Adapt the geoserver_wps scripts with the correct references and credentials
3. Create a settings file:

You need to add a file settings.py to the folder ./gmi/cgi-bin/
Here's an example:

##### settings for VM ######

#conn_params = "host=localhost port=5432 dbname=research user=secret password=secret"
#pgserver_host = 'localhost'
#pgserver_port = '5432'
#pgserver_user = 'secret'
#gs_host = 'localhost'
#gs_port = '8080'

#gdal_translate_path = '/usr/bin/gdal_translate'
#gdalwarp_path = '/usr/bin/gdalwarp'
#lcpmake_path = '/var/www/gmi/bin/lcpmake'
#farsite_path = '/var/www/gmi/bin/farsite'
#output_basepath  = '/var/data/wildfire/'

####### settings for geodan research cluser ######
conn_params = "host=192.168.40.5 port=3389 dbname=research user=secret password=secret"
pgserver_host = '192.168.40.5'
pgserver_port = '3389'
pgserver_user = 'secret'
gs_host = '192.168.40.8'
gs_port = '3389'

gdal_translate_path = '/usr/local/bin/gdal_translate'
gdalwarp_path = '/usr/local/bin/gdalwarp'
lcpmake_path = '/var/www/main/gmi/bin/lcpmake'
farsite_path = '/var/www/main/gmi/bin/farsite'
output_basepath  = '/var/data/wildfire/'
defaults_path = '/var/www/main/gmi/defaults/'