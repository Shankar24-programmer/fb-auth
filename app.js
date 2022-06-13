// const express = require('express');
// const app = express();
// const cors = require('cors');
// const passport = require('passport')
// const User = require('./models/User')
// const session = require('express-session')
// const facebookStrategy = require('passport-facebook').Strategy;
// // require('./server/config/passport')(passport);

// app.use(cors())
// app.set('view engine', 'ejs');

// app.use(session({
//     secret: 'This is secret key',
//     resave: false,
//     saveUninitialized: true,
// }))
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new facebookStrategy({

//     clientID: "2946235549002365",
//     clientSecret: "c4a23ae2ef8aaccf950b23883c24e3cc",
//     callbackURL: "http://localhost:8000/facebook/callback",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
// },
// function(token, refreshToken, profile, done) {
//     process.nextTick(function() {

//         // find the user in the database based on their facebook id
//         User.findOne({ 'uid' : profile.id }, function(err, user) {

//             // if there is an error, stop everything and return that
//             // ie an error connecting to the database
//             if (err)
//                 return done(err);

//             // if the user is found, then log them in
//             if (user) {
//                 console.log("user found")
//                 console.log(user)
//                 return done(null, user); // user found, return that user
//             } else {
//                 // if there is no user found with that facebook id, create them
//                 var newUser = new User();

//                 // set all of the facebook information in our user model
//                 newUser.uid    = profile.id; // set the users facebook id                 
//                 newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//                 newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
//                 newUser.pic = profile.photos[0].value
//                 // save our user to the database
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;

//                     // if successful, return the new user
//                     return done(null, newUser);
//                 });
//             }

//         });

//     })

// }));

// app.get('/', (req, res) => {
//     res.render("index.ejs")
// })

// app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email', 'profile']}))
// app.get('/facebook/callback', passport.authenticate('facebook', {
//     successRedirect: '/profile',
//     failureRedirect: '/failed'
// }))

// app.get('/profile', (req,res) => {
//     res.send("You are a valid user")
// })

// app.get('/failed', (req,res) => {
//     res.send("You are a non valid user")
// })

// passport.serializeUser(function(user, done) {
//     done(null, user);
// })

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user){
//         done(err, user);
//     });
// });


// app.listen(8000)


const express = require('express')
const app = express();

const passport = require('passport')
const User = require('./models/User')
const session = require('express-session')
const facebookStrategy = require('passport-facebook').Strategy

app.set("view engine", "ejs")
app.use(session({
    secret: 'This is secret key',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());


passport.use(new facebookStrategy({
    clientID: "2946235549002365",
    clientSecret: "c4a23ae2ef8aaccf950b23883c24e3cc",
    callbackURL: "http://localhost:8000/facebook/callback",
    profileFields: ["id", "displayName", "name", "gender", "picture.type(large)", "email"]
},

    function (token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            User.findOne({ 'uid': profile.id }, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    console.log("user found")
                    console.log(user)
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.uid = profile.id; // set the users facebook id                    
                    newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.pic = profile.photos[0].value
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });

        })

    }));
app.get('/', (req, res) => {
    res.render("index.ejs")
})


app.get('/auth/facebook', passport.authenticate('facebook', { scope: "email" }))
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed'
}))

app.get('/profile', (req, res) => {
    res.send("You are a valid user")
})

app.get('/failed', (req, res) => {
    res.send("You are a non valid user")
})

passport.serializeUser(function(user, done){
    done(null, user.id);
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

app.listen(8000)