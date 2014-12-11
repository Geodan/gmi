docker stop -t 0 apache
docker rm apache
docker rmi apache
docker rmi apache2
docker build -t apache2 ./apache2
docker build -t apache ./apache2-run
./drun-3-g-a.sh
