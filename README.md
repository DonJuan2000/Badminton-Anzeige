# Digitale Badminton Spielstandsanzeige
TBD


# Setup
Ensure Docker/Compose is installed. [Docker install](https://docs.docker.com/engine/install/)

## Install
1. Clone the repository.
    ```shell
    git clone https://github.com/DonJuan2000/Badminton-Anzeige.git
    ```
2. Move into the cloned directory.
    ```shell
    cd Badminton-Anzeige
    ```
3. Build the docker images (Requires internet access!)

    1. Give the install script the right to be executed.
        ```shell
        chmod +x install.sh
        ```
    2. Run the install script.
        ```shell
        ./install.sh
        ```

4. Ensure the images were built successfully.
    ```shell
    (sudo) docker image ls
    ```
    should list both images: frontend & backend.

## Automatic start
1. Enable auto login on your system
2. Ensure xdg-open is installed on your system.
    ```shell
    sudo apt install xdg-open
    ```
3. Give the run script the right to be executed.
    ```shell
    chmod +x run.sh
    ```
4. Add the script to the Cron-Daemon, to automatically execute on startup.
    ```shell
    crontab -e
    ```
    At the end of the file add the following line:
    ```shell
    @reboot /path/to/run.sh
    ```
5. Setup the automatic hotspot start
    1. Install Wifi-Hotspot-Manager:
        ```shell
        sudo apt update && sudo apt install wifi-hotspot-manager
        ```
    2. Ensure networkd is installed for managing network interfaces:
        ```shell
        sudo apt update && sudo apt install networkd
        ```
    3. Open the hotspot configuration file in a text editor e.g. nano
        ```shell
        nano /etc/networkd/default/forwarder.conf
        ```
    4. Add or modify the following lines:
        ```shell
        # Enable forwarding on eth0 interface
        nmtcpup eth0
        # Set up DHCP and NAT services on eth0
        service { type dhcp; }
        service { type nat; }
        ```
        


    

# Manual start
After successfully building the docker images, the app can be manually startet by running
```shell
(sudo) docker compose up --no-build
```

Hit `CTRL+C` to stop Compose.
