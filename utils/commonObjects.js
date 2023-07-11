const addressObject = {
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  flatNumber: {
    type: String,
    required: true
  }
};

module.exports = { addressObject };
