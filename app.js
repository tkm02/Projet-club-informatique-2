const express       =  require('express');
const app           =  express();
const server        =  require('http').createServer(app);
const mongoose      =  require('mongoose');
const dotenv        =  require('dotenv');
const userRoutes    =  require('./routes/login');
const {loginCheck}  =  require('./auth/passport');
const Chat          =  require('./models/chat');
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
.then(() => console.log('connexion a mongodb reussie!'))
.catch(err => console.log(err,'impossible de se connecter verifie et ressaie'));

var io  = require('socket.io')(server);
//TODO

io.on('connection', (socket)=> {
  console.log('un utilisateur est en ligne');
  socket.on('username',(username)=>{
    // console.log(username); 
    socket.username = username;
    socket.broadcast.emit('newUser',socket.username);

    Chat.find((err,message)=>{
      socket.emit('oldMessages',message);
    })
  });

  socket.on('message',(message)=>{
    var chat = new Chat();
    chat.content = message;
    chat.sender = socket.username;
    chat.save();
    socket.broadcast.emit('messageAll',{message : message ,username: socket.username});
  });
  socket.on('writting',(username)=>{
    socket.broadcast.emit('writting',username);
  });
  socket.on('noWritting',()=>{
    socket.broadcast.emit('noWritting');
  });

  socket.on('disconnect',()=>{
    console.log('un utilisateur deconnecter');
    socket.broadcast.emit("quitUser",socket.username);
  })
});


const PORT = (process.env.PORT || 3000);
server.listen(PORT,console.log('Notre server demare sur le port : ' + `http://localhost:${PORT}/connexion`));

