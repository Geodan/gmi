import os,cgi, cgitb
import subprocess
killstring = "sleep 5 && kill `ps -C farsite | awk '{ print $1 }' | grep -v PID`"
try:
	p = subprocess.Popen(killstring,shell=True)
except subprocess.CalledProcessError, e:
	print "Error: " , e.output

