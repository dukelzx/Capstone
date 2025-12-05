import Track from "../Track/Track";
import styles from "./Tracklist.module.css";

function Tracklist(props) {
  return (
    <div className={styles.Tracklist}>
      {props.tracks &&
        props.tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            onAdd={props.onAdd}
            onRemove={props.onRemove}
            isRemoval={props.isRemoval}
          />
        ))}
    </div>
  );
}

export default Tracklist;
