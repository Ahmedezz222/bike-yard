import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Mountain Bikes', 'Road Bikes', 'Electric Bikes', 'Kids Bikes', 'Accessories', 'Parts'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema); 