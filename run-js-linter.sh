#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2026 CERN.
#
# React-Invenio-Forms is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

# Usage:
#   ./run-js-linter.sh [args]

# Arguments
# -i|--install: installs dependencies
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ESLINT=./node_modules/.bin/eslint

for arg in $@; do
	case ${arg} in
	-i|--install)
        npm install;;
	-f|--fix)
		printf "${GREEN}Run eslint${NC}\n";
    		$ESLINT -c .eslintrc.yml src/**/*.js --fix;;
		*)
			printf "Argument ${RED}$arg${NC} not supported\n"
			exit;;
	esac
done

printf "${GREEN}Run eslint${NC}\n"
$ESLINT -c .eslintrc.yml src/**/*.js
