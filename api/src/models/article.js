import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

// set up a mongoose model
const ArticleSchema = new Schema({
  title: {
      type: String,
      required: true,
    },
  category: {
      type: String,
      enum: ['Blog', 'Sale', 'Brand'],
      default: 'Blog',
      required: true
      },
  short_text: {
      type: String,
    },
  content: {
      type: String,
      required: true
    },
  picture: {
      type: String,
      required: true
    },
  url: {
      type: String,
      required: true
    },
  product_id: {
      type: Schema.ObjectId,
      ref: 'Product',
      required: true
    },
  activated: {
      type: Boolean,
      default: false
    }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
ArticleSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});

// ArticleSchema.pre('save', function (next) {
//   // console.log(this);
//    console.log('Do anything...');
//   next();
// });

Mongoose.model('Article', ArticleSchema);
