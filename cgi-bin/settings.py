##### settings for VM ######

#conn_params = "host=localhost port=5432 dbname=research user=modeluser password=modeluser"
#pgserver_host = 'localhost'
#pgserver_port = '5432'
#pgserver_user = 'modeluser'
#gs_host = 'localhost'
#gs_port = '8080'

#gdal_translate_path = '/usr/bin/gdal_translate'
#gdalwarp_path = '/usr/bin/gdalwarp'
#lcpmake_path = '/var/www/gmi/bin/lcpmake'
#farsite_path = '/var/www/gmi/bin/farsite'
#output_basepath  = '/var/data/wildfire/'

####### settings for geodan research cluser ######
conn_params = "host=192.168.40.5 port=3389 dbname=research user=modeluser password=modeluser"
pgserver_host = '192.168.40.5'
pgserver_port = '3389'
pgserver_user = 'modeluser'
gs_host = '192.168.40.8'
gs_port = '3389'

gdal_translate_path = '/usr/local/bin/gdal_translate'
gdalwarp_path = '/usr/local/bin/gdalwarp'
lcpmake_path = '/var/www/main/gmi/bin/lcpmake'
farsite_path = '/var/www/main/gmi/bin/farsite'
output_basepath  = '/var/data/wildfire/'
defaults_path = '/var/www/main/gmi/defaults/'
