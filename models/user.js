const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({
    email:{
        type: String,
        required: true

    }
});
UserSchema.plugin(passportLocalMongoose);   //this automatically adds username hashing and salting to the password and the account.
module.exports = mongoose.model('User', UserSchema);