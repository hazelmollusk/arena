FROM public.ecr.aws/debian/amd64:unstable-20220328-slim
RUN adduser --system --home /home/arena --disabled-password --disabled-login arena
RUN addgroup arena
RUN adduser arena arena
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -qqqy \
    libapache2-mod-wsgi-py3 \
    apache2 \
    curl \
    python3 \
    python3-distutils \
    python3-venv
RUN wget https://s3.region.amazonaws.com/amazon-ssm-region/latest/debian_amd64/amazon-ssm-agent.deb
RUN dpkg -i amazon-ssm-agent.deb
RUN systemctl enable amazon-ssm-agent
# install npm from nodesource, not debian
# debian depends on X :P
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -qqqy \
    nodejs=17.9.0-deb-1nodesource1
RUN curl https://bootstrap.pypa.io/get-pip.py | python3
COPY . /home/arena/arena
WORKDIR /home/arena/arena
RUN ./build.sh
COPY ./assets/arena.conf /etc/apache2/sites-available/
RUN a2ensite arena.conf
RUN a2enmod wsgi
EXPOSE 80
ENTRYPOINT \
    APACHE_RUN_DIR=/etc/apache2 \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=arena \
    APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid \
    /usr/sbin/apache2 -DFOREGROUND