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
        const commentedDuas = await Dua.find({ 'comments.userId': userId }).select('_id')
        const commentedDuaIds = commentedDuas.map(dua => dua._id.toString())

        return NextResponse.json({ commentedDuas: commentedDuaIds }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/user/commented-duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}