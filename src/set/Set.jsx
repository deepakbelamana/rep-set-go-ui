import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Table } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from '../components/Sidebar'
import './set.css'

export default function Set () {
  const { workoutId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [sets, setSets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [repCount, setRepCount] = useState('')
  const [weight, setWeight] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSets = async () => {
      if (!workoutId) return
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(
          `https://repsetgo.onrender.com/rep-set-go/set/${workoutId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.ok) {
          const data = await response.json()
          console.log(data);
          setSets(data)
        } else {
          console.error('Failed to fetch sets')
        }
      } catch (err) {
        console.error('Error fetching sets:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSets()
  }, [workoutId])

  const handleSave = async e => {
    e.preventDefault()
    if (!repCount.trim() || !weight.trim()) return
    setIsSaving(true)
    const newSet = {
      workout_id: parseInt(workoutId),
      rep_count: parseInt(repCount.trim()),
      weight: parseFloat(weight.trim())
    }
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('https://repsetgo.onrender.com/rep-set-go/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSet)
      })
      if (response.ok) {
        const savedSet = await response.json()
        setSets([...sets, savedSet])
        setRepCount('')
        setWeight('')
        toast.success('Set saved successfully!')
      } else {
        toast.error('Failed to save set. Please try again.')
      }
    } catch (err) {
      console.error('Error saving set:', err)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setRepCount('')
    setWeight('')
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
      <h2 className='text-light mb-4'>
        {state?.workout?.workout_name || 'Workout'}
      </h2>
      <Form className='d-flex gap-2 mb-4' onSubmit={handleSave}>
        <Form.Control
          type='number'
          placeholder='enter rep count'
          value={repCount}
          onChange={e => setRepCount(e.target.value)}
          className='bg-dark text-light border-secondary'
          disabled={isSaving}
        />

        <Form.Control
          type='number'
          placeholder='enter weight'
          step='0.1'
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className='bg-dark text-light border-secondary'
          disabled={isSaving}
        />
        <Button variant='success' type='submit' disabled={isSaving}>
          save
        </Button>
        <Button variant='danger' onClick={handleCancel} disabled={isSaving}>
          cancel
        </Button>
      </Form>
      <h3 className='text-light mb-3'>Last performed</h3>
      {isLoading ? (
        <p className='text-light'>Loading...</p>
      ) : (
        <Table variant='dark' responsive>
          <thead>
            <tr>
              <th>set</th>
              <th>rep</th>
              <th>weight</th>
            </tr>
          </thead>
          <tbody>
            {sets.slice(-3).map((s, idx) => (
              <tr key={s.set_id || idx}>
                <td>{sets.length - 3 + idx + 1}</td>
                <td>{s.rep_count}</td>
                <td>{s.weight}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className='fixed-bottom text-center mb-3'>
        <Button
          variant='success'
          size='lg'
          onClick={() => navigate('/progress')}
        >
          Check Progress
        </Button>
      </div>
    </Container>
  )
}
