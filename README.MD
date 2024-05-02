# NestJS REST API Gateway + Kafka
This project is created using the nestjs framework and typescript.
The api-gateway communicates with users via rest api, and the api-gateway 
and other microservices communicate using kafka. all services are using only one db.
Because this project is for learning and example purposes. 
The normal way is to have a separate DB for each microservice.

## Features of this project
- Sign up
- Login
- Insert Todo
- Update Todo
- Delete Todo
- Complete Todo / Incomplete Todo

## How to Run

1. Program Requirements
-  [Docker](https://docs.docker.com/install/)
-  [Docker Compose](https://docs.docker.com/compose/install/)

2. In the Terminal or Command Prompt, type the command below.
- Mac/Linux \
`docker network create kafka-microservices-study && cp .env.docker.local .env && docker-compose up -d`
- Window
- `docker network create kafka-microservices-study && copy .env.docker.local .env && docker-compose up -d`


## Monitoring Kafka clusters
This project uses kafdrop. So you can see the Kafka cluster information in gui.
http://localhost:9000
