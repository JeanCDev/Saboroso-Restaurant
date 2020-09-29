var db = require('../inc/bd');
var menus = require('../inc/menus');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{

    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results
    });

  });

});

router.get('/contact', function(req, res, next) {

  res.render('contact', { 
    title: 'Contato - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1:'Diga Olá'
  });

});

router.get('/menu', function(req, res, next) {

  menus.getMenus().then(results =>{
    res.render('menu', { 
      title: 'Menu - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1:'Saboreie nosso menu',
      menus: results
    });
  });

});

router.get('/reservation', function(req, res, next) {

  res.render('reservation', { 
    title: 'Reservas - Restaurante Saboroso!',
    background: 'images/img_bg_2.jpg',
    h1:'Reserve uma mesa!'
  });

});

router.get('/services', function(req, res, next) {

  res.render('services', { 
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1:'Um prazer poder servir!'
  });

});

module.exports = router;
