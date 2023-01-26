const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    _id_room:{
        type : String
    },
    sender : String,
    receiver : String,
    content : String,
    date: {type: Date, default: Date.now}
});

const Chat = mongoose.model("chat",ChatSchema);
module.exports= Chat;

