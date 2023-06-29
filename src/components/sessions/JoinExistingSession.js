import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function JoinExistingSession() {
  const [session, setSession] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const joinSession = async (event) => {
    event.preventDefault();
    try {
      const doc = await db.sessions.doc(session);
      doc.update({
        users: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      });
      navigate(`/session/${session}`)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form>
      <Form.Group>
        <Form.Label>Session ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter session ID"
          name="sessionId"
          onChange={(e) => setSession(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" onClick={joinSession} variant="primary">
        Let's go!
      </Button>
    </Form>
  );
}

export default JoinExistingSession;
