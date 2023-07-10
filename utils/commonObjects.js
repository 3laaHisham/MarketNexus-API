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
};

module.exports = { addressObject };
