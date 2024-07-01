import { playAtivo } from "./script.js";

export { permisorPlay };

const addTarefa = document.querySelector('.app__button--add-task');
const formulario = document.querySelector('.app__form-add-task');
const textAreaForm = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const limparAllTarefas = document.getElementById('btn-remover-todas');
const cancelar = document.querySelector('.app__form-footer__button--cancel');
const del = document.querySelector('.app__form-footer__button--delete');
const limparComcluidas = document.getElementById('btn-remover-concluidas');
const emAndamentoP = document.querySelector('.app__section-active-task-description');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let permisorPlay = null
let tarefaAtual = null;
let liTarefaAtual = null;

function atulaizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description')
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    botao.onclick = () => {
        const novaDescricao = prompt("Qual o nome da nova tarefa?").trim();
        if (novaDescricao && !'') {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atulaizarTarefas();
        }
    }

    const img = document.createElement('img');

    img.setAttribute('src', '/imagens/edit.png');

    botao.append(img);

    li.append(svg, paragrafo, botao);

    if (tarefa.complete) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
        li.onclick = (evento) => {
            evento.preventDefault()
        }
    } else {
        li.onclick = () => {
            if (!playAtivo) {
                document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
                if (tarefaAtual == tarefa) {
                    emAndamentoP.textContent = ''
                    permisorPlay = null;
                    tarefaAtual = null;
                    liTarefaAtual = null;
                    return
                }
                tarefaAtual = tarefa;
                liTarefaAtual = li;
                emAndamentoP.textContent = tarefa.descricao;
                permisorPlay = true;
                li.classList.add('app__section-task-list-item-active')
            } else{alert('NÃO É POSIVEL MUDAR DE TAREFA NO MOMENTO')}
        }

    }

    return li;

}

addTarefa.addEventListener('click', () => {
    formulario.classList.toggle('hidden');
})


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textAreaForm.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atulaizarTarefas();
    textAreaForm.value = '';
    formulario.classList.add('hidden');
})

del.addEventListener('click', () => {
    textAreaForm.value = '';
})


cancelar.addEventListener('click', () => {
    textAreaForm.value = '';
    formulario.classList.add('hidden');
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

limparAllTarefas.addEventListener('click', () => {
    ulTarefas.innerHTML = '';
    localStorage.clear();
    tarefas = [];
})

limparComcluidas.addEventListener('click', () => {
    const selector = ".app__section-task-list-item-complete"
    document.querySelectorAll(selector).forEach(elemento => {
        elemento.remove();
    })
    tarefas = tarefas.filter(tarefa => !tarefa.complete);
    atulaizarTarefas()
})

document.addEventListener('focoFinalizado', () => {
    if (tarefaAtual && liTarefaAtual) {
        liTarefaAtual.classList.remove('app__section-task-list-item-active');
        liTarefaAtual.classList.add('app__section-task-list-item-complete');
        liTarefaAtual.querySelector('button').setAttribute('disabled', 'disabled');
        emAndamentoP.textContent = '';
        permisorPlay = null;
        liTarefaAtual.onclick = (evento) => {
            evento.preventDefault()
        }
        tarefaAtual.complete = true;
        atulaizarTarefas()
    }
})