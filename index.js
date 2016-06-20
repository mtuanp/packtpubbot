var config = require('./config.json');
var request = require('request').defaults({
    jar: true // enable cookie support, default is false
});
var cheerio = require('cheerio');

var packtpubBaseUrl = 'https://www.packtpub.com'
var packtpubFreeEbookUrl = packtpubBaseUrl + '/packt/offers/free-learning';
var userLoginForm;
var freeEbookUrl;
var formData = {
	      email: config.packtpub.email,
	      password: config.packtpub.password,
	      op: 'Login',
	      form_build_id: '',
	      form_id: ''
	    };

request(packtpubFreeEbookUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    userLoginForm = $('#packt-user-login-form');
    formData.form_build_id = userLoginForm.find('[name="form_build_id"]').val();
    formData.form_id = userLoginForm.find('[name="form_id"]').val();
    freeEbookUrl = packtpubBaseUrl + $('a.twelve-days-claim').attr("href");
    console.log(freeEbookUrl);
    request.post({url: packtpubFreeEbookUrl, formData: formData}, function (error, response, body) {
      request(freeEbookUrl, function (error, response, body) {
    	  console.log("DONE...");
      });
    });
  }
})
