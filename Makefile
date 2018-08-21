MAKEFLAGS += --silent
VERSION ?= $(shell git log --pretty=format:'%h' -n 1)
AUTHOR ?= $(shell git log --pretty=format:'%an' -n 1)

APP_NAME ?= mjml-api

help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sed -e 's|^| |'

## $(APP_NAME): Build app with dependencies download
$(APP_NAME):
	npm ci
	npm run build
	rm -rf node_modules/
	npm i --production

## name: Output name of app
name:
	@echo -n $(APP_NAME)

## version: Output sha1 of last commit
version:
	@echo -n $(VERSION)

## author: Output author's name of last commit
author:
	@python -c 'import sys; import urllib; sys.stdout.write(urllib.quote_plus(sys.argv[1]))' "$(AUTHOR)"

.PHONY: help $(APP_NAME) name version author
