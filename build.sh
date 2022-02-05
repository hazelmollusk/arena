#!/bin/bash
python3 -mvenv env
source ./env/bin/activate
pip3 install -r requirements.txt
npm install
npm install @babel/core
npm run build
./manage.py collectstatic --noinput