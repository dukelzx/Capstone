import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import styles from "./App.module.css";
import { mockSearchResults, mockPlaylist } from "../../data/mockData";
import Spotify from "../../utils/Spotify";
function App() {
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState(mockPlaylist);
  const addTrack = (track) => {
    const isExist = playlistTracks.find(
      (savedTrack) => savedTrack.id === track.id
    );
    if (isExist) return;
    setPlaylistTracks([...playlistTracks, track]);
  };
  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
  };
  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };
  const savePlaylist = () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  };
  const search = (term) => {
    Spotify.search(term).then(results => {
      console.log("Search results:", results);
      setSearchResults(results); 
    })
    .catch(error => {
    console.error("Search failed:", error); })
  };
  return (
    <div className={styles.App}>
      <h1>Zane React App</h1>
      <SearchBar onSearch={search} />
      <div className={styles.main}>
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
