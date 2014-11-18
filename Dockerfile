FROM ubuntu:trusty
MAINTAINER huub<huub.fleuren@geodan.nl>
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN apt-get -y update
RUN apt-get -y install ca-certificates rpl pwgen
RUN apt-get install -y postgresql-9.3-postgis-2.1
RUN service postgresql start && /bin/su postgres -c "createuser -d -s -r -l docker" && /bin/su postgres -c "psql postgres -c \"ALTER USER docker WITH ENCRYPTED PASSWORD 'docker'\"" && service postgresql stop
ADD postgres.conf /etc/supervisor/conf.d/postgres.conf
EXPOSE 5432
ADD setup.sh /setup.sh
RUN chmod 0755 /setup.sh
RUN /setup.sh
ADD start-postgis.sh /start-postgis.sh
RUN chmod 0755 /start-postgis.sh

USER postgres
CMD /start-postgis.sh

