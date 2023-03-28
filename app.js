const express       =  require('express');
const app           =  express();
const server        =  require('http').createServer(app);
const mongoose      =  require('mongoose');
const dotenv        =  require('dotenv');
const userRoutes    =  require('./routes/login');
const {loginCheck}  =  require('./auth/passport');
const Chat          =  require('./models/chat');
const User = require('./models/user');
const session = require("express-session");
const passport = require('passport');
loginCheck(passport);

dotenv.config({path:'process.env'});
app.set("view engine", "ejs");
app.use(express.json());
app.use(session({
  secret:'oneboy',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.use('/',userRoutes);
app.get('/',(req,res)=>{
  res.send('hello');
}); 

const database = process.env.MONGOLAB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(`${database}`, 
{useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connexion a mongodb réussie!'))
.catch(err => console.log(err,'impossible de se connecter vérifie et réessaie'));

var io  = require('socket.io')(server);
//TODO
var connectedUsers =[];
io.on('connection', (socket)=> {
  console.log('un utilisateur est en ligne');

  socket.on('username',(username)=>{
    // console.log(username); 
    socket.username = username;
    socket.broadcast.emit('newUser',socket.username);
   User.findOne({ username: username })
      .then(user => socket.broadcast.emit('enligne',(user.username)));
    connectedUsers.push(socket);

    Chat.find(({receiver : 'A tous'}),(err,message)=>{
      socket.emit('oldMessages',message);
    })
  });

  socket.on('oldWhispers',(username)=>{
    Chat.find({receiver : username},(err,messages)=>{
      if(err){
        console.log(err);
        return false;
      }
      else{
        socket.emit('oldWhispers',messages);
      }
    })
  });

  socket.on('message',(message,receiver)=>{
    if(receiver === "A tous"){
        var chat = new Chat();
        chat.content = message;
        chat.sender = socket.username;
        chat.receiver = receiver;
        chat.save();

        socket.broadcast.emit('messageAll',{message : message ,username: socket.username});
    }
    else{

        User.findOne({username : receiver},(err,user)=> {

          if(!user){
            return false;

          }else{
            socketReceiver = connectedUsers.find(socket => socket.username === user.username);
            if(socketReceiver){
              socketReceiver.emit('whisper',{sender : socket.username, message : message});
            }
            var chat = new Chat();
            chat.content = message; 
            chat.sender = socket.username;
            chat.receiver = receiver;
            chat.save();
          }
          
      })
    }
    
  });
  socket.on('writting',(username)=>{
    socket.broadcast.emit('writting',username);
  });
  socket.on('noWritting',()=>{
    socket.broadcast.emit('noWritting');
  });

  socket.on('disconnect',()=>{
    var index = connectedUsers.indexOf(socket);
    if(index > -1){
      connectedUsers.splice(index, 1);
    }
    console.log('un utilisateur déconnecté');
    socket.broadcast.emit("quitUser",socket.username);
  })
});


const PORT = (5000);
server.listen(PORT,console.log('Notre serveur démarre sur le port : ' + `http://localhost:${PORT}/connexion`));

