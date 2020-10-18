var db = require('./bd');
var Pagination = require('./pagination');

module.exports = {

  render(req, res, error){

    res.render('admin/login', {
      body: req.body,
      error,
    });

  },

  login(email, password){

    return new Promise((resolve, reject) => {

      db.query(`
        SELECT * FROM tb_users WHERE email = ?
      `, [email], (err, result) => {

        if (err){ 
          reject(err) 
        } else {

          if(!result.length > 0){

            reject('Usuário ou senha incorretos!');
            
          } else {

            let row = result[0];

            if(row.password !== password){

              reject('Usuário ou senha incorretos!');

            } else{

              resolve(row)

            }

          }

        }

      })


    });

  },
    
// pega os usuários do banco de dados
 getUsers(page){

      if(!page) page = 1;

      let pagination = new Pagination(
        `
          SELECT SQL_CALC_FOUND_ROWS * FROM tb_users ORDER BY name LIMIT ?, ?
        `
      );

      return pagination.getPage(page);

    },

  // salvar uma nova linha no banco de dados
  save(fields, files) {

    return new Promise((resolve, reject) =>{

      let query, queryPhoto = '', params;

      params = [
        fields.name,
        fields.email,
      ];

      if(parseInt(fields.id) > 0){

        params.push(fields.id);

        query = `
          UPDATE tb_users
          SET name = ?,
              email = ?
          WHERE id = ?
        `;

      } else {

        query = `
          INSERT INTO tb_users (name, email, password)
          VALUES(?, ?, ?)
        `;

        params.push(fields.password)

      }

      db.query(query, params, (err, results)=>{

        if(err){ 
          console.log(err)
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  },

  // excluir uma linha do banco de dados 
  delete(id){

    return new Promise((resolve, reject) => {

      db.query(`DELETE FROM tb_users WHERE id = ?`, [id], (err, results) => {

        if(err){
          console.log(err)
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  },

  // Altera senha do usuário no banco de dados
  changePassword(req){

    return new Promise((resolve, reject) => {

      if(!req.fields.password){

        reject('Preencha a senha');

      } else if(req.fields.password !== req.fields.passwordConfirm){

        reject('Preencha a senha corretamente');

      } else{

        db.query(`
          UPDATE tb_users 
            SET password = ?
          WHERE id = ?
        `, [
          req.fields.password,
          req.fields.id,
        ],function(err, results){

          if(err){
            reject(err.message);
          } else {
            resolve(results);
          }

        });

      }

    });

  }

}