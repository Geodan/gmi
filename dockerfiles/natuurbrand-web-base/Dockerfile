FROM quantumobject/docker-baseimage
RUN  apt-get update && apt-get install -yq  python python-psycopg2 gdal-bin lib32stdc++6 lib32z1 lib32ncurses5 lib32bz2-1.0 git &&  apt-get clean && echo "Europe/Amsterdam" > /etc/timezone  && dpkg-reconfigure -f noninteractive tzdata
