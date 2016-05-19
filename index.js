var request = require('request');

request('https://www.packtpub.com/packt/offers/free-learning', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})
