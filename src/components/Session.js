import { useEffect } from "react";
import { Card, Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";
import RestaurantCard from "./places/RestaurantCard";
export default function Session() {
  let { sessionId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selected, setSelected] = useState([])
  const restaurantRequest = useNearbyRestaurants(sessionId);
  console.log(restaurantRequest)

  const handleSwipeLeft = (restaurant) => {
    // Handle swiping left action
    console.log(`Swiped left on ${restaurant.name}`);
    console.log(restaurant)
    nextCard();
  };

  const handleSwipeRight = (restaurant) => {
    // Handle swiping right action
    console.log(`Swiped right on ${restaurant.name}`);
    setSelected(prev => [...prev, restaurant.id])
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1)
    );
  };


  useEffect(() => {

    const validateUser = async () => {
      try {
        const doc = await db.sessions.doc(sessionId).get()
        const users = doc.data().users
        setIsAuthorized(users.includes(currentUser.uid));
     
      } catch (err) {
        console.log(err);
      }
    };

    validateUser();


  }, [currentUser.uid, sessionId, restaurantRequest.data]);

  return (
    <div>
      {isAuthorized && (
        <>
          <Navbar className="bg-white shadow-sm" data-bs-theme="dark">
            <Container>
              <Navbar.Brand>Session ID {sessionId}</Navbar.Brand>
              <Nav className="me-auto">
                <Button className="mx-2" variant="warning" onClick={() => setCurrentIndex(0) && setSelected([])}>reset</Button>
                <Button className="mx-2" variant="danger" as={Link} to="/" >Exit</Button>
              </Nav>
            </Container>
          </Navbar>
          <Container className="mt-5 d-flex justify-content-center">
            {restaurantRequest.data.length > 0 ? (
              <RestaurantCard
                data={restaurantRequest.data[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            ) : (
              <p>No restaurants available.</p>
            )}
          </Container>
        </>
      )}
      {!isAuthorized && (
        <Card>
          <Card.Title>
            Sorry, you are not authorized to join this session.
          </Card.Title>
        </Card>
      )}
    </div>
  );
}
