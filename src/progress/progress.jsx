import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import Sidebar from '../components/Sidebar'

export default function Progress () {
  const { workoutId } = useParams()
  const [volumeData, setVolumeData] = useState({})
  const [oneRm,SetOneRm] = useState(0.0)
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchVolume = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`${baseUrl}/set/progress/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setVolumeData(data)
        } else {
          console.error('Failed to fetch volume data')
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVolume()
  }, [baseUrl, workoutId])

  useEffect(() => {
    const fetchOneRm = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`${baseUrl}/set/progress/oneRm/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log(data);
          SetOneRm(data)
        } else {
          console.error('Failed to fetch volume data')
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOneRm()
  }, [baseUrl, workoutId])


  const chartData = Object.entries(volumeData)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Container fluid className='py-5 text-light'>
      <Sidebar />
      <Row><h2 className='text-center mb-5'>your one rep max for this workout is {oneRm.toFixed(2)} kgs</h2></Row>
      <Row>
        {/* Chart Section */}
        <Col md={6}>
          <div className='p-4 bg-dark rounded shadow-sm h-100'>
            {loading ? (
              <p>Loading chart...</p>
            ) : chartData.length === 0 ? (
              <p>No data available.</p>
            ) : (
              
              <div style={{ width: '100%',
                maxWidth: '100%',
                overflow: 'hidden', 
                padding:0,
                display: 'flex',
                justifyContent:'center',
                alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1e1e',
                      borderColor: '#555',
                      borderRadius: '10px'
                    }}
                    itemStyle={{ color: '#00ff99' }}
                    labelStyle={{ color: '#ccc' }}
                  />
                  <Line
                    type="natural"
                    dataKey="volume"
                    stroke="#00ff99"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>            
            )}
          </div>
        </Col>

        {/* Placeholder Section */}
        <Col md={6}>
          <div className='p-4 bg-dark rounded shadow-sm h-100 d-flex justify-content-center align-items-center'>
            <h4 className='text-center text-white'>
              📌 leaderboards coming soon..!
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
