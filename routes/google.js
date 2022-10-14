const express = require('express');
const googleRouter = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');



googleRouter.get("/login", (req,res)=>{
    res.send('<a href="auth/google">Authenticate with google </a>')
});

googleRouter.get("/auth/google", passport.authenticate("google", { scope: ['email', 'profile'], prompt: "select_account" }));

googleRouter.get("/callback", 
    //Función de fallo
    passport.authenticate('google', { failureRedirect: 'google/auth/failure' }), 
    //Función exitosa
    (req,res)=>{
    //En el cuerpo de esta función podemos almacenar usuarios en nuestra bbdd con el objeto que nos proporciona req.user (Para ello es necesario hacer la función asíncrona)

    //Estos son los pasos para crear un token si la autenticación es exitosa
    const payload = {
        //save here data
        check: true
    };
    const token = jwt.sign(payload, `secret_key`, {
        expiresIn: "20m"
    });

    //Almacenamos el token en las cookies
    res.cookie("access-token", token, {
        httpOnly: true,
        sameSite: "strict",
    }).send("Welcome! You are now authenticated with google! <br><br> <a href='/logout'>Click here to logout!</a>");
});


//Definimos una ruta en caso de que la autenticación falle.
googleRouter.get('/auth/failure', (req, res) => {
    res.send('Something went wrong..')  
});

//Definimos la ruta de logout, donde eliminamos la sesión y limpiamos el token de las cookies.
googleRouter.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.clearCookie("access-token").send('Goodbye! <br><br> <a href="/auth/google">Authenticate again</a>');
      });

});


module.exports = googleRouter;
