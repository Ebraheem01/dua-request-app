import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

const ADMIN_IDS = ['user_2n6lqs0UiEisVYBOGyA4SyNPuBs', 'user_2nBxPoMoXk0rzbJMCf9yIyGckgS'] // Replace with actual admin user IDs

export async function GET() {
    try {
        const { userId } = auth()
        if (!userId || !ADMIN_IDS.includes(userId)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const users = await clerkClient.users.getUserList();
        console.log(users)
        const simplifiedUsers = users.data.map(user => ({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddresses: user.emailAddresses,
        }))

        return NextResponse.json({ users: simplifiedUsers }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/admin/users:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}