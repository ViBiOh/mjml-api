VERSION ?= $(shell git log --pretty=format:'%h' -n 1)
AUTHOR ?= $(shell git log --pretty=format:'%an' -n 1)
APP_NAME := mjml-api

default: js docker

docker: docker-build docker-push

js:
	npm run build
	rm -rf node_modules/
	npm i --production

version:
	@echo -n $(VERSION)

author:
	@python -c 'import sys; import urllib; sys.stdout.write(urllib.quote_plus(sys.argv[1]))' "$(AUTHOR)"

docker-login:
	echo $(DOCKER_PASS) | docker login -u $(DOCKER_USER) --password-stdin

docker-build:
	docker build -t $(DOCKER_USER)/$(APP_NAME):$(VERSION) .

docker-push: docker-login
	docker push $(DOCKER_USER)/$(APP_NAME):$(VERSION)

docker-pull:
	docker pull $(DOCKER_USER)/$(APP_NAME):$(VERSION)

docker-promote: docker-pull
	docker tag $(DOCKER_USER)/$(APP_NAME):$(VERSION) $(DOCKER_USER)/$(APP_NAME):latest

docker-delete:
	curl -X DELETE -u "$(DOCKER_USER):$(DOCKER_CLOUD_TOKEN)" "https://cloud.docker.com/v2/repositories/$(DOCKER_USER)/$(APP_NAME)/tags/$(VERSION)/"

.PHONY: docker js version author docker-login docker-build docker-push docker-pull docker-promote docker-delete
