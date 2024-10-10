import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

const ADMIN_IDS = ['user_2n6lqs0UiEisVYBOGyA4SyNPuBs', 'user_2nBxPoMoXk0rzbJMCf9yIyGckgS'] // Replace with actual admin user IDs

export async function DELETE(req, { params }) {
    try {
        const { userId } = auth()
        if (!userId || !ADMIN_IDS.includes(userId)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        // Delete user from Clerk
        await clerkClient.users.deleteUser(id)

        // Delete user's duas from MongoDB
        await dbConnect()
        await Dua.deleteMany({ userId: id })

        return NextResponse.json({ message: 'User and associated duas deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error in DELETE /api/admin/users/[id]:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}