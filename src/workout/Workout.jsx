import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Form, Button, Container } from 'react-bootstrap';
import Sidebar from "../components/Sidebar";
import './workout.css';

export default function Workout() {
  const { groupId } = useParams();
  const { state } = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!groupId) return;

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:9090/rep-set-go/workout/${groupId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkouts(data);
        } else {
          console.error("Failed to fetch workouts");
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [groupId]);

  const handleEdit = (workoutId) => {
    // TODO: Implement edit functionality
    console.log("Edit workout:", workoutId);
  };

  const handleDelete = (workoutId) => {
    // TODO: Implement delete functionality
    console.log("Delete workout:", workoutId);
  };

  const handleAddWorkout = () => {
    setShowInput(true);
  };

  const handleCancel = () => {
    setNewWorkoutName("");
    setShowInput(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (newWorkoutName.trim() === "") return;

    setIsSaving(true);
    try {
      const newWorkout = {
        group_id: groupId,
        workout_name: newWorkoutName.trim()
      };
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:9090/rep-set-go/workout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newWorkout),
        }
      );

      if (response.ok) {
        const savedWorkout = await response.json();
        setWorkouts([...workouts, savedWorkout]);
        setNewWorkoutName("");
        setShowInput(false);
      } else {
        alert("Failed to save workout. Please try again.");
      }
    } catch (err) {
      console.error("Error saving workout:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <Sidebar />
        <div className="workout-container">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Sidebar />
      <div className="workout-container">
        <h2 className="workout-header">{state?.group?.group_name || 'Workout Group'}</h2>
        
        {workouts.length === 0 && !showInput && (
          <div className="text-center">
            <p className="no-workouts">No workout list found</p>
            <button className="add-workout-button" onClick={handleAddWorkout}>
              + Add Work out
            </button>
          </div>
        )}

        {showInput && (
          <Card className="slide-in bg-dark text-light border-secondary mb-4">
            <Card.Body>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    placeholder="Enter workout name"
                    className="bg-dark text-light border-secondary"
                    disabled={isSaving}
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={newWorkoutName.trim() === "" || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {workouts.length > 0 && (
          <div className="workout-list">
            {workouts.map((workout) => (
              <div key={workout.workout_id} className="workout-item">
                <p className="workout-name">{workout.workout_name}</p>
                <div className="workout-actions">
                  <button 
                    className="action-button"
                    onClick={() => handleEdit(workout.workout_id)}
                    aria-label="Edit workout"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleDelete(workout.workout_id)}
                    aria-label="Delete workout"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {workouts.length > 0 && !showInput && (
          <button className="add-workout-button" onClick={handleAddWorkout}>
            + Add Work out
          </button>
        )}
      </div>
    </Container>
  );
} 