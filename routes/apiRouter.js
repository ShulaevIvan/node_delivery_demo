const router = require('express').Router();
const passport = require('passport');
const UserModule = require('../modules/UserModule');
const hashPassword = require('../utils/hashPassword');

router.post('/signup', async (req, res) => {
     try {
        const data = req.body;
        await hashPassword(data.password)
        .then((hashPassword) => {
            const userData = {
                email: data.email,
                name: data.name,
                contactPhone: data.contactPhone,
                passwordHash: hashPassword,
            };
            UserModule.create(userData)
            .then((userObj) => {
               return res.status(201).json({'status': 'ok', data: userObj});
            })
            .catch((err) => {
                return res.status(201).json({'status': 'err', data: err.message});
            })
        });
    }
    catch(err) {
        res.status(500).json({'status': 'err', 'message':'server err'});
    }
});

router.post('/signin',
    passport.authenticate('local', { 
        failureRedirect: '/signin',
    }), 
    async (req, res) => {
    try {
        const userData = req.body;
        await UserModule.findByEmail(userData.email)
        .then((targetUser) => {
            req.logIn(targetUser, function(err) {
                if (err) {
                    return res.redirect('/signin')
                }
                return res.status(201).json({'status': 'ok', data: targetUser});
            });
        })
        .catch((err) => {
            return res.status(401).json({'status': 'err', data: err});
        })
    }
    catch(err) {
        return res.status(500).json({'status': 'err', data: []});
    }
});

router.post('/logout', async (req, res) => {
    if (req.isAuthenticated()) {
    }
});


module.exports = router;