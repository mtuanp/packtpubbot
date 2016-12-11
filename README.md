# packtpubbot

A bot for claim daily free learning ebooks from packtpub. It also notify you over [Pushbullet](https://www.pushbullet.com/) or [Telegram](https://telegram.org/). It can download the ebook after claim if you want. It's designed as cron job task on a [Raspberry Pi](https://www.raspberrypi.org/).

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
  "informBy": "",
  "downloadAfterClaim": true,
  "outputDirectory": null,
  "packtpub": {
    "email": "put your email here",
    "password": "put your password here"
  },
  "pushbullet": {
    "apiKey": "put your pushbullet api key here"
  },
    "telegram": {
    "botToken" : "put your telegram bot token here",
    "receiverId" : "put destination user id here"
  }
}
```
### informBy
Configure the desired notification platform, if leaves it blank will be output to console.
**Aceptable values:**
- telegram
- pushbullet

### downloadAfterClaim
Configure to download the ebook after claim.
**Default value:** *true*
**Aceptable values:**
- true
- false

### outputDirectory
Configure the desired directory to output the ebook.
*The ebook will be download at the same directory as the index.js if leaves this null*
**Default value:** *null*

### outputFormat
Configure the desired format to download the ebook.
**Default value:** *pdf*
**Aceptable values:**
- pdf
- epub
- mobi

### packtpub
#### email
email to login into https://www.packtpub.com
#### password
password to login into https://www.packtpub.com

### pushbullet
#### apiKey
apiKey provided by https://www.pushbullet.com

### telegram
#### botToken
the bot token provided by botFather
#### receiverId
the telegram user id to receive the notification

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
0 9 * * * <PATH_TO_NODE>/node <PATH_TO_REPO>/index.js >> /var/log/packtpub.log 2>&1
```
