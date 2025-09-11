const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authentification = async (req, res, next) => {
    try {
        // Vérifie la présence du header Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('Aucun header Authorization trouvé');
            throw new Error('Token manquant');
        }

        // Vérifie le format du token
        if (!authHeader.startsWith('Bearer ')) {
            console.log('Format de token invalide');
            throw new Error('Format de token invalide');
        }

        // Extrait le token
        const authToken = authHeader.replace('Bearer ', '');
        
        // Vérifie et décode le token
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        
        // Recherche l'utilisateur avec ce token
        const user = await User.findOne({
            _id: decodedToken._id,
            'authToken.authToken': authToken
        });

        if (!user) {
            console.log('Utilisateur non trouvé avec ce token');
            throw new Error('Session invalide');
        }

        // Ajoute l'utilisateur et le token à la requête
        req.user = user;
        req.authToken = authToken;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error.message);
        res.status(StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            message: error.message || 'Authentification requise'
        });
    }
}

module.exports = authentification;