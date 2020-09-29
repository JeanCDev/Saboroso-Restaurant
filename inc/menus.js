let db = require('./bd');

module.exports = {

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