const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(v){
            if(!validator.isEmail(v)) throw new Error('Email invalide');
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Ne valider que si le mot de passe est nouveau ou modifié
                return this.isNew || this.isModified('password')
                    ? validator.isLength(v, {min: 6, max: 12})
                    : true;
            },
            message: 'Le mot de passe doit contenir entre 6 et 12 caractères'
        }
    },
    authToken: [{
        authToken:{
            type: String,
            required: true
        }
    }]
})


userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.authToken;
    return user;
};

userSchema.methods.generateAuthTokenAndSaveUser = async function(){
    const authToken = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET);
    this.authToken.push({authToken});
    await this.save();
    return authToken;
};

userSchema.statics.findUser = async function(email, password) {
    const user = await this.findOne({email})
    if(!user) throw new Error('Utilisateur non trouvé');
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if(!isPasswordvalid) throw new Error('Mot de passe invalide');
    return user;
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});




module.exports = mongoose.model('User', userSchema);
