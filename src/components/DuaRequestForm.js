'use client'

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import toast from 'react-hot-toast'

export default function DuaRequestForm({ onClose, onSubmit }) {
    const { userId } = useAuth()
    const { user } = useUser()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('general')
    const [isAnonymous, setIsAnonymous] = useState(false)
    console.log(user)
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userIdentifier = user.firstName || user.username || userId

            const response = await fetch('/api/duas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    title,
                    description,
                    category,
                    isAnonymous,
                    userIdentifier: isAnonymous ? null : userIdentifier,
                    profileImageUrl: isAnonymous ? null : user.imageUrl,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit dua')
            }

            setTitle('')
            setDescription('')
            setCategory('general')
            setIsAnonymous(false)
            onClose()
            if (onSubmit) onSubmit()
            toast.success('Dua submitted successfully')
        } catch (error) {
            console.error('Error submitting dua:', error)
            toast.error('Failed to submit dua. Please try again.')
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Request a Dua</h3>
                    <form onSubmit={handleSubmit} className="mt-2">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            required
                            className="mt-2 p-2 text-gray-600 w-full border rounded"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            required
                            className="mt-2 p-2 w-full border rounded text-gray-600"

                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-2 p-2 w-full border rounded text-gray-600"
                        >
                            <option value="general">General</option>
                            <option value="health">Health</option>
                            <option value="success">Success</option>
                            <option value="family">Family</option>
                            <option value="travel">Travel</option>
                            <option value="birthday">Birthday</option>
                            <option value="safety">Safety</option>
                            <option value="death">Death</option>
                            <option value="community">Community</option>
                        </select>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span className="ml-2 text-gray-600">Post anonymously</span>
                            </label>
                        </div>
                        <div className="items-center px-4 py-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    <button
                        onClick={onClose}
                        className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}