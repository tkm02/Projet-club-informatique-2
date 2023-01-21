const protectRoute = (req, res, next) =>{
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('Please log in to continue');
    res.redirect('/connexion');
  }
  const allowIf = (req, res, next) =>{
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/chat');      
  }
  module.exports = {
      protectRoute,
      allowIf,
    };