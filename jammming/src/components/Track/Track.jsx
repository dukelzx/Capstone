import styles from "./Track.module.css";

function Track({ track }) {
  return (
    <div className={styles.Track}>
      <p>{track.name} by {track.artist} ({track.album})</p>
      <button>Add</button>
    </div>
  );
}

export default Track;
