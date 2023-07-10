const addressObject = {
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  flatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  landMark: {
    type: String,
    trim: true,
  },
  additionalInfo: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: Number,
    default: null,
    trim: true,
  },
};

module.exports = { addressObject };
