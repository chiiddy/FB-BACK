import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {type: String, required: true },
  surname: {type: String, required: true},
  number: {type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 8, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  
});

const user_model = mongoose.model('sfaceBook', UserSchema);

export default user_model;