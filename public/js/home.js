import { config } from 'dotenv';
config({path:'process.env'});
const PORT = process.env.PORT;

var socket  =  io.connect(`http://localhost:${PORT}/chat`);
