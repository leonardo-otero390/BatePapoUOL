const URL_API_UOL = {
    participants: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",
    status: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
    messages: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
}
const KEY_ENTER_CODE = 13;
const SECONDS = 1000;
let clientName, messages, messagesCounter, participants;
let userRecipient = "Todos";
let visibility = "message";
let alertVisibility = "";

function pressEnterToEnterRoom() {
    const input = document.querySelector(".type-name");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === KEY_ENTER_CODE) {
            event.preventDefault();
            enterRoom();
        }
    });
}
function pressEnterToSendMessage() {
    const input = document.querySelector(".type-message");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === KEY_ENTER_CODE) {
            event.preventDefault();
            sendMessage();
        }
    });
}
function startChat() {
    document.querySelector(".entry-screen").classList.add("hidden");
    setInterval(keepConnection, 5 * SECONDS);
    getMessages();
    getParticipants();
    setInterval(getMessages, 3 * SECONDS);
    setInterval(getParticipants, 10 * SECONDS);
}
function hideLoading() {
    document.querySelector(".loading-img").classList.add("hidden");
    document.querySelector(".type-name").classList.remove("hidden");
    document.querySelector("button").classList.remove("hidden");
}
function showLoading() {
    document.querySelector(".hidden").classList.remove("hidden");
    document.querySelector(".type-name").classList.add("hidden");
    document.querySelector("button").classList.add("hidden");
}
function enterRoom() {
    showLoading();
    clientName = document.querySelector(".type-name").value;
    const request = axios.post(URL_API_UOL.participants, { name: clientName });
    document.querySelector(".type-name").value = "";
    request.catch(function () {
        alert("O nome já está em uso por favor ecolha outro")
        hideLoading();
    });
    request.then(startChat);
}
function keepConnection() {
    axios.post(URL_API_UOL.status, { name: clientName });
}
function loadMessages(response) {
    messages = response.data;
    document.querySelector(".chat-box").innerHTML = "";
    renderMessages();
    messagesCounter.toString();
    let lastMessage = document.querySelector("#msg-id-" + messagesCounter);
    lastMessage.scrollIntoView();
}
function getMessages() {
    const promise = axios.get(URL_API_UOL.messages);
    promise.then(loadMessages);
}
function renderMessages() {
    let msgType, destinyText;
    for (let i = 0; i < messages.length; i++) {
        messagesCounter = i;
        msgType = messages[i].type;
        destinyText;
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
    const message = document.querySelector(".type-message").value;
    const request = axios.post(URL_API_UOL.messages, {
        from: clientName,
        to: userRecipient,
        text: message,
        type: visibility
    });

    request.then(getMessages);
    request.catch(function () {
        window.location.reload();
    });
    document.querySelector(".type-message").value = "";
    userRecipient = "Todos";
    visibility = "message";
    document.querySelector(".alert-send-message").innerHTML = "";

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
function alertText() {
    if (visibility === "private_message") {
        alertVisibility = "(reservadamente)";
    } else alertVisibility = "";
    document.querySelector(".alert-send-message").innerHTML = `Enviando para ${userRecipient} ${alertVisibility}`;
}
function selectUser(element) {
    if (document.querySelector(".users-list .check.marked") !== null) {
        document.querySelector(".users-list .check.marked").classList.remove("marked");
    }
    element.querySelector(".check").classList.add("marked");
    userRecipient = element.querySelector(".user").innerText;
    alertText();
}
function selectVisibility(element) {
    if (document.querySelector(".visibility .check.marked") !== null) {
        document.querySelector(".visibility .check.marked").classList.remove("marked");
    }
    element.querySelector(".check").classList.add("marked");
    visibility = element.classList[1];
    alertText();
}
function renderParticipants(element) {
    element.innerHTML = `<div class="user-option" onclick = "selectUser(this)">
    <div class="user">
      <ion-icon name="people-sharp"></ion-icon>
      Todos
    </div>
    <ion-icon name="checkmark-sharp" class="check"></ion-icon>
  </div>`
    for (let i = 0; i < participants.length; i++) {
        element.innerHTML += `<div class="user-option" onclick = "selectUser(this)">
        <div class="user">
          <ion-icon name="person-circle-sharp"></ion-icon>
          ${participants[i].name}
        </div>
        <ion-icon name="checkmark-sharp" class="check"></ion-icon>
      </div>`
    }
}
function loadParticipants(response) {
    participants = response.data;
    const element = document.querySelector(".users-list");
    renderParticipants(element);
}
function getParticipants() {
    const promise = axios.get(URL_API_UOL.participants);
    promise.then(loadParticipants);
}
pressEnterToEnterRoom();
pressEnterToSendMessage();