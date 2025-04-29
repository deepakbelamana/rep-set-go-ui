import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Form, Button, Container,ListGroup } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from '../components/Sidebar'
import './workout.css'

export default function Workout () {
  const { groupId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInput, setShowInput] = useState(false)
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [editWorkoutName, setEditWorkoutName] = useState('')
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!groupId) return
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`${baseUrl}/workout/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setWorkouts(data)
        } else {
          console.error('Failed to fetch workouts')
        }
      } catch (err) {
        console.error('Error fetching workouts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkouts()
  }, [groupId])

  const handleEdit = workoutId => {
    const workout = workouts.find(w => w.workout_id === workoutId)
    if (workout) {
      setEditingWorkout(workoutId)
      setEditWorkoutName(workout.workout_name)
    }
  }

  const handleDelete = async workoutId => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return
    }

    const token = localStorage.getItem('token')
    const workoutToDelete = workouts.find(
      workout => workout.workout_id === workoutId
    )

    if (!workoutToDelete) {
      toast.error('Workout not found')
      return
    }

    try {
      const response = await fetch(`${baseUrl}/workout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workoutToDelete)
      })

      if (response.ok) {
        setWorkouts(
          workouts.filter(workout => workout.workout_id !== workoutId)
        )
        toast.success('Workout deleted successfully!')
      } else {
        toast.error('Failed to delete workout. Please try again.')
      }
    } catch (err) {
      console.error('Error deleting workout:', err)
      toast.error('An error occurred while deleting the workout.')
    }
  }

  const handleAddWorkout = () => {
    setShowInput(true)
  }

  const handleCancel = () => {
    setNewWorkoutName('')
    setShowInput(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    if (newWorkoutName.trim() === '') return

    setIsSaving(true)
    try {
      const newWorkout = {
        group_id: groupId,
        workout_name: newWorkoutName.trim()
      }
      const token = localStorage.getItem('token')

      const response = await fetch(baseUrl + '/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newWorkout)
      })

      if (response.ok) {
        const savedWorkout = await response.json()
        setWorkouts([...workouts, savedWorkout])
        setNewWorkoutName('')
        setShowInput(false)
        toast.success('Workout saved successfully!')
      } else {
        toast.error('Failed to save workout. Please try again.')
      }
    } catch (err) {
      console.error('Error saving workout:', err)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingWorkout(null)
    setEditWorkoutName('')
  }

  const handleSaveEdit = async () => {
    if (!editingWorkout || editWorkoutName.trim() === '') return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${baseUrl}/workout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          workout_id: editingWorkout,
          workout_name: editWorkoutName.trim(),
          group_id: groupId
        })
      })

      if (response.ok) {
        setWorkouts(
          workouts.map(workout =>
            workout.workout_id === editingWorkout
              ? { ...workout, workout_name: editWorkoutName.trim() }
              : workout
          )
        )
        setEditingWorkout(null)
        setEditWorkoutName('')
        toast.success('Workout updated successfully!')
      } else {
        toast.error('Failed to update workout. Please try again.')
      }
    } catch (err) {
      console.error('Error updating workout:', err)
      toast.error('An error occurred while updating the workout.')
    }
  }

  if (isLoading) {
    return (
      <Container className='py-4'>
        <Sidebar />
        <div className='workout-container'>Loading...</div>
      </Container>
    )
  }

  return (
    <Container className='py-4'>
      <Sidebar />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <div className='workout-container'>
        <h2 className='workout-header'>
          {state?.group?.group_name || 'Workout Group'}
        </h2>

        {workouts.length === 0 && !showInput && (
          <div className='text-center'>
            <p className='no-workouts'>No workout list found</p>
            <button className='add-workout-button' onClick={handleAddWorkout}>
              + Add Work out
            </button>
          </div>
        )}

        {showInput && (
          <Card className='slide-in bg-dark text-light border-secondary mb-4'>
            <Card.Body>
              <Form onSubmit={handleSave}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    value={newWorkoutName}
                    onChange={e => setNewWorkoutName(e.target.value)}
                    placeholder='Enter workout name'
                    className='bg-dark text-light border-secondary'
                    disabled={isSaving}
                  />
                </Form.Group>
                <div className='d-flex gap-2'>
                  <Button
                    variant='secondary'
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='success'
                    type='submit'
                    disabled={newWorkoutName.trim() === '' || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {workouts.length > 0 && (
          <ListGroup className='mb-4'>
            {workouts.map(workout => (
              <ListGroup.Item
                key={workout.workout_id}
                className='d-flex justify-content-between align-items-center bg-dark text-light border-secondary'
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(`/set/${workout.workout_id}`, { state: { workout } })
                }
              >
                {editingWorkout === workout.workout_id ? (
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <Form.Control
                      type='text'
                      value={editWorkoutName}
                      onChange={e => setEditWorkoutName(e.target.value)}
                      className='bg-dark text-light border-secondary'
                      autoFocus
                    />
                    <div className='workout-actions'>
                      <button
                        className='action-button save'
                        onClick={e => {
                          e.stopPropagation()
                          handleSaveEdit()
                        }}
                        aria-label='Save workout'
                      >
                        <FaCheck />
                      </button>
                      <button
                        className='action-button cancel'
                        onClick={e => {
                          e.stopPropagation()
                          handleCancelEdit()
                        }}
                        aria-label='Cancel edit'
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>{workout.workout_name}</span>
                    <div className='workout-actions'>
                      <button
                        className='action-button edit'
                        onClick={e => {
                          e.stopPropagation()
                          handleEdit(workout.workout_id)
                        }}
                        aria-label='Edit workout'
                      >
                        <FaEdit />
                      </button>
                      <button
                        className='action-button delete'
                        onClick={e => {
                          e.stopPropagation()
                          handleDelete(workout.workout_id)
                        }}
                        aria-label='Delete workout'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {workouts.length > 0 && !showInput && (
          <button className='add-workout-button' onClick={handleAddWorkout}>
            + Add Work out
          </button>
        )}
      </div>
    </Container>
  )
}
