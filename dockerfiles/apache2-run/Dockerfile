FROM apache2
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
VOLUME /var/www/main/gmi/externals/GeoExt
ADD libfarsite.so /usr/lib/libfarsite.so
ADD write.sh /write.sh
ADD run.sh /run.sh
RUN chmod +x /run.sh
RUN chmod +x /write.sh
ENTRYPOINT /run.sh
