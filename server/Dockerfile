FROM mhart/alpine-node:11

# App Directory
WORKDIR /app
COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

#ENVIROMENT VARIABLES
ENV NODE_ENV=production

#COMMANDS
#RUN npm install 

# Configuration and sharing folders
#VOLUME /root/.msf4/
#VOLUME /tmp/data/

#PORTS
EXPOSE 8080

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)


#ENTRYPOINT [ "/root/shell/container_init.sh" ]
ENTRYPOINT [ "node","server.js" ]

######################
#CMD [ "npm", "load" ]
#RUN ping www.google.com.br
#RUN git clone https://github.com/quirinobytes/workspace.git
#RUN ls -la
