#!/bin/bash
docker run --name geth -d -p 8110:8110  --entrypoint "usr/bin/rungeth" ethereum/client-go:test
