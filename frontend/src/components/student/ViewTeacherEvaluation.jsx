import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { GraduationCap } from 'lucide-react'

const ViewTeacherEvaluation = () => {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await axios.get('/api/student/teacher-evaluation')
        setEvaluation(response.data)
      } catch (err) {
        setError('Failed to load teacher evaluation')
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [])

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-yellow-500/10 p-2 w-fit">
          <GraduationCap className="h-6 w-6 text-yellow-500" />
        </div>
        <CardTitle className="mt-4">Teacher's Evaluation</CardTitle>
        <CardDescription>View teacher evaluations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading evaluation...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : evaluation ? (
          <div>
            <p className="font-semibold">Grade: {evaluation.grade}</p>
            <p className="mt-2">{evaluation.comments}</p>
          </div>
        ) : (
          <p>No evaluation available yet.</p>
        )}
        <Button
          variant="secondary"
          className="w-full mt-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500"
          disabled={!evaluation}
        >
          View Full Evaluation
        </Button>
      </CardContent>
    </Card>
  )
}

export default ViewTeacherEvaluation