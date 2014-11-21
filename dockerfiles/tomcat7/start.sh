#!/bin/sh
#service tomcat7 restart

#Override the exit command to prevent accidental container distruction 
#echo 'alias exit="echo Are you sure? this will kill the container. use Ctrl + p, Ctrl + q to detach or ctrl + d to exit"' > ~/.bashrc

#Run bash to keep container running and provide interactive mode
#bash
/usr/share/tomcat7/bin/catalina.sh run
