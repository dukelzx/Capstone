import styles from "./Track.module.css";

function Track(props) {
  const addTrack = () => {
    props.onAdd(props.track);
  };
  const removeTrack = () => {
    props.onRemove(props.track);
  };
  const renderAction = () => {
    if (props.isRemoval) {
      return <button className={styles.TrackAction} onClick={removeTrack}>-</button>;
    } else {
      return (
        <button className={styles.TrackAction} onClick={addTrack}>
          +
        </button>
      );
    }
  };
  return (
    <div className={styles.Track}>
      <div className={styles.TrackInformation}>
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;
