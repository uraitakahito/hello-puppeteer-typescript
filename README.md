## Setup

Please download the required files by following these steps:

```sh
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-puppeteer/refs/heads/main/Dockerfile
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/heads/main/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

Detailed environment setup instructions are described at the beginning of the [Dockerfile](./Dockerfile).

## Running in headless mode

Run the following commands inside the Docker container:

```sh
npx tsx examples/scrape-news.ts
```

## Running in headful mode

### Using noVNC

The noVNC can be accessed at http://localhost:6080/

If you are running from the noVNC terminal, you can simply run:

```sh
npx tsx examples/scrape-news.ts --no-headless --slow-mo 250
```

If you are running from a separate terminal (e.g., VS Code integrated terminal), set the `DISPLAY` environment variable to use the VNC server:

```sh
DISPLAY=:1 npx tsx examples/scrape-news.ts --no-headless --slow-mo 250
```

You can watch the browser in action via noVNC.

### Using xvfb-run

Alternatively, use `xvfb-run` to run headful mode without a display (useful for CI/CD):

```sh
xvfb-run --auto-servernum npx tsx examples/scrape-news.ts --no-headless --slow-mo 250
```

## Troubleshooting

You can check if you have enough memory by running this command:

```console
% numfmt --to iec $(echo $(($(getconf _PHYS_PAGES) * $(getconf PAGE_SIZE))))
```
