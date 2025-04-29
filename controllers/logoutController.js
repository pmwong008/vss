const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    console.log("Cookies found:", cookies);
    console.log("Cookies jwt found:", cookies.jwt, cookies.refresh);
    const refreshToken = cookies.refresh;
    if (!refreshToken) {
        return res.status(400).json({ message: "Invalid username provided." });
    }
   
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.redirect('/');
    }
    

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.redirect('/');
}

module.exports = { handleLogout }