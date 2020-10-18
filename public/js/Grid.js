class Grid {

  constructor(configs) {

    // faz o listener padrão ser o de abrir o modal
    configs.listeners = Object.assign({
      afterUpdateClick: (e)=>{
        $('#modal-update').modal('show');
      },
      afterDeleteClick: (e)=>{
        window.location.reload();
      },
      afterFormCreate: (e)=>{
        window.location.reload();
      },
      afterFormUpdate: (e)=>{
        window.location.reload();
      },
      afterDeleteUpdate: (e)=>{
        window.location.reload();
      },
      afterFormCreateError: e =>{
        alert('Não foi possível enviar o formulário');
      },
      afterFormUpdateError: e =>{
        alert('Não foi possível enviar o formulário');
      } 
    },configs.listeners)

    // configurações padrão dos formulários
    this.options = Object.assign({}, {
      formCreate: '#modal-create form',
      formUpdate: '#modal-update form',
      btnUpdate: 'btn-update',
      btnDelete: 'btn-delete',
      onUpdateLoad:(form, name, data) => {

        let input = form.querySelector(`[name=${name}]`);
        if(input) input.value = data[name];

      }
    }
    , configs);

    this.rows = [...document.querySelectorAll('table tbody tr')]

    this.initForms();
    this.initButtons();

  }

  // inicia todos os formulários
  initForms() {

    // salva um formulário usando o prototype
    this.formCreate = document.querySelector(this.options.formCreate);

    if(this.formCreate){

      this.formCreate.save({
        success: () => {
  
          this.fireEvent('afterFormCreate');
  
        },
        failure: err => {
  
          this.fireEvent('afterFormCreateError');
  
        }
      });

    }

    // salva um formulário usando o prototype
    this.formUpdate = document.querySelector(this.options.formUpdate);

    if(this.formUpdate){

      this.formUpdate.save({
        success: () => {
  
          this.fireEvent('afterFormUpdate');
  
        },
        failure: err => {
  
          this.fireEvent('afterFormUpdateError');
  
        }
      });

    }

  }

  // adiciona um event listener para qualquer argumento
  fireEvent(name, args){

    if(typeof this.options.listeners[name] === 'function'){

      this.options.listeners[name].apply(this, args);

    }

  }

  // pega as informações da Tr e adiciona à variáveis do form
  getTrData(e){

    let tr = e.path.find(el => {

      return (el.tagName.toUpperCase() === 'TR');

    });

    return JSON.parse(tr.dataset.row);

  }

  // eventos de atualização de usuário
  // cria um array de botões pegando os dados para edição de itens do banco de dados
  btnUpdateClick(e){

        // dispara qualquer evento
        // this.fireEvent('beforeUpdateClick');

        let data = this.getTrData(e);

        for (let name in data) {

          // externaliza o uso do switch
          this.options.onUpdateLoad(this.formUpdate, name, data);

        }

        // dispara o evento de abrir o modal
        this.fireEvent('afterUpdateClick', [e]);

  }

  // evento de exclusão usuário
  btnDeleteClick(e){

        this.fireEvent('beforeDeleteClick');

        let data = this.getTrData(e);

        if (confirm(eval('`' + this.options.deleteMessage + '`'))) {

          fetch(eval('`' + this.options.deleteUrl + '`'), {
              method: 'DELETE',
            }).then(response => {
              response.json()
            })
            .then(json => {

              this.fireEvent('afterDeleteClick');

            });

        }

  }

  // inicia os botões de forma inteligente
  initButtons() {

    this.rows.forEach(row => {

      [...row.querySelectorAll('.btn')].forEach(btn=>{

        btn.addEventListener('click', e =>{

          if(e.target.classList.contains(this.options.btnUpdate)){

            this.btnUpdateClick(e);

          } else if(e.target.classList.contains(this.options.btnDelete)){

            this.btnDeleteClick(e);

          } else {

            this.fireEvent('buttonClick', [
              e.target,
              this.getTrData(e),
              e
            ]);

          }

        });

      });

    });

  }

}