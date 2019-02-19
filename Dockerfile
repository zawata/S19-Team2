FROM alpine:latest

# Adding globally needed libraries
RUN apk add boost-python
RUN apk add cmake
RUN apk add --no-cache python3-dev
RUN python3 -m ensurepip
RUN pip3 install flask
RUN apk add --update nodejs nodejs-npm

# Create working directory
WORKDIR /app

# Copy local directory into /app of image
COPY . /app

###### Build Spyce Toolkit ######
RUN mkdir build
# RUN cmake --build ./build --target all

##### Bundle Web Files ######
# Get project specific dependencies
RUN npm install

RUN npm run build

##### Start Flask Server #####

# Expose default flask server port
EXPOSE 5000
