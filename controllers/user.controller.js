const User = require('../models/user')
const catchAsync = require('../helpers/watchAsync')
const { StatusCodes } = require('http-status-codes')


const createUser = catchAsync(async (req, res) => {
    const user = await User(req.body);
    try{
        const authToken = await user.generateAuthTokenAndSaveUser();
        res.json({
            status: 'success',
            data: { user, authToken }
        });
    }catch(error){
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
    
})

const loginUser = catchAsync(async (req, res) => {
    console.log('Tentative de connexion avec:', req.body);
    
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        console.log('Utilisateur trouvé:', user);
        const authToken = await user.generateAuthTokenAndSaveUser();
        res.json({
            status: 'success',
            data: { user, authToken }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error.message);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

const logoutUser = catchAsync(async (req, res) => {
    try {
        // Vérification des données d'authentification
        if (!req.user || !req.authToken) {
            throw new Error('Session invalide');
        }

        // Vérification si le token existe dans la liste
        const initialLength = req.user.authToken.length;
        req.user.authToken = req.user.authToken.filter(
            tokenObj => tokenObj.authToken !== req.authToken
        );

        // Si aucun token n'a été supprimé
        if (initialLength === req.user.authToken.length) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'error',
                message: 'Token non trouvé ou déjà supprimé'
            });
        }

        await req.user.save();
        
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Déconnexion réussie',
            data: {
                userId: req.user._id,
                remainingSessions: req.user.authToken.length
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message || 'Erreur lors de la déconnexion'
        });
    }
});

const logoutAllUser = catchAsync(async (req, res) => {
    try {
        // Vérification des données d'authentification
       req.user.authToken = [];
        await req.user.save();
        
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Déconnexion réussie',
            data: {
                userId: req.user._id,
                remainingSessions: req.user.authToken.length
            }
        });
        
    }catch(error){
        console.error('Erreur lors de la déconnexion:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message || 'Erreur lors de la déconnexion'
        });
        
    }
})
    

const getAllUsers = catchAsync(async (req, res) => {
    const allUsers = await User.find();
    res.send(allUsers);
})

const getUser = catchAsync(async (req, res) =>{
    res.send(req.user)
})


const getUserById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(StatusCodes.NOT_FOUND).send("User non trouvé")
        return;
    }
    res.send(user);
})

const updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!user){
        res.status(StatusCodes.NOT_FOUND).send("User non trouvé")
        return;
    }
    res.send(user);
})

const deleteUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        res.status(StatusCodes.NOT_FOUND).send("User non trouvé")
        return;
    }
    res.send(user);
})


module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    logoutUser,
    logoutAllUser
}