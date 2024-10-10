import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const ADMIN_IDS = ['user_2n6lqs0UiEisVYBOGyA4SyNPuBs', 'user_2nBxPoMoXk0rzbJMCf9yIyGckgS'] // Replace with actual admin user IDs

export async function GET() {
    try {
        const { userId } = auth()
        console.log(userId)
        if (!userId || !ADMIN_IDS.includes(userId)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ message: 'Authorized' }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/admin/check:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}