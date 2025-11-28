import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <h1>Jammming</h1>
      <SearchBar />
      <div className={styles.main}>
        <SearchResults />
        <Playlist />
      </div>
    </div>
  );
}

export default App;
