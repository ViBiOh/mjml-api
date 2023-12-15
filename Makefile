SHELL = /usr/bin/env bash -o nounset -o pipefail -o errexit -c

ifneq ("$(wildcard .env)","")
	include .env
	export
endif

APP_NAME = mjml

.DEFAULT_GOAL := app

## help: Display list of commands
.PHONY: help
help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sort

## app: Build whole app
.PHONY: app
app: init format style build

## name: Output name of app
.PHONY: name
name:
	@printf "$(APP_NAME)"

## version: Output last commit sha in short version
.PHONY: version
version:
	@printf "$(shell git rev-parse --short HEAD)"

## version-full: Output last commit sha
.PHONY: version-full
version-full:
	@printf "$(shell git rev-parse HEAD)"

## version-date: Output last commit date
.PHONY: version-date
version-date:
	@printf "$(shell git log -n 1 "--date=format:%Y%m%d%H%M" "--pretty=format:%cd")"

## init: Bootstrap your application. e.g. fetch some data files, make some API calls, request user input etc...
.PHONY: init
init:
	@curl --disable --silent --show-error --location --max-time 30 "https://raw.githubusercontent.com/ViBiOh/scripts/main/bootstrap" | bash -s -- "-c" "git_hooks"
	npm ci

## format: Format code. e.g Prettier (js), format (golang)
.PHONY: format
format:
	npm run format

## style: Check lint, code styling rules. e.g. pylint, phpcs, eslint, style (java) etc ...
.PHONY: style
style:
	npm run style

## build: Build the application.
.PHONY: build
build:
	npm run build
	rm -rf node_modules/
	npm i --production

## run: Locally run the application, e.g. node index.js, python -m myapp, go run myapp etc ...
.PHONY: run
run:
	npm start
