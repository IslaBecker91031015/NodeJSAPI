import mongoose from 'mongoose';
import {    PlaylistSchema, SongSchema, ArtistSchema, AlbumSchema 
        } from '../models/crmModel'; 
const Song = mongoose.model('Song', SongSchema);
const Artist = mongoose.model('Artist', ArtistSchema);
const Album = mongoose.model('Album', AlbumSchema);
const Playlist = mongoose.model('Playlist', PlaylistSchema);

// SONGS - New Song
export const addSong = (req, res, next) => {
  let newSong = new Song(req.body);
    newSong.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: 'New Song Created',
        song: newSong
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            error: err
        })
    })
};

// Get Songs
export const getSongs = (req, res, next) => {
    Song.find()
    .select('_id songTitle duration album') // fields retrieved
    .populate({
        path: 'album', select: 'albumTitle',
        populate: { path: 'artist', select: 'artistName' }
    })
    .exec()
    .then(songs => {
        console.log(songs);
        res.status(200).json(songs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};

// Get Songs with ID
export const getSongWithID = (req, res, next) => {
    const id = req.params.songId;
    Song.findById(id) 
        .select('_id songTitle duration album') // fields retrieved
        .populate({
            path: 'album', select: 'albumTitle',
            populate: { path: 'artist', select: 'artistName'}
        })
        .exec()
        .then(song => {
            res.status(200).json(song);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message:'Invalid Song'});
    });
    
};

// Delete Songs
export const deleteSongWithID = (req, res, next) => {
    const id = req.params.songId;
    Song.remove({ _id: id }) 
        .exec()
        .then(result =>{
            console.log(result);
            res.status(200).json({
            message: 'Song Successfully Deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message:'Invalid Song'
            });
        });
};

// ALBUMS - New Album
export const addAlbum = (req, res, next) => {
    let newAlbum = new Album(req.body);
    newAlbum.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: 'New Album created',
        album: newAlbum
       })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            error: err
        })
    })
};
  
// Get Albums
export const getAlbums = (req, res, next) => {
    Album.find()
    .select('_id albumTitle artist') // fields retrieved
    .populate('artist', 'artistName') 
    .exec()
    .then(album => {
        console.log(album);
        res.status(200).json(album);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};
  
// Get Album with ID
export const getAlbumWithId = (req, res, next) => {
    const id = req.params.albumId;
    Album.findById(id) 
        .select('_id albumTitle artist') // fields retrieved
        .populate('artist', 'artistName')
        .exec()
        .then(album => {
            res.status(200).json(album);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message:'Invalid Album'});
    });
};

// Get Album's Songs
export const getAlbumsTracks = (req, res, next) => {
    const id = req.params.albumId;
    Song.find({ album: id }) 
        .select('_id songTitle duration album') // fields retrieved
        .populate('album', 'albumTitle')   
        .exec()
        .then(song => {
            res.status(200).json(song);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message: 'Invalid'
            });
    });
};

 
//PLAYLIST Add New Playlist
export const addNewPlaylist = (req, res, next) => {
    const user = req.params.userId;
    let newPlaylist = new Playlist({
        playlistName: req.body.playlistName,
        user: user,
        songs: req.body.songs
    });
    newPlaylist.save();
    res.status(201).json({
        message: 'New Playlist created',
        playlist: newPlaylist
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            error:err });
    });
};


// Get Playlists
export const getPlaylists = (req, res, next) => {
    Playlist.find()
    .select('_id playlistName user') // fields retrieved
    .populate('user', 'firstName') // fields retrieved
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            error: err
        })
    })
};


// Get Playlist With ID
export const getPlaylistWithID = (req, res) => {
    const id = req.params.playlistId;
    Playlist.findById(id) 
        .select('_id playlistName user') // fields retrieved
        .populate('user', 'firstName') // fields retrieved
        .exec()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message: 'Playlist Invalid'});
    });
};
// Update Playlist Name
export const updatePlaylistName = (req, res) => {
    const id = req.params.playlistId;
    const newName = req.body.playlistName;
    Playlist.findByIdAndUpdate(id,  
        { $set: { playlistName: newName}
        })
        .select('_id playlistName user') // fields retrieved
        .populate('user', 'firstName') // fields retrieved
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json({
                message: 'Playlist Name Updated',
                newName
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
    });
};

// Get Playlist Tracks
export const getPlaylistTracks = (req, res, next) => {
    const id = req.params.playlistId;
    Playlist.findById(id) 
        .select('_id playlistName user songs') // fields retrieved
        .populate({  
            path: 'songs', select: 'songTitle', 
            populate: { 
                path: 'album', select: 'albumTitle, artist',
                populate: { 
                    path: 'artist', select: 'artistName'}
            }
        })
        .exec()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message: 'Playlist Invalid'});
    });
};

// Add Tracks to Playlist
export const addPlaylistTracks = (req, res) => {
    const id = req.params.playlistId;
    const newSongs = req.body;
    // update playlist, keep ID
    Playlist.update({ _id: id },
        {$push: newSongs })
        .exec()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Song Added',
                newSongs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message:'Invalid Song'});
        }); 
        
};

// Delete Playlist Tracks
export const deletePlaylistTracks = (req, res) => {
    const id = req.params.playlistId;
    const track = req.params.trackId;
    // update playlist
    Playlist.update({ _id: id },
        {$pull:  { songs : track } 
    })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Track Deleted From Playlist Successfully'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            message: 'Invalid'});
    });
}

// Delete Playlist
export const deletePlaylist = (req, res) => {
    Playlist.remove({ _id: req.params.playlistId })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Playlist Deleted Successfully'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            message: 'Invalid Playlist'});
    });
}

//ARTIST
// Add New Artist
export const addNewArtist = (req, res, next) => {
    let newArtist = new Artist(req.body);
    
    newArtist.save();
    res.status(201).json({
        message: 'New Artist created',
        artist: {
            _id: newArtist._id,
            artistName: newArtist.artistName
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({error:err});
    });
};

// Get Artists
export const getArtists = (req, res, next) => {
    Artist.find()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            error: err
        })
    })
};

// Get Artist with ID
export const getArtistWithID = (req, res, next) => {
    const id = req.params.artistId;
    Artist.findById(id) 
        .exec()
        .then(artist => {
            res.status(200).json(artist);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                message:'Invalid Artist'});
    });
};

