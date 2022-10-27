const url = 'https://mock-api.driven.com.br/api/v6/uol/'
const endpoint = ['participants', 'status', 'messages']
const msgType = ['status', 'message', 'private_message']
const main = document.querySelector("main");
const input = document.querySelector("input");
let username;
let firstLogin = true;
let firstList = true;

login();
resetHeight();

function login() {
    username = firstLogin ? { name: prompt("Digite seu Nickname") } : { name: prompt("Nickname em uso ou inválido, tente novamente!") };
    firstLogin = false;
    axios.post(url + endpoint[0], username).then(resposta).catch(resposta);
    function resposta(resposta) {
        if (resposta.status === 200) {
            listarMensagens();
            setInterval(listarMensagens, 3000);
            setInterval(keepAlive, 5000);
            input.addEventListener('keydown', logKey);
            addEventListener('resize', () => { rolaPraBaixo(); resetHeight(); });
        } else {
            login();
        }
    }
}

function resetHeight() {
    document.body.style.height = window.innerHeight + "px";
}

function keepAlive() {
    axios.post(url + endpoint[1], username).then(() => { }).catch(() => { keepAlive() });
}

function listarMensagens() {
    const promessa = axios.get(url + endpoint[2]);
    promessa.then((resposta) => {
        main.innerHTML = "";
        for (let i = 0; i < resposta.data.length; i++) {
            switch (resposta.data[i].type) {
                case msgType[0]:
                    main.innerHTML += `<div class="status">
                    <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> ${resposta.data[i].text}.
                    </div>`
                    break;
                case msgType[1]:
                    main.innerHTML += `<div class="message">
                    <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                    </div>`
                    break;
                case msgType[2]:
                    if (resposta.data[i].from === username.name || resposta.data[i].to === username.name) {
                        main.innerHTML += `<div class="private_message">
                        <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                        </div>`
                    }
                    break;
                default:
                    break;
            }
        }
        if (firstList) {
            rolaPraBaixo();
            firstList = false;
        }
    });
}

function rolaPraBaixo() {
    const elementoQueQueroQueApareca = document.querySelector("main div:last-of-type");
    elementoQueQueroQueApareca.scrollIntoView();
}

function logKey(e) {
    if (e.key === "Enter") {
        enviar();
    }
}

function enviar() {
    const mensagem = {
        from: username.name,
        to: "Todos",
        text: input.value,
        type: "message"
    }

    if (input.value.replace(/\s/g, '').length) {
        const promessaNome = axios.post(url + endpoint[2], mensagem);
        promessaNome.then((resposta) => {
        });
        input.value = "";
        setTimeout(() => { listarMensagens(); rolaPraBaixo() }, 500);
        promessaNome.catch((resposta) => {
            console.log(resposta);
            window.location.reload();
        });
    }
}

// https://stackoverflow.com/questions/43575363/css-100vh-is-too-tall-on-mobile-due-to-browser-ui