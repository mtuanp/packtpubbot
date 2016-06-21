var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var PushBullet = require('pushbullet');
var cron = require('node-cron');

var packtpubBaseUrl = 'https://www.packtpub.com'
var packtpubFreeEbookUrl = packtpubBaseUrl + '/packt/offers/free-learning';
var pusher = new PushBullet(config.pushbullet.apiKey);

function claimFreeEbook() {
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
    request = request.defaults({
        jar: true // enable cookie support, default is false
    });

    request(packtpubFreeEbookUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);
            userLoginForm = $('#packt-user-login-form');
            formData.form_build_id = userLoginForm.find('[name="form_build_id"]').val();
            formData.form_id = userLoginForm.find('[name="form_id"]').val();
            freeEbookUrl = packtpubBaseUrl + $('a.twelve-days-claim').attr("href");
            freeEbookTitle = $('.dotd-title').find('h2').text().trim();
            console.log("Claim Title: " + freeEbookTitle);
            request.post({
                url: packtpubFreeEbookUrl,
                formData: formData
            }, function(error, response, body) {
                request(freeEbookUrl, function(error, response, body) {
                    pusher.note('', 'packtpub claim bot', "Sir, I've just claimed " + freeEbookTitle + " for you.", function(error, response) {});
                    console.log("DONE...");
                });
            });
        }
    })
}

cron.schedule(config.cron, function(){
  console.log("Start from scheduler");
  claimFreeEbook();
});
