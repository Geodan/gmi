docker stop -t 0 apache
docker stop -t 0 geoserver
docker rm apache
docker rm geoserver
./drun-2-p-g.sh
echo wait 5 secs
sleep 5
./drun-3-p-g-a.sh

