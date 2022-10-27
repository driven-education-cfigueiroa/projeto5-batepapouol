const url = 'https://mock-api.driven.com.br/api/v6/uol/'
const endpoint = ['participants', 'status', 'messages']
const msgType = ['status', 'message', 'private_message']
const main = document.querySelector("main");
const input = document.querySelector("input");
let username;
let firstLogin = true;


login();

function login() {
    username = firstLogin ? { name: prompt("Digite seu Nickname") } : { name: prompt("Nickname em uso ou inválido, tente novamente!") };
    firstLogin = false;
    axios.post(url + endpoint[0], username).then(resposta).catch(resposta);
    function resposta(resposta) {
        if (resposta.status === 200) {
            listarMensagens();
            setInterval(listarMensagens, 3000);
            setInterval(keepAlive, 5000);
        } else {
            login();
        }
    }
}

function keepAlive() {

    axios.post(url + endpoint[1], username).then(resposta).catch(resposta);
    function resposta(resposta) {
        if (resposta.status === 200) { }
    }

}

function listarMensagens() {
    const promessa = axios.get(url + endpoint[2]);
    promessa.then((resposta) => {
        main.innerHTML = "";
        for (let i = 0; i < resposta.data.length; i++) {
            switch (resposta.data[i].type) {
                case msgType[0]:
                    main.innerHTML +=
                        `<div style="background-color: #DCDCDC;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} ${resposta.data[i].text}.
                </div>`
                    break;
                case msgType[1]:
                    main.innerHTML +=
                        `<div style="background-color: #FFF;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
                </div>`
                    break;
                case msgType[2]:
                    if (resposta.data[i].from === username.name || resposta.data[i].to === username.name) {
                        main.innerHTML +=
                            `<div style="background-color: #FFDEDE;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
                </div>`
                    }
                    break;
                default:
                    break;
            }
        }
        const elementoQueQueroQueApareca = document.querySelector("main div:last-of-type");
        elementoQueQueroQueApareca.scrollIntoView();
    });
}

input.addEventListener('keydown', logKey);

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

    const promessaNome = axios.post(url + endpoint[2], mensagem);
    promessaNome.then((resposta) => {
    });
    input.value = "";
    setTimeout(listarMensagens, 500);
    promessaNome.catch((resposta) => {
        window.location.reload();
    });
}
