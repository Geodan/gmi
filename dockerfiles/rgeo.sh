docker stop -t 0 geoserver
docker rm geoserver
docker rmi geoserver
docker build -t geoserver ./geoserver-2.6.0
./drun-2-p-g.sh
