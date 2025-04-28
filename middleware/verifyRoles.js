/* const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
} */

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) return res.sendStatus(403); // Forbidden
        const rolesArray = Array.isArray(req.user.roles) ? req.user.roles : Object.values(req.user.roles);

        // Check if the user has at least one of the allowed roles
        const hasRole = rolesArray.some(role => allowedRoles.includes(role));
        if (!hasRole) return res.sendStatus(403); // Forbidden

        next();
    };
};
    
    
       

module.exports = verifyRoles