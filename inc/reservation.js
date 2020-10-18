var db = require('./bd');

module.exports = {

  // renderiza página de reservas
  render(req, res, error, success) {

    res.render('reservation', {
      title: 'Reservas - Restaurante Saboroso!',
      background: 'images/img_bg_2.jpg',
      h1: 'Reserve uma mesa!',
      body: req.body,
      error,
      success
    });

  },

  // pega os dados de reservas do Banco de dados
 getReservations(){
  return new Promise((resolve, reject) => {

      db.query(`
        SELECT * FROM tb_reservations ORDER BY date DESC
        `, (err, results)=>{

            if (err) { reject(err);} 
            
            resolve(results);

        });

      });

    },

  // salva dados de reserva no banco de dados
  save(fields) {

    return new Promise((resolve, reject) => {

      if(fields.date.indexOf('/') > -1) {

        let date = fields.date.split('/');

        fields.date = `${date[2]}-${date[1]}-${date[0]}`;

      }

      let query;
      let params = [
        fields.name,
        fields.email,
        fields.people,
        fields.date,
        fields.time
      ];

      if(parseInt(fields.id) > 0){

        query = `
          UPDATE tb_reservations
          SET
            name = ?,
            email = ?,
            people = ?,
            date = ?,
            time = ?
          WHERE id = ?`;

          params.push(fields.id);
      } else {

        query = `
          INSERT INTO tb_reservations (name, email, people, date, time)
          VALUES (?, ?, ?, ?, ?)
        `;

      }

      db.query(query, params, (err, results) => {

          if(err) {
            return reject(err)
          } else {
            resolve(results);
          }

        }
      )

    });

  },

  // excluir uma linha do banco de dados 
  delete(id){

    return new Promise((resolve, reject) => {

      db.query(`DELETE FROM tb_reservations WHERE id = ?`, [id], (err, results) => {

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  }

}