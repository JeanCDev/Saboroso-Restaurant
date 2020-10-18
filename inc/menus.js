let db = require('./bd');
let Pagination = require('./pagination');
let path = require('path');

module.exports = {

// pega os pratos do banco de dados
 getMenus(page){

        if(!page) page = 1;

        let pagination = new Pagination(
          `
            SELECT SQL_CALC_FOUND_ROWS * FROM tb_menus ORDER BY title LIMIT ?, ?
          `
        );

        return pagination.getPage(page);

    },
  
  // salvar uma nova linha no banco de dados
  save(fields, files) {

    return new Promise((resolve, reject) =>{

      fields.photo = `images/${path.parse(files.photo.path).base}`;

      let query, queryPhoto = '', params;

      params = [
        fields.title,
        fields.description,
        fields.price,
      ];

      if(files.photo.name){

        queryPhoto = ', photo = ?';

        params.push(fields.photo);

      }

      if(parseInt(fields.id) > 0){

        params.push(fields.id);

        query = `
          UPDATE tb_menus
          SET title = ?,
              description = ?,
              price = ?
              ${queryPhoto}
          WHERE id = ?
        `;

      } else {

        if(!files.photo.name){
          reject('Envie a foto do prato');
        }

        query = `
          INSERT INTO tb_menus (title, description, price, photo)
          VALUES(?, ?, ?, ?)
        `;

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

      db.query(`DELETE FROM tb_menus WHERE id = ?`, [id], (err, results) => {

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      });

    });

  }

}