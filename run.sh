#!/bin/bash

# Move to the correct directory
cd path/to/Badminton-Anzeige || Exit

# Start Compose which start the backend and frontend container
docker compose up

# start a wifi hotspot
nmcli d wifi hotspot ifname <device> ssid <Hotspot name> password <password>

# sleep for 5 seconds, to ensure everthing is up
sleep 5

# open the Webpage
google-chrome-stable --start-fullscreen http://localhost:5173/Anzeige