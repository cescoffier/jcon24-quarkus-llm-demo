# Quarkus LLM demo


This repository contains a set of demos demonstrating some Quarkus Langchain4J features:

- Declarative AI services
- Tools and Agents
- Observability
- Building chatbots
- Implementing a RAG (Retrieval Augmented Generation) pattern

## Prerequisites

- Java 21 or later
- Apache Maven 3.9.6 or later
- Podman or Docker (Podman recommended)
- A working docker-compose installation (working with podman recommended)

## Running the demos

The repo follows an incremental structure. Each demo builds on the previous one. To run a demo, navigate to its directory and run `mvn quarkus:dev`. 
The UI is available at `http://localhost:8080`.

### Demo 1: Declarative AI services

This demo (contained in the `0-summarizer` directory) demonstrates how to create a declarative AI service using Quarkus and Langchain4J. 
The service provides a REST API to summarize insurance claims (you can find claim examples in the `claim-samples` directory).
It also extracts the policy number and analyzes the sentiment of the claim.

### Demo 2: Tools and Agents

This demo (located in the `1-agent` directory) extends the previous one but use a _tool_ to detect if the new document is related to an existing claim. 
If so, the application updates the existing claim.

### Demo 3: Observability

This demo (locate in the `2-observability` directory) extends the previous one by adding observability features to the application.

You can run the observability stack using:
```shell
> podman compose -f infrastructure/observability.yaml up
```

Then use the application. 
The Jaeger UI is available at `http://localhost:16686`. 
To demonstrate Prometheus, use the dev-ui (available at `http://localhost:8080/q/dev`).

### Demo 4: Building chatbots

This demo (located in the `3-chatbot` directory) extends the previous one by adding a chatbot to the application.
This chatbot is very simple and use a tool to find a given claim.

### Demo 5: Implementing a RAG (Retrieval Augmented Generation) pattern

This demo (located in the `4-rag` directory) extends the previous one by adding a RAG pattern to the application.


## License

This project is licensed under the Apache License, Version 2.0.