de volgende (image) names (-t) zijn belangrijk in Dockerfiles (FROM) 

  * docker build -t tomcat ./tomcat7
  * docker build -t geoserver ./geoserver-2.6.0
  * docker build -t postgres93 ./postgres-9.3
  * docker build -t postgres ./postgres-9.3-run
  * docker build -t apache2 ./apache2
  * docker build -t apache ./apache2-run

images die als container (naam) gedraaid worden: 
  1. runpg (container name = postgres)
  2. geoserver (container name = geoserver) 
  3. apache (container name = apache)

Verwijder een bestaand image alvorens het opnieuw te builden


de drie scripts 
  1. drun.sh 
  2. dstop.sh 
  3. dstart.sh 
gebruiken de container names die gecreeerd worden bij het aanmaken ervan in de verschilende docker run opdrachten
  
  voorbeeld: rebuild apache: ./rapa.sh


met dstart.sh kunnen de drie containers gestart worden, als ze met docker stop gestopt waren

stop container:  docker stop &lt;container-name>

remove container:  docker rm &lt;container-name>

remove image:  docker rmi &lt;image-name>

opnieuw maken: docker image -t &lt;image-name> Dockerfile-directory

opnieuw runnen: geef zelf een naam aan de container, of je krijgt een random naam.
* zie drun-1,2,3- scripts

docker run -d (daemon) --name &lt;container-name> -p &lt;port>:&lt;exposed-port-in-Dockerfile> [other options] image-name

 * bij links tussen containers moeten de container names worden gebruikt
 * de container name van de gelinkte container komt in de host file van de linkende container
 * in de configuraties van de linkende container kunnen de container names van de gelinkte container worden gebruikt (op plekken van host referenties).

