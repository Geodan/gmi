FROM postgres
RUN service postgresql start && \
    /bin/su postgres -c "createuser -d -s -r -l docker" && \
    /bin/su postgres -c "psql postgres -c \"ALTER USER docker WITH ENCRYPTED PASSWORD 'docker'\"" && \
    service postgresql stop

RUN mv /etc/ssl/private /etc/ssl/private~ && \
    cp -pr /etc/ssl/private~ /etc/ssl/private && \
    rm -rf /etc/ssl/private~ 

#    sed -i s=/var/lib/postgresql/9.3/main=/base=g /etc/postgresql/9.3/main/postgresql.conf

ENV PGPASSWORD docker

# Add very important files
ADD run.sh /run.sh

EXPOSE 5432

ENTRYPOINT /run.sh

