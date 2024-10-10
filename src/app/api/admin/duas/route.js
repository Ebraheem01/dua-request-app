import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

const ADMIN_IDS = ['user_2n6lqs0UiEisVYBOGyA4SyNPuBs', 'user_2nBxPoMoXk0rzbJMCf9yIyGckgS'] // Replace with actual admin user IDs

export async function GET() {
    try {
        const { userId } = auth()
        if (!userId || !ADMIN_IDS.includes(userId)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const duas = await Dua.find({}).sort({ createdAt: -1 })
        return NextResponse.json({ duas }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/admin/duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}