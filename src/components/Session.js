import { useEffect } from "react";
import CenteredContainer from "./commons/CenteredContainer";
import { Card} from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext"
import { useState } from 'react'
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";

export default function Session() {
    let { sessionId } = useParams();
    const { currentUser } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const restaurantRequest = useNearbyRestaurants();

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
        
    }, [currentUser.uid, sessionId])

    return(
        <CenteredContainer>
            {isAuthorized && (
                <Card className="shadow">
                    <Card.Body>
                        <Card.Title>
                            Session {sessionId}
                        </Card.Title>
                    </Card.Body>
                </Card>
            )}
            {!isAuthorized && (
                <Card>
                    <Card.Title>
                        Sorry, you are not authorized to join this session.
                    </Card.Title>
                </Card>
            )}
        </CenteredContainer>
    )
}