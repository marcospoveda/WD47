(function(){
    console.log("start app...");

    var endpoint = "http://localhost:4000/schedule";

    // elementos da tela
    var ui = {
        fields: document.querySelectorAll("input"),
        button: document.querySelector(".pure-button"),
        table: document.querySelector(".pure-table tbody")
    };

    // ações da tela
    var validateFields = function(e){
        // debugger;
        e.preventDefault();
        console.log("botão clicado", ui.fields);
        var data = {};
        var errors = 0;
        // ui.fields.forEach(function(field){
        //     var fieldValue = field.value.trim();
        //     // console.log(field.value, field.value.length, field.id);
        //     if(fieldValue.length === 0){
        //         field.classList.add("error");
        //         errors++;
        //     } else {
        //         field.classList.remove("error");
        //         data[field.id] = fieldValue;
        //     }
        // });

        // // Arrow Function
        ui.fields.forEach(field => {
            if(field.value.trim().length === 0){
                field.classList.add("error");
                errors++;
            } else {
                field.classList.remove("error");
                data[field.id] = field.value.trim();
            }
        });

        if(errors > 0){
            document.querySelector(".error").focus();
        } else {
            addContact(data);
        }
    };

    var addContact = function(contact){
        console.log(contact);
        //forma de envio da requisição HTTP (GET, POST, PUT, DELETE) - method
        //Corpo da requisição (Envia os dados), 'stringify' converte o objeto para JSON - body
        //Definição do formato do arquivo enviado (json, binário, authentication......) - headers
        var config = {
            method: "post",
            body: JSON.stringify(contact),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };
        console.log(config);
        //fetch API - lança comunicação de rede. Em caso de sucesso cai no then() em caso de erro cai no catch()
        // fetch() recebe dois parâmetros. "aonde vai bater(Endpoint)" e quais a configurações do arquivo (config)
        fetch(endpoint, config)
            .then(addContactSuccess)
            .catch(genericError);
    };

    var genericError = () => console.error(arguments);

    var addContactSuccess = () => {
        cleanFields();
        getContacts();
    };

    var cleanFields = () => ui.fields.forEach(field => field.value = "");

    var getContacts = () => {
        var config = {
            method: "get",
            headers: new Headers({
                "Content-type": "application/json"
            })
        };
        fetch(endpoint, config)
            .then(res => {return res.json()})
            .then(getContactsSuccess)
            .catch(genericError);
    };

    var getContactsSuccess = contacts => {
        var html = [];
        // console.table(contacts);
        contacts.forEach(contact => {
            console.log(contact.id, contact.name, contact.email, contact.phone);
            html.push(`<tr>
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>
                <a href="#" data-action="delete" data-id="${contact.id}">Excluir</a>
            </td>
            </tr>`);
        });
        if(contacts.length === 0){
            html.push(`<tr>
            <td colspan="5">Não existem dados registrados!</td>
            </tr>`);
        }
        console.log(html.join(""));
        ui.table.innerHTML = html.join("");
    };

    var removeContact = function(id){
        var config = {
            method: "delete",
            headers: new Headers({
                "Content-Type":"application/json"
            })
        };

        fetch(`${endpoint}/${id}`, config)
            .then(getContacts)
            .catch(genericError)
    };

    var handlerAction = function(e){
        // console.log(this);
        if(e.target.dataset.action === "delete"){
            removeContact(e.target.dataset.id);
        }

    };

    var init = function(){
        ui.button.onclick = validateFields;
        ui.table.onclick = handlerAction;
        getContacts();
    }();

    console.log(ui);
})();