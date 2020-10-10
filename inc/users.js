var db = require('./bd');

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
 getUsers(){
  return new Promise((resolve, reject) => {

      db.query(`
        SELECT * FROM tb_users ORDER BY name
        `, (err, results)=>{

            if (err) { reject(err);} 
            
            resolve(results);

        });

      });

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
          INSERT INTO tb_menus (name, email, password)
          VALUES(?, ?, ?)
        `;

        params.push(fields.password)

      }

      db.query(query, params, (err, results)=>{

        if(err){ 
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
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  }

}