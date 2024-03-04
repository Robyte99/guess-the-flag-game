// Arrays para armazenar códigos e nomes de países
const countryCodesArray = [];
const countryNamesArray = [];

// Variáveis de pontuação e vidas
var score = 0;
var lifes = 3;

// Índice da resposta correta
var correctAnswerIndex;

// Função para obter os códigos dos países de uma API
function getCountriesData() {
    return fetch("https://flagcdn.com/en/codes.json")
        .then(response => response.json())
        .catch(error => console.error("Erro ao obter dados da API:", error));
}

// Função assíncrona para obter dados e popular os arrays
async function getData() {
    const countryCodes = await getCountriesData();

    // Popula os arrays com códigos e nomes dos países
    countryCodesArray.push(...Object.keys(countryCodes));
    countryNamesArray.push(...Object.values(countryCodes));
}

// Função para gerar número aleatório não repetido
function rndNumber(usedIndices) {
    let index;
    do {
        index = Math.floor(Math.random() * 255);
    } while (usedIndices.includes(index));
    return index;
}

// Array para armazenar índices usados nas opções
const usedIndices = [];

// Função assíncrona para gerar opções com nomes de países
async function options() {
    await getData();

    // Limpa o array de índices usados
    usedIndices.length = 0;

    // Gera opções não repetidas
    for (let i = 1; i <= 4; i++) {
        const index = rndNumber(usedIndices);
        usedIndices.push(index);
        document.getElementById("option" + i).innerText = countryNamesArray[index];
    }
}

// Função assíncrona para configurar a resposta correta
async function setAnswer() {
    await getData();

    // Escolhe aleatoriamente um índice para ser a resposta correta
    correctAnswerIndex = rndNumber([]);

    // Obtém o nome do país correspondente à resposta correta
    const correctCountryName = countryNamesArray[correctAnswerIndex];

    // Garante que a resposta correta esteja entre as opções
    const randomOptionIndex = Math.floor(Math.random() * 4) + 1;
    document.getElementById("option" + randomOptionIndex).innerText = correctCountryName;

    // Obtém a URL da bandeira correspondente à resposta correta
    var flagAPI = `https://flagcdn.com/w640/${countryCodesArray[correctAnswerIndex]}.jpg`;
    // Atualiza a imagem da bandeira
    document.getElementById("flag").src = flagAPI;
}

// Função para verificar o chute do jogador
function verificarChute(chute) {
    // Obtém o texto da opção escolhida pelo jogador
    const optionText = document.getElementById("option" + chute).innerText;

    // Verifica se a opção escolhida é a resposta correta
    if (countryNamesArray[correctAnswerIndex] === optionText) {
        // Incrementa a pontuação
        score++;
        document.getElementById("score").innerText = "" + score;

        // Gera novas opções e configura uma nova resposta
        options();
        setAnswer();
    } else {
        // Decrementa as vidas
        lifes--;
        document.getElementById("lifes").innerText = "" + lifes;

        // Gera novas opções e configura uma nova resposta
        options();
        setAnswer();

        // Verifica se as vidas acabaram, se sim, redireciona para a página de derrota
        if (lifes == 0) {
            window.location.href = "defeat.html";
        }
    }
}

// Função para reiniciar o jogo
function resetGame() {
    window.location.href = "index.html";
}

// Inicializa o jogo chamando as funções de gerar opções e configurar resposta
options();
setAnswer();
