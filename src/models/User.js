/* Imports */
import mongoose from 'mongoose';

/* Initialization */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  faceOpt: {
    type: Boolean,
    default: false
  },
  faceEncoding: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('users', UserSchema, 'users');

/* Exports */
export default User;
