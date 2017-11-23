#!/bin/sh
#sed -i s/localhost/"${GEOSERVER_PORT_8080_TCP_ADDR}"/g /etc/apache2/sites-available/000-default.conf
#sed -i s/8080/"${GEOSERVER_PORT_8080_TCP_PORT}"/g /etc/apache2/sites-available/000-default.conf
mkdir -p  /var/data/wildfire/fires
mkdir -p  /var/data/wildfire/fuelmodels
chown www-data /var/data/wildfire/fires
chown www-data /var/data/wildfire/fuelmodels
cd /farsite-python
python setup.py install
#Rough workaround to deal with stale apache pid files
rm /run/apache2/*.pid
/usr/sbin/apachectl -DFOREGROUND
