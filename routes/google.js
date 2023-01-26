const express = require('express');
const googleRouter = express();
const tokens = require('../utils/tokens');
const passport = require('passport');
const baseUrl = "http://localhost:3000"

googleRouter.get("/auth/google", passport.authenticate("google", { scope: ['email', 'profile'], prompt: "select_account" }));

googleRouter.get("/callback",
    //Función de fallo
    passport.authenticate('google', { failureRedirect: `${baseUrl}/google/auth/failure` }),
    //Función exitosa
    async (req, res) => {

        const payload = {
            user: req.user._json.name,
            email: req.user._json.email,
            check: true
        };

        const token = await tokens.createToken(payload, "20m");
        console.log("CREATED TOKEN ", token)

        res.cookie("access-token", token, {
            httpOnly: true,
            sameSite: "strict",
        }).status(302).redirect(`${baseUrl}`);

    });


//Definimos una ruta en caso de que la autenticación falle.
googleRouter.get('/auth/failure', (req, res) => {
    res.send('Something went wrong..')
});

//Definimos la ruta de logout, donde eliminamos la sesión y limpiamos el token de las cookies.
googleRouter.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.clearCookie("access-token").redirect(`${baseUrl}`);
    });

});


module.exports = googleRouter;
