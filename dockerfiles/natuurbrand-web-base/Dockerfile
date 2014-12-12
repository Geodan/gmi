FROM quantumobject/docker-baseimage
# Download and Install gdal with python bindings 
RUN  apt-get update && apt-get install -yq build-essential python python-all-dev python-psycopg2 &&  apt-get clean

RUN wget http://download.osgeo.org/gdal/gdal-1.9.0.tar.gz && tar xvfz gdal-1.9.0.tar.gz && cd gdal-1.9.0 && ./configure --with-python && make && make install && ldconfig
