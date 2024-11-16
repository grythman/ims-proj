import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { BookOpen } from 'lucide-react'

const RegisterInternship = () => {
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    setRegistering(true)
    setError(null)
    try {
      await axios.post('/api/student/register-internship')
      // Handle successful registration (e.g., show a success message)
    } catch (err) {
      setError('Failed to register internship')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-green-500/10 p-2 w-fit">
          <BookOpen className="h-6 w-6 text-green-500" />
        </div>
        <CardTitle className="mt-4">Register Internship</CardTitle>
        <CardDescription>Register for a new internship</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="secondary"
          className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? 'Registering...' : 'Register Now'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default RegisterInternship