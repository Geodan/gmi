FROM apache2
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
VOLUME /var/www/gmi/externals/GeoExt
ADD run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT /run.sh
