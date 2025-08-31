FROM tomcat:11-jre21

WORKDIR /usr/local/tomcat/webapps/

COPY /target/artifacts/*.war .
RUN mv $(ls -t -- *.war | head -n1) app.war

EXPOSE 8080

ENTRYPOINT ["catalina.sh", "run"]
