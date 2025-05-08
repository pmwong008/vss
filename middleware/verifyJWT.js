const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // Extract token from Authorization header or cookie
    let token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]; // From header (e.g., "Bearer <token>")
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt; // From cookie
    }

    // If no token is found
    if (!token) {
        console.log('No token found in Authorization header or cookies.');
        return res.status(401).send(`
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                  .error-message { font-size: 48px; color: red; font-weight: bold; }
                  .link { font-size: 36px; color: blue; text-decoration: underline; }
                </style>
              </head>
              <body>
                <h3 class="error-message">Authentication Failed!</h3>
                <h3 class="link"><a href="/">Go to Home and Login</a></h3>
              </body>
            </html>
          `); // Unauthorized */
    }
    console.log('Token retrieved:', token)
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // if (err) return res.sendStatus(403); //invalid token
            if (err) return res.render('error', { message: 'Invalid token' }); // Forbidden

            // decoded.UserInfo.roles = Object.values(decoded.UserInfo.roles).filter(Boolean);
            req.user = decoded.UserInfo;
            console.log("Decoded User Info:", req.user); // Debugging            
            // Convert roles to an array for validation

            // req.user.roles = decoded.UserInfo.roles;
            // req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT