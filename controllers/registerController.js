const User = require('../model/User');
const bcrypt = require('bcryptjs');


const handleNewUser = async (req, res) => {
    const { user, pwd, roles } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        // return res.status(400).send('Username is already taken.'); //Conflict 
        return res.status(400).send(`
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                  .error-message { font-size: 40px; color: red; font-weight: bold; }
                </style>
              </head>
              <body>
                <h3 class="error-message">User Name already taken. Try a new Name.</h3>
                
              </body>
            </html>
          `); //Conflict 
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
        // res.render('confirmRegistration', { username: result.username });
        // res.status(201).json({ 'success': `New user ${user} created!` });
        res.status(201).send(`
            <html>
              <head>
                <style>
                  body { font-family: Raleway, Arial, sans-serif; text-align: center; margin-top: 100px; }
                  .success-message { font-size: 40px; color: green; font-weight: bold; }
                </style>
              </head>
              <body>
                <h3 class="success-message">New user ${user} created!</h3>
                <a href="/register" style="font-size: 36px; color: blue; text-decoration: underline;">Register another user</a><br>
                <a href="/adminDashboard" style="font-size: 36px; color: blue; text-decoration: underline;">Back to Dashboard</a>
              </body>
            </html>
          `);

    } catch (err) {
        console.error('Error registering new user:', err);
        res.status(500).send('An error occurred while registering the new user.');
    }
}
   

module.exports = { handleNewUser };