// function enterRoom () {
// const userName = "yas" ;//prompt("Diga seu nome");
// const request = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants', {name: userName});

// request.then(function (param){
//     console.log(param.status);
// })
// request.catch(function (error){
//         console.log(error.response.status);
//     });
// }
// enterRoom();
const clientName = "Leo";
let messages;
let messagesCounter;
function getMessages(response) {
    messages = response.data;
    document.querySelector(".chat-box" ).innerHTML = "";
    renderMessages();
    messagesCounter.toString();
    let lastMessage = document.querySelector("#msg-id-"+messagesCounter);
    lastMessage.scrollIntoView();
}
function loadMessages() {
    
    const promise = axios.get(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
    );
    promise.then(getMessages);
}
function renderMessages() {
    for (let i = 0; i<messages.length; i++) {
        messagesCounter = i;
    let msgType = messages[i].type;
    let destinyText;
    if (msgType === "status") {
        destinyText = "";
        messages[i].to = "";
    } else if (msgType === "message") {
        destinyText = "para";
    } else {
        if (messages[i].to !== clientName && messages[i].from !== clientName) continue;
        destinyText = "resevadamente para";
    }
    document.querySelector(".chat-box" ).innerHTML += `<div class="${msgType} chat-status" id ="msg-id-${i}">
    <p class="message-content">
      <time>(${messages[i].time})</time>
     <strong> ${messages[i].from}</strong> ${destinyText} <strong>${messages[i].to}</strong> ${messages[i].text}
    </p>
  </div>`;
  
}
}
loadMessages();
setInterval(loadMessages,3000);