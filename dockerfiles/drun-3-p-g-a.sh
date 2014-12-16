docker run -d -p 80:80 --name apache -v ~/data/log:/var/log -v ~/git/gmi:/var/www/main/gmi --link geoserver:geoserver --link postgres:postgres apache
