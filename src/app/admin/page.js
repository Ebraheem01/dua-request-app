'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [duas, setDuas] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const { userId, isLoaded, isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/')
        } else if (isSignedIn) {
            checkAdminStatus()
        }
    }, [isLoaded, isSignedIn])

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('/api/admin/check')
            if (!response.ok) {
                throw new Error('Not authorized')
            }
            fetchData()
        } catch (error) {
            toast.error('You are not authorized to view this page')
            router.push('/')
        }
    }

    const fetchData = async () => {
        try {
            const [duasResponse, usersResponse] = await Promise.all([
                fetch('/api/admin/duas'),
                fetch('/api/admin/users')
            ])

            if (!duasResponse.ok || !usersResponse.ok) {
                throw new Error('Failed to fetch data')
            }

            const duasData = await duasResponse.json()
            const usersData = await usersResponse.json()

            setDuas(duasData.duas)
            setUsers(usersData.users)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to fetch data')
            setLoading(false)
        }
    }

    const handleDeleteDua = async (duaId) => {
        try {
            const response = await fetch(`/api/admin/duas/${duaId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete dua')
            }

            setDuas(duas.filter(dua => dua._id !== duaId))
            toast.success('Dua deleted successfully')
        } catch (error) {
            toast.error('Failed to delete dua')
        }
    }

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            setUsers(users.filter(user => user.id !== userId))
            toast.success('User deleted successfully')
        } catch (error) {
            toast.error('Failed to delete user')
        }
    }

    if (loading) {
        return <div className="text-center py-4">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="mb-12 text-gray-600">
                <h2 className="text-2xl font-semibold mb-4">Duas</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">User</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {duas.map((dua) => (
                                <tr key={dua._id}>
                                    <td className="border px-4 py-2">{dua.title}</td>
                                    <td className="border px-4 py-2">{dua.description}</td>
                                    <td className="border px-4 py-2">{dua.userIdentifier}</td>
                                    <td className="border px-4 py-2">{dua.category}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteDua(dua._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Users</h2>
                <div className="overflow-x-auto text-gray-600">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Username</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border px-4 py-2">{user.emailAddresses[0].emailAddress}</td>
                                    <td className="border px-4 py-2">{user.username || user.firstName || user.email}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}