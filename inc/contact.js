var db = require('./bd')

module.exports = {

  // renderiza página de contato
  render(req, res, error, success) {

    res.render('contact', { 
      title: 'Contato - Restaurante Saboroso!',
      background: 'images/img_bg_3.jpg',
      h1:'Diga Olá',
      body: req.body,
      error, 
      success
    });

  }, 

  // salva mensagem no banco de dados
  save(fields){

    return new Promise((resolve, reject) =>{

      db.query(`
          INSERT INTO tb_contacts(name, email, message)
          VALUES(?, ?, ?)
        `,[fields.name, fields.email, fields.message],
          (err, results) => {

            if(err) {
              return reject(err)
            } else {
              resolve(results);
            }

          }
        );

      });

  }

}