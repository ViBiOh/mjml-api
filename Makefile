SHELL = /bin/bash

ifneq ("$(wildcard .env)","")
	include .env
	export
endif

APP_NAME = mjml

.DEFAULT_GOAL := app

## help: Display list of commands
.PHONY: help
help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sed -e 's|^| |'

## app: Build app with dependencies download
.PHONY: app
app:
	npm ci
	npm run build
	rm -rf node_modules/
	npm i --production

## name: Output name of app
.PHONY: name
name:
	@printf "%s" "$(APP_NAME)"

## version: Output sha1 of last commit
.PHONY: version
version:
	@printf "%s" "$(shell git rev-parse --short HEAD)"

## init: Download dependencies
.PHONY: init
init:
	@curl -q -sSL --max-time 10 "https://raw.githubusercontent.com/ViBiOh/scripts/master/bootstrap" | bash -s "git_hooks"
