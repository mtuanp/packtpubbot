'use strict';

var config = require('./config.json');
var request = require('request').defaults({
    jar: true // enable cookie support, default is false
});
var cheerio = require('cheerio');
var PushBullet = require('pushbullet');

var packtpubBaseUrl = 'https://www.packtpub.com'
var packtpubFreeEbookUrl = packtpubBaseUrl + '/packt/offers/free-learning';
var pusher = new PushBullet(config.pushbullet.apiKey);
var userLoginForm;
var freeEbookUrl;
var freeEbookTitle;
var formData = {
    email: config.packtpub.email,
    password: config.packtpub.password,
    op: 'Login',
    form_build_id: '',
    form_id: ''
};
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
        freeEbookUrl = packtpubBaseUrl + $('a.twelve-days-claim').attr("href");
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
                        pusher.note('', 'packtpub claim bot error', "Got a error please check this!", function(error, response) {
                            if (error) {
                                console.error('pushbullet failure', error);
                            }
                        });
                    }
                    if (!error && response.statusCode == 200) {
                        pusher.note('', 'packtpub claim bot', "Sir, I've just claimed " + freeEbookTitle + " for you.", function(error, response) {
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
})
