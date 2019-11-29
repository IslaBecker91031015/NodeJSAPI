import mongoose from 'mongoose';
// import schemas
import { UserSchema, PlaylistSchema } from '../models/crmModel'; 
const bcrypt = require('bcrypt'); // password encyption
const User = mongoose.model('User', UserSchema);
const Playlist = mongoose.model('Playlist', PlaylistSchema);
const jwt = require('jsonwebtoken');

// Add New User
export const userSignup = (req, res, next) => {
    User.find({email: req.body.email})       //check if email already used
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Email already Exists'
            });
        } else { 
            bcrypt.hash(req.body.password, 10, (err, hash) => {   // hash password  
                if(err){
                    return res.status(500).json({error: err});
                } else {    
                    const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                    }); 
                    newUser.save()   // save new user
                    .then(result =>{
                        console.log(result);    //return message + new user details
                        res.status(201).json({
                            message: 'New User Created',
                            'new user': newUser
                        });
                    })
                    .catch(err =>{       // catch error
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    })
};

// User Login
export const userLogin = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json ({
                message: 'Login Failed'
            });
        }
        // Check password
        bcrypt.compare(req.body.password, user[0].password, function(err, result){
            if (err){  
                return res.status(401).json ({   // failed Auth
                    message: 'Login Failed'
                });
            }
            if (result){
                const webtoken = jwt.sign({   //Jsonwebtoken
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, 
                {  
                    expiresIn: "1h"  // Set timeout
                });
                return res.status(200).json ({
                    message: 'Login Successful',    // Successful login message + token returned
                    token: webtoken
                });
            }
            res.status(401).json ({
                message: 'Login Failed'
            });
        })
    }) 
    .catch(err => {         // catch error
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

// Get All Users
export const getUsers = (req, res) => {
    User.find()
    .select('_id firstName lastName email') // Fields retrieved
    .exec()
    .then(users => {
        console.log(users);
        res.status(200).json(users);
    }) // catch error
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'Users Not Found'
        })
    })
};

// Get User With ID 
export const getUserWithID = (req, res) => {
    const id = req.params.userId;
    User.findById(id) 
        .select('_id firstName lastName email') 
        .exec()
        .then(song => {
            res.status(200).json(song);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({message: 'User Not Found'});
    });
}

// Update User 
export const updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId}, 
        req.body, { new: true })
        .select('_id firstName lastName email') 
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json({
                message: 'User Details Updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({message: 'User Invalid'});
    });
}

//***
export const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.userId) 
    .select('_id firstName lastName email') 
    .exec()
    .then(results => {console.log(results);
        res.status(200).json({
            message: 'User Successfully Deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            message: 'User Invalid'});
});
};

// Get User's Playlists
export const getUserPlaylists = (req, res) => {
    const id = req.params.userId;
    Playlist.find({ user : id  }) 
        .select('_id playlistName songs user') // fields retrieved
        .populate('user', 'firstName') // fields retrieved
        .populate('songs', 'songTitle') 
        .exec()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message: 'User Invalid'});
        });
};
