import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function SessionCard({ data }) {

  return (
    <Card>
      <Card.Header>
        <Card.Title>ID: {data.id}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Badge pill variant="info" className="mr-1">
          lat: {data.lat}
        </Badge>
        <Badge pill variant="info" className="mr-1">
          long: {data.long}
        </Badge>
           <Card.Text>Users: {data.users.join(", ")}</Card.Text>
      </Card.Body>

      <Card.Footer>
        <Button variant="primary" as={Link} to={`/session/${data.id}`}>Go To Session</Button>
      </Card.Footer>
    </Card>
  );
}
