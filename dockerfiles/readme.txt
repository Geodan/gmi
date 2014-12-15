Natuurbrand model
=================

Componenten
===========
Database
	postgres/postgis
Java Webserver (tomcat7)
	Geoserver (Python/WPS)
Webserver (apache2)
	onstluit alle componenten
	farsite (dit model wordt aangestuurd binnen de Webserver (apache cgi))
	reverse proxy

Componenten die geinstalleerd moeten worden: git, postgis, gdal, python, geoserver, plugins voor wps en python, 32-bit support

Authenticatie
=============
-De site wordt afgeschermd met BASIC AUTHENTICATION
-De database toegang voor psql-scripts en pd-tools kan worden geregeld door de toegangsparameters in ~/.pgpass te zetten
host:port:user:password (dit is op de localhost: localhost:5432:research:modeluser:modeluser)
(python)  scripts moeten voor elke database call zelf de credentials mee opgeven.
 tomt:tomt
 modeluser:modeluser
 docker:docker
-Geoserver: admin:Gehijm

Werking
=======

Via de user interface, een kaart, wordt een gebied ingeteket als rechthoek
Er wordt een terrein subset gemaakt (presentatie mbv. top10nl)
Teken een vuurlijn
Draai het model

Flow
====
De software die de besturing regelt zit in de vorm van JavaScript op de client.
De Ajax calls waarmee gegevens naar de server worden gestuurd gaan naar de wps omgeving, die via de Webserver wordt gevonden.

De WPS scripts roepen CGI scripts aan op de Webserver

De CGI scripts roepen op hun beurt weer WPS aan.

Op het filesysteem, binnen de data direcotry van geoserver, worden features toegevoegd.

Zowel WPS scripts als CGI scripts hebben toegang tot de database nodig



Data
====

Er zijn 2 databronnen
1. de geoserver data directory
2. en de postgres/gis database.

1.
De geoserver data directory kan buiten de webserver worden gehouden als complete directory structuur. Deze is ongeveer 800 Mb, en bevat onder meer de top10nl web-cache.

2.
De postgis database heeft behalve tabellen die de parameters voor het rekenmodel bewaren met name een ahn tabel met rasters (dems.ahn1).
Deze rasters worden ingelezen mbt. een postgis tool. De files moeten voor de database zichtbaar blijven, na inlezen kan de ahn bron niet verplaatst worden.
voorbeeld : raster2pgsql -I -F -x -r -a  -s 28992 -R /home/ubuntu/a.tiff dems.ahn1 | psql -h localhost -d research -U modeluser
De ahn bevat 6.2Gb aan tiff files. De postgres database is 12Gb.


Deployment
==========

In de ontwikkelomgeving (Geodan omgeving) staan de genoemde componenten op drie servers, bron data van de ah komt van de titania (staat blijkbaar niet op de (40.8). Voor de uitlevering wordt een Virtual Host gebruikt, waarop alles opnieuw moet worden geinstalleerd.
In principe worden alle genoemende componenten op 1 virtual host geinstalleerd en werkend gemaakt (denk aan settings waarin paden, hosts en ports, users/passwds  worden gezet). Klanten draaien de Virtual Machine lokaal op de laptop.

Voor de laatste levering gebruiken we Docker. Docker kan de drie-server-opzet aanhouden in de vorm van verschillende ubuntu images die alle alles op 1 en dezelfde server staan. De drie omgevingen kunnen afzonderlijk worden geconfigureerd en in delen worden samengesteld en relatief makkelijk worden gewijzigd. Momenteel zijn er voor dit project 7 images, waarvan er 3 gerund worden.

De datapakket kunnen buiten de Docker images blijven staan (persistent) en via parameters aan de verschillende containers worden doorgegeven.
Dit geldt voor de tiffs van de hoogtekaart, de geoserverdata en de postgres database ~/data/postgresql/9.3/main/



VirtualBox of VMWare
====================]
Virtual box kan een vmdx openen en draaien

Creer een virtual ubuntu 14.04 box vooralsnog Bridged (over de wired  connection), met als user ubuntu (levert /home/ubuntu/)

Ga uit van

Kopieren van data
=================

git clone https://github.com/Geodan/gmi
scp geodan@192.168.40.5:/var/data/geoserverdata ~/data/geoserverdata
scp geodan@192.168.24.15:/var/data/geodata/ahn1/raster5  ~/data/ahn/raster5



