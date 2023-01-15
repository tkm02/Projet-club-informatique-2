const User = require('../models/user');
const session = require("express-session");

const chatView = (req,res)=>{
  User.find()
  .then(user=>{
    const users =user;
    res.render("chat",{user :req.user});
    // res.status(200).json(user);
  })
  .catch(err=>{res.status(500).json(err)})
   
    // console.log(req.User);

}
const deconnexion = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.redirect('/connection');
        // res.status(200).json("deconnecter");
        // res.send('Logout successful')
      }
    });
  } else {
    res.end()
  }
}



module.exports ={
    chatView,
    deconnexion
    
}