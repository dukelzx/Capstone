import Tracklist from "../Tracklist/Tracklist";
import styles from "./SearchResults.module.css";
import { mockSearchResults } from "../../data/mockData";

function SearchResults() {
  return (
    <div className={styles.SearchResults}>
      <h2>Results</h2>
      <Tracklist tracks={mockSearchResults} />
    </div>
  );
}

export default SearchResults;
