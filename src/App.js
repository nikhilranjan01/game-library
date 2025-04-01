import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Form, FormControl, Button, Card, Dropdown, Pagination } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Sidebar Filters Component
const SidebarFilters = ({ setCategory, setTag }) => {
  const [category, setCategoryState] = useState("All");
  const [tag, setTagState] = useState("All");

  const handleCategoryChange = (selectedCategory) => {
    setCategoryState(selectedCategory);
    setCategory(selectedCategory);  // Update parent state
  };

  const handleTagChange = (selectedTag) => {
    let formattedTag = selectedTag.toLowerCase().replace(" ", "-"); 
  
    // Manually handle known exceptions
    if (selectedTag === "Single-player") {
      formattedTag = "singleplayer"; // Try this if "single-player" isn't working
    }
  
    setTagState(selectedTag);
    setTag(formattedTag);
  };
  

  return (
    <div className="filters">
      <h5>Filters</h5>

      {/* Category Filter */}
      <div>
        <h6>Category</h6>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="category-dropdown">
            {category}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleCategoryChange("Action")}>Action</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("RPG")}>RPG</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("Sports")}>Sports</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Tags Filter */}
      <div>
        <h6>Tags</h6>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="tag-dropdown">
            {tag}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleTagChange("Multiplayer")}>Multiplayer</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTagChange("Single-player")}>Single-player</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

const App = () => {
  // State for category, tag, search, and game data
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  // Fetch games based on category, tag, search query, and current page
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const apiKey = "0ba9da439f9d4e3da77393547288154b"; // Replace with your API key
        const categoryQuery = category !== "All" ? `&category=${category}` : "";
        const tagQuery = tag !== "All" ? `&tags=${tag}` : "";
        const searchQueryParam = searchQuery ? `&search=${searchQuery}` : ""; // Add search query parameter
        const pageQuery = `&page=${currentPage}`;

        const response = await axios.get(
          `https://api.rawg.io/api/games?key=${apiKey}${categoryQuery}${tagQuery}${searchQueryParam}${pageQuery}`
        );
        
        setGames(response.data.results); // Save the fetched games data
        setTotalPages(Math.ceil(response.data.count / 20)); // Assuming 20 results per page
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };

    fetchGames();
  }, [category, tag, searchQuery, currentPage]); // Re-run the effect when category, tag, searchQuery, or page changes

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    setCurrentPage(1); // Reset to the first page when a new search is done
  };

  // Generate page numbers (1-10 or adjusted to show 10 pages max)
  const generatePaginationItems = () => {
    const pageStart = Math.floor((currentPage - 1) / 19) * 19 + 1;
    const pageEnd = Math.min(pageStart + 18, totalPages);

    let pages = [];
    for (let i = pageStart; i <= pageEnd; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pages;
  };

  return (
    <>
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand href="#">Game Library</Navbar.Brand>
        <Form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder="Search Games"
            className="me-2"
            value={searchQuery}
            onChange={handleSearchChange} // Update search query on input change
          />
          <Button variant="outline-light" type="submit">Search</Button>
        </Form>
        <Button variant="primary" className="ms-3">Library</Button>
      </Navbar>

      {/* Main Layout */}
      <Container fluid className="mt-3">
        <Row>
          {/* Sidebar */}
          <Col md={3} className="bg-light p-3">
            <SidebarFilters setCategory={setCategory} setTag={setTag} />
          </Col>

          {/* Game Cards Grid */}
          <Col md={9}>
            <Row>
              {loading ? (
                <p>Loading...</p> // Display loading text while fetching data
              ) : (
                games.map((game) => (
                  <Col md={4} key={game.id} className="mb-3">
                    <Card>
                      <Card.Img variant="top" src={game.background_image} alt={game.name} />
                      <Card.Body>
                        <Card.Title>{game.name}</Card.Title>
                        <Card.Text>
                          Category: {category} | Tag: {tag} | Rating: ⭐ {game.rating}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>

            {/* Pagination */}
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {generatePaginationItems()}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
