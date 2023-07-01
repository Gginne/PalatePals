import React from "react";
import NewSessionForm from "./NewSessionForm";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

export default function CreateSessionModal() {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Button className="px-4" variant="success" onClick={handleShowModal}>
        Create Session
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewSessionForm />
        </Modal.Body>
       
      </Modal>
    </>
  );
}
