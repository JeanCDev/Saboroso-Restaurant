var express = require('express');
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var router = express.Router();

// Middleware para verificar se o usuário está logado.
router.use(function(req, res, next) {

  if(['/login'].indexOf(req.url) === -1 && !req.session.user){
    res.redirect('/admin/login');
  } else {
    next();
  }

});

// middleware para cria o menu lateral do admin dinamicamente
router.use(function(req, res, next) {

  req.menus = admin.getMenus(req);

  next();

});

// rota para sair do painel de admin
router.get('/logout', function (req, res, next){

  delete req.session.user;

  res.redirect('/admin/login');

});

// rota de login do painel de admin
router.get('/login', function (req, res, next) {

  users.render(req, res, null);

});

router.post('/login', function (req, res, next) {

  if(!req.body.email){
    users.render(req, res, 'Preencha o campo e-mail');
  } else if(!req.body.password){
    users.render(req, res, 'Preencha o campo senha');
  } else {

    users.login(req.body.email, req.body.password).then(user =>{

      req.session.user = user;

      res.redirect('/admin')

    }).catch(err =>{

      users.render(req, res, err.message || err);

    });
    
  }

});

// rota principal do painel de admin
router.get('/', function (req, res, next) {

  admin.dashboard().then(data => {

    res.render('admin/index', admin.getParams(req, {
      data
    }));

  }).catch(err =>{

    console.log(err);

  });

});

// rota de contatos do painel do admin
router.get('/contacts', function (req, res, next) {

  res.render('admin/contacts', admin.getParams(req));

});

// rota de emails do painel de admin
router.get('/emails', function (req, res, next) {

  res.render('admin/emails', admin.getParams(req));

});

// rota dos menus do painel de admin
router.get('/menus', function (req, res, next) {

  menus.getMenus().then(data =>{

    res.render('admin/menus', admin.getParams(req,{
      data
    }));

  });

});

// rota do envio de formulários da rota de menus
router.post('/menus', function (req, res, next){
  menus.save(req.fields, req.files).then(result =>{

    res.send(result);

  }).catch(error =>{

    res.send(error);

  });
  
});

router.delete('/menus/:id', function(req, res, next){

  menus.delete(req.params.id).then(result =>{

    res.send(result);

  }).catch(err =>{

    res.send(err);

  });

});

// rota das reservas do painel de admin
router.get('/reservations', function (req, res, next) {

  res.render('admin/reservations', admin.getParams(req, {
    date: {}
  }));

});

// rota dos usuários cadastrados no painel de admin
router.get('/users', function (req, res, next) {

  res.render('admin/users', admin.getParams(req));

});

module.exports = router;