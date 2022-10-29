const url = 'https://mock-api.driven.com.br/api/v6/uol/'
const endpoint = ['participants', 'status', 'messages']
const msgType = ['status', 'message', 'private_message']
const main = document.querySelector("main");
const input = document.querySelector("footer input");
const loginOverlay = document.querySelector(".login");
const loadingOverlay = document.querySelector(".loading");
const loginInput = document.querySelector(".login-input input");
const overlayDiv = document.querySelector(".overlay");
const closeOverlayDiv = document.querySelector("div.overlay > div:nth-child(1)");
const userlist = document.querySelector(".lista");
let username;
let firstLogin = true;
let lastMsg
let currentMsg

//login();
//resetHeight();

loginInput.addEventListener('keydown', logKey2);

function logKey2(e) {
    if (e.key === "Enter") {
        login();
    }
}

function overlay(e){
    overlayDiv.style.zIndex = "100";
}

function closeOver(e){
    overlayDiv.style.zIndex = "-1";
}


function listarUsers() {
    const promessa = axios.get(url + endpoint[0]);
    promessa.then((resposta) => {
        console.log(resposta);
        userlist.innerHTML = "";
        for (let i = 0; i < resposta.data.length; i++) {
            // userlist.innerHTML += 
        }
    });
}

function login() {
    //username = firstLogin ? { name: prompt("Digite seu Nickname") } : { name: prompt("Nickname em uso ou inválido, tente novamente!") };
    let loginInput = document.querySelector("div.login-input > div:nth-child(1) > input[type=text]")
    username = { name: loginInput.value };
    firstLogin = false;
    axios.post(url + endpoint[0], username).then(resposta).catch(resposta);
    loginOverlay.style.zIndex = "-100";
    function resposta(resposta) {
        if (resposta.status === 200) {
            loginInput.value = ""
            loginInput.placeholder = "Aguarde..."
            listarMensagens();
            setInterval(listarMensagens, 3000);
            setInterval(keepAlive, 5000);
            input.addEventListener('keydown', logKey);
            addEventListener('resize', () => { rolaPraBaixo(); resetHeight(); });
            loadingOverlay.style.zIndex = "-1";
        } else {
            loginOverlay.style.zIndex = "10";
            loginInput.value = ""
            loginInput.placeholder = "Nickname em uso!"
        }
    }
}

function resetHeight() {
    document.body.style.height = (window.innerHeight - 1) + "px";
}

function keepAlive() {
    axios.post(url + endpoint[1], username).then(() => { }).catch(() => { keepAlive() });
}

function listarMensagens() {
    const promessa = axios.get(url + endpoint[2]);
    promessa.then((resposta) => {
        console.log(resposta.data[resposta.data.length - 1]);
        lastMsg = JSON.stringify(resposta.data[resposta.data.length - 1]);
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
        if (lastMsg !== currentMsg) {
            rolaPraBaixo();
            currentMsg = lastMsg;
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