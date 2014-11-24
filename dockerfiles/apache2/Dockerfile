FROM quantumobject/docker-baseimage

# Download and Install Apache2
RUN apt-get update
RUN apt-get install -y apache2

# Setting up the Enviroment Variables
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

# Set the Volume
#VOLUME ["/var/www/gmi"]
ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
ADD gmi /var/www/gmi

# Set the port
EXPOSE 80

CMD ["/usr/sbin/apachectl","-DFOREGROUND"]
