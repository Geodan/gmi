docker stop -t 0 postgres 
docker rm postgres
docker rmi postgres
docker build -t postgres ./postgres-9.3-run
./drun-1-p.sh
