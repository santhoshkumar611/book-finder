import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("All");
  const [author, setAuthor] = useState("All");
  const [authorsList, setAuthorsList] = useState([]);

  // Fetch books from API
  const searchBooks = async () => {
    if (!query.trim()) {
      setError("Please enter a book name.");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);
    setFilteredBooks([]);
    setAuthorsList([]);
    setYear("All");
    setAuthor("All");

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No books found.");
      } else {
        const sliced = data.docs.slice(0, 40);
        setBooks(sliced);
        setFilteredBooks(sliced);

        // Create unique author list
        const uniqueAuthors = [
          ...new Set(
            sliced
              .filter((book) => book.author_name && book.author_name.length > 0)
              .map((book) => book.author_name[0])
          ),
        ].sort();

        setAuthorsList(uniqueAuthors);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  // Filter by year
  const handleYearFilter = (selectedYear) => {
    setYear(selectedYear);
    applyFilters(selectedYear, author);
  };

  // Filter by author
  const handleAuthorFilter = (selectedAuthor) => {
    setAuthor(selectedAuthor);
    applyFilters(year, selectedAuthor);
  };

  // Apply both filters together
  const applyFilters = (selectedYear, selectedAuthor) => {
    let filtered = [...books];

    if (selectedYear !== "All") {
      filtered = filtered.filter(
        (book) =>
          book.first_publish_year &&
          book.first_publish_year >= parseInt(selectedYear)
      );
    }

    if (selectedAuthor !== "All") {
      filtered = filtered.filter(
        (book) => book.author_name && book.author_name[0] === selectedAuthor
      );
    }

    setFilteredBooks(filtered);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem", padding: "1rem" }}>
      <h1>📚 Book Finder</h1>

      {/* Search bar */}
      <div style={{ margin: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title..."
          style={{
            padding: "0.5rem",
            width: "250px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={searchBooks}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Filters */}
      {books.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          {/* Year filter */}
          <div>
            <label htmlFor="year" style={{ marginRight: "10px", fontWeight: "bold" }}>
              Year:
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => handleYearFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="All">All</option>
              <option value="1980">After 1980</option>
              <option value="1990">After 1990</option>
              <option value="2000">After 2000</option>
              <option value="2010">After 2010</option>
              <option value="2020">After 2020</option>
            </select>
          </div>

          {/* Author filter */}
          <div>
            <label htmlFor="author" style={{ marginRight: "10px", fontWeight: "bold" }}>
              Author:
            </label>
            <select
              id="author"
              value={author}
              onChange={(e) => handleAuthorFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="All">All</option>
              {authorsList.map((a, index) => (
                <option key={index} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: "2rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #ccc",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading books...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            color: "red",
            background: "#ffe6e6",
            padding: "0.8rem",
            borderRadius: "8px",
            display: "inline-block",
            marginTop: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Books */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {filteredBooks.map((book, index) => (
          <div
            key={index}
            style={{
              width: "180px",
              background: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />
            <h3 style={{ fontSize: "1rem", marginTop: "0.5rem" }}>{book.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "gray" }}>
              {book.author_name ? book.author_name[0] : "Unknown Author"}
            </p>
            <p style={{ fontSize: "0.8rem", color: "gray" }}>
              {book.first_publish_year ? `Year: ${book.first_publish_year}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
