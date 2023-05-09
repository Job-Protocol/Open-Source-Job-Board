#!/bin/bash

set -a
[ -f .env ] && . .env
set +a

echo "Environment variables loaded from .env file:"
env | grep -iE '^(GOOGLE_API_KEY|BUBBLE_API_PRIVATE_KEY|BUBBLE_API_PRIVATE_KEY|CONFIG_FILE|PASSWORD)'