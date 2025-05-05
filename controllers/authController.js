const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/roles_list');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: username }).exec();
    //if (!foundUser) return res.sendStatus(401); //Unauthorized 
    if (!foundUser) {
        return res.status(401).send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 200px; }
                .error-message { font-size: 36px; color: red; font-weight: bold; }
              </style>
            </head>
            <body>
              <p class="error-message">Username Not Found</p>
            </body>
          </html>
        `);
      }
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
            { expiresIn: '1200s' }
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
        res.cookie('jwt', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 60 * 60 * 1000 }); // remove 'secure: true' for thunderClient endpoint testing
        // Creates Secure Cookie with refresh token
        res.cookie('refresh', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 }); // remove 'secure: true' for thunderClient endpoint testing
        // res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 1000 });
        res.cookie('username', username, { httpOnly: false, secure: true, sameSite: 'Strict', maxAge: 60 * 60 * 1000 });
        // Add a logic to check if the user is an admin, if yes, redirect to the adminDashboard
        if (roles.includes(ROLES_LIST.Admin)) {
            res.redirect(`/adminDashboard?accessToken=${ accessToken }&username=${ username }`);
        }
        // Add a logic to check if the user is an editor, if yes, redirect to the editorDashboard
        else if (roles.includes(ROLES_LIST.Editor)) {
            res.redirect(`/editorDashboard?accessToken=${ accessToken }&username=${ username }`);
        }
        // If the user is neither an admin nor an editor, redirect to the calendar
        else {
            res.redirect(`/calendar?accessToken=${ accessToken }&username=${ username }`);
        }

    } else {
        return res.status(401).send(`
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                  .error-message { font-size: 24px; color: red; font-weight: bold; }
                </style>
              </head>
              <body>
                <p class="error-message">Wrong Passcode</p>
              </body>
            </html>
          `);
    }
}

module.exports = { handleLogin };