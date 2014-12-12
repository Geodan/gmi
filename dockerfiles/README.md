Voorbereiding:
=============

Alle data downloaden van cumulus, nimbus, git, titania (ahn/raster5)

m.n.

  1. geoserverdata
  2. ahn files
  3. https://github.com/Geodan/gmi/
  4. zie ./dockerfiles/posgres-9.3-run/ddldump.sh om data te halen

gebruik bv. scp -rp geodan@192.168.40.8:/var/data/geoserverdata ~/data/geoserverdata

	./prepare.sh
		dit haalt het project van git en doet zoek en vervang van configuratie files
	./prepare_geoserver.sh
		plaatst files met configuratie data in ~/geoserver en ~/data/geoserverdata


Docker
======

In de docker directories bevinden zich files die naar de -v volumes worden gekopieerd

de volgende (image) names (-t) zijn belangrijk in Dockerfiles (FROM) 

  * docker build -t web-base ./natuurbrand-web-base
  * docker build -t tomcat ./tomcat7
  * docker build -t geoserver ./geoserver-2.6.0
  * docker build -t postgres93 ./postgres-9.3
  * docker build -t postgres ./postgres-9.3-run
  * docker build -t apache2 ./apache2
  * docker build -t apache ./apache2-run

images die als container (naam) gedraaid worden: 
  1. postgres (container name = postgres)
  2. geoserver (container name = geoserver) 
  3. apache (container name = apache)

Verwijder een bestaand image alvorens het opnieuw te builden


de drie scripts 
  1. drun.sh 
  2. dstop.sh 
  3. dstart.sh
 
gebruiken de container names die gecreeerd worden bij het aanmaken ervan in de verschilende docker run opdrachten
  1. drun-1-p.sh
  2. drun-2-p-g.sh
  3. drun-3-g-a.sh

utility

	docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter

	docker-enter &lt;container-name> 

herstarten webservices

	./drerunga.sh

docker (re-)build scripting (eerst stop en rm)

	voorbeeld: rebuild apache: ./rapa.sh
	voorbeeld: rebuild postgres: ./rpo93.sh ./rpo.sh
	voorbeeld: rebuild geoserver: ./rgeo.sh


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

