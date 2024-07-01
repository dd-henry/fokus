import { permisorPlay } from "./script-crud.js";

export {playAtivo};

const html = document.querySelector('html');
const relogio = document.querySelector('#timer');
const img = document.querySelector('.app__image');
const msg = document.querySelector('.app__title');
const player = document.querySelector('#start-pause span');
const playEPausebt = document.querySelector('.app__card-primary-butto-icon');
const focusbt = document.querySelector('.app__card-button--foco');
const curtobt = document.querySelector('.app__card-button--curto');
const longobt = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button');
const musicainout = document.querySelector('#alternar-musica');

const musica = new Audio('/sons/luna-rise-part-one.mp3');
const playEffect = new Audio('/sons/play.wav');
const pauseEffect = new Audio('/sons/pause.mp3');
const timerOverEffect = new Audio('/sons/beep.mp3');

musica.loop = true;
let playAtivo = null;

musicainout.addEventListener('change', () => {
    if (musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})


let tempoReset = 10;
let tempoDecorrido = 10;
let intervaloId = null;



focusbt.addEventListener('click', () => {
    alterarContexto('foco');
    focusbt.classList.add('active');
});

curtobt.addEventListener('click', () => {
    alterarContexto('descanso-curto');
    curtobt.classList.add('active');
});

longobt.addEventListener('click', () => {
    alterarContexto('descanso-longo');
    longobt.classList.add('active');
});

function alterarContexto(contexto) {
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto)
    img.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            msg.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            tempoDecorrido = 10;
            tempoReset = 10;

            break;
        case "descanso-curto":
            msg.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            tempoDecorrido = 300;
            tempoReset = 300;

            break;
        case "descanso-longo":
            msg.innerHTML = `Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            tempoDecorrido = 900;
            tempoReset = 900;

            break;

        default:
            break;
    }

    zerar()
}

let contagemR = function () {
    if (tempoDecorrido <= 0) {
        timerOverEffect.play();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const elemento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(elemento);
        }
        alert('timer over')
        playAtivo = null;
        tempoDecorrido = tempoReset;
        zerar();
        return;
    }
    tempoDecorrido -= 1;
    mostrarNatela();
}

player.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (permisorPlay) {
        if (intervaloId) {
            zerar()
            pauseEffect.play()
            return;
        }
        intervaloId = setInterval(contagemR, 1000)
        playEffect.play();
        player.textContent = 'Pausar'
        playEPausebt.setAttribute('src', '/imagens/pause.png')
        playAtivo = true;
    } else { alert('NENHUMA TAREFA EM ANDAMENTO') }
}

function zerar() {
    clearInterval(intervaloId);
    player.textContent = 'Começar'
    playEPausebt.setAttribute('src', '/imagens/play_arrow.png');
    intervaloId = null
    mostrarNatela();
    return;
}

function mostrarNatela() {
    const tempo = new Date(tempoDecorrido * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
    relogio.innerHTML = `${tempoFormatado}`;
}

mostrarNatela();