import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { FileCheck } from 'lucide-react'

const PreliminaryReportCheck = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/student/preliminary-report-status')
        setStatus(response.data.status)
      } catch (err) {
        setError('Failed to load preliminary report status')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-blue-500/10 p-2 w-fit">
          <FileCheck className="h-6 w-6 text-blue-500" />
        </div>
        <CardTitle className="mt-4">Preliminary Report Check</CardTitle>
        <CardDescription>Check preliminary report status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading status...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="font-semibold mb-4">Status: {status}</p>
        )}
        <Button
          variant="secondary"
          className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreliminaryReportCheck