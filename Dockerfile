#===== Stage 1: Build spyce =====#
FROM alpine:latest as stage1

# Adding needed libraries
RUN apk add boost-dev
RUN apk add g++ make cmake
RUN apk add python3-dev

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
FROM alpine:latest as flaskapp

# Adding globally needed libraries
RUN apk add --no-cache libstdc++
RUN apk add boost-system boost-filesystem boost-python3
RUN apk add python3
RUN python3 -m ensurepip
RUN pip3 install flask

#create app directory
WORKDIR /app

# Copy relevant files
COPY --from=stage1 /spyce/spyce.so        /app/
COPY --from=stage2 /stage2/dist           /app/dist
COPY               FlaskServer.py         /app

# Expose flask server port
EXPOSE 5000

# Start Flask Server
CMD [ "python3", "FlaskServer.py" ]