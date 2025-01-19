# NPM ?= pnpm
NPM ?= yarn

.PHONY: build

build: src/*
	$(NPM) run prepare

install:
	$(NPM) install
