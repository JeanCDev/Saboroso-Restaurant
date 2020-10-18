let db = require('./bd');

class Pagination{

  constructor(query, params = [], itemsPerPage = 10){

    this.query = query;
    this.params = params;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;

  }

  // pega o numero da página de dados e divide os resultados entre elas
  getPage(page){

    this.currentPage = page - 1;

    this.params.push(
      this.currentPage * this.itemsPerPage,
      this.itemsPerPage
    );

    return new Promise((resolve, reject)=>{

      db.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, result)=>{

        if (err) { 
          reject(err);
        } else {

          this.data = result[0];
          this.total = result[1][0].FOUND_ROWS;
          this.totalPages = Math.ceil(this.total / this.itemsPerPage);
          this.currentPage++;

          resolve(this.data);
        }

      });

    });

  }

  // pega o total de resultados da consulta
  getTotal(){

    return this.total;

  }

  // pega o numero da pagina atual
  getCurrentPage(){

    return this.currentPage;

  }

  // pega o numero total de páginas
  getTotalPages(){

    return this.totalPages;

  }

  getNavigation(params){

    let navLimitPages = 3;
    let links = [];
    let pagesStart = 0;
    let pagesEnd = 0;

    if(this.getTotalPages() < navLimitPages){

      navLimitPages = this.getTotalPages();

    }

    // determina se está nas primeiras páginas
    if((this.getCurrentPage() - parseInt(navLimitPages/2))< 1){
      pagesStart = 1;
      pagesEnd = navLimitPages;
    } 
    // determina se está próximos às últimas páginas
    else if((this.getCurrentPage() + parseInt(navLimitPages/2) > this.getTotalPages())){

      pagesStart = this.getTotalPages() - navLimitPages;
      pagesEnd = this.getTotalPages();

    } 
    // determina se está no meio da navegação
    else {

      pagesStart = this.getCurrentPage() - parseInt(navLimitPages/2);
      pagesEnd = this.getCurrentPage() + parseInt(navLimitPages/2);

    }

    if(this.getCurrentPage() > 1) {

      links.push({
        text: '«',
        href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() - 1})),
      })

    }

    for (let x = pagesStart; x <= pagesEnd; x++) {

      links.push({
        text: x,
        href: '?' + this.getQueryString(
          Object.assign(
            {}, 
            params, 
            {page: x}
          )),
        active: (x === this.getCurrentPage()),
      });

    }

    if(this.getCurrentPage() < this.getTotalPages()) {

      links.push({
        text: '»',
        href: '?' + this.getQueryString(
          Object.assign(
            {}, 
            params, 
            {page: this.getCurrentPage() + 1}
          )),
      })

    }

    return links;

  }

  getQueryString(params){
    
    let queryString = [];

    for(let name in params){

      queryString.push(`${name}=${params[name]}`);

    }

    return queryString.join('&');
  
  }

}

module.exports = Pagination;