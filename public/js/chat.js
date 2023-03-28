var socket = io.connect('http://localhost:5000');
const FormChat = document.getElementById('form');
var corpsDiscution = document.getElementById("corps-discution");
var userAll = document.querySelectorAll('.usr');
///////////////////////////////////////////////

let toggle = document.querySelector('.toggle');
let body = document.querySelector('body');
let d1 = document.getElementById('d1');
toggle.addEventListener('click',()=>{
    if(body.classList.contains('open')){
        // fermer le menu
        // toggle.style.color='#fff';
        body.classList.remove('open');

    }else{
        // ouvrir le menu.
        body.classList.add('open');
    }
})
///////////////////////////////////////////////

var username = document.getElementById('username').textContent;
console.log(username);
socket.emit('username', username);
socket.emit('oldWhispers',username);
document.title = username + ' - ' + document.title;


var info = document.getElementById('info');

socket.on('newUser',(username)=>{
    info.textContent = `${username} est en ligne...`;
});

socket.on('oldWhispers',(message)=>{
    console.log(message);
    message.forEach(msg=>{
        // UserEnvoie.textContent = msg.sender; 
        const ulRecue = document.createElement('ul');
            ulRecue.classList.add('messagePrivé');
            const liRecue = document.createElement('li');
            liRecue.classList.add('li-recue');
            liRecue.innerText = `message privé de ${msg.sender} : ${msg.content}`;
            ulRecue.appendChild(liRecue);
            corpsDiscution.appendChild(ulRecue);
    })
})
socket.on('enligne',(name)=>{
    console.log(name);
    userAll.forEach((el)=>{
        el.childNodes[3].classList.remove("deconnecter");
        if (el.innerText == name) {
            el.childNodes[3].classList.add("connecter");
        }

    });
})

socket.on('quitUser',(username)=>{
    info.textContent =`${username} est deconnecter.`;
    userAll.forEach((el)=>{
        if (el.innerText == username) {
            el.childNodes[3].classList.add("deconnecter");
        }
    });
});

socket.on('oldMessages',(messages)=>{
    messages.forEach(message => {
        if(message.sender === username){
            const ulenvoyer = document.createElement('ul'); 
            ulenvoyer.classList.add('envoyer');
            const lienvoyer = document.createElement('li');
            lienvoyer.classList.add('li-envoyer');
            lienvoyer.innerText = message.content;
            ulenvoyer.appendChild(lienvoyer);
            corpsDiscution.appendChild(ulenvoyer);
        }
        else{
            const ulRecue = document.createElement('ul');
                ulRecue.classList.add('recue');
                const liRecue = document.createElement('li');
                liRecue.classList.add('li-recue');
                liRecue.innerText = `${message.sender} : ${message.content}`;
                ulRecue.appendChild(liRecue);
                corpsDiscution.appendChild(ulRecue);
        }
    });
})




var receiver = document.getElementById('options').value;
document.getElementById('nonAutre').textContent = receiver;

FormChat.addEventListener('submit',(e)=>{
    e.preventDefault();
    var date = new Date();
    var heures = date.getHours();
    var minutes = date.getMinutes();
    var msg = document.getElementById('message').value;
    document.getElementById('message').value = "";
    receiver = document.getElementById('options').value;
    document.getElementById('nonAutre').textContent = receiver;
    console.log(receiver);
    
    if(msg.length > 0){

        socket.emit('message',msg,receiver);

    

            const ulenvoyer = document.createElement('ul');
            ulenvoyer.classList.add('envoyer');
            const lienvoyer = document.createElement('li');
            const heurRecue = document.createElement('span');
            heurRecue.classList.add('heur-recue');
            heurRecue.innerText = `${heures}:${minutes}`;
            lienvoyer.classList.add('li-envoyer');
            lienvoyer.innerText = `${username} : ${msg}`;
            // lienvoyer.style.width='150px';
            ulenvoyer.appendChild(lienvoyer);
            ulenvoyer.appendChild(heurRecue);
            corpsDiscution.appendChild(ulenvoyer);

        
       
       
    }
    else{
        return false;
    }
});


socket.on('messageAll',(contenue)=>{

    var date = new Date();
    var heures = date.getHours();
    var minutes = date.getMinutes();
    const UserEnvoie = document.getElementById('nonAutre');
    UserEnvoie.textContent = contenue.username; 
    const ulRecue = document.createElement('ul');
        ulRecue.classList.add('recue');
        const liRecue = document.createElement('li');
        const heurEnvoie = document.createElement('span');
        heurEnvoie.classList.add('heur-recue');
        heurEnvoie.innerText = `${heures}:${minutes}`;
        liRecue.classList.add('li-recue');
        liRecue.innerText = `${contenue.username} : ${contenue.message}`;
        // lienvoyer.style.width='150px';
        ulRecue.appendChild(liRecue);
        ulRecue.appendChild(heurEnvoie);
        corpsDiscution.appendChild(ulRecue);
});

socket.on('whisper',(content=>{
    
    var date = new Date();
    var heures = date.getHours();
    var minutes = date.getMinutes();
    const UserEnvoie = document.getElementById('nonAutre');
    UserEnvoie.textContent = content.sender; 
    const ulRecue = document.createElement('ul');
        ulRecue.classList.add('messagePrivé');
        const liRecue = document.createElement('li');
        const heurEnvoie = document.createElement('span');
        heurEnvoie.classList.add('heur-recue');
        heurEnvoie.innerText = `${heures}:${minutes}`;
        liRecue.classList.add('li-recue');
        liRecue.innerText = `${content.sender} : ${content.message}`;
        // lienvoyer.style.width='150px';
        ulRecue.appendChild(liRecue);
        ulRecue.appendChild(heurEnvoie);
        corpsDiscution.appendChild(ulRecue);
}));

function writting(){
    socket.emit('writting', username);
}
function noWritting(){
    socket.emit('noWritting');
}

socket.on('writting',(username)=>{
    document.getElementById('nonAutre').style.color='#05E395';
    document.getElementById('nonAutre').textContent = username + " est entrain d'ecrire";
    // document.getElementById('ecrire').textContent = ;
});

socket.on('noWritting',()=>{
    document.getElementById('nonAutre').textContent = " ";
});

