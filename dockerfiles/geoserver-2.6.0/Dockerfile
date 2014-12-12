FROM tomcat7
ADD write.sh /write.sh
RUN ldconfig && chmod +x write.sh
ENTRYPOINT /usr/share/tomcat7/bin/catalina.sh run
