import "./home.css";
import { useState, useEffect } from "react";
import { Container, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate();
  const [workoutLists, setWorkoutLists] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");

  useEffect(() => {
    const fetchWorkoutGroups = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        console.error("User ID or token not found");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:9090/rep-set-go/group/${userId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkoutLists(data);
        } else {
          console.error("Failed to fetch workout groups");
        }
      } catch (err) {
        console.error("Error fetching workout groups:", err);
      }
    };

    fetchWorkoutGroups();
  }, []);

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
        toast.success('Workout group saved successfully!');
      } else {
        toast.error('Failed to save workout group. Please try again.');
      }
    } catch(err) {
      console.error("Error saving workout group:", err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (groupId) => {
    const group = workoutLists.find(g => g.group_id === groupId);
    if (group) {
      setEditingGroup(groupId);
      setEditGroupName(group.group_name);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditGroupName("");
  };

  const handleSaveEdit = async () => {
    if (!editingGroup || editGroupName.trim() === "") return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:9090/rep-set-go/group`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            group_id: editingGroup,
            group_name: editGroupName.trim()
          })
        }
      );

      if (response.ok) {
        setWorkoutLists(workoutLists.map(group => 
          group.group_id === editingGroup 
            ? { ...group, group_name: editGroupName.trim() }
            : group
        ));
        setEditingGroup(null);
        setEditGroupName("");
        toast.success('Workout group updated successfully!');
      } else {
        toast.error('Failed to update workout group. Please try again.');
      }
    } catch (err) {
      console.error("Error updating workout group:", err);
      toast.error('An error occurred while updating the workout group.');
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this workout group?')) {
      return;
    }

    const token = localStorage.getItem("token");
    const groupToDelete = workoutLists.find(group => group.group_id === groupId);
    
    if (!groupToDelete) {
      toast.error('Workout group not found');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9090/rep-set-go/group`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(groupToDelete)
        }
      );

      if (response.ok) {
        setWorkoutLists(workoutLists.filter(group => group.group_id !== groupId));
        toast.success('Workout group deleted successfully!');
      } else {
        toast.error('Failed to delete workout group. Please try again.');
      }
    } catch (err) {
      console.error("Error deleting workout group:", err);
      toast.error('An error occurred while deleting the workout group.');
    }
  };

  return (
    <Container className="py-4">
      <Sidebar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
                style={{ cursor: 'pointer' }}
              >
                {editingGroup === list.group_id ? (
                  <div className="d-flex align-items-center gap-2 w-100">
                    <Form.Control
                      type="text"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      className="bg-dark text-light border-secondary"
                      autoFocus
                    />
                    <div className="group-actions">
                      <button 
                        className="action-button save"
                        onClick={handleSaveEdit}
                        aria-label="Save changes"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="action-button cancel"
                        onClick={handleCancelEdit}
                        aria-label="Cancel edit"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span onClick={() => navigate(`/workout/${list.group_id}`, { state: { group: list } })}>
                      {list.group_name}
                    </span>
                    <div className="group-actions">
                      <button 
                        className="action-button edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(list.group_id);
                        }}
                        aria-label="Edit workout group"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(list.group_id);
                        }}
                        aria-label="Delete workout group"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
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
