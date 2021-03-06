const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mernSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    lasttname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email already exists"],
        trim: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("enter valid email");
            }
        }
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        min: [10,"enter 10 valid phone number"],
    },
    age: {
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    re_password:{
        type: String,
        required: true,
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
});

// generating tokens
mernSchema.methods.genterateAuthToken = async function(){
    try {
        
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token);
        
        // this.tokens = this.tokens.concat({token:token})
        this.tokens = this.tokens.concat({token})
        await this.save();

        return token;

    } catch (err) {
        res.status(401).send(`The error with JWT is ${err}`);
        console.log(`The error with JWT is ${err}`);
    }
}


// the 'pre' method takes two parameter
// 1. condition
// 2. callback function

// When the fiven condition method is called before that this callback is executed
// The callback takes a parameter 'next' 
// At the end of the function next(); is to be called so as to continue with the next process

// isModified(<arg>)  takes an argument and checks for any modification
// only when it is satisfied the code executes

// Here 'pre()' and 'next()' act like "middleware"

mernSchema.pre('save', async function(next){

    if (this.isModified("password")) {
        // console.log(`original password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        this.re_password = await bcrypt.hash(this.re_password,10);;
        // console.log(`original password ${this.password}`);
    }

    next();

})

const Detail =  mongoose.model('Detail',mernSchema);

module.exports = Detail