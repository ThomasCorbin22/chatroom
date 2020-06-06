const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config();

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database:   process.env.DATABASE_NAME,
        user:       process.env.DATABASE_USERNAME,
        password:   process.env.DATABASE_PASSWORD
    }
});

module.exports = (passport) => {
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.APP_ID,
        clientSecret: process.env.APP_SECRET,
        callbackURL: `app-03/auth/facebook/callback`,
        profileFields: ['id', 'email', 'name', 'gender', 'displayName', 'profileUrl']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        let userResult = await knex('users').where({ facebookID: profile.id });
        if (userResult == 0) {
            let user = {
                facebookID: profile.id,
                email: profile.displayName,
                displayName: profile.name.givenName,
                accessToken: accessToken
            }
            let query = await knex('users').insert(user).returning('id');
            user.id = query[0];
            done(null, user);
        } else {
            done(null, userResult[0])
        }
    }
    ));
}