Docker
======
Docker installeren : curl -sSL https://get.docker.com/ubuntu/ | sudo sh
Om docker te runnen zonder sudo : USER toevoegen aan docker groep. (sudo groupadd docker, als docker groep niet bestaat)
sudo gpasswd -a ${USER} docker
sudo service docker restart

Docker-enter utility
====================
Handig om een containers in te gaan die gestart werd met docker run -d (daemon)

Installeren: docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter

Gebruik: docker-enter apache (als apache een runnende container is)


~/git/gmi/dockerfiles
=====================

In ~/git/gmi/dockerfiles bevinden zich de 7 Dockerfiles voor de 7 images, waarvan er uiteindelijk 3 als container gerund worden.
In dezeldfe directory bevinden zich een hoop shell scripts die helpen om alles goed in te stellen

een image wordt gemaakt met docker build -t <image-name> <Dockerfile locatie>
let op: voordat je nog eens bouwt moet de image erst wordt verwijderd met docker rmi <image-name>
let op: voordat je een image kunt verwijderen, mag hij niet meer in gebruik zijn.

Images bouwen op elkaar.

De opzet
========
kies een basis image: dit kan zijn ubuntu:14.04, maar ik kies voor een afgemeten versie hiervan quantumobject/docker-baseimage
Hier wordt een tag name (image name) gebruikt


een postgres93 image: met postgres en postgis + toegangs regeling + GDAL enable)
FROM quantumobject/docker-baseimage

een postgres image (postgres) dat we gaan runnen
FROM postgres93

een basis web image waarop de gemenschappelijke componenten van de geoserver en apache image al staan
FROM quantumobject/docker-baseimage

een apache2 image
FROM web-base

een tomcat7 image
FROM web-base

een apache image (apache) met de configuratie die we gaan runnen
FROM apache2

een tomcat image  (geoserver) met de configuratie die we gaan runnen
FROM tomcat7


Te werk
=======

$ docker images
er zijn geen images

docker build -t web-base ./natuurbrand-web-base
docker build -t tomcat ./tomcat7
docker build -t geoserver ./geoserver-2.6.0
docker build -t postgres93 ./postgres-9.3
docker build -t postgres ./postgres-9.3-run
docker build -t apache2 ./apache2
docker build -t apache ./apache2-run

(dit duurt allemaal tegelijk lang, maar het opnieuw maken van de run images duren nog maar kort)

Voor het opnieuw maken zie rpo en rpo93, rapa en rapa2, rgeo


Runnen
======
Sommige images worden gerund. Niet eenmalig maar als daemon mer daarin een service op een poort.
In het image moet een service draaien, en die moet blijven draaien, dus niet zelf als service, maar als FORGROUND process in de container.
Het fine tunen van het opstartproces wordt vaak geregeld in een shell script, dat als ENTRYPOINT wordt gebruikt na docker start.

Je moet daarna rekening houden met deze containers. Runnende containers kunnen gestopt en weer gestart worden (zonder opnieuw te runnen).
Het ENTRYPOINT wordt opnieuw uitgevoerd.

Als er nog helamaal geen containers zijn moet je een image runnen. De container krijgt een tag name (container name)

$ docker ps -a
er zijn geen containers


Er zijn 3 run scripts drun-1 drun-2 en drun-3. Bekijk de parameters: belangrijke info worden in het runcommando aan de container gegeven: -p = port mapping, -v = volumes --link andere containers
Je moet de containers dus in volgorde starten om de links te kunnen resolvenm.
Bij crosslinks (container A gebruikt container B en cointainer B gebruikt container A die container B gebruikt) kan de --add-host uitkomst bieden als je de virtual host zelf bekend maakt in decontainer. --add-host=myserver:$(script om de ip adres van deze host te parsen)
Dit laatse is in onze geval nodig bij de tweede container : geoserver


Om dit proces iets te vereenvoudigen:
~/drun.sh

Als de virtual host uit gaat wordten de containers gestopt. (dit kun je zelf doen met ~/dstop.sh)
Als de virtual host weer wordt opgestart, moeten de containers weer worden gestart met ~/dstart.sh



Mocht je de cotainers opnieuw willen bouwen,. dan moet je eerst alle afhankelijkheden verwijderen:
container stoppen en weggooien ( docker rm : of ~/drm.sh)
image weggooien. ~/drmi.sh gooit de drie container images weg: ~/dbuild.sh bouwt de drie images (dus niet de  onderliggende andere 4)











