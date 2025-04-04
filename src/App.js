import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { Container, Row, Col, Navbar, Form, FormControl, Button, Card, Dropdown, Pagination } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import GameDetail from "./GameDetail";

// Clerk Frontend API
const clerkFrontendApi = "pk_test_dm9jYWwtbGlvbmVzcy0zMy5jbGVyay5hY2NvdW50cy5kZXYk"; // 🔁 Replace with your actual Clerk frontend API


// Sidebar Filters Component
const SidebarFilters = ({ setCategory, setTag }) => {
  const [category, setCategoryState] = useState("All");
  const [tag, setTagState] = useState("All");

  const handleCategoryChange = (selectedCategory) => {
    setCategoryState(selectedCategory);
    setCategory(selectedCategory);
  };

  const handleTagChange = (selectedTag) => {
    let formattedTag = selectedTag.toLowerCase().replace(" ", "-");

    if (selectedTag === "Single-player") {
      formattedTag = "singleplayer";
    }

    setTagState(selectedTag);
    setTag(formattedTag);
  };

  return (
    <div className="filters p-3 rounded shadow-sm bg-white">
      <h5 className="fw-bold text-center mb-3">🎯 Filters</h5>
  
      {/* Category Filter */}
      <div className="mb-3">
        <h6 className="fw-semibold">📌 Category</h6>
        <Dropdown>
          <Dropdown.Toggle variant="dark" className="w-100">
            {category}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            <Dropdown.Item onClick={() => handleCategoryChange("Action")}>Action</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("RPG")}>RPG</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("Sports")}>Sports</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
  
      {/* Tags Filter */}
      <div>
        <h6 className="fw-semibold">🏷️ Tags</h6>
        <Dropdown>
          <Dropdown.Toggle variant="dark" className="w-100">
            {tag}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            <Dropdown.Item onClick={() => handleTagChange("Multiplayer")}>Multiplayer</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTagChange("Single-player")}>Single-player</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );  
};
// end sidebar




// HOME
const Home = () => {
  return <AppContent />;
};
// const Library = () => {
//   const { isSignedIn } = useUser();
//   if (!isSignedIn) return <RedirectToSignIn />;
//       return <GameDetail/>
//   // return (
//   //   <div className="p-5 text-center">
//   //     <h2>📚 Welcome to Your Game Library!</h2>
//   //     <p>This is a protected page only for signed-in users.</p>
//   //   </div>
//   // );
// };
const ProtectedGameDetail = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <GameDetail />;
};
const AppContent = () => {
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const apiKey = "0ba9da439f9d4e3da77393547288154b";
        const categoryQuery = category !== "All" ? `&category=${category}` : "";
        const tagQuery = tag !== "All" ? `&tags=${tag}` : "";
        const searchQueryParam = searchQuery ? `&search=${searchQuery}` : "";
        const pageQuery = `&page=${currentPage}`;
    
        // ✅ Fetch exactly 21 games per page
        const response = await axios.get(
          `https://api.rawg.io/api/games?key=${apiKey}${categoryQuery}${tagQuery}${searchQueryParam}${pageQuery}&page_size=21`
        );
    
        setGames(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 21)); // Ensure pagination works correctly
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };
    

    fetchGames();
  }, [category, tag, searchQuery, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const generatePaginationItems = () => {
    const pageStart = Math.floor((currentPage - 1) / 20) * 20 + 1;
    const pageEnd = Math.min(pageStart + 24, totalPages);

    let pages = [];
    for (let i = pageStart; i <= pageEnd; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return pages;
  };

 return (
   <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/">Game Library</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          
          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search Games"
              className="me-2"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>

          {/* Auth Links */}
          <div>
            <Link to="/sign-in" className="btn btn-light me-2">Sign In</Link>
            <Link to="/sign-up" className="btn btn-outline-light">Sign Up</Link>
          </div>

        </Navbar.Collapse>
      </Navbar>


      <Container fluid className="mt-3">                      
        <Row>
          {/* Sidebar */}
          <Col md={3} className="bg-light p-3">
            <SidebarFilters setCategory={setCategory} setTag={setTag} />
          </Col>

          {/* Game Cards Section */}
          <Col md={9}>
            <div className="d-flex flex-column">
              <Row className="g-4">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "50vh" }}>
                    <p className="text-muted fs-5">Loading games...</p>
                  </div>
                ) : (
                  games.map((game) => (
                    <Col md={4} key={game.id} className="d-flex">
                      <Card className="game-card shadow-lg border-0 rounded-4">
                        {/* Image */}
                        <Card.Img
                          variant="top"
                          src={game.background_image}
                          alt={game.name}
                          className="rounded-top-4 game-image"
                        />

                        {/* Card Body */}
                        <Card.Body className="d-flex flex-column justify-content-between text-center">
                          <div>
                            <Card.Title className="fw-bold fs-5">{game.name}</Card.Title>
                            <Card.Text className="text-muted small">
                              <strong>📌 Category:</strong> {category} <br />
                              <strong>🏷️ Tag:</strong> {tag} <br />
                              <strong>⭐ Rating:</strong> {game.rating}
                            </Card.Text>
                          </div>
                          <Link to={`/library/${game.id}`} className="btn btn-dark rounded-pill w-100 mt-2">
                            🎮 View Details
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
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
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

    </>
  );
};

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/library" element={<Library />} /> */}
          {/* <Route path="/library/:id" element={<GameDetail />} /> */}
          <Route path="/library/:id" element={<ProtectedGameDetail />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};
export default App;

