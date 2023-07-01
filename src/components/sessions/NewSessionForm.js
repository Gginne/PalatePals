import { Alert, Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { getLocation, getRestaurants } from "../../api/api";

function NewSessionForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    location: "",
    radius: "",
  });

  function handleChangeNewSession(e) {
    const key = e.target.name;
    let value = e.target.value;
    if(key === 'radius'){
      value = Number(value)*1609
    }
    setFormData({ ...formData, [key]: value });
  }

  const createNewSession = async (event) => {
    event.preventDefault();
    const obj = await getLocation(formData.location);

    const lat = obj.results[0].geometry.location.lat;
    const long = obj.results[0].geometry.location.lng;

    const data = {
      users: [currentUser.uid],
      lat,
      long,
      radius: formData.radius,
    };
    try {
     const result = await db.sessions.add(data);
     const restaurantRequest = await getRestaurants(lat, long, formData.radius);
     const sess = await db.sessions.doc(result.id)
     const restaurants = sess.collection("restaurants"); 
     restaurantRequest.forEach(restaurant => {
        const id = restaurant.fsq_id
        const currRestaurant = restaurants.doc(id)
        currRestaurant.set({
          swipes: [],
          name: restaurant.name,
          distance: restaurant.distance,
          address: restaurant.location.formatted_address,
          categories: restaurant.categories
        })
     })
     setSession(result.id)
    } catch (e) {
      console.log(e);
    }
  };

  const inviteUser = async(e) => {
    e.preventDefault()
    try {
      const query = await db.users.where('email', '==', email).limit(1).get()
      const userData = await db.formatDoc(query.docs[0])
      const id = userData.id
      const users = await db.sessions.doc(session).get()
      var arr = users.data().users
      arr.push(id)
      db.sessions.doc(session).set({
        users: arr
      })
      navigate(`/session/${session}`)
    } catch(err) {
      setError("Cannot invite this user. Please make sure that this user has an account.")
      console.log(err)
    }
  }

 

  return (
    <div>
      {!session && (
        <Form>
        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChangeNewSession}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Radius (Miles)</Form.Label>
          <Form.Control
            type="number"
            name="radius"
            placeholder="1"
            onChange={handleChangeNewSession}
          />
        </Form.Group>
        <Button type="submit" onClick={createNewSession} variant="primary">
          Let's go!
        </Button>
      </Form>
      )}
      {session && (
        <Form>
          <Form.Group>
            <Form.Label>Invite user to session {session}</Form.Label>
            <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
            {error && <Alert variant="danger">{error}</Alert>}
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button type="submit" onClick={inviteUser} variant="primary">
              Invite Partner & Create Session
            </Button>
         
          </div>
        </Form>
      )}
    </div>
  );
}

export default NewSessionForm;
