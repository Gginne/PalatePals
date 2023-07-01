import { useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useState } from "react";
import RestaurantCard from "./places/RestaurantCard";

export default function Session() {
  let { sessionId } = useParams();

 
  const [matches, setMatches] = useState([]);
  const [resultsReady, setResultsReady] = useState(null);

  useEffect(() => {
    // Create the listener
    const sessionRef = db.sessions.doc(sessionId);
    const swipesRef = sessionRef.collection("swipes");

    const unsubscribe = swipesRef.onSnapshot(async (snapshot) => {
      const swipes = snapshot.docs.map(db.formatDoc)

      const session = await sessionRef.get();
      const noOfUsers = session.data().users.length;

      setResultsReady((swipes.length  === noOfUsers));

      if(swipes.length === noOfUsers){
        const restaurants = swipes.map(swipe => swipe.restaurants)
        const findCommonElements = (arrays) =>arrays.reduce((acc, curr) => acc.filter((element) => curr.includes(element)));
        const matchedIds = findCommonElements(restaurants)  

        
        let matchedRestaurants = []
        
        for(const id of matchedIds){
            const restaurantRef = sessionRef.collection('restaurants').doc(id)
            const restaurantQuery = await restaurantRef.get()
            
            const restaurantData = restaurantQuery.data()
            matchedRestaurants.push(restaurantData)
        }
  
        setMatches(matchedRestaurants)
        
                
      }
    
    });
    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  return (
    <div>
      <Navbar className="bg-white shadow-sm" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Session ID {sessionId}</Navbar.Brand>
          <Nav className="me-auto">
            <Button className="mx-2" variant="danger" as={Link} to="/">
              Exit
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-5">
        {
          resultsReady ? (
            <>
            <h1>Matched Restaurants</h1>
            <div className="row mt-3">
               
                    {matches.map((data) => (
                       <div className="col-sm-3">
                        <RestaurantCard data={data} displayOnly />
                      </div>
                    ))}
                
            </div>
            </>
          ) : (<h1>Waiting for your partner to finish their selection...</h1>)

        }
        
      </Container>
    </div>
  );
}
