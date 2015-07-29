import fs from 'fs';
import async from 'async';
import express from 'express';
import multiparty from 'connect-multiparty';

export default function() {
  var router = express.Router();
  var multipart = multiparty();

  var uploadToDropbox = function(files, token, callback) {
    let Dropbox = require('dropbox');
    let client = new Dropbox.Client({token: token});
    let processed = [];
    async.each(files, (file, cb) => {
      fs.readFile(file.path, (err1, data) => {
        if(err1) {
          console.error(err1);
          cb(err1);
        }
        else {
          client.writeFile(file.originalFilename, data, (err2, stat) => {
            if(err2) {
              console.error(err2);
              cb(err2);
            }
            else {
              processed.push(file);
              cb(null);
            }
          });
        }
      });
    }, (err) => callback(err, processed));
  };

  router.get('/', (req, res) => {
    let apiKey = process.env.API_KEY;
    let redirectUrl = (req.headers['x-forwarded-proto'] || req.protocol) + '://' + req.get('Host') + '/dropbox/auth';
    res.render('upload', {authenticated: false, apiKey: apiKey, redirectUrl: redirectUrl});
  });

  router.get('/dropbox/auth', (req, res) => {
    res.render('upload', {authenticated: true});
  });

  router.post('/file', multipart, (req, res) => {
    let files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    uploadToDropbox(files, req.body.token, (err, result) => {
      if(err) {
        res.send(err);
      }
      else {
        res.send(result.length + ' files saved');
      }
    });
  });

  return router;
}
