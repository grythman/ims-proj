import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Calendar } from 'lucide-react'

const ViewInternshipDuration = () => {
  const [duration, setDuration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDuration = async () => {
      try {
        const response = await axios.get('/api/student/internship-duration')
        setDuration(response.data)
      } catch (err) {
        setError('Failed to load internship duration')
      } finally {
        setLoading(false)
      }
    }

    fetchDuration()
  }, [])

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-orange-500/10 p-2 w-fit">
          <Calendar className="h-6 w-6 text-orange-500" />
        </div>
        <CardTitle className="mt-4">Internship Duration</CardTitle>
        <CardDescription>View your internship timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading duration...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : duration ? (
          <div>
            <p className="font-semibold">Start Date: {duration.startDate}</p>
            <p className="font-semibold mt-2">End Date: {duration.endDate}</p>
            <p className="mt-2">Total Duration: {duration.totalDays} days</p>
          </div>
        ) : (
          <p>No internship duration available.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewInternshipDuration