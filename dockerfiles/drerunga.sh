docker stop -t 0 apache
docker stop -t 0 geoserver
docker rm apache
docker rm geoserver
./drun-2-p-g.sh
sleep 5
./drun-3-g-a.sh

