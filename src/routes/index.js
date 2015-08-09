import express from 'express';
import Admin from '../models/admin';

export default function() {
  var router = express.Router();
  var admin = new Admin(global.apiUrl, global.apiOptions);

  router.get('/', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/apihealth', (req, res) => {
    admin.getApiHealth((err, result) => {
      res.json({data: {online: err || result.error ? false : result.data.online}});
    });
  });

  return router;
}
