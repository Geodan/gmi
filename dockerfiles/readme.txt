Natuurbrand model
=================

Componenten
===========

Database

- postgres 9.3 / postgis 2.1

Java Webserver 

- tomcat7
- Geoserver 2.6.0 (python/WPS/gdal-bin)

Webserver 

- apache2
- python 2.7 
- gdal-bin
- reverse proxy
- farsite (dit model wordt aangestuurd via apache cgi) (copieer naar /usr/lib/)

Componenten die geinstalleerd moeten worden: git, postgis, gdal, python, geoserver, plugins voor wps en python, 32-bit support

Authenticatie
=============
- De site wordt afgeschermd met BASIC AUTHENTICATION
- De database toegang voor psql-scripts en pd-tools kan worden geregeld door de toegangsparameters in ~/.pgpass te zetten
  host:port:user:password (dit is op de localhost: localhost:5432:research:modeluser:modeluser)
  (python)  scripts moeten voor elke database call zelf de credentials mee opgeven.
     tomt:tomt
     modeluser:modeluser
     docker:docker
- Geoserver
    admin:<het geheime wachtwoord>

Werking
=======

- Via de user interface, een kaart, wordt een gebied ingetekend als rechthoek
- Er wordt een terrein subset gemaakt (presentatie mbv. top10nl)
- Teken een vuurlijn
- Draai het model

Flow
====
De software die de besturing regelt zit in de vorm van JavaScript op de client.
De Ajax calls waarmee gegevens naar de server worden gestuurd gaan naar de wps omgeving, die via de Webserver wordt gevonden.

- De WPS scripts roepen CGI scripts aan op de Webserver

- De CGI scripts roepen op hun beurt weer WPS aan.

- Op het filesysteem, binnen de data direcotry van geoserver, worden features toegevoegd.

- Zowel WPS scripts als CGI scripts hebben toegang tot de database nodig


Deployment
==========

Voor de uitlevering wordt een Virtual Host gebruikt, waarop alles opnieuw moet worden geinstalleerd.
In principe worden alle genoemende componenten op 1 virtual host geinstalleerd en werkend gemaakt (denk aan settings waarin paden, hosts en ports, users/passwds  worden gezet). 
Klanten draaien de Virtual Machine lokaal op de laptop.

