var db = require('./bd');
var Pagination = require('./pagination');

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

  getContacts(page){

      if(!page) page = 1;

          let pagination = new Pagination(
            `
              SELECT SQL_CALC_FOUND_ROWS * FROM tb_contacts ORDER BY register DESC LIMIT ?, ?
            `
      );

      return pagination.getPage(page);

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

  },

  delete(id){

    return new Promise((resolve, reject) => {

      db.query(`DELETE FROM tb_contacts WHERE id = ?`, [id], (err, results) => {

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  }

}