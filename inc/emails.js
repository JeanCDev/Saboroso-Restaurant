var db = require('./bd');
var Pagination = require('./pagination');

module.exports = {

  // pega os emails do banco de dados
  getEmails(page){

    if(!page) page = 1;

    let pagination = new Pagination(
      `
        SELECT SQL_CALC_FOUND_ROWS * FROM tb_emails ORDER BY register DESC LIMIT ?, ?
      `
    );

    return pagination.getPage(page);

  }, 

  // salva emails no banco de dados
  save(fields){

    return new Promise((resolve, reject) =>{

      db.query(`
          INSERT INTO tb_emails(email)
          VALUES(?)
        `,[fields.email],
          (err, results) => {

            if(err) {
              reject(err.message);
            } else {
              resolve(results);
            }

          }
        );

      });

  },

  // exclui emails do banco de dados
  delete(id){

    return new Promise((resolve, reject) => {

      db.query(`DELETE FROM tb_emails WHERE id = ?`, [id], (err, results) => {

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  }

}