import express from 'express';
import Admin from '../models/admin';
import helper from '../models/routerHelper';

export default function() {
  var router = express.Router();
  var admin = new Admin(global.apiUrl, global.apiOptions);

  router.get('/', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/apihealth', (req, res) => {
    admin.getApiHealth((result) => {
      res.json({data: {online: result.error ? false : result.data.online}});
    });
  });

  router.get('/upload', helper.isLoggedIn, (req, res) => {
    res.render('upload', {
      services: []
    });
  });

  return router;
}
