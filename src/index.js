'use strict';

const BaseAdapter = require('ghost-storage-base');
const azure = require('azure-storage');
const blobService = azure.createBlobService();

const AZURE_STORAGE_CONTAINER = process.env.AZURE_STORAGE_CONTAINER || "ghost";


class azureAdapter extends BaseAdapter {
    constructor() {
        super();
        blobService.createContainerIfNotExists(AZURE_STORAGE_CONTAINER, {
            publicAccessLevel: 'blob'
        }, function(error, result, response) {
            if (!error) {
                // if result = true, container was created.
                // if result = false, container already existed.
            }
        });
    }

    exists(fileName, targetDir) {

    }

    save(image) {
        return new Promise(function (resolve, reject) {
            blobService.createBlockBlobFromLocalFile(AZURE_STORAGE_CONTAINER, image.filename, image.path, function (error, result, response) {
                    if (error) {
                        reject(error.message);
                    }else{
                        const url = blobService.getUrl(AZURE_STORAGE_CONTAINER,image.filename);
                        resolve(url);
                    }
                })
        });
    }

    serve() {
        return function customServe(req, res, next) {
            next();
        }
    }

    delete(fileName) {
        console.log(fileName);

    }

    read(options = {}) {

    }
}

module.exports = azureAdapter;