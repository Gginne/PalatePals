import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function NewSession() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    radius: "",
  });

  function handleChangeNewSession(e) {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  }

  const getLocation = async () => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.location}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          )
      
          const jsonData = response.json()
          return jsonData;

    } catch (err){
        console.log(err)
        return err
    }
  };

  const createNewSession = async (event) => {
    event.preventDefault();
    const obj = await getLocation();

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
        <Form.Label>Radius</Form.Label>
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
