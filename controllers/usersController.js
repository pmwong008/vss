const User = require('../model/User');
const bcrypt = require('bcryptjs');


const getAllUsers = async (req, res) => {
    const users = await User.find();
    console.log('This is the type of users fetched from DB:', typeof users); // Debugging
    if (!users || users.length === 0) {
        return res.render('noUser', { message: 'No user found' }); // Render a separate view if no users exist    res.json(users);
    }

    // Understanding Mongoose properties
    users.forEach(user => {
        console.log("User with Mongoose properties:", user);
        console.log("Raw document data (_doc):", user._doc);
    });
    

    const mappedUsers = users.map( e => ({
        ...e._doc,
        roles: Object.keys(e.roles)
        .filter(role => e.roles[role] !== undefined)
        .filter((role, _, arr) => role !== "User" || (arr.includes("Admin") || arr.includes("Editor") ? false : true))

    })); 

    console.log('This is the mapped users:', mappedUsers); // Debugging
    res.render('allUsers', { users: mappedUsers, title: 'All Users' });
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.body; // Get ID from request body
        const loggedInUsername = req.user.username; // Retrieve logged-in user's username

        if (!id) return res.status(400).json({ message: 'User ID required' });

        // Fetch user details before deletion
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: `User ID ${id} not found` });
        }

        // Prevent admin from deleting himself based on username
        if (userToDelete.username === loggedInUsername) {
            // return res.status(403).json({ message: 'You cannot delete yourself!' });
            return res.status(403).send(`
                <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                      .error-message { font-size: 48px; color: red; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <h3 class="error-message">You cannot delete yourself!</h3>
                    <h3><a href="/users">Back to User List</a></h3>
                  </body>
                </html>
              `); 
        }

        const deletedUsername = userToDelete.username; // Store username before deletion
        
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: `User ID ${id} not found` });
        }

        // Fetch updated user list after deletion
        // const updatedList = await User.find();
        res.render('confirmDeleteUser', { deletedUsername, message: `User '${deletedUsername}' was deleted successfully` });
        // res.render('confirmDeleteUser', { message: `User ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
};

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const updateUserRole = async (req, res) => {
    try {
        const { id, role } = req.body; // Get user ID and new role from request
        console.log('Update User Role route hit! ID received:', id, 'Role:', role); // Debug ID and role

        if (!id || !role) return res.status(400).json({ message: 'User ID and role are required.' });

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: `User ID ${id} not found.` });
        }

        console.log('User found:', user); // Debug user

        // Define role mapping (if needed)
        const roleMapping = {
            User: 2001,
            Editor: 1984,
            Admin: 5150
        };

        if (!roleMapping[role]) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

        // Set the specific role inside roles object
        user.roles = { [role]: roleMapping[role] }; // Updating only the selected role

        await user.save(); // Save changes to the database

        // Fetch updated user list
        // const users = await User.find();
        res.render('confirmUpdateUserRole', { username: user.username, roles: role});
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
};

const updateUserRemarks = async (req, res) => {
    try {
        const { id, remarks } = req.body; // Get user ID and remarks from request

        if (!id) return res.status(400).json({ message: 'User ID is required.' });

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: `User ID ${id} not found.` });
        }

        user.remarks = remarks; // Update remarks field
        await user.save(); // Save changes

        // Fetch updated user list
        // const users = await User.find();
        res.render('confirmUpdateRemarks', { username: user.username, remarks: user.remarks});
    } catch (error) {
        console.error('Error updating user remarks:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
};

const getUpdatePasswordPage = async (req, res) => {
    // This function serves the update password page
    // It can be used to render a view or return a message
    console.log('Serve Update Password Page route hit!'); // Debugging
    const { username } = req.user; // Get username from authenticated user
    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }
    // Find the user by username
    const user = await User.findOne({ username }); 
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.render('updatePassword', { user, title: 'Update Password' });
}

const postUpdatePasswordPage = async (req, res) => {
    // This function is not implemented yet
    // Authenticate the user, validate the new password, and update it in the database
    // You can use bcrypt to hash the new password before saving it
    console.log('Update Password post route hit!'); // Debugging
    try {
        const { username } = req.user; // Get username from authenticated user
        const user = await User.findOne({ username }); // Assuming req.params.id is the user ID
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log('User found:', user); // Debugging
        // Assuming req.body contains the current password and new password
        const { currentPassword, newPassword, newPassword2 } = req.body; // Get user ID and new password from request
        if (!req.body.currentPassword || !req.body.newPassword || !req.body.newPassword2) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        
        console.log('Received data:', { currentPassword, newPassword, newPassword2 }); // Debugging
        
        // Validate input
        const isMatch = await bcrypt.compare(currentPassword, user.password); // Compare current password with stored hash
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }
        if (newPassword !== newPassword2) {
            return res.status(400).json({ message: 'New passwords do not match.' });
        }

        if (newPassword === currentPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
        }
        if (newPassword === user.username) {
            return res.status(400).json({ message: 'New password cannot be the same as the username.' });
        }


        // Hash the new password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // Update password field

        await user.save(); // Save changes
        res.render('confirmUpdatePassword', { user: user.username, message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
    
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUserRole,
    updateUserRemarks,
    getUpdatePasswordPage,
    postUpdatePasswordPage
}