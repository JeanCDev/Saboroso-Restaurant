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
      btnUpdate: '.btn-update',
      btnDelete: '.btn-delete',
      onUpdateLoad:(form, name, data) => {

        let input = form.querySelector(`[name=${name}]`);
        if(input) input.value = data[name];

      }
    }
    , configs);

    this.initForms();
    this.initButtons();

  }

  // inicia todos os formulários
  initForms() {

    // salva um formulário usando o prototype
    this.formCreate = document.querySelector(this.options.formCreate);

    this.formCreate.save().then(json => {

      this.fireEvent('afterFormCreate');

    }).catch(error => {

      this.fireEvent('afterFormCreateError');
      
    });

    // salva um formulário usando o prototype
    this.formUpdate = document.querySelector(this.options.formUpdate);

    this.formUpdate.save().then(json => {

      this.fireEvent('afterFormUpdate');

    }).catch(error => {

      console.log(error)
      
    });

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

  // inicia os botões de update e delete
  initButtons() {

    // cria um array de botões pegando os dados para edição de itens do banco de dados
    [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {

      btn.addEventListener('click', e => {

        // dispara qualquer evento
        // this.fireEvent('beforeUpdateClick');

        let data = this.getTrData(e);

        for (let name in data) {

          // externaliza o uso do switch
          this.options.onUpdateLoad(this.formUpdate, name, data);

        }

        // dispara o evento de abrir o modal
        this.fireEvent('afterUpdateClick');

      });

    });

    [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

      btn.addEventListener('click', e => {

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

      });

    });

  }

}