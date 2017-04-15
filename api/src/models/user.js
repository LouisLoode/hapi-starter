import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

// set up a mongoose model
const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        index: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        index: true
    },
    connectionsTokens: { type: Array },
    connections: {
        facebook: { type: String, default: null }
    },
    rights: {
        type: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    pictures: {
        avatar: { type: String, default: null },
        cover: { type: String, default: null }
    },
    infos: {
        description: { type: String, default: null },
        location: { type: String, default: null },
        gender: { type: String, default: null }
    },
    // filters: [{type: Schema.ObjectId, ref: 'Filter'}],
    preferences: [{
        id: { type: Schema.ObjectId, ref: 'Filter' },
        number: { type: Date, default: Date.now }
    }],
    story: [
        {
            id: { type: Schema.ObjectId, ref: 'Product' },
            date: { type: Date, default: Date.now }
        }],
    swiplist: [{ type: Schema.ObjectId, ref: 'Product' }],
    favorites: [{ type: Schema.ObjectId, ref: 'Product' }],
    likes: [{ type: Schema.ObjectId, ref: 'Product' }],
    dislikes: [{ type: Schema.ObjectId, ref: 'Product' }],
    updatedAt: {
        type: Date,
        autoValue: () => {
          if (this.isUpdate) {
            return new Date();
          }
        },
        denyInsert: true,
        optional: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: false // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret.password;
         delete ret.connections;
         delete ret.connectionsTokens;
         delete ret.pictures;
        //  delete ret.swiplist;
         delete ret.dislikes;
         delete ret.likes;
         delete ret.story;
         delete ret.preferences;
         delete ret.rights;
         delete ret._id;
         delete ret.__v;
     }
});


/**
 * Password hash middleware.
 */
 // UserSchema.pre('save', function (next) {
 //   // console.log(this);
 //   // console.log('Do anything...');
 //   var user = this;
 //   if (!user.isModified('password')) { return next(); }
 //   bcrypt.hash(user.password, 10, function(err, hash) {
 //     if (err) { return next(err); }
 //       // Store hash in your password DB.
 //       user.password = hash;
 //       next();
 //   });
 // });

/**
 * Middleware for updating the date.
 */
UserSchema.pre('update', function() {

  this.update({},{ $set: { updated: new Date() } });
  
});

/**
 * Action after all
 */
UserSchema.pre('save', function (next) {

  // console.log(this);

  next();
});

Mongoose.model('User', UserSchema);
