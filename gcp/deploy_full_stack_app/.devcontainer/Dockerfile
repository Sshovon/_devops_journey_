FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates gnupg curl sudo make ssh

RUN echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - \
    && apt-get update \
    && apt-get install -y google-cloud-sdk

WORKDIR /gcp-automation
COPY . /gcp-automation