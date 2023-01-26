const mongoose = require('mongoose');
const UserSchemaVrai = new mongoose.Schema({
    username :{type : String, require:true,unique:true},
    email :{type:String,require:true,unique:true,lowercase: true},
    password :{type:String,require:true},
    location: {type: String,default: "Abidjan"},
    date: {type: Date,default: Date.now},
});

const User = mongoose.model("User",UserSchemaVrai);
module.exports= User;