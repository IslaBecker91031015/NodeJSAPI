import mongoose from 'mongoose';

// create Schema
const Schema = mongoose.Schema;

// User Schema (export and create schema at same time)
export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a First Name'
    },
    lastName: {
        type: String,
        required: 'Enter an Last Name'
    },
    email: {
        type: String,
        required: 'Enter an Email Address',
        unique: true,
        // email validation
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: 'Enter a password'
    },
});

// Playlist Schema
export const PlaylistSchema = new Schema({
    playlistName: {
        type: String,
        required: 'Enter a playlist name'
    },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

// Song
export const SongSchema = new Schema({
    songTitle: {
        type: String,
        required: 'Enter a song name'
    },
    duration: {
        type: Number,
        required: 'Enter a duration'
    },
    album: { type: Schema.Types.ObjectId, ref: 'Album' }
});

// Album
export const AlbumSchema = new Schema({
    albumTitle: {
        type: String,
        required: 'Enter an album name'
    },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist' }
});

// Artist
export const ArtistSchema = new Schema({
    artistName: {
        type: String,
        required: 'Enter an artist name'
    },
});