import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { ClipboardEdit } from 'lucide-react'

const SubmitReport = () => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await axios.post('/api/student/submit-report')
      // Handle successful submission (e.g., show a success message)
    } catch (err) {
      setError('Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-primary/10 p-2 w-fit">
          <ClipboardEdit className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="mt-4">Submit Report</CardTitle>
        <CardDescription>Submit your internship reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Now'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default SubmitReport