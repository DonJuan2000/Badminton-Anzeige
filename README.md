# Digitale Badminton Spielstandsanzeige

<p align="center">
  <strong><span style="font-size: 20px;">Anzeige</span></strong>  
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/69a8f14c-24cb-429f-b81b-6e708a18cfc9" alt="Image" width="800">
</p>

<p align="center">
  <strong><span style="font-size: 20px;">Controller</span></strong>  
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/0515b818-1b01-4d4e-9154-363cf6ae51eb" alt="Image" width="400">
</p>


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

3. Edit the Frontend/.env file, to contain the correct IP-Address.

    1. The .env file should contain the servers own IP-Address, when starting a hotspot.

4. Make docker run without sudo rights.
    1. Add the `docker` group if it doesn't already exist:
    ```shell
    sudo groupadd docker
    ```
    2. Add the connected user "$USER" to the `docker` group.
    ```shell
    sudo gpasswd -a $USER docker
    ```
    3. reboot

5. Build the docker images (Requires internet access!)

    1. Give the install script the right to be executed.
        ```shell
        chmod +x install.sh
        ```
    2. Run the install script.
        ```shell
        ./install.sh
        ```

6. Ensure the images were built successfully.
    ```shell
    (sudo) docker image ls
    ```
    should list both images: frontend & backend.

## Automatic start
1. Enable auto login on your system

2. Modify the `run.sh` script.

    1. Edit line 4 with the correct path to the cloned directory.
    2. Edit line 10 with the desired parameters. 

        1. device: wifi interface name e.g. wlp2s0 (ifconfig)
        2. ssid: Desired Hotspot name
        3. password: Desired hotspot password

    3. Edit line 16 to open the desired Webbrowser

3. Give the run script the right to be executed.
    ```shell
    chmod +x run.sh
    ```

4. Add a `.desktop` file which executes the script on startup.

    1. Create a `.desktop` file:
    ```shell
    nano ~/.config/autostart/<name>.desktop
    ```
    2. Add the following lines:
    ```shell
    [Desktop Entry]
    Type=Application
    Name=Open Website
    Exec=bash -c "path/to/run.sh"
    Terminal=false
    ```


    
        


    

# Manual start
After successfully building the docker images, the app can be manually startet by running
```shell
(sudo) docker compose up
```

Hit `CTRL+C` to stop Compose.
