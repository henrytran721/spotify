var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
let request = require('request')
const redirect_uri = 'http://localhost:8080/callback/';

router.post('/', (req, res, next) => {
    var scopes = 'user-read-private user-read-email user-library-read user-top-read user-modify-playback-state user-read-currently-playing user-read-playback-state streaming';
    let url = 'https://accounts.spotify.com/authorize' + '?response_type=code' + '&client_id=' + process.env.CLIENT_ID + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirect_uri);
    if(global.data) {
      res.send({redirect: url, refresh_token: global.data.refresh_token});
    } else {
      res.send({redirect: url})
    }
})

router.post('/me', (req, res, next) => {
    //fetch('https://api.spotify.com/v1/me');
})

router.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      // var currTime = new Date();
      // var time = body.expires_in;
      // var expired = currTime.getTime() + time;
      // if(currTime > expired) {

      // }
      global.data = body;
      console.log(data);
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
      res.redirect(uri + '?access_token=' + access_token);
    })
  })

  router.get

module.exports = router;