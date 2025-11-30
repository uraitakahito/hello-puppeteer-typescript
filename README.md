# hello-puppeteer-typescript

A Hacker News scraping tool built with TypeScript and Puppeteer.
It connects to a remote Chromium browser running in a Docker container via Chrome DevTools Protocol (CDP) to automatically collect web page data.

## Setup

### Launching Chromium

Run Chromium in a separate container with a GUI environment.
Refer to [this](https://github.com/uraitakahito/puppeteer-novnc-docker) repository.

### Launching the development Docker container

Please download the required files by following these steps:

```
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/heads/main/Dockerfile
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/heads/main/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

Detailed environment setup instructions are described at the beginning of the `Dockerfile`.

**Important: Only the container start command differs from what’s written in the Dockerfile. Please use the following command.**

```sh
#
# Build the Docker image:
#
PROJECT=$(basename `pwd`) && docker image build -t $PROJECT-image . --build-arg user_id=`id -u` --build-arg group_id=`id -g` --build-arg TZ=Asia/Tokyo
#
# Create a volume to persist the command history executed inside the Docker container.
# It is stored in the volume because the dotfiles configuration redirects the shell history there.
#   https://github.com/uraitakahito/dotfiles/blob/b80664a2735b0442ead639a9d38cdbe040b81ab0/zsh/myzshrc#L298-L305
#
docker volume create $PROJECT-zsh-history
#
# Start the Docker container:
#
docker container run --add-host=puppeteer-1:host-gateway --add-host=puppeteer-2:host-gateway -d --rm --init -v $SSH_AUTH_SOCK:/ssh-agent -e SSH_AUTH_SOCK=/ssh-agent --mount type=bind,src=`pwd`,dst=/app --mount type=volume,source=$PROJECT-zsh-history,target=/zsh-volume --name $PROJECT-container $PROJECT-image
```

## Usage

Run the following commands inside the Docker container:

```sh
npx tsx examples/scrape-news.ts --browser-url http://puppeteer:9222
```

### Watching the browser via noVNC

The noVNC can be accessed at http://localhost:6080/

Use the `--slow-mo` option to slow down operations and observe the browser behavior:

```sh
npx tsx examples/scrape-news.ts --browser-url http://puppeteer:9222 --slow-mo 250
```

## Troubleshooting

You can check if you have enough memory by running this command:

```console
% numfmt --to iec $(echo $(($(getconf _PHYS_PAGES) * $(getconf PAGE_SIZE))))
```
