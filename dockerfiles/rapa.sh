docker stop -t 0 apache
docker rm apache
docker rmi apache
docker build -t apache ./apache2
./drun-3-g-a.sh