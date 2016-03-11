FROM    centos:centos7

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN     yum install -y epel-release
# Install Node.js and npm
RUN     yum install -y nodejs npm

# Create app directory
RUN mkdir -p /service/www
WORKDIR /service/www

# Install app dependencies
COPY package.json /service/www/package.json
RUN cd /service/www; npm install --production

# Bundle app source
COPY . /service/www

RUN ls -lha /service/www
RUN cat /service/www/config/config.js
EXPOSE  3000
CMD ["node", "bin/www"]
