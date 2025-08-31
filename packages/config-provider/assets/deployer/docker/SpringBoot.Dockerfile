FROM ghcr.io/graalvm/graalvm-ce:latest

WORKDIR /app

COPY /target/*.jar .
RUN mv $(ls -t -- *.jar | head -n1) app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
