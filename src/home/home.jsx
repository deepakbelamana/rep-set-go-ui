import "./home.css";
import { useState } from "react";
import { Container, Card, Button, Form, ListGroup } from 'react-bootstrap';
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [workoutLists, setWorkoutLists] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleCancel = () => {
    setNewGroupName("");
    setShowInput(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (newGroupName.trim() === "") return;
    
    setIsLoading(true);
    try {
      const newList = {
        user_id: localStorage.getItem("userId"),
        group_name: newGroupName.trim()
      };
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        "http://localhost:9090/rep-set-go/group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newList),
        }
      );
      
      if (response.ok) {
        setWorkoutLists([...workoutLists, newList]);
        setNewGroupName("");
        setShowInput(false);
      } else {
        alert("Failed to save workout list. Please try again.");
      }
    } catch(err) {
      console.error("Error saving workout list:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Sidebar />
      <h2 className="mb-4 text-light">Welcome to Rep Set Go!</h2>

      {workoutLists.length === 0 && !showInput && (
        <Card className="text-center p-4 bg-dark text-light border-secondary">
          <Card.Body>
            <p className="mb-4">No workout list found.</p>
            <Button variant="success" onClick={handleAddClick}>
              + Add Workout List
            </Button>
          </Card.Body>
        </Card>
      )}

      {showInput && (
        <Card className="slide-in bg-dark text-light border-secondary">
          <Card.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter workout group name"
                  className="bg-dark text-light border-secondary"
                  disabled={isLoading}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  type="submit"
                  disabled={newGroupName.trim() === "" || isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {workoutLists.length > 0 && (
        <>
          <ListGroup className="mb-4">
            {workoutLists.map((list) => (
              <ListGroup.Item 
                key={`${list.user_id}-${list.group_name}`}
                className="d-flex justify-content-between align-items-center bg-dark text-light border-secondary"
              >
                {list.group_name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="success" onClick={handleAddClick}>
            + Add Workout List
          </Button>
        </>
      )}
    </Container>
  );
}
