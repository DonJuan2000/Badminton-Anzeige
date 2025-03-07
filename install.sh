#!/bin/bash

# Clear docker builder cache
docker builder prune -f

# Stop all running containers
docker stop $(docker ps -aq)

# Delete all Containers
docker rm $(docker ps -aq)

# Delete all images
docker rmi $(docker images -q)

echo "Docker cleanup completed!"

# Run Docker Compose to build new images
docker compose build