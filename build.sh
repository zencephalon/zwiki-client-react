#!/bin/bash

npm run-script build
sudo cp index.html /usr/share/nginx/html/zwiki-app/
sudo cp dist/bundle.js /usr/share/nginx/html/zwiki-app/static
sudo cp spidertree.png /usr/share/nginx/html/zwiki-app/static
sudo cp celebrate.wav /usr/share/nginx/html/zwiki-app/static
sudo systemctl restart nginx
