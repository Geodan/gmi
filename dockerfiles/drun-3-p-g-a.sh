docker run -d -p 80:80 --name apache -v /var/log/apache2:/var/log/apache2 -v /opt/gmi:/var/www/main/gmi --link geoserver:geoserver --link postgres:postgres apache
