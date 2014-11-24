# PostGIS
# Defaults: Postgis credentials: docker/docker
#           Open ports:          5432

#FROM ubuntu:14.04
FROM quantumobject/docker-baseimage

# Initialization
RUN wget --quiet --no-check-certificate -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends pwgen ca-certificates postgresql-9.3 postgresql-contrib-9.3 \
                                                postgresql-9.3-postgis-2.1 postgis && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
# Configure PostGIS
RUN echo "host    all   all     192.168.0.0/16               md5" >> /etc/postgresql/9.3/main/pg_hba.conf && \
    echo "listen_addresses = '*'" >> /etc/postgresql/9.3/main/postgresql.conf && \
    echo "port = 5432" >> /etc/postgresql/9.3/main/postgresql.conf
RUN service postgresql start && \
    /bin/su postgres -c "createuser -d -s -r -l docker" && \
    /bin/su postgres -c "psql postgres -c \"ALTER USER docker WITH ENCRYPTED PASSWORD 'docker'\"" && \
    service postgresql stop
RUN mv /etc/ssl/private /etc/ssl/private~ && \
    cp -pr /etc/ssl/private~ /etc/ssl/private && \
    rm -rf /etc/ssl/private~

ENV PGPASSWORD postgis

# Add very important files
ADD run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 5432

ENTRYPOINT /run.sh