In de ontwikkelomgeving (Geodan omgeving) staan de genoemde componenten op drie servers:
- bron data van de ahn komt van de titania (staat blijkbaar niet op de (192.168.40.8). 

In plaats nu om alles op 1 virtuele macine te zetten gebruiken we voor de verandering Docker.
Docker kan de drie-server-opzet aanhouden in de vorm van verschillende ubuntu images die alle alles op 1 en dezelfde server staan. 
De drie omgevingen kunnen afzonderlijk worden geconfigureerd en in delen worden samengesteld en relatief makkelijk worden gewijzigd. 
Momenteel zijn er voor dit project 7 images, waarvan er 3 gerund worden.

De datapakket kunnen buiten de Docker images blijven staan (persistent) en via parameters aan de verschillende containers worden doorgegeven.
Dit geldt voor de tiffs van de hoogtekaart, de geoserverdata en de postgres database. Zie  ~/data/ (/home/ubuntu/data)


VirtualBox of VMWare
====================
Virtual box kan een vmdx openen en draaien

Creer een virtual ubuntu 14.04 box vooralsnog Bridged (over de wired  connection), met als user ubuntu (levert /home/ubuntu/). 
De HardDisk moet 40Gb zijn, een basis draaiend systeem is 30Gb.


Data
====
Er zijn 2 databronnen

1. de geoserver data directory
2. en de postgres/gis database, met daarin 4 schema's, deels  gevuld met data
	de data komt van dezelfde schema's van 192.168.40.8 research database 
	de administration, model_wildfire, top10nl, dems.
	de dems wordt met raster2psql gevuld
	in ./dockerfiles/postgres-9.3-run/ddl bevindt zich een dump script, bedoeld om de gegevens en de schema definities op te halen.

ad 1. De geoserver data directory kan buiten de webserver worden gehouden als complete directory structuur. Deze is ongeveer 800 Mb, en bevat onder meer de terrein web-cache.
ad 2. De postgis database heeft behalve tabellen die de parameters voor het rekenmodel bewaren, met name een ahn1 tabel met rasters (dems.ahn1).

De rasters worden ingelezen mbt. een postgis tool. De files moeten voor de database zichtbaar blijven, na inlezen kan de ahn bron niet verplaatst worden.
De ahn bevat 6.2Gb aan tiff files. De postgres database is 12Gb, incl. ahn1 en top10nl (top10nl.sql is 13Gb).


De data kan worden opgeschoond, door resultaat features te verwijderen zijnde de geoserver objecten en de bijbehorende tabelen op postgres.
De params_ tabellen in administration kunnen worden leeggemaakt (truncate)


Kopieren van data
-----------------

	$ git clone https://github.com/Geodan/gmi
	$ scp -rp geodan@192.168.40.5:/var/data/geoserverdata ~/data/geoserverdata
	$ scp -rp geodan@192.168.24.15:/var/data/geodata/ahn1/raster5  ~/data/ahn/raster5
	

Het inlezen van de ddl en gebruik van raster2psql
-------------------------------------------------

Gebruik voor het vullen van de database psql en raster2psql. Deze tools zijn aanwezig in de postgres container. (Zie Docker)
Na het runnen van de postgres container kun je naar postgres met docker-enter postgres .

Je kan ook mbv je netwerk en eigen postgres installatie (versie 9.3) de remote database vullen.

De ddl scripts kunnen via psql  research worden ingelezen. 

	- voorbeeld : psql -h localhost -d research -U modeluser -f <SQL-file>
	- voorbeeld : raster2pgsql -I -F -x -r -a  -s 28992 -R /home/ubuntu/data/ahn/raster5/a.tiff dems.ahn1 | psql -h localhost -d research -U modeluser
		In de /home/ubuntu/data/ahn/raster5 directory bevindt zich een script voor deze import

De tif files moet vanuit de database in de container gezien dezelfde padverwijzign hebben. Zie Docker: drun-1-p.sh -v volume referentie.


Docker
======
Docker installeren 
	
	curl -sSL https://get.docker.com/ubuntu/ | sudo sh

Om docker te runnen zonder sudo : USER toevoegen aan docker groep. (sudo groupadd docker, als docker groep niet bestaat)

	$ sudo gpasswd -a ${USER} docker
	$ sudo service docker restart

docker-enter utility
--------------------
Handig om een containers in te gaan die gestart werd met docker run -d (daemon)

Installeren via docker: 

	$ docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter

Gebruik: 

	$ docker-enter apache
	$ docker-enter postgres
	$ docker-enter geoserver


~/git/gmi/dockerfiles
---------------------

In ~/git/gmi/dockerfiles bevinden zich de 7 Dockerfiles voor de 7 images, waarvan er uiteindelijk 3 als container gerund worden.
In dezelfde directory bevinden zich een hoop shell scripts die helpen met docker management.
De shell-scripts gebruiken relatieve paden dus ga naar ~/git/gmi/dockerfiles alvorens ze te gebruiken.

Een image wordt gemaakt met docker build -t <image-name> <Dockerfile locatie>
let op: voordat je nog eens bouwt moet de image eerst wordt verwijderd met docker rmi <image-name>
let op: voordat je een image kunt verwijderen, mag hij niet meer in gebruik zijn (container stoppen en verwijderen).


Images / Dockerfile
-------------------
Images bouwen op elkaar. 

	- De docker file (genaamd Dockerfile) begint met FROM <image:tag>. 
	- Daarna RUN je commando's op dit image (uitbreiding). 
		In de RUN statements zie je het apt-get install verschijnen.
		Maar ook regels die iets toevoegen aan configuratiebestanden
	- Voeg hele bestanden toe met ADD (bv. een uitgekiende 000-default.conf aan /etc/apache2/sites-available)
	- Daarna kan je een proces laten starten op het image. In ENTRYPOINT komt het opstart commando
		Dit opstart commando is vaak een shell script dat tevoren met ADD is toegevoegd aan de image.
		docker run start dit script, elke keer als de container met docker start opnieuw wordt gestart wordt het ENTRYPOINT opnieuw gedaan.
		Zie postgres-9.3-run/run.sh

De images opzet
---------------

Kies eerste een basis image: dit kan zijn ubuntu:14.04, maar ik kies voor een afgemeten versie hiervan quantumobject/docker-baseimage
docker images worden in dedocker registry gezoncht als ze lokaal niet bestaan

Elke Dockerfile moet in een eigen directory zitten

./postgres-9.3 : out of the box met postgres en postgis, maar ook configuratie (ip: toegang + GDAL enable)

	FROM quantumobject/docker-baseimage

./postgres-9.3-run : postgres image (postgres) dat we gaan runnen

	FROM postgres93

./natuurbrand-web-base : een basis web image, waarop de componenten die geoserver en apache nodig hebben (32-bit support en gdal-bin)

	FROM quantumobject/docker-baseimage

./apache2 : out of the box

	FROM web-base

./tomcat7 : out of the box

	FROM web-base

./apache2-run : apache image  met de configuratie die we gaan runnen als apache

	FROM apache2

./geoserver-2.6.0 : tomcat image  (geoserver) met de configuratie die we gaan runnen als geoserver

	FROM tomcat7

Images bouwen
=============

	$ docker images

er zijn geen images

gebruik -t om een image name te geven die later gebruikt wordt in FROM

	$ docker build -t web-base ./natuurbrand-web-base
	$ docker build -t tomcat ./tomcat7
	$ docker build -t geoserver ./geoserver-2.6.0
	$ docker build -t postgres93 ./postgres-9.3
	$ docker build -t postgres ./postgres-9.3-run
	$ docker build -t apache2 ./apache2
	$ docker build -t apache ./apache2-run

(dit duurt allemaal tegelijk lang, maar het opnieuw maken van de run images duren nog maar kort)

Voor het opnieuw maken zie rpo.sh en rpo93.sh, rapa.sh en rapa2.sh, rgeo.sh


Images runnen
=============

Voordat er gerund kan worden aandacht voor de volgende voorbereidingen:

postgres
--------
Voor postgres moeten de container subnetmasks worden toegevoegd aan pg_hba.conf. Dit gebeurt in de base image postgres93. 
De database wordt buiten de container gedirigeerd.
de base image creeert een database. Bij het runnen wordt de bestaand volume buiten de container zichtbaar.


geoserver
---------
Een geoserver.war (versie 2.6.0) moet worden uitgebreid met wps en python scripts. Hier is ~/prepare_geoserver/geoserver.sh beschikbaar. 
Dit download alles en pakt uit. Het resultaat komt in ~/geoserver. Deze map wordt aan de geoserver container meegeven.
De GEOSERVER_DATA_DIR genoemd in web.xml (geoserver-2.6.0/Dockerfile) wordt ook meegegeven aan de container. Dit is ~/data/geoserverdata/
In geoserverdata/workspace moet de datastore in model_wildfire worden aangepast. De server heet postgres. 
Het wachtwoord van tomt is anders dan op de 192.168.40.8. (zie store: /jansen (tomt))
De wps scripts moeten de juiste connectieparameters gebruiken postgres 5432 en virtualhost.

prepare apache
--------------
De hele ~/git/gmi directory wordt gemapt op /var/www/main/gmi
Ook hier moeten de scripts de juiste connectieparameters gebruiken postgres:5432 en geoserver:8080.
Let ook op de paden naar gdal in settings.py.

settings.py: 

	conn_params = "host=postgres port=5432 dbname=research user=modeluser password=modeluser"
	pgserver_host = 'postgres'
	pgserver_port = '5432'
	pgserver_user = 'modeluser'
	gs_host = 'geoserver'
	gs_port='8080'

	gdal_translate_path = '/usr/bin/gdal_translate'
	gdalwarp_path = '/usr/bin/gdalwarp'
	lcpmake_path = '/var/www/main/gmi/bin/lcpmake'
	farsite_path = '/var/www/main/gmi/bin/farsite'
	output_basepath  = '/var/data/wildfire/'
	defaults_path = '/var/www/main/gmi/defaults/'


runnen
------

Onze images worden gerund als daemon (op de actergrond) met daarin een service op een poort (EXPOSE).
Normaal als docker iets runt, wordt het commando uitgevoerd en eindigt de run. De container gaat weer uit.
Maar we willen dat in de container de service blijft draaien. Dan moet dat process op de FOREGROUND draaien.
Het fine-tunen van het opstartproces wordt vaak geregeld in een shell script, dat als ENTRYPOINT wordt gebruikt na docker start.


Je moet na docker run rekening houden met het bestaan van de container. Runnende containers kunnen gestopt en weer gestart worden (zonder opnieuw te runnen).
Het ENTRYPOINT wordt na $ docker start opnieuw uitgevoerd.

Kijk welke containers er zijn.

	$ docker ps -a


Als er helemaal geen containers zijn moet je nog een run commando geven.

Als er wel containers zijn, kun je die weer starten (met zijn container naam).

De container krijgt in het run commando een tag name (container name) (dit wordt een grappige random naam, maar we gaan hem met -t zelf meegeven.)

Er zijn 3 run scripts drun-1-p.sh drun-2-p-g.sh en drun-3-p-g-a. 
Bekijk deze scripts en vooral de parameters: 
belangrijke info worden in het run-commando aan de container gegeven: -p = port mapping, -v = volumes --link andere containers

Links 
-----
Na docker run -d -t A imageA kun je docker run -d -t B --link A:A imageB doen: in container B wordt nu  een entry voor A in de /etc/hosts file gezet.
Zo kan je deze naam gebruiken in calls naar server A vanuit container B.

Je moet de containers dus in volgorde starten om de links te kunnen resolven.
Bij crosslinks kan de --add-host uitkomst bieden. 
Stel container 3 (apache) gebruikt container 2 (geoserver) en geoserver  gebruikt serverside apache (die zelf daar dan weer geoserver gebruikt). 
Maak dan de virtual host zelf bekend binnen container 2 (geoserver). apache is immers beschikbaar op de virtualhost poort 80.

--add-host=virtualhost:$(ip addr show eth0 | awk '/ inet / {split($2,arr,"/");print arr[1]}'))
IP virtualhost wordt toegevoegd aan de /etc/host file
De geoserver container kan op deze manier serverside curl requests naar de host sturen (ipv naar de container).


