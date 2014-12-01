docker run -d -p 80:80 --name apache -v ~/git/gmi/:/var/www/gmi --link geoserver:geoserver apache
