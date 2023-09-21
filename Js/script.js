const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
let isMarioPassingPipe = false; // Variável para controlar se o Mario está passando pelo cano
let counterVal = 0; // Variável para armazenar o score

// Função para fazer o Mario pular
const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

// Função para verificar se o Mario passou pelo cano
function checkIfMarioPassedPipe() {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Verifica se o Mario cruzou o cano completamente
    if (pipePosition <= 0 && marioPosition >= 100) {
        if (!isMarioPassingPipe) { // Verifica se o Mario não está atualmente passando pelo cano
            isMarioPassingPipe = true; // Define a variável isMarioPassingPipe como true
            incrementClick(); // Incrementa o contador
        }
    } else {
        isMarioPassingPipe = false; // Define a variável isMarioPassingPipe como false quando o Mario não está passando pelo cano
    }
}

// Função para salvar o score na localStorage
function saveScore(score) {
    if (typeof Storage !== "undefined") {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];

        scores.push(score);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 5);

        localStorage.setItem("scores", JSON.stringify(scores));
    } else {
        console.log("LocalStorage não suportada no seu navegador.");
    }
}

// Função para recuperar os top 5 scores da localStorage
function getTopScores() {
    if (typeof Storage !== "undefined") {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        return scores;
    } else {
        console.log("LocalStorage não suportada no seu navegador.");
        return [];
    }
}

// Função de loop que verifica a colisão entre o Mario e o cano
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Verifica se houve colisão entre o Mario e o cano
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 100) {
        // Remove animações e redefine as posições do Mario e do cano
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        // Define uma imagem de "game over" para o Mario
        mario.src = './img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        // Salva o score atual
        saveScore(counterVal);

        // Exibe o botão de recarregar a página
        const reloadButton = document.getElementById("reload-button");
        reloadButton.style.display = "block";
        reloadButton.addEventListener("click", () => {
            location.reload(); // Recarrega a página quando o botão é clicado
        });

        clearInterval(loop); // Interrompe o loop de verificação de colisão
    }

    checkIfMarioPassedPipe(); // Verifica se o Mario passou pelo cano

}, 10);

// Event listener para detectar o pressionamento da tecla de espaço para fazer o Mario pular
document.addEventListener('keydown', (event) => {
    if (event.key === " ") {
        jump();
    }
});

// Função para incrementar o contador de score
function incrementClick() {
    counterVal += 1;
    updateDisplay(counterVal);
}

// Função para atualizar a exibição do score no HTML e exibir os top 5 scores
function updateDisplay(val) {
    document.getElementById("counter-label").innerHTML = val;

    // Recupere e exiba os top 5 scores
    const topScores = getTopScores();
    const topScoresList = document.getElementById("top-scores-list");

    topScoresList.innerHTML = ""; // Limpe a lista antes de exibir os novos scores

    topScores.forEach((score, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Top ${index + 1}: ${score}`;
        topScoresList.appendChild(listItem);
    });
}
