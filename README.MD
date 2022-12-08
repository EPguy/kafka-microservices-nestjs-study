# NestJS REST API Gateway + Kafka
This project was created using the nestjs framework and typescript.
The api-gateway communicates with users via rest api, and the api-gateway 
and other microservices communicate using kafka. all services are looking at only one db.
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
-  Docker
-  Docker-compose

2. In the Terminal or Command Prompt, type the command below.
- Mac/Linux \
`docker network create kafka-microservices-study && cp .env.docker.local .env && docker-compose up -d`
- Window
- `docker network create kafka-microservices-study && copy .env.docker.local .env && docker-compose up -d`
