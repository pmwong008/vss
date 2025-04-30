const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users || users.length === 0) {
        return res.render('noUser', { message: 'No user found' }); // Render a separate view if no users exist    res.json(users);
    }
    res.render('allUsers', { users, title: 'All Users' });
}

/* const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    
    try {
        const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await User.deleteOne({ _id: req.body.id });
    res.render('confirmDelete', { user, message: `User ${req.body.id} deleted successfully` });

    } catch {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
    
    
} */

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body; // Get ID from request body
        
        // Fetch the user before deleting to retain the username
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: `User ID ${id} not found` });
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

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}