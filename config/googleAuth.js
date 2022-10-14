const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

//Establecemos la estrategia de Google con los credenciales de nuestro proyecto
passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_OAUTH_IDCLIENT}`,
    clientSecret: `${process.env.GOOGLE_OAUTH_SECRET}`,
    callbackURL: `http://localhost:5000/google/callback`,
    proxy: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

//Esta función determina los datos que se van a guardar en la sesión de google: user
passport.serializeUser(function (user, done) {
    done(null,user)
});
//Determina que objeto borrar de la sesión: user
passport.deserializeUser(function (user, done) {
    done(null,user)
});