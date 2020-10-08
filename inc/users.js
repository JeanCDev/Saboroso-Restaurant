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

  }

}