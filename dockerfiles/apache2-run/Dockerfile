FROM apache2
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
ADD run.sh /run.sh
ADD index.html /var/www/index.html
ADD farsite/lib/* /usr/lib/
RUN ldconfig
RUN mkdir /farsite-python
ADD farsite/api/python/ /farsite-python/
RUN chmod +x /run.sh
EXPOSE 80
ENTRYPOINT /run.sh
