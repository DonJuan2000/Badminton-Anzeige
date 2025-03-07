# Digitale Badminton Spielstandsanzeige
TBD


# Setup
Ensure Docker/Compose is installed. [Docker install](https://docs.docker.com/engine/install/)

## Install

Cloning and installing the App requires internet access!
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


# Manual start
After successfully building the docker images, the app can be manually startet by running
```shell
(sudo) docker compose up --no-build
```

Hit `CTRL+C` to stop Compose.
