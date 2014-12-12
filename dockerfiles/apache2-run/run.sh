#!/bin/sh
#sed -i s/localhost/"${GEOSERVER_PORT_8080_TCP_ADDR}"/g /etc/apache2/sites-available/000-default.conf
#sed -i s/8080/"${GEOSERVER_PORT_8080_TCP_PORT}"/g /etc/apache2/sites-available/000-default.conf
if [ ! -e /date.txt ]
then
date > /date.txt
mkdir -p  /var/www/main/gmi/externals/GeoExt
git clone https://github.com/geoext/geoext /var/www/main/gmi/externals/GeoExt
fi
mkdir -p  /var/data/wildfire/fires
mkdir -p  /var/data/wildfire/fuelmodels
chown www-data /var/data/wildfire/fires
chown www-data /var/data/wildfire/fuelmodels
/usr/sbin/apachectl -DFOREGROUND
