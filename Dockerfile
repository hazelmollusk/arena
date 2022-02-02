FROM debian:sid
RUN adduser --system --home /home/arena --disabled-password --disabled-login arena
COPY . /home/arena/arena
WORKDIR /home/arena/arena
RUN apt-get -qq update
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -qqqy python3-pip \
    libapache2-mod-wsgi-py3 \
    apache2 \
    npm
RUN pip install -r /home/arena/arena/requirements.txt
COPY ./assets/arena.conf /etc/apache2/sites-available/
RUN a2ensite arena.conf
RUN a2enmod wsgi
RUN npm install --verbose
RUN npm run build
EXPOSE 80
CMD apache2ctl -k start