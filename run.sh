#!/bin/bash

# Start Compose which start the backend and frontend container
docker compose up

# start a wifi hotspot
wifi-hotspot-manager start

# sleep for 30 seconds, to ensure everthing is up
sleep 30

# open the Webpage
xdg-open localhost:5173/Anzeige