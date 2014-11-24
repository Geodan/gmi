sudo apt-get install unzip
wget http://ares.boundlessgeo.com/geoserver/release/2.6.0/geoserver-2.6.0-war.zip 
wget http://ares.boundlessgeo.com/geoserver/release/2.6.0/plugins/geoserver-2.6.0-wps-plugin.zip
wget http://ares.boundlessgeo.com/geoserver/2.6.x/community-latest/geoserver-2.6-SNAPSHOT-python-plugin.zip
unzip geoserver-2.6.0.zip 
unzip geoserver.war -d geoserver
unzip geoserver-2.6-SNAPSHOT-python-plugin.zip -d geoserver/WEB-INF/lib
unzip -o geoserver-2.6-SNAPSHOT-python-plugin.zip -d geoserver/WEB-INF/lib
unzip -o geoserver-2.6.0-wps-plugin.zip -d geoserver/WEB-INF/lib
mkdir geoserver/data/scripts/functions
mkdir geoserver/data/scripts/lib
mkdir geoserver/data/scripts/wps
cp scripts/* geoserver/data/scripts/wps
