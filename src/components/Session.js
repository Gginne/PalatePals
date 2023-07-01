import { useEffect } from "react";
import { Card, Container, Navbar, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";
import RestaurantCard from "./places/RestaurantCard";
import { useNavigate } from "react-router-dom";
export default function Session() {

  let { sessionId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState([]);
  const restaurantRequest = useNearbyRestaurants(sessionId);
  const navigate = useNavigate()


  const handleSwipeLeft = (restaurant) => {
    // Handle swiping left action
    console.log(`Swiped left on ${restaurant.name}`);
    console.log(restaurant);
    nextCard();
  };

  const handleSwipeRight = (restaurant) => {
    // Handle swiping right action
    console.log(`Swiped right on ${restaurant.name}`);
    setSelected((prev) => [...prev, restaurant.id]);
    console.log(restaurant);
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmitSwipes = async () => {
    const sess = await db.sessions.doc(sessionId);
    const swipes = sess.collection("swipes");
    const userSwipes = swipes.doc(currentUser.uid);
    userSwipes.set({
      restaurants: selected,
    });
    navigate(`/session/${sessionId}/results`)
  };

  const handleResetSwipes = async () => {
    setSelected([]);
    setCurrentIndex(0);
  };

 
  useEffect(() => {
    // Create the listener

    const sessionRef = db.sessions.doc(sessionId);
    const swipesRef = sessionRef.collection('swipes');

    const unsubscribe = swipesRef.onSnapshot(async (snapshot) => {
      const swipes = snapshot.docs.map(db.formatDoc)
   
      if(swipes.find(swipe => swipe.id === currentUser.uid)) {
        console.log("User has already chosen his preferences")
        navigate(`/session/${sessionId}/results`)
      }

    });
    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [sessionId, currentUser]);

  return (
    <div>
          <Navbar className="bg-white shadow-sm" data-bs-theme="dark" />
          <Container className="mt-5 d-flex justify-content-center">
            {restaurantRequest.data.length > 0 ? (
              currentIndex === restaurantRequest.data.length ? (
                <Card>
                  <Card.Body>
                    <Button variant="primary" onClick={handleSubmitSwipes}>
                      Submit
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <RestaurantCard
                  data={restaurantRequest.data[currentIndex]}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  session={sessionId}
                  reset={handleResetSwipes}
                />
              )
            ) : (
              <p>No restaurants available.</p>
            )}
          </Container>
      
    
    </div>
  );
}
