# PostGIS
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
    echo "Europe/Amsterdam" > /etc/timezone    && \
    dpkg-reconfigure -f noninteractive tzdata && \
    rm -rf /var/lib/apt/lists/*
   
# Configure PostGIS
RUN echo "host    all   all     192.168.0.0/16               md5" >> /etc/postgresql/9.3/main/pg_hba.conf && \
    echo "host    all   all     172.17.0.0/16               md5" >> /etc/postgresql/9.3/main/pg_hba.conf && \
    echo "listen_addresses = '*'" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "port = 5432" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "logging_collector = on" >>  /etc/postgresql/9.3/main/postgresql.conf && \ 
    echo "log_directory = '/var/log/postgresql'" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "log_truncate_on_rotation = on" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "log_rotation_age = 1d" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "POSTGIS_ENABLE_OUTDB_RASTERS=1" >> /etc/postgresql/9.3/main/environment && \
    echo "POSTGIS_GDAL_ENABLED_DRIVERS=ENABLE_ALL" >>  /etc/postgresql/9.3/main/environment

EXPOSE 5432
