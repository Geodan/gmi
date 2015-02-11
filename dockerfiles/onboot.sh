#!/bin/sh 
### BEGIN INIT INFO
# Provides:         onboot 
# Required-Start:    $local_fs $remote_fs $network
# Required-Stop:     $local_fs $remote_fs $network
# Should-Start:      $named
# Should-Stop:       $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start docker containers.
# Description:       Start the dockercontainers.
### END INIT INFO
PATH=/sbin:/usr/sbin:/bin:/usr/bin
DESC="Run onboot"
NAME=onboot
#not more or less than 4 lines
PS=$(docker ps -a | awk 'END{print NR}')
cd /opt/gmi/dockerfiles
echo $PS
if [ $PS = 4 ]; then
	/opt/gmi/dockerfiles/dstart.sh
	exit 0
else
	/opt/gmi/dockerfiles/drm.sh
	/opt/gmi/dockerfiles/drun.sh
	exit 0
fi;
