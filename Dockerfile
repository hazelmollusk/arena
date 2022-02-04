FROM debian:sid
RUN adduser --system --home /home/arena --disabled-password --disabled-login arena
RUN apt-get -qq update
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -qqqy python3-pip \
    libapache2-mod-wsgi-py3 \
    apache2 \
    npm \
    python3-venv
COPY . /home/arena/arena
RUN ./build.sh
WORKDIR /home/arena/arena
RUN . /home/arena/arena/env/bin/activate && \
    pip install -r /home/arena/arena/requirements.txt
RUN . /home/arena/arena/env/bin/activate && \
    pip install -r /home/arena/arena/requirements.txt

COPY ./assets/arena.conf /etc/apache2/sites-available/
RUN a2ensite arena.conf
RUN a2enmod wsgi
RUN npm install -g npm
RUN pwd
RUN npm install
# RUN npm run build
EXPOSE 80
ENTRYPOINT \
    APACHE_RUN_DIR=/etc/apache2 \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data \
    APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid \
    /usr/sbin/apache2 -DFOREGROUND