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

  // salva dados de reserva no banco de dados
  save(fields) {

    return new Promise((resolve, reject) => {

      let date = fields.date.split('/');

      fields.date = `${date[2]}-${date[1]}-${date[0]}`

      db.query(`
        INSERT INTO tb_reservations (name, email, people, date, time)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          fields.name,
          fields.email,
          fields.people,
          fields.date,
          fields.time
        ], (err, results) => {

          if(err) {
            return reject(err)
          } else {
            resolve(results);
          }

        }
      )

    });



  }

}