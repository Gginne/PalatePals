import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function RestaurantCard({ data, onSwipeLeft, onSwipeRight, session, reset }) {
  return (
    <Card className="my-2 shadow-sm w-100" style={{maxWidth: '25rem'}}>
       <Card.Header>
          <div className="me-auto">
            <Card.Title >Session ID {session}</Card.Title>
              <Button
                className="mx-2"
                variant="warning"
                onClick={reset}
                >
                  Reset
              </Button>
              <Button className="mx-2" variant="danger" as={Link} to="/">
                Exit
              </Button>
            </div>
          </Card.Header>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>
          {data.address}<br />
          <small className="text-muted">Distance: {data.distance} meters</small>
        </Card.Text>
        <div>
          {data.categories.map((category, index) => (
            <Badge key={index} pill variant="info" className="mr-1">
              {category.name}
            </Badge>
          ))}
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
       
        
          <Button variant="danger" onClick={() => onSwipeLeft(data)}>Yuck!</Button>
          <Button variant="success" onClick={() => onSwipeRight(data)}>Yum!</Button>
        
      </Card.Footer>
    </Card>
  );
}