import Tracklist from "../Tracklist/Tracklist";
import styles from "./Playlist.module.css";
import { mockPlaylist } from "../../data/mockData";
function Playlist() {
  return (
    <div className={styles.Playlist}>
      <h2>My Playlist</h2>
       <Tracklist tracks={mockPlaylist} />
      <button>Save To Spotify</button>
    </div>
  );
}

export default Playlist;
