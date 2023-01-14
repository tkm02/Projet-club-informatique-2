const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//routes pour servir les page : GET

const connexionView = (req,res)=>{
    res.render("connection",{});
}

const inscriptionView =(req,res)=>{
    res.render("inscription",{});
}


//routes pour connection inscription

const inscriptionUser =(req,res)=>{
    
    const { username, email, location, password } = req.body;
      
        if (!username || !email || !password ) {
          console.log(req.body);
          return;
        }
          //Validation
        User.findOne({ email: email }).then((user) => {
            if (user) {
              console.log("l'email existe!!");
              res.render("inscription", {
                username,
                email,
                password,
              });
            } else {
              //Validation
              const newUser = new User({
                username,
                email,
                location,
                password,
              });
              //Password Hashing
              bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
      
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(valid =>{
                      if(!valid){
                        res.status(500).json({err})
                      }
                      else{
                        res.redirect('/connection')
                      }
                    })
                    .catch((err) => console.log(err));
                })
              );
            }
          });
        
      ;
}

const connectionUser = (req, res) => {
  const { email, password } = req.body;

  //Required
  if (!email || !password) {
    console.log("Please fill in all the fields");
    res.render("login", {
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/chat",
      failureRedirect: "/connection",
      failureFlash: true,
    })(req, res);
  }
};

module.exports={
    inscriptionView,
    connexionView,
    connectionUser,
    inscriptionUser
}
