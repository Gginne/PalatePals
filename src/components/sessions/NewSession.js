import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { getLocation, getRestaurants } from "../../api/api";

function NewSession() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
     console.log(restaurantRequest)
     const sess = await db.sessions.doc(result.id)
     const restaurants = sess.collection("restaurants"); 
     restaurantRequest.forEach(restaurant => {
        const id = restaurant.fsq_id
        const currRestaurant = restaurants.doc(id)
        currRestaurant.set({
          swipes: [],
          name: restaurant.name,
          distance: restaurant.distance,
          addres: restaurant.location.formatted_address,
          categories: restaurant.categories
        })
     })
     navigate(`/session/${result.id}`)
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
  );
}

export default NewSession;
