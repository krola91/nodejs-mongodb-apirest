const mongoose = require("mongoose");

const crudSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  tech: {
    type: String,
    require: true,
  },
  sub: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Crud', crudSchema)
