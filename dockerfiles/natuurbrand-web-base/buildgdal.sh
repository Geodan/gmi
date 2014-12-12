
apt-get install -y build-essential python-all-dev
wget http://download.osgeo.org/gdal/gdal-1.9.0.tar.gz
tar xvfz gdal-1.9.0.tar.gz
cd gdal-1.9.0
./configure --with-python
make
sudo make install
