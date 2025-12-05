import { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar(props) {
  const [term, setTerm] = useState("");
  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };
  const search = () => {
    if (term) {
      props.onSearch(term);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };
  return (
    <div className={styles.SearchBar}>
      <input
        value={term}
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.SearchButton} onClick={search}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
