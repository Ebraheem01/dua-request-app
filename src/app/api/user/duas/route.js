import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

export async function GET() {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const duas = await Dua.find({ userId }).sort({ createdAt: -1 })

        return NextResponse.json({ duas }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/user/duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}