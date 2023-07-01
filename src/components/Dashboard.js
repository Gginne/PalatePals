import React, { useState } from "react";
import { Button, Card, Tab, Tabs } from "react-bootstrap";
import CenteredContainer from "./commons/CenteredContainer";
import NewSession from "./sessions/NewSession";
import JoinExistingSession from "./sessions/JoinExistingSession";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {

  const [form, setForm] = useState("join");
  return (
    <CenteredContainer>
      <Card className="shadow">
        <Card.Body>
        
          <Tabs
            id="controlled-tab-example"
            activeKey={form}
            onSelect={(k) => setForm(k)}
            className="mb-3"
          >
            <Tab eventKey="join" title="Join Session">
              <JoinExistingSession />
            </Tab>
            <Tab eventKey="create" title="Create Session">
              <NewSession />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </CenteredContainer>
  );
}
