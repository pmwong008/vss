const User = require('../model/User');
const bcrypt = require('bcryptjs');


const handleNewUser = async (req, res) => {
    const { user, pwd, roles } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.status(400).send('Username is already taken.'); //Conflict 
    }
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        
        // Assign roles based on form input
        let roleData = { User: 2001 }; // Default role
        if (roles === "Editor") {
            roleData = { User: 2001, Editor: 1984 };
        } else if (roles === "Admin") {
            roleData = { User: 2001, Admin: 5150 };
        }

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd,
            "roles": roleData
        });

        console.log('New user registered:', result);
        res.render('confirmRegistration', { username: newUser.username });
        // res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        console.error('Error registering new user:', err);
        res.status(500).send('An error occurred while registering the new user.');
    }
}

module.exports = { handleNewUser };