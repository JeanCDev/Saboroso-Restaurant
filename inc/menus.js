let db = require('./bd');

module.exports = {

// pega os pratos do banco de dados
 getMenus(){
    return new Promise((resolve, reject) => {

        db.query(`
          SELECT * FROM tb_menus ORDER BY title
          `, (err, results)=>{

              if (err) { reject(err);} 
              
              resolve(results);

          });

        });

      }

}