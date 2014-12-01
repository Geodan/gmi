FROM quantumobject/docker-baseimage

# Download and Install Apache2
RUN apt-get update && apt-get install -yq apache2 python git && a2enmod cgi proxy proxy_html proxy_http && apt-get clean 
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
VOLUME /var/www/gmi/externals/GeoExt
ADD run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT /run.sh
