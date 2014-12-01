#!/bin/bash

DATADIR="/var/lib/postgresql/9.3/main"
CONF="/etc/postgresql/9.3/main/postgresql.conf"
POSTGRES="/usr/lib/postgresql/9.3/bin/postgres"
INITDB="/usr/lib/postgresql/9.3/bin/initdb"
SQLDIR="/usr/share/postgresql/9.3/contrib/postgis-2.1/"


# test if DATADIR is existent
if [ ! -d $DATADIR ]; then
  echo "Creating Postgres data at $DATADIR"
  mkdir -p $DATADIR
fi

# test if DATADIR has content
if [ ! "$(ls -A $DATADIR)" ]; then
  echo "Initializing Postgres Database at $DATADIR"
  chown -R postgres $DATADIR
  su postgres sh -c "$INITDB $DATADIR"
  su postgres sh -c "$POSTGRES --single -D $DATADIR -c config_file=$CONF" <<< "CREATE USER $USERNAME WITH SUPERUSER PASSWORD '$PASS';"
fi

trap "echo \"Sending SIGTERM to postgres\"; killall -s SIGTERM postgres" SIGTERM

su postgres sh -c "$POSTGRES -D $DATADIR -c config_file=$CONF" &
# Wait for the db to start up before trying to use it....

sleep 10

RESULT=`sudo -u postgres psql -l | grep postgis | wc -l`
if [[ $RESULT == '1' ]]
then
    echo 'Postgis Already There' >out
else
    echo "Postgis is missing, installing now" >out
    # Note the dockerfile must have put the postgis.sql and spatialrefsys.sql scripts into /root/
    # We use template0 since we want t different encoding to template1
    echo "Creating template postgis"
    sudo -u postgres createdb template_postgis -E UTF8 -T template0

    echo "Adding extensions to template_postgis"
    sudo -u postgres psql -d template_postgis -c 'create extension hstore;'
    sudo -u postgres psql -d template_postgis -c 'create extension postgis;'
    sudo -u postgres psql -d template_postgis -c 'create extension postgis_topology;'

    echo "Creating research database using template_postgis"    
    sudo -u postgres createdb -T template_postgis -O docker  research

    echo "Creating user tomt"    
    sudo -u postgres psql -c "CREATE USER tomt WITH PASSWORD 'tomt';"
    sudo -u postgres psql -c "CREATE USER modeluser WITH PASSWORD 'modeluser';"
    
    sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE research to tomt;'
    sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE research to modeluser;'

    echo "Executing DDL scripts"    
    psql -U docker -d research -h localhost -f /ddl/administration.sql 
    psql -U docker -d research -h localhost -f /ddl/create_schemas.sql 
   echo "Finished DDL scripts"    
    
fi

wait $!