Om het run proces iets te vereenvoudigen:

	./drun.sh

Als de virtual host uit gaat, worden de containers gestopt. ( ./dstop.sh)
Als de virtual host weer wordt opgestart, moeten de containers weer worden gestart met ./dstart.sh


Volumes
-------
Om te voorkomen dat images data gaat bevatten, die kwijt raakt als het image opnieuw gebouwd moet worden, bewaren we de data buiten de daemon images. 
Dit kan in aparte docker images (zodat je eenvoudig van databases kan verwisselen), maar wij hebben data gemapt op directories van het host systeem. 
Zie folder ~/data (/ubuntu/home/data)

Logging
=======
De logging is niet buiten de container in te zien. Binnen de containers produceren geoserver, tomcat en apache logging. postgres doet dit niet, omdat het proces



Opnieuw bouwen
=============

data
----
De data in de database en de tiff files staan op het hostsysteem, maar mocht dit kwijt of corrupt raken, dan moet dit opnieuw naar de VM worden gebracht 
en zonodig opnieuw in de  database ingelezen.

docker
------
Mocht je de containers opnieuw willen bouwen, dan moet je eerst alle afhankelijkheden verwijderen:

	- containers stoppen en weggooien 
		docker stop : of ./dstop.sh
		docker rm : of ./drm.sh)
	- images weggooien. 
		docker rmi : of ./drmi.sh gooit de drie container images weg: 
			(./dbuild.sh bouwt de drie images (dus niet de  onderliggende andere 4))

	- bekijk / gebruik de genoemde scripts (Images bouwen) om onderdelen opnieuw te bouwen en runnen.

Mochten er conflicten ontstaan binnen docker management kijk dan met docker ps -a en docker images of werkelijk alle weg is. Je kan de hashes gebruiken bij stop rm en rmi.

