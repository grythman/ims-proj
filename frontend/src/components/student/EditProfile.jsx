import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { UserCog } from 'lucide-react'

const EditProfile = () => {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)

  const handleEdit = async () => {
    setEditing(true)
    setError(null)
    try {
      // In a real application, you would open a modal or navigate to an edit form
      // For this example, we'll just simulate an API call
      await axios.put('/api/student/profile', { /* updated profile data */ })
      // Handle successful edit (e.g., show a success message)
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setEditing(false)
    }
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-pink-500/10 p-2 w-fit">
          <UserCog className="h-6 w-6 text-pink-500" />
        </div>
        <CardTitle className="mt-4">Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="secondary"
          className="w-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-500"
          onClick={handleEdit}
          disabled={editing}
        >
          {editing ? 'Updating...' : 'Edit Profile'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default EditProfile