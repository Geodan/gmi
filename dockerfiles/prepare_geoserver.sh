#Download and extract geoserver
sudo apt-get -y install unzip
wget http://ares.boundlessgeo.com/geoserver/release/2.6.0/geoserver-2.6.0-war.zip 
wget http://ares.boundlessgeo.com/geoserver/release/2.6.0/plugins/geoserver-2.6.0-wps-plugin.zip
wget http://ares.boundlessgeo.com/geoserver/2.6.x/community-latest/geoserver-2.6-SNAPSHOT-python-plugin.zip
unzip geoserver-2.6.0-war.zip 
mkdir -p ../geoserver
unzip geoserver.war -d ../geoserver
unzip -o geoserver-2.6-SNAPSHOT-python-plugin.zip -d ../geoserver/WEB-INF/lib
unzip -o geoserver-2.6-SNAPSHOT-python-plugin.zip -d ../geoserver/WEB-INF/lib
unzip -o geoserver-2.6.0-wps-plugin.zip -d ../geoserver/WEB-INF/lib
mkdir -p ../geoserver/data/scripts/functions
mkdir -p ../geoserver/data/scripts/lib
mkdir -p ../geoserver/data/scripts/wps
cp ~/git/gmi/geoserver_wps/* ../geoserver/data/scripts/wps
cp ~/git/gmi/dockerfiles/geoserver-2.6.0/web.xml ../geoserver/WEB-INF/web.xml

