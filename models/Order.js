const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: ''
  },
  list: [
    {
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      cost: {
        type: Number
      }
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

// odk9JYdygYvbQ0KC Maksym

module.exports = mongoose.model('orders', categorySchema)