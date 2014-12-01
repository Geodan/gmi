# PostGIS
# Defaults: Postgis credentials: docker/docker
#           Open ports:          5432

#FROM ubuntu:14.04
FROM quantumobject/docker-baseimage

# Initialization
RUN wget --quiet --no-check-certificate -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends sed pwgen ca-certificates postgresql-9.3 postgresql-contrib-9.3 \
                                                postgresql-9.3-postgis-2.1 postgis && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
# Configure PostGIS
RUN echo "host    all   all     192.168.0.0/16               md5" >> /etc/postgresql/9.3/main/pg_hba.conf && \
    echo "host    all   all     172.17.0.0/16               md5" >> /etc/postgresql/9.3/main/pg_hba.conf && \
    echo "listen_addresses = '*'" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "port = 5432" >> /etc/postgresql/9.3/main/postgresql.conf 

