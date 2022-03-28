FROM postgres:14.1-alpine
# what image to base off of - references a Dockerfile to automate the build process

RUN npm i express pg knex
# RUN git clone 
RUN npx knex migrate:latest
RUN npx knex seed:run
# what runs within the container at build time - can have multiple

VOLUME var/lib/postgresql/data
#specifying it in the dockerfile allows it to be externally mounted via the host itself or a docker data container 
# if it is not defined here it is not possible to access outside of the container

ENV
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=docker
# sets environment variables which can be used in the Dockerfile and any scripts that it calls

COPY 
# can copy a file in the same directory as the dockerfile to the container

ENTRYPOINT
# if not specified, docker will ise /bin/sh -c as default
#can be used to override some of the system defaults

CMD
#default argument passed to entrypoint