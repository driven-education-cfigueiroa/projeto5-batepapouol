const url = 'https://mock-api.driven.com.br/api/v6/uol/'
const endpoint = ['participants', 'status', 'messages']
const msgType = ['status', 'message', 'private_message']
const main = document.querySelector("main");


const promessa = axios.get(url + endpoint[2]);
promessa.then((resposta) => {
    
    console.log(resposta.data)
    for (let i = 0; i < resposta.data.length; i++) {
        console.log(resposta.data[i])
        switch (resposta.data[i].type) {
            case msgType[0]:
                main.innerHTML += 
                `<div style="background-color: #DCDCDC;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} entra na sala...
                </div>`
                break;
            case msgType[1]:
                main.innerHTML += 
                `<div style="background-color: #FFF;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
                </div>`
                break;
            case msgType[2]:
                main.innerHTML += 
                `<div style="background-color: #FFDEDE;">
                    (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
                </div>`
                break;
            default:
                break;
        }
    }

});


// main.innerHTML += `<div>${resposta.data[i].from}</div>`;