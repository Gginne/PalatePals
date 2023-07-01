import { useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Session() {
  let { sessionId } = useParams();

  const { currentUser } = useAuth();
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

      if(swipes.length == noOfUsers){
        const restaurants = swipes.map(swipe => swipe.restaurants)
        const findCommonElements = (arrays) => {
            if (arrays.length === 0) {
              return [];
            }
          
            // Reduce the arrays into a single array
            const flattenedArray = arrays.reduce((acc, curr) => acc.concat(curr));
          
            // Filter the elements that are present in all arrays
            const commonElements = flattenedArray.filter((element, index, array) => {
              return array.indexOf(element) === index && arrays.every((array) => array.includes(element));
            });

            console.log(commonElements)
          
            return commonElements;
          };
        setMatches(findCommonElements(restaurants))          
      }
    
      setResultsReady((swipes.length  === noOfUsers));

      
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
            <h1>Matched Restaurants</h1>
          ) : (<h1>Waiting for your partner to finish his selection...</h1>)

        }
        
      </Container>
    </div>
  );
}
