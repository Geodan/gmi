FROM apache2
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
VOLUME /var/www/main/gmi/externals/GeoExt
ADD run.sh /run.sh
ADD write.sh /write.sh
RUN chmod +x /run.sh
RUN chmod +x /write.sh
ENTRYPOINT /run.sh
