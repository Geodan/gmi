docker stop -t 0 apache
docker rm apache
docker rmi apache
docker build -t apache ./apache2-run
./drun-3-p-g-a.sh
