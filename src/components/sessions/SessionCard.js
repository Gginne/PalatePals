import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function SessionCard({ data }) {
  return (
    <Card className="shadow-sm">
    
      <Card.Body>
      <Card.Title>{data.title}</Card.Title>
        <Card.Text>
          <b>People: </b>
          {data.users.map((user, index) => (
            <Badge key={index} pill variant="info" className="mr-1">
              {user}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" as={Link} to={`/session/${data.id}`}>
          Go To Session
        </Button>
      </Card.Footer>
    </Card>
  );
}
