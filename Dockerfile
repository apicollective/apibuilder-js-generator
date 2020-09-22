FROM node:12 AS builder

# Define working directory and copy source
WORKDIR /opt/apibuilder
COPY . .
# Install dependencies and build application
RUN apt-get update && apt-get install -y rsync
RUN npm install -q
RUN npm run build

##########################

FROM node:12
ENV NODE_ENV=production
WORKDIR /opt/apibuilder

# Install dependencies for production only
COPY ./package* ./
RUN npm install -q
RUN npm install -q -g forever

# Copy built source from the upper builder stage
COPY --from=builder /opt/apibuilder/dist ./dist
COPY ./run.sh .

RUN mkdir ./log

ENTRYPOINT ./run.sh
