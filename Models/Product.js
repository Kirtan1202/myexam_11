const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  Upload: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|gif)$/.test(v); // Validate file extension
      },
      message: props => `${props.value} is not a valid image file!`
    }
  } 
});

module.exports = mongoose.model('product_info', productSchema);
