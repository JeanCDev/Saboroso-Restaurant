var express = require('express');
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservation');
var contacts = require('./../inc/contact');
const emails = require('./../inc/emails');

var moment = require('moment');
moment.locale("pt-BR");

var router = express.Router();

// função que retorna o router para usar o socket.io
module.exports = function (io) {

  // Middleware para verificar se o usuário está logado.
  router.use(function (req, res, next) {

    if (['/login'].indexOf(req.url) === -1 && !req.session.user) {
      res.redirect('/admin/login');
    } else {
      next();
    }

  });

  // middleware para cria o menu lateral do admin dinamicamente
  router.use(function (req, res, next) {

    req.menus = admin.getMenus(req);

    next();

  });

  // rota para sair do painel de admin
  router.get('/logout', function (req, res, next) {

    delete req.session.user;

    res.redirect('/admin/login');

  });

  // rota de login do painel de admin
  router.get('/login', function (req, res, next) {

    users.render(req, res, null);

  });

  // rota para fazer o login no painel do admin
  router.post('/login', function (req, res, next) {

    if (!req.body.email) {
      users.render(req, res, 'Preencha o campo e-mail');
    } else if (!req.body.password) {
      users.render(req, res, 'Preencha o campo senha');
    } else {

      users.login(req.body.email, req.body.password).then(user => {

        req.session.user = user;

        res.redirect('/admin')

      }).catch(err => {

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

    }).catch(err => {

      console.log(err);

    });

  });

  // rota para atualizar em tempo real com o socket.io
  router.get('/dashboard', function (req, res, next) {

    reservations.dashboard().then(data => {

      res.send(data);

    });

  });

  // rota de contatos do painel do admin
  router.get('/contacts', function (req, res, next) {

    contacts.getContacts().then(data => {

      res.render('admin/contacts', admin.getParams(req, {
        data
      }));

    });

  });

  router.delete('/contacts/:id', function (req, res, next) {

    contacts.delete(req.params.id).then(results => {
      res.send(results);
      io.emit('dashboard update');
    }).catch(err => {
      res.send(err);
    });

  });

  // rota de emails do painel de admin
  router.get('/emails', function (req, res, next) {

    emails.getEmails().then(data => {

      res.render('admin/emails', admin.getParams(req, {
        data
      }));

    });

  });

  // exclui emails da newsletter
  router.delete('/emails/:id', function (req, res, next) {

    emails.delete(req.params.id).then(results => {
      res.send(results);
      io.emit('dashboard update');
    }).catch(err => {
      res.send(err);
    });

  });

  // rota dos menus do painel de admin
  router.get('/menus', function (req, res, next) {

    menus.getMenus().then(data => {

      res.render('admin/menus', admin.getParams(req, {
        data
      }));

    });

  });

  // rota do envio de formulários da rota de menus
  router.post('/menus', function (req, res, next) {
    menus.save(req.fields, req.files).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(error => {

      res.send(error);

    });

  });

  // rota para excluir itens do menu
  router.delete('/menus/:id', function (req, res, next) {

    menus.delete(req.params.id).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(err => {

      res.send(err);

    });

  });

  // rota das reservas do painel de admin
  router.get('/reservations', function (req, res, next) {

    let start = (req.query.start) ? req.query.start : moment().subtract(3, 'year').format('YYYY-MM-DD');
    let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

    reservations.getReservations(req).then(pagination => {

      res.render('admin/reservations', admin.getParams(req, {
        date: {
          start,
          end
        },
        data: pagination.data,
        moment,
        links: pagination.links
      }));

    });

  });

  router.get('/reservations/chart', function (req, res, next) {

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(3, 'year').format('YYYY-MM-DD');
    req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

    reservations.chart(req).then(chartData => {

      res.send(chartData);

    });

  });

  // rota do envio de formulários da rota de reservas
  router.post('/reservations', function (req, res, next) {
    reservations.save(req.fields).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(error => {

      res.send(error);

    });

  });

  // rota para excluir reservas
  router.delete('/reservations/:id', function (req, res, next) {

    reservations.delete(req.params.id).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(err => {

      res.send(err);

    });

  });

  // rota dos usuários cadastrados no painel de admin
  router.get('/users', function (req, res, next) {

    users.getUsers().then(data => {

      res.render('admin/users', admin.getParams(req, {
        data
      }));

    });

  });

  // rota do envio de formulários da rota de usuários
  router.post('/users', function (req, res, next) {
    users.save(req.fields).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(error => {

      res.send(error);

    });

  });

  //rota para alteração de senha do usuário
  router.post('/users/password-change', function (req, res, next) {

    users.changePassword(req).then(result => {

      res.send(result);

    }).catch(err => {

      res.send({
        error: err
      });

    });

  });

  // rota para excluir usuários
  router.delete('/users/:id', function (req, res, next) {

    users.delete(req.params.id).then(result => {

      res.send(result);
      io.emit('dashboard update');

    }).catch(err => {

      res.send(err);

    });

  });

  return router;

}