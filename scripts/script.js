const URL_API_UOL = {
    participants: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",
    status: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
    messages: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
}
let clientName, messages, messagesCounter;
function enterRoom() {
    if (clientName !== undefined) {
        clientName = prompt("Este nome já está em uso, por favor escolha outro:");
    } else if (clientName === undefined) {
        clientName = prompt("Diga seu nome");
    }
    const request = axios.post(URL_API_UOL.participants, { name: clientName });

    request.catch(enterRoom);
    request.then(setInterval(keepConnection, 5000));
}
function keepConnection() {
    axios.post(URL_API_UOL.status, { name: clientName });
}
function getMessages(response) {
    messages = response.data;
    document.querySelector(".chat-box").innerHTML = "";
    renderMessages();
    messagesCounter.toString();
    let lastMessage = document.querySelector("#msg-id-" + messagesCounter);
    lastMessage.scrollIntoView();
}
function loadMessages() {

    const promise = axios.get(
        URL_API_UOL.messages
    );
    promise.then(getMessages);
}
function renderMessages() {
    for (let i = 0; i < messages.length; i++) {
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
        document.querySelector(".chat-box").innerHTML += `<div class="${msgType} chat-status" id ="msg-id-${i}">
    <p class="message-content">
      <time>(${messages[i].time})</time>
     <strong> ${messages[i].from}</strong> ${destinyText} <strong>${messages[i].to}</strong> ${messages[i].text}
    </p>
  </div>`;

    }
}
function sendMessage() {
    let message = document.querySelector(".type-message").value;
    const request = axios.post(URL_API_UOL.messages, {
        from: clientName,
        to: "Todos",
        text: message,
        type: "message"
    });

    request.then(loadMessages);
    request.catch(function () {
        window.location.reload();
    });
    document.querySelector(".type-message").value = "";
}
function showSidebar() {
    const element = document.querySelectorAll(".side-bar");
    element[0].classList.remove("hidden");
    element[1].classList.remove("hidden");
}
function hideSidebar() {
    const element = document.querySelectorAll(".side-bar");
    element[0].classList.add("hidden");
    element[1].classList.add("hidden");
}
enterRoom();
loadMessages();
setInterval(loadMessages, 3000);