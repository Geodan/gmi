FROM web-base

# Download and Install Apache2
RUN ldconfig && apt-get update --fix-missing && apt-get install -yq lib32stdc++6 lib32z1 lib32ncurses5 lib32bz2-1.0 apache2 python-scitools libboost-all-dev git && a2enmod cgi proxy proxy_html proxy_http && apt-get clean 
