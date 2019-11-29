import { 
    addNewPlaylist,
    getPlaylists,
    getPlaylistWithID,
    updatePlaylistName,
    getPlaylistTracks,
    addPlaylistTracks,
    deletePlaylist,
    deletePlaylistTracks,

    addAlbum,
    getAlbums,
    getAlbumWithId,
    getAlbumsTracks,

    addNewArtist,
    getArtists,
    getArtistWithID,

    addSong,
    getSongs, 
    getSongWithID,
    deleteSongWithID,
  
} from '../controllers/crmController';
import { 
    userSignup, userLogin, getUsers, getUserWithID, updateUser,
    deleteUser, getUserPlaylists, } from '../controllers/usersController';

const auth = require('../auth/auth');
const routes = (app) => {
    
    // Users
    app.route('/signup',)
    .post(userSignup);
    app.route('/login')
    .post(userLogin);
    app.route('/users')
    .get(auth, getUsers);

    // Users by Id
    app.route('/users/:userId') 
    .get(auth, getUserWithID)
    .put(auth, updateUser)
    .delete(auth, deleteUser);

    // User's Playlist
    app.route('/users/:userId/playlists')
    .post(auth, addNewPlaylist)
    .get(auth, getUserPlaylists);
    
    //Playlists
    app.route('/playlists')
    .get(auth, getPlaylists);

    // Playlists by Id
    app.route('/playlists/:playlistId')
    .get(auth, getPlaylistWithID)
    .put(updatePlaylistName)
    .post(auth, addPlaylistTracks)
    .delete(auth, deletePlaylist);

    // Playlist tracks
    app.route('/playlists/:playlistId/tracks')
    .get(auth, getPlaylistTracks);
    app.route('/playlists/:playlistId/tracks/:trackId')
    .delete(auth, deletePlaylistTracks);

    // Albums
    app.route('/albums')
    .post(auth, addAlbum)
    .get(auth, getAlbums);
    
    //Album by Id
    app.route('/albums/:albumId')
    .get(auth, getAlbumWithId);
    // Album tracks
    app.route('/albums/:albumId/tracks')
    .get(auth, getAlbumsTracks);

    // Artists
    app.route('/artists')
    .post(auth, addNewArtist)
    .get(auth, getArtists);
    // Artist by Id
    app.route('/artists/:artistId')
    .get(auth, getArtistWithID);

    // Songs
    app.route('/songs')
    .post(auth, addSong)
    .get(auth, getSongs);
    // Songs by Id
    app.route('/songs/:songId')
    .get(auth, getSongWithID)
    .delete(auth, deleteSongWithID);
}

export default routes;
