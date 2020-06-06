const passport = require('passport');

module.exports = (express, path) => {
    const router = express.Router();

    function isLoggedIn(req) {
        if (req.isAuthenticated()) {
            return true
        }
    }
    
    router.get("/auth/facebook", passport.authenticate('facebook', { scope: ["email", "user_gender", "user_link"] }));
    router.get("/auth/facebook/callback", passport.authenticate('facebook', { successRedirect: '/',
    failureRedirect: '/' }))

    router.post('/login', passport.authenticate('local-login', { successRedirect: '/',
    failureRedirect: '/' }))
    router.post('/signup', passport.authenticate('local-signup', { successRedirect: '/',
    failureRedirect: '/' }))


    router.get("/logout", (req, res) => {
        req.logout();
        console.log('Logged out')
        res.redirect("/");
    });

    router.get('/', (req, res) => {
        res.sendFile(path + '/index.html');
    });

    router.get('/login', (req, res) => {
        if (isLoggedIn(req) === true){
            console.log('Logged in')
            res.send(req.user.displayName);
        }
        else{
            console.log('Not logged in')
            res.send('Not Logged In');
        }
    })

    return router;
};