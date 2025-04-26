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

export default function Progress () {
  const { workoutId } = useParams()
  const [volumeData, setVolumeData] = useState({})
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

  const chartData = Object.entries(volumeData)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Container fluid className='py-5 text-light'>
      <h2 className='text-center mb-5'>Progress Chart</h2>
      <Row>
        {/* Chart Section */}
        <Col md={6}>
          <div className='p-4 bg-dark rounded shadow-sm h-100'>
            {loading ? (
              <p>Loading chart...</p>
            ) : chartData.length === 0 ? (
              <p>No data available.</p>
            ) : (
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1e1e', // dark background
                      borderColor: '#555', // softer border
                      borderRadius: '10px'
                    }}
                    itemStyle={{
                      color: '#00ff99' // color of text inside
                    }}
                    labelStyle={{
                      color: '#ccc' // color of the label (date)
                    }}
                  />
                  <Line
                    type='natural'
                    dataKey='volume'
                    stroke='#00ff99'
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
