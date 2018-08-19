APP_NAME := mjml-api
VERSION ?= $(shell git log --pretty=format:'%h' -n 1)
AUTHOR ?= $(shell git log --pretty=format:'%an' -n 1)

docker:
	docker build -t vibioh/$(APP_NAME):$(VERSION) .

$(APP_NAME):
	npm ci
	npm run build
	rm -rf node_modules/
	npm i --production

name:
	@echo -n $(APP_NAME)

version:
	@echo -n $(VERSION)

author:
	@python -c 'import sys; import urllib; sys.stdout.write(urllib.quote_plus(sys.argv[1]))' "$(AUTHOR)"

.PHONY: docker $(APP_NAME) name version author
