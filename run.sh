#!/bin/bash
DEBUG="apibuilder:*" forever -o ./log/console.log -e ./log/console.error.log dist/server/index.js
