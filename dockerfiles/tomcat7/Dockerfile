#FROM ubuntu:14.04
FROM quantumobject/docker-baseimage

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
RUN  export DEBIAN_FRONTEND=noninteractive
ENV  DEBIAN_FRONTEND noninteractive
RUN ["apt-get","update"]
RUN ["apt-get","-y","install","wget"]
RUN ["apt-get","-y","install","openjdk-7-jre"]
RUN ["apt-get","-y","install","tomcat7"]
RUN ["mkdir","/usr/share/tomcat7/logs"]
ENV CATALINA_BASE /var/lib/tomcat7
ENV CATALINA_HOME /usr/share/tomcat7 
EXPOSE 8080

