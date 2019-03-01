#===== Stage 1: Build spyce =====#
FROM debian:stable-slim as stage1

# Adding needed libraries
RUN apt-get update &&\
    apt-get install -y \
    curl \
    libboost-python-dev \
    libboost-filesystem-dev \
    build-essential \
    python3-dev

RUN curl -L https://github.com/Kitware/CMake/releases/download/v3.13.4/cmake-3.13.4-Linux-x86_64.sh -o curl.sh &&\
    chmod +x curl.sh &&\
    ./curl.sh --skip-license --prefix=/usr

# create stage directory
WORKDIR /stage1
#copy spyce src files
COPY ./spyce /stage1/spyce
COPY ./CMakeLists.txt /stage1/

#build
RUN mkdir build
RUN cmake . && make

#===== Stage 2: NPM and parceling =====#
FROM node:latest as stage2

# create stage directory
WORKDIR /stage2
#copy web folder contents
COPY ./web /stage2/web
COPY ./package.json /stage2/

#build
RUN npm install
RUN npm run build

#===== Stage 3: Python + Final =====#
FROM debian:stable-slim as flaskapp

# Adding globally needed libraries
RUN apt-get update
RUN apt-get install -y libboost-python-dev
RUN apt-get install -y libboost-filesystem-dev
RUN apt-get install -y python3-pip
RUN pip3 install flask

#create app directory
WORKDIR /app

# Copy relevant files
COPY --from=stage1 /spyce/spyce.so        /app/spyce.so
COPY --from=stage2 /stage2/dist           /app/dist
COPY               FlaskServer.py         /app

EXPOSE 5000

# Start Flask Server
CMD [ "python3", "FlaskServer.py" ]