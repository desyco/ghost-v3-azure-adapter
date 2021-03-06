# Ghost-v3-azure-adapter
This npm package is created to store images on azure storage for ghost cms version 3.

## How to use it.
This adapter should be placed under the folder: 
`{ghost_dir}/content/adapters/storage/ghost-v3-azure-adapter`.

To configure ghost to use this adapter, we need to adapt the  config.{env}.json file. 
Beneath is a step by step instruction list to install it locally or in a docker container.

### Environment variables.
To configure azure credentials and the azure bucket to use, the package needs two env variables set.
```
AZURE_STORAGE_CONTAINER={Name of the storage container}
AZURE_STORAGE_CONNECTION_STRING={Azure connection string for authentication to your contaienr}
```

### Local installation
Add the following configuration to the config.{env}.json
```
  "storage": {
    "active": "ghost-v3-azure-adapter",
    "ghost-v3-azure-adapter": {
    }
  }
```

Next we need to provide the adapter code to ghost in the following path. 
`{ghost_dir}/content/adapters/storage/ghost-v3-azure-adapter`. Create the folder.

```
mkdir -p content/adapters/storage/ghost-v3-azure-adapter
cd content/adapters/storage/ghost-v3-azure-adapter
```
Install the package in the folder.
```
npm install ghost-v3-azure-adapter
```
Move the downloaded adapter from node_modules to `ghost-v3-azure-adapter` folder.
```
mv node_modules/ghost-v3-azure-adapter/* .
```
Start ghost
```
ghost start
```

### Docker installation
There are 2 steps to configure the bitnami ghost image. 

*NOTE* As base image this guide starts from the bitnami docker image and probably need some adaptations for the official ghost image.

First we need to update our config.json file.
```
COPY azure-storage-config.sh /
RUN chmod +x /azure-storage-config.sh \
    && cp /app-entrypoint.sh /tmp/app-entrypoint.sh \
    && sed '/info "Starting ghost... "/ a . /azure-storage-config.sh' /tmp/app-entrypoint.sh > /app-entrypoint.sh

```
The `azure-storage-config.sh` script is used to import the correct values in config.production.json and will look like:
```
#!/bin/bash -e
cp /bitnami/ghost/config.production.json /tmp/config.tmp.json

jq -r '. +   {
      "storage": {
      "active": "ghost-v3-azure-adapter",
      "ghost-v3-azure-adapter": {
        "container": "{container}"
       }}}' \
    /tmp/config.tmp.json > /bitnami/ghost/config.production.json
```

As you can see we need jq for this script.
```
RUN install_packages jq
```
When we configured the image to use azure storage we need to provide this azure adapter.
```
RUN mkdir -p /bitnami/ghost/content/adapters/storage/ghost-v3-azure-adapter
RUN cd /bitnami/ghost/content/adapters/storage/ghost-v3-azure-adapter/ && npm install ghost-v3-azure-adapter && mv node_modules/ghost-v3-azure-adapter/* .
```

Have a look at the docker file in this project.