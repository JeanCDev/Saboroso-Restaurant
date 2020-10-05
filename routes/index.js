var db = require('../inc/bd');
var menus = require('../inc/menus');
var express = require('express');
var router = express.Router();
var reservation = require('../inc/reservation');
var contact = require('../inc/contact');

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{

    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results,
      isHome: true
    });

  });

});

// rota para acessar página de contato
router.get('/contact', function(req, res, next) {

  contact.render(req, res);

});

// rota para enviar mensagem
router.post('/contact', function(req, res, next) {

  if(!req.body.name){
    contact.render(req, res, "Digite o seu nome");
  } else if(!req.body.email){
    contact.render(req, res, "Digite o sue E-mail");
  } else if(!req.body.message){
    contact.render(req, res, "Digite uma mensagem");
  } else{
    contact.save(req.body).then(result =>{

      req.body = {}
      contact.render(req, res, null, "Obrigado por entrar em contato!");

    }).catch(err =>{
      contact.render(req, res, err.message);
    });
    
  }

});

// rota para acessar página de Menu
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

// rota para acessar página de reservas
router.get('/reservation', function(req, res, next) {

  reservation.render(req, res);

});

// rota para enviar pedido de reserva
router.post('/reservation', function(req, res, next) {

  if(!req.body.name){
    reservation.render(req, res, "Digite o seu nome");
  } else if(!req.body.email){
    reservation.render(req, res, "Digite o seu E-mail");
  } else if(!req.body.people){
    reservation.render(req, res, "Escolha o numero de pessoas");
  } else if(!req.body.date){
    reservation.render(req, res, "Escolha uma data da reserva");
  } else if(!req.body.time){
    reservation.render(req, res, "Escolha um horário");
  } else{
    reservation.save(req.body).then(results =>{

      req.body = {};

      reservation.render(req, res, null, "Reserva realizada com sucesso");

    }).catch(err =>{
      reservation.render(req, res, err.message);
    });
  }

});

// rota para acessar página de serviços
router.get('/services', function(req, res, next) {

  res.render('services', { 
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1:'Um prazer poder servir!'
  });

});

module.exports = router;
