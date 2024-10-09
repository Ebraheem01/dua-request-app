'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { PlusCircle, List, Grid } from 'lucide-react'
import DuaRequestForm from '@/components/DuaRequestForm'

export default function Dashboard() {
    const { userId, isSignedIn } = useAuth()
    const [showDuaForm, setShowDuaForm] = useState(false)
    const [userDuas, setUserDuas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [view, setView] = useState('grid')

    useEffect(() => {
        if (isSignedIn) {
            fetchUserDuas()
        }
    }, [isSignedIn])

    const fetchUserDuas = async () => {
        try {
            const response = await fetch('/api/user/duas')
            if (!response.ok) {
                throw new Error('Failed to fetch user duas')
            }
            const data = await response.json()
            setUserDuas(data.duas)
            setLoading(false)
        } catch (error) {
            setError('An error occurred while fetching your duas')
            setLoading(false)
        }
    }

    if (!isSignedIn) {
        return <div className="text-center py-4">Please sign in to view your dashboard.</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            DuaShare
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Dashboard</h1>
                    <button
                        onClick={() => setShowDuaForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center"
                    >
                        <PlusCircle className="mr-2" size={24} />
                        Request New Dua
                    </button>
                </div>

                {showDuaForm && (
                    <DuaRequestForm onClose={() => setShowDuaForm(false)} onSubmit={fetchUserDuas} />
                )}

                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-gray-600 font-semibold">Your Duas</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                    {loading && <div className="text-center py-4">Loading your duas...</div>}
                    {error && <div className="text-center py-4 text-red-500">{error}</div>}

                    {!loading && !error && (
                        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                            {userDuas.map((dua) => (
                                <div key={dua._id} className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-gray-600 text-xl font-semibold mb-2">{dua.title}</h3>
                                    <p className="text-gray-700 mb-4">{dua.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1  rounded-full">{dua.category}</span>
                                        <span>Supports: {dua.supportCount || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && userDuas.length === 0 && (
                        <div className="text-center py-4 text-gray-500">You haven't submitted any duas yet.</div>
                    )}
                </div>
            </main>
        </div>
    )
}