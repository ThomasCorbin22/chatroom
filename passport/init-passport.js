const passport = require('passport')

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // passport.deserializeUser(async (id, done) => {
    //     let users = await knex("users").where({ id: id.id });
    //     if (users.length == 0) {
    //         return done(new Error(`Wrong user id ${id}`));
    //     }
    //     user = users[0];
    //     return done(null, user);
    // });

    require('./facebook-strategy.js')(passport);
    require('./passport.js')(passport);
}