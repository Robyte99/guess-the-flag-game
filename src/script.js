const countryCodesArray = [];
const countryNamesArray = [];
let score = 0;
let lifes = 3;
let correctIndex = null;
let currentOptions = [];

// Lista de códigos de estados dos EUA a serem ignorados
const excludedUSStates = [
    "us-ak", "us-al", "us-ar", "us-az", "us-ca", "us-co", "us-ct", "us-de", "us-fl", "us-ga",
    "us-hi", "us-ia", "us-id", "us-il", "us-in", "us-ks", "us-ky", "us-la", "us-ma", "us-md",
    "us-me", "us-mi", "us-mn", "us-mo", "us-ms", "us-mt", "us-nc", "us-nd", "us-ne", "us-nh",
    "us-nj", "us-nm", "us-nv", "us-ny", "us-oh", "us-ok", "us-or", "us-pa", "us-ri", "us-sc",
    "us-sd", "us-tn", "us-tx", "us-ut", "us-va", "us-vt", "us-wa", "us-wi", "us-wv", "us-wy"
];

// Carrega os dados dos países uma única vez
async function loadCountries() {
    if (countryNamesArray.length === 0) {
        const response = await fetch("https://flagcdn.com/en/codes.json");
        const data = await response.json();

        for (const [code, name] of Object.entries(data)) {
            if (!excludedUSStates.includes(code)) {
                countryCodesArray.push(code);
                countryNamesArray.push(name);
            }
        }
    }
}

// Gera 4 opções únicas de países
function gerarOpcoes() {
    const opcoes = new Set();
    while (opcoes.size < 4) {
        opcoes.add(Math.floor(Math.random() * countryNamesArray.length));
    }
    return Array.from(opcoes);
}

// Atualiza a rodada com nova bandeira e opções
async function novaRodada() {
    await loadCountries();

    currentOptions = gerarOpcoes();
    correctIndex = currentOptions[Math.floor(Math.random() * 4)];

    const countryCode = countryCodesArray[correctIndex];
    const countryName = countryNamesArray[correctIndex];

    document.getElementById("flag").src = `https://flagcdn.com/w320/${countryCode}.png`;

    currentOptions.forEach((index, i) => {
        document.getElementById("option" + (i + 1)).innerText = countryNamesArray[index];
    });

    // Buscar dica do país
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await res.json();
        const country = data[0];
        const hint = `
            Capital: ${country.capital?.[0] || "Desconhecida"}<br>
            Região: ${country.region}<br>
            Idioma: ${Object.values(country.languages || {})[0] || "N/A"}<br>
            População: ${country.population.toLocaleString()}
        `;
        document.getElementById("dica").innerHTML = `<strong>Dica:</strong><br>${hint}`;
    } catch (err) {
        document.getElementById("dica").innerText = "Não foi possível carregar a dica.";
        console.error(err);
    }
}

// Verifica o chute do jogador
function verificarChute(opcao) {
    const escolhido = document.getElementById("option" + opcao).innerText;
    const correto = countryNamesArray[correctIndex];

    const scoreEl = document.getElementById("score");
    const lifesEl = document.getElementById("lifes");
    const flagContainer = document.getElementById("flagContainer");

    if (escolhido === correto) {
        score++;
        scoreEl.innerText = score;

        scoreEl.classList.add('animate-bounce-custom');
        setTimeout(() => scoreEl.classList.remove('animate-bounce-custom'), 1000);

        novaRodada();
    } else {
        lifes--;
        lifesEl.innerText = lifes;

        flagContainer.classList.add('animate-shake');
        setTimeout(() => {
            flagContainer.classList.remove('animate-shake');
            if (lifes === 0) {
                window.location.href = "defeat.html";
            } else {
                novaRodada();
            }
        }, 600);
    }
}

// Começa o jogo
window.onload = novaRodada;
