import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { Users } from 'lucide-react'

const ViewMentorEvaluation = () => {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await axios.get('/api/student/mentor-evaluation')
        setEvaluation(response.data)
      } catch (err) {
        setError('Failed to load mentor evaluation')
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [])

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-purple-500/10 p-2 w-fit">
          <Users className="h-6 w-6 text-purple-500" />
        </div>
        <CardTitle className="mt-4">Mentor's Evaluation</CardTitle>
        <CardDescription>View feedback from your mentor</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading evaluation...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : evaluation ? (
          <div>
            <p className="font-semibold">Score: {evaluation.score}</p>
            <p className="mt-2">{evaluation.feedback}</p>
          </div>
        ) : (
          <p>No evaluation available yet.</p>
        )}
        <Button
          variant="secondary"
          className="w-full mt-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500"
          disabled={!evaluation}
        >
          View Full Evaluation
        </Button>
      </CardContent>
    </Card>
  )
}

export default ViewMentorEvaluation