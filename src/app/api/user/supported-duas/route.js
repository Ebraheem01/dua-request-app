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
        const supportedDuas = await Dua.find({ supporters: userId }).select('_id')
        const supportedDuaIds = supportedDuas.map(dua => dua._id.toString())

        return NextResponse.json({ supportedDuas: supportedDuaIds }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/user/supported-duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}