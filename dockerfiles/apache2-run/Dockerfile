FROM apache2
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
ADD libfarsite.so /usr/lib/libfarsite.so
ADD run.sh /run.sh
RUN chmod +x /run.sh
EXPOSE 80
ENTRYPOINT /run.sh
