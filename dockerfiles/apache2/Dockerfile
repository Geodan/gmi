FROM quantumobject/docker-baseimage

# Download and Install Apache2
RUN apt-get update && apt-get install -yq apache2 python python-psycopg2 git && a2enmod cgi proxy proxy_html proxy_http && apt-get clean 
