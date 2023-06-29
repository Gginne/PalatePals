import React from 'react'
import {Card, ListGroup} from 'react-bootstrap'
export default function RestaurantCard({data}) {
  return (
    <Card className='my-2'>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.location.formatted_address}</Card.Text>
      </Card.Body>
      <ListGroup variant="flush">
        {data.categories.map((category, index) => (
          <ListGroup.Item key={index}>{category.name}</ListGroup.Item>
        ))}
      </ListGroup>
      <Card.Footer>
        <small className="text-muted">Distance: {data.distance} meters</small>
      </Card.Footer>
  </Card>
  )
}
