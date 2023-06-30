import { useEffect } from "react";
import { Card, Container} from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext"
import { useState } from 'react'
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";

export default function Session() {
    let { sessionId } = useParams();
    const { currentUser } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState(false)

    const restaurantRequest = useNearbyRestaurants(sessionId);

    useEffect(() => {
        const validateUser = async() => {
            try {
                const doc = await db.sessions.doc(sessionId).get()
                const users = doc.data().users
                if(users.includes(currentUser.uid)) {
                    setIsAuthorized(true)
                } else {
                    setIsAuthorized(false)
                }
            } catch (err) {
                console.log(err)
            }
        }

        validateUser()

        console.log(restaurantRequest.data)
        
    }, [currentUser.uid, sessionId, restaurantRequest.data])

    return(
        <div>
            {isAuthorized && (
                <>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>
                            Session ID {sessionId}
                        </Card.Title>
                    </Card.Body>
                </Card>
                <Container className="my-3">
                    
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
    )
}