import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import './set.css';

export default function SetPage() {
  const { workoutId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repCount, setRepCount] = useState('');
  const [weight, setWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch sets from backend
  useEffect(() => {
    const fetchSets = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/set/${workoutId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched sets:", data);
          setSets(data);
        } else {
          console.error('Failed to fetch sets');
        }
      } catch (err) {
        console.error('Error fetching sets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, [baseUrl, workoutId]);

  // Update available dates and selected date after sets are loaded
  useEffect(() => {
    if (sets.length > 0) {
      const datesArray = sets
        .map(dt => dt.created_date?.split('T')[0])
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a)); // Newest first

      const uniqueDates = Array.from(new Set(datesArray));
      setAvailableDates(uniqueDates);

      // Only set selectedDate if not manually selected
      setSelectedDate(prev => prev || uniqueDates[0]);
    }
  }, [sets]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!repCount.trim() || !weight.trim()) return;
    setIsSaving(true);

    const newSet = {
      workout_id: parseInt(workoutId),
      rep_count: parseInt(repCount.trim()),
      weight: parseFloat(weight.trim())
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSet),
      });

      if (response.ok) {
        const savedSet = await response.json();
        setSets([savedSet, ...sets]);
        const newSavedDate = savedSet.created_date.split('T')[0];

        if (!availableDates.includes(newSavedDate)) {
          setAvailableDates([newSavedDate, ...availableDates]);
        }

        setSelectedDate(newSavedDate); // After save, show new set's date

        setRepCount('');
        setWeight('');
        toast.success('Set saved successfully!');
      } else {
        toast.error('Failed to save set. Please try again.');
      }
    } catch (err) {
      console.error('Error saving set:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setRepCount('');
    setWeight('');
  };

  const filteredSets = sets.filter(
    s => s.created_date?.split('T')[0] === selectedDate
  );

  return (
    <Container className="py-4">
      <Sidebar />
      <ToastContainer theme="dark" />

      <h2 className="text-light mb-4">
        {state?.workout?.workout_name || 'Workout'}
      </h2>

      {/* Save form */}
      <Form className="d-flex gap-2 mb-4" onSubmit={handleSave}>
        <Form.Control
          type="number"
          placeholder="Enter rep count"
          value={repCount}
          onChange={(e) => setRepCount(e.target.value)}
          className="bg-dark text-light border-secondary"
          disabled={isSaving}
        />
        <Form.Control
          type="number"
          placeholder="Enter weight"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="bg-dark text-light border-secondary"
          disabled={isSaving}
        />
        <Button variant="success" type="submit" disabled={isSaving}>
          Save
        </Button>
        <Button variant="danger" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
      </Form>

      {/* Last Performed Header with Dropdown */}
      <div className="d-flex align-items-center mb-3">
        <h3 className="text-light mb-0 me-3">Last Performed</h3>
        <Form.Select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-dark text-light border-secondary w-auto"
        >
          {availableDates.length ? (
            availableDates.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))
          ) : (
            <option disabled>No dates available</option>
          )}
        </Form.Select>
      </div>

      {/* Sets table */}
      {isLoading ? (
        <p className="text-light">Loading…</p>
      ) : (
        <Table variant="dark" responsive>
          <thead>
            <tr>
              <th>Set</th>
              <th>Rep</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {filteredSets.length ? (
              filteredSets.slice(0, 3).map((s, idx) => (
                <tr key={s.set_id || idx}>
                  <td>{idx + 1}</td>
                  <td>{s.rep_count}</td>
                  <td>{s.weight}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-light">
                  No sets available for selected date
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Check Progress Button */}
      <div className="fixed-bottom text-center mb-3">
        <Button
          variant="success"
          size="lg"
          onClick={() => navigate(`/progress/${workoutId}`)}
        >
          Check Progress
        </Button>
      </div>
    </Container>
  );
}
