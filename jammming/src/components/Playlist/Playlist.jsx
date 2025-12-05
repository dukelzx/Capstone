import { useState } from "react";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./Playlist.module.css";
function Playlist(props) {
  const [isEditing, setIsEditing] = useState(false);
  const handleNameChange = (event) => {
    props.onNameChange(event.target.value);
  };
  const handleBlur = () => {
    if (props.playlistName.trim() === "") {
      props.onNameChange("New Playlist");
    }
    setIsEditing(false);
  };
  return (
    <div className={styles.Playlist}>
      {isEditing ? (
        <input
          value={props.playlistName}
          onChange={handleNameChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>{props.playlistName}</h2>
      )}
      <Tracklist
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true}
      />
      <button className={styles.PlaylistSave} onClick={props.onSave}>
        Save To Spotify
      </button>
    </div>
  );
}

export default Playlist;
