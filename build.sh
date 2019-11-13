#!/bin/bash

npm run-script build
sudo cp index.html dist/bundle.js /usr/share/nginx/html/zwiki-app/