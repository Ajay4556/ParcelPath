import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Trip ID is required.'],
    ref: 'Trip'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required.'],
    ref: 'User'
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required.'],
    min: [0, 'Weight cannot be negative.']
  },
  calculatedPrice: {
    type: Number,
    required: [true, 'Calculated price is required.'],
    min: [0, 'Calculated price cannot be negative.']
  },
  shippingAddress: {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required.'],
      trim: true
    },
    aptNumber: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required.'],
      trim: true
    },
    zip: {
      type: String,
      required: [true, 'ZIP code is required.'],
      trim: true,
      match: [/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Please enter a valid Canadian postal code.']
    }
  },
  pickupAddress: {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required.'],
      trim: true
    },
    aptNumber: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required.'],
      trim: true
    },
    zip: {
      type: String,
      required: [true, 'ZIP code is required.'],
      trim: true,
      match: [/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Please enter a valid Canadian postal code.']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Checkout = mongoose.model('Checkout', checkoutSchema);
export default Checkout;