'use strict'

const abreModal = () => document.getElementById('modal')
    .classList.add('active')

const fechaModal = () => {
    limpaCampos()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deletaTarefa = (index) => {
    const dbClient = leTarefa()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const atualizaTarefa = (index, client) => {
    const dbClient = leTarefa()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const leTarefa = () => getLocalStorage()

const criaTarefa = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const campoEhValido = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const limpaCampos = () => {
    const fields = document.querySelectorAll('.modal-campo')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-cabecalho>h2").textContent = 'Nova Tarefa'
}

const salvaTarefa = () => {
    if (campoEhValido()) {
        const task = {
            nome: document.getElementById('nome').value,
            data: document.getElementById('data').value
        };

        const index = document.getElementById('nome').dataset.index;

        if (index === 'new') {
            criaTarefa(task); // Criar uma nova tarefa
        } else {
            atualizaTarefa(index, task); // Atualizar tarefa existente
        }

        atualizaLista();
        fechaModal();
    }
};

const criaTarefaNova = (task, index) => {
    const newListElement = document.createElement('li');
    const isCompleted = task.realizada ? 'completed' : '';
    newListElement.innerHTML = `
        <div class="div1">
            <input type="checkbox" class="checkbox" data-index="${index}" id="check-${index}" ${task.realizada ? 'checked' : ''}>
            <h3 class="tarefa-nome${isCompleted}">${task.nome}</h3>
        </div>
        <div class="icones">
            <img src="/assets/icone-lapis.svg" class="icone" data-index="${index}" id="edit-${index}">
            <img src="/assets/icone-lixeira.svg" class="icone" data-index="${index}" id="delete-${index}">
        </div>
    `;

    newListElement.classList.add('tarefa');

    document.getElementById('todoList').appendChild(newListElement);
    document.getElementById(`edit-${index}`).addEventListener('click', () => editaTarefa(index));
};



const limpaLista = () => {
    const list = document.getElementById('todoList');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const atualizaLista = () => {
    const task = leTarefa();
    limpaLista();
    task.forEach(criaTarefaNova);
};


const preencheCampos = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('data').value = client.data
}

const editaTarefa = (index) => {
    const client = leTarefa()[index];
    preencheCampos(client);
    document.getElementById('nome').dataset.index = index; // Atualizar o dataset.index
    document.querySelector(".modal-cabecalho>h2").textContent = `Editando "${client.nome}"`;
    abreModal();
};

const editaDeleta = (event) => {
    const target = event.target;
    if (target.classList.contains('icone')) {
        const [action, index] = target.id.split('-');

        if (action === 'edit') {
            editaTarefa(index);
        } else if (action === 'delete') {
            const client = leTarefa()[index];
            const resposta = confirm(`Deseja realmente excluir a tarefa "${client && client.nome}"?`);
            if (resposta) {
                deletaTarefa(index);
                atualizaLista();
            }
        }
    }
};


const checkTarefa = (event) => {
    if (event.target.classList.contains('checkbox')) {
        const index = event.target.dataset.index;
        const taskList = leTarefa();
        taskList[index].realizada = event.target.checked;
        atualizaTarefa(index, taskList[index]);
        atualizaLista();
    }
};

atualizaLista()

// Eventos
document.getElementById('novaTarefa')
    .addEventListener('click', abreModal)

document.getElementById('modalX')
    .addEventListener('click', fechaModal)

document.getElementById('salvar')
    .addEventListener('click', salvaTarefa)

document.getElementById('todoList')
    .addEventListener('click', editaDeleta);

document.getElementById('todoList')
    .addEventListener('click', checkTarefa);
