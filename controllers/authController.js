const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // const roles = foundUser.roles;
        console.log('This is the roles:', roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log('This is the result:', result);
        console.log('This is the roleData:', foundUser.roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 }); // remove 'secure: true' for thunderClient endpoint testing
        // res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 1000 });
        res.cookie('username', username, { httpOnly: false, secure: true, sameSite: 'Strict', maxAge: 30 * 60 * 1000 });
        // Add a logic to check if the user is an admin, if yes, redirect to the adminDashboard
        if (roles.includes(5150)) {
            res.redirect(`/adminDashboard?accessToken=${ accessToken }&username=${ username }`);
        }
        // Add a logic to check if the user is an editor, if yes, redirect to the editorDashboard
        else if (roles.includes(1984)) {
            res.redirect(`/editorDashboard?accessToken=${ accessToken }&username=${ username }`);
        }
        // If the user is neither an admin nor an editor, redirect to the calendar
        else {
            res.redirect(`/calendar?accessToken=${ accessToken }&username=${ username }`);
        }

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };