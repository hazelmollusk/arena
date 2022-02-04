#!/bin/bash
python3 -mvenv env
source ./env/bin/activate
pip3 install -r requirements.txt
./manage.py collectstatic --noinput
hash -r 
npm install
npm run build