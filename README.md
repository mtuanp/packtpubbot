# packtpubbot

A bot for claim daily free learning ebooks from packtpub. It also notify you over [Pushbullet](https://www.pushbullet.com/). It's designed as cron job task on a [Raspberry Pi](https://www.raspberrypi.org/).

## Requirements
* [node.js](https://nodejs.org), version 6.0.0+ (only tested on v6)

## How to install
```bash
git clone https://github.com/mtuanp/packtpubbot.git
```

## Configuration

The bot uses a json configuration file for providing login credentials. Add file names config.json in your working directory where you cloned. Example of config.json:

```json
{
  "packtpub": {
    "email": "put your email here",
    "password": "put your password here"
  },
  "pushbullet": {
    "apiKey": "put your pushbullet api key here"
  }
}
```
## How to use

After set up your config.json, you start the bot with following statements:
```bash
npm install # only on first run
npm start
```
## Cron job
Find the absolute location of npm and copy it:
```bash
which node
```
Open cron job table with:
```bash
crontab -e
```
Add following statements for every day cron job at 9 am:
```bash
0 9 * * * <PATH_TO_NODE> <PATH_TO_REPO>/index.js >> /tmp/packtpub.log 2>&1
```
