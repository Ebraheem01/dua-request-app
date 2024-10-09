'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Heart, MessageCircle, Share2, User } from 'lucide-react'
import Image from 'next/image'

export default function DuaList({ filter, sort }) {
    const { userId, isSignedIn } = useAuth()
    const [duas, setDuas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [supportedDuas, setSupportedDuas] = useState({})

    useEffect(() => {
        fetchDuas()
        if (isSignedIn) {
            fetchSupportedDuas()
        }
    }, [filter, sort, isSignedIn])

    const fetchDuas = async () => {
        try {
            const response = await fetch(`/api/duas?filter=${filter}&sort=${sort}`)
            if (!response.ok) {
                throw new Error('Failed to fetch duas')
            }
            const data = await response.json()
            setDuas(data.duas)
            setLoading(false)
        } catch (error) {
            setError('An error occurred while fetching duas')
            setLoading(false)
        }
    }

    const fetchSupportedDuas = async () => {
        try {
            const response = await fetch('/api/user/supported-duas')
            if (!response.ok) {
                throw new Error('Failed to fetch supported duas')
            }
            const data = await response.json()
            setSupportedDuas(data.supportedDuas.reduce((acc, duaId) => {
                acc[duaId] = true
                return acc
            }, {}))
        } catch (error) {
            console.error('Error fetching supported duas:', error)
        }
    }

    const handleSupport = async (duaId) => {
        if (!isSignedIn) {
            alert('Please sign in to support this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${duaId}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to support dua')
            }
            const data = await response.json()
            setSupportedDuas(prev => ({ ...prev, [duaId]: !prev[duaId] }))
            setDuas(duas.map(dua =>
                dua._id === duaId ? { ...dua, supportCount: data.supportCount } : dua
            ))
        } catch (error) {
            setError('An error occurred while supporting the dua')
        }
    }

    if (loading) return <div className="text-center py-4">Loading...</div>
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>

    return (
        <div className="space-y-6">
            {duas.map((dua) => (
                <div key={dua._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        {dua.isAnonymous ? (
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                                <User className="text-gray-600" size={24} />
                            </div>
                        ) : (
                            <Image
                                src={dua.profileImageUrl || '/placeholder-user.jpg'}
                                alt={`${dua.firstName || 'User'}'s profile`}
                                width={40}
                                height={40}
                                className="rounded-full mr-3"
                            />
                        )}
                        <div>
                            <p className="font-semibold">
                                {dua.isAnonymous ? 'Anonymous' : (dua.firstName || dua.userId)}
                            </p>
                            <p className="text-sm text-gray-500">{new Date(dua.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{dua.title}</h3>
                    <p className="text-gray-700 mb-4">{dua.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{dua.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleSupport(dua._id)}
                            className="flex items-center text-gray-600 hover:text-red-600"
                        >
                            <Heart
                                className={`mr-1 ${supportedDuas[dua._id] ? 'fill-red-500 text-red-500' : ''}`}
                                size={20}
                            />
                            <span>{dua.supportCount || 0}</span>
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                            <MessageCircle className="mr-1" size={20} />
                            <span>Comment</span>
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-green-600">
                            <Share2 className="mr-1" size={20} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}