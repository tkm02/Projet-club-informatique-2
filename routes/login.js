const express = require('express');
const { inscriptionView,connexionView,connectionUser,inscriptionUser} = require('../controllers/loginController');
const {chatView,deconnexion} = require('../controllers/chatController');
const { protectRoute } = require ( "../auth/protect" ); 
const router = express.Router();

//afficher les page :GET
router.get('/connection',connexionView);
router.get('/inscription',inscriptionView);

router.get('/chat',protectRoute,chatView);
router.delete('/chat',deconnexion);
// router.post('/chat',infoDataBase);  



//inscription-connection :POST
router.post('/connection/',connectionUser);
router.post('/inscription',inscriptionUser);

module.exports=router;