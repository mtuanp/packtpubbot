'use strict';

const config = require('./config.json');
const request = require('request').defaults({
    jar: true // enable cookie support, default is false
});
const path = require('path');
const fs = require("fs");
const cheerio = require('cheerio');
const PushBullet = require('pushbullet');

var packtpubBaseUrl = 'https://www.packtpub.com';
var packtpubDownloadEbookUrl = packtpubBaseUrl + "/ebook_download/{ebook_id}/{downloadFormat}";
var packtpubFreeEbookUrl = packtpubBaseUrl + '/packt/offers/free-learning';
var pusher = new PushBullet(config.pushbullet.apiKey);
var userLoginForm;
var freeEbookUrl;
var ebookId;
var baseDownloadUrl;
var downloadUrl;
var freeEbookTitle;
var formData = {
    email: config.packtpub.email,
    password: config.packtpub.password,
    op: 'Login',
    form_build_id: '',
    form_id: ''
};
var downloadFormates = config.dowloadFormat.split(";");
console.log("----- Start claim free ebook from packtpub -----");
request(packtpubFreeEbookUrl, function(error, response, body) {
    if (error) {
        console.error('first get request', error);
    }
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        userLoginForm = $('#packt-user-login-form');
        formData.form_build_id = userLoginForm.find('[name="form_build_id"]').val();
        formData.form_id = userLoginForm.find('[name="form_id"]').val();
        var relativeLink = $('a.twelve-days-claim').attr("href");
        freeEbookUrl = packtpubBaseUrl + relativeLink;
        ebookId = relativeLink.replace(/\/freelearning-claim\/([0-9]*)\/[0-9]*/g, "$1")
        baseDownloadUrl = packtpubDownloadEbookUrl.replace("{ebook_id}", ebookId);
        console.log("Free Ebook Url: " + freeEbookUrl);
        freeEbookTitle = $('.dotd-title').find('h2').text().trim();
        console.log("Claim Title: " + freeEbookTitle);
        request.post({
            url: packtpubFreeEbookUrl,
            formData: formData
        }, function(error, response, body) {
            if (error) {
                console.error('auth failure', error);
            }
            if (!error && !body) {
                request(freeEbookUrl, function(error, response, body) {
                    if (error) {
                        console.error('claim error', error);
                        inform('packtpub claim bot error', "Got a error please check this!", function(error, response) {
                            if (error) {
                                console.error('pushbullet failure', error);
                            }
                        });
                    }
                    if (!error && response.statusCode == 200) {
                        if (config.downloadAfterClaim) {
                            downloadFormates.forEach(function(dowloadFormat) {
                                downloadUrl = baseDownloadUrl.replace("{downloadFormat}", dowloadFormat);
                                request({
                                    followAllRedirects: true,
                                    url: downloadUrl
                                }).pipe(
                                    fs.createWriteStream(
                                        (config.outputDirectory != null ? (config.outputDirectory + path.sep) : '') + freeEbookTitle + "." + dowloadFormat
                                    ));
                            });
                        }
                        inform('packtpub claim bot', "Sir, I've just claimed " + freeEbookTitle + " for you.", function(error, response) {
                            if (error) {
                                console.error('pushbullet failure', error);
                            }
                        });
                        console.log("----- Done... -----");
                    }
                });
            } else {
                console.error('auth failure', error);
            }
        });
    }
});

function inform(name, content, handler) {
    if (config.informBy == "telegram") {
        informTelegram(content, config.telegram.receiverId, config.telegram.botToken);
    } else if (config.informBy == "pushbullet") {
        informPusher(name, content, handler);
    } else {
        console.log(content);
    }
}

function informPusher(name, content, handler) {
    pusher.note('', name, content, handler);
}

function informTelegram(content, receiver, token) {
    var TelegramBot = require('node-telegram-bot-api');
    // just send the message
    var bot = new TelegramBot(token);
    bot.sendMessage(receiver, content);
}
