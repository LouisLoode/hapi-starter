const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Bcrypt = require('bcryptjs');

// set up a mongoose model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    apikey: { type: String, default: null },
    connectionsTokens: { type: Array },
    connections: {
        facebook: { type: String, default: null },
        twitter: { type: String, default: null }
    },
    rights: {
        type: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    pictures: {
        avatar: { type: String, default: null },
        cover: { type: String, default: null }
    },
    infos: {
        description: { type: String, default: null },
        location: { type: String, default: null },
        gender: { type: String, default: null },
        website: { type: String, default: null }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
UserSchema.options.toJSON = {
    transform(doc, ret) {

        ret.id = ret._id;
        delete ret.password;
        delete ret.social;
        delete ret.salt;
        delete ret.tokens;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        //  delete ret.pictures;
        //  delete ret.infos;
        delete ret._id;
        delete ret.__v;

    }
};

/**
 * Middleware for updating the date.
 */
UserSchema.pre('update',() => {

    this.update({},{ $set: { updated: new Date() } });
});

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = (password, encrypt) => {

    return Bcrypt.compareSync(password, encrypt);
};


module.exports = Mongoose.model('User', UserSchema);
