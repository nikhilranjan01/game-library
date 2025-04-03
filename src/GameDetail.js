import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Spinner, Button, Row, Col } from "react-bootstrap";

const GameDetail = () => {
  const { id } = useParams(); // Get game ID from URL
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const apiKey = "0ba9da439f9d4e3da77393547288154b"; // Replace with your API key
        const response = await axios.get(
          `https://api.rawg.io/api/games/${id}?key=${apiKey}`
        );
        setGame(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!game) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">Game details not found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Img
              variant="top"
              src={game.background_image}
              alt={game.name}
              className="rounded-top-4"
            />
            <Card.Body className="p-4">
              <Card.Title className="text-center fw-bold fs-3">
                {game.name}
              </Card.Title>
              <Card.Text className="mt-3">
                <strong>📅 Released:</strong> {game.released} <br />
                <strong>⭐ Rating:</strong> {game.rating} / 5 <br />
                <strong>🎮 Genres:</strong>{" "}
                {game.genres.map((g) => g.name).join(", ")}
              </Card.Text>
              <hr />
              <p className="game-description" dangerouslySetInnerHTML={{ __html: game.description }}></p>
              <div className="text-center mt-4">
                <Button as={Link} to="/" variant="dark" className="px-4 rounded-pill">
                  ⬅ Back to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameDetail;
