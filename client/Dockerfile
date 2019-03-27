#FROM ubuntu:bionic
FROM node:carbon

# Installation
RUN apt update -y
RUN apt install -y curl postgresql postgresql-contrib postgresql-client apt-transport-https gnupg2 nmap nasm
RUN /etc/init.d/postgresql start && su postgres -c "psql -f /tmp/db.sql" 
RUN curl -fsSL https://apt.metasploit.com/metasploit-framework.gpg.key | apt-key add - 
RUN echo "deb https://apt.metasploit.com/ jessie main" >> /etc/apt/sources.list 
RUN apt update -y
RUN apt install gcc g++ make -y
RUN apt install -y metasploit-framework 
RUN curl -fsSL https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_6.x | bash -
RUN apt install nodejs -y
#  && apt-get remove -y apt-transport-https postgresql-contrib postgresql-client \
RUN rm -rf /var/lib/apt/lists/*

# Configuration and sharing folders
VOLUME /root/.msf4/
VOLUME /tmp/data/

# Locales for tmux
ENV LANG C.UTF-8

CMD "/usr/local/bin/init.sh"
# specify the node base image with your desired version node:<version>
#FROM kalilinux/kali-linux-docker

#RUN echo "deb http://http.kali.org/kali kali-rolling main contrib non-free" > /etc/apt/sources.list 
#RUN echo "deb-src http://http.kali.org/kali kali-rolling main contrib non-free" >> /etc/apt/sources.list 
#ENV DEBIAN_FRONTEND noninteractive



# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)



RUN mkdir /root/shell/node_modules -p
RUN mkdir /root/shell/hostScripts -p
RUN mkdir /root/shell/linux -p
RUN mkdir /root/shell/push -p
RUN mkdir /root/shell/ansible -p
RUN mkdir /root/shell/KRN_SW_ASSET -p
RUN mkdir /root/shell/skeleton -p
RUN mkdir /root/shell/install -p
RUN mkdir /root/shell/openbsd -p
RUN mkdir /root/shell/license -p
RUN mkdir /root/shell/funcoeszz -p
RUN mkdir /root/shell/githooks -p
RUN mkdir /root/shell/github -p
RUN mkdir /root/.ssh -p


#RUN npm install crawler-js 
COPY push/. push/.
COPY linux/. /root/shell/linux/.
COPY linux/. linux/.
COPY hostScripts /root/shell/hostScripts 
COPY ansible /root/shell/ansible
COPY skeleton /root/shell/skeleton
COPY install /root/shell/install
COPY openbsd /root/shell/openbsd
COPY license /root/shell/license
COPY funcoeszz /root/shell/funcoeszz
COPY githooks /root/shell/githooks
COPY github /root/shell/github
COPY . .
COPY . /root/shell/
COPY .bashrc /root/
COPY .alias /root/
COPY .export /root/
COPY secret/id_rsa /root/.ssh/
COPY install/config_ssh /root/.ssh/
RUN mv /root/.ssh/config_ssh /root/.ssh/config
RUN chmod 600 /root/.ssh/id_rsa

RUN ln -s /usr/src/app/node_modules /root/shell/node_modules
#RUN ln -s /usr/local/bin/nodejs /usr/local/bin/node
RUN ln -s /usr/local/bin/node /bin/node


CMD [ "/bin/sh", "/root/shell/install.sh" ]
ENTRYPOINT [ "/root/shell/container_init.sh" ]
#ENTRYPOINT [ "node", "/root/shell/push/cdshelld.js" ]




######################
#CMD [ "npm", "load" ]
#ENTRYPOINT ["/root/workspace/bolsa-systems/blueMoney/dataMining/mining.sh"]
#RUN ping www.google.com.br
#RUN git clone https://github.com/quirinobytes/workspace.git
#RUN ls -la
##ENTRYPOINT ["node","bolsa.js"]
