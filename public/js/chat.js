var socket = io.connect('ws://localhost:5502');
const FormChat = document.getElementById('form');
var corpsDiscution = document.getElementById("corps-discution");

const username = document.getElementById('username').textContent;
socket.emit('username', username);
document.title = username + ' - ' + document.title;

var info = document.getElementById('info');

socket.on('newUser',(username)=>{
    info.textContent = `${username} est en ligne...`;
});

socket.on('quitUser',(username)=>{
    info.textContent =`${username} est deconnecter.`;
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
var tabUser =[];

const userAll = document.querySelectorAll('li');
userAll.forEach(el=>{
    console.log(el);
    el.addEventListener('click',(e)=>{
        e.preventDefault();
        alert(el.innerText);
    });
});




FormChat.addEventListener('submit',(e)=>{
    e.preventDefault();
    var date = new Date();
    var heures = date.getHours();
    var minutes = date.getMinutes();
    var msg = document.getElementById('message').value;
    document.getElementById('message').value = "";
    console.log(msg);
    
    if(msg.length > 0){
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
        socket.emit('message',msg);
       
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
