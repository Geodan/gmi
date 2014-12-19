docker run -d -p 80:80 --name apache -v ~/data/log/tomcat7:/var/log/tomcat7 -v ~/git/gmi:/var/www/main/gmi --link geoserver:geoserver --link postgres:postgres apache
