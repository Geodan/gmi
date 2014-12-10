cd git
git clone https://github.com/Geodan/gmi
#all connection to postgres geoserver and self (gs_host)
find ~/git/gmi/ -name '*.py' -type f | xargs sed -i  "s/gs_host = '192.168.40.8'/gs_host='geoserver'/g"
find ~/git/gmi/ -name '*.py' -type f | xargs sed -i  "s/gs_port = '3389'/gs_port='80'/g"
find ~/git/gmi/ -name '*.py' -type f | xargs sed -i  's/3389/5432/g' 
find ~/git/gmi/ -name '*.py' -type f | xargs sed -i  's/192.168.40.8/geoserver/g' 
find ~/git/gmi/ -name '*.py' -type f | xargs sed -i  's/192.168.40.5/postgres/g' 

#geoserverdata is a copy from nimbus /var/data/geoserverdata
#all connection to postgres
find ~/data/geoserverdata/ -name '*.py' -type f | xargs sed -i s/192.168.40.5/postgres/g
find ~/data/geoserverdata/ -name '*.py' -type f | xargs sed -i s/3389/5432/g
cp ~/git/gmi/dockerfiles/geoserver-2.6.0/datastore.xml ~/data/geoserverdata/workspaces/model_wildfire/landuse/datastore.xml
cp ~/git/gmi/dockerfiles/geoserver-2.6.0/global.xml ~/data/geoserverdata/global.xml

