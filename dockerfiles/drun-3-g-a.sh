docker run -d -p 80:80 --name apache -v ~/git/gmi:/var/www/main/gmi --link geoserver:geoserver --link postgres:postgres apache
