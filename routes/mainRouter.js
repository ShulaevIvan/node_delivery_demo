const env = require('dotenv').config();
const PORT = env.parsed.PORT ? env.parsed.PORT : 3000;
const HOST = env.parsed.HOST ? env.parsed.HOST : 'localhost';
const wsServer = `http://${HOST}:${PORT}`;
const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');


router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('main.ejs', {
            user: req.session.passport.user[0], 
            pageTitle: 'MainPage', 
            jsScript: 'main.js' 
        });
    }
    return res.redirect(301, '/singin')
});

router.get('/singup', async (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(301).redirect('/', { jsScript: 'register.js', user: req.user })
    }
    res.render('registerPage.ejs', {
        pageTitle: 'Register', 
        jsScript: 'register.js', 
        user: undefined 
    });

});

router.get('/singin', async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('loginPage.ejs', { 
        pageTitle: 'Login', 
        jsScript: 'login.js'
    });
});

router.get('/logout', async (req, res) => {
    req.logOut(() => {
        res.redirect('/singin')
    });
});

router.get('/advertisments', async (req, res) => {
    return res.render('advertismentsPage.ejs', {
        pageTitle: 'Advertisments', 
        jsScript: 'login.js'
    });
});

router.get('/chat', isAuthenticated, async (req, res) => {
    const userData = {
        userId: req.session.passport.user[0]._id,
        email: req.session.passport.user[0].email,
        name: req.session.passport.user[0].name,
        contactPhone: req.session.passport.user[0].contactPhone
    }
    return res.render('chatPage.ejs', {
        pageTitle: 'Chat', 
        user: userData,
        wsServerUrl: wsServer,
        jsScript: 'chat.js'
    })
})


module.exports = router;