FROM bitnami/ghost:latest

USER root

RUN install_packages jq
RUN mkdir -p /.npm && chmod -R g+rwX,o+rw /.npm

COPY azure-storage-config.sh /
RUN chmod +x /azure-storage-config.sh \
    && cp /app-entrypoint.sh /tmp/app-entrypoint.sh \
    && sed '/info "Starting ghost... "/ a . /azure-storage-config.sh' /tmp/app-entrypoint.sh > /app-entrypoint.sh

RUN chmod -R 777 /bitnami/ghost/

USER 1001

RUN mkdir -p /bitnami/ghost/content/adapters/storage/ghost-v3-azure-adapter
RUN cd /bitnami/ghost/content/adapters/storage/ghost-v3-azure-adapter/ && npm install ghost-v3-azure-adapter && mv node_modules/ghost-v3-azure-adapter/* .


#ENTRYPOINT ["tail", "-f", "/dev/null"]



