import Tracklist from "../Tracklist/Tracklist";
import styles from "./SearchResults.module.css";

function SearchResults(props) {
  return (
    <div className={styles.SearchResults}>
      <h2>Results</h2>
      <Tracklist
        tracks={props.searchResults}
        onAdd={props.onAdd}
        isRemoval={false}
      />
    </div>
  );
}

export default SearchResults;
