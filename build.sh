#!/bin/bash
pushd `dirname $0`
rm -rf env node_modules
python3 -mvenv env
source ./env/bin/activate
pip3 install -r requirements.txt
npm install
npm run build
./manage.py collectstatic --noinput
popdw