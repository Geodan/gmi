#!/bin/sh
#sed -i s/localhost/"${GEOSERVER_PORT_8080_TCP_ADDR}"/g /etc/apache2/sites-available/000-default.conf
#sed -i s/8080/"${GEOSERVER_PORT_8080_TCP_PORT}"/g /etc/apache2/sites-available/000-default.conf

git clone https://github.com/geoext/geoext /var/www/gmi/externals/GeoExt
/usr/sbin/apachectl -DFOREGROUND
