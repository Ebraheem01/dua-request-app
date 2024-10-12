import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

export async function POST(req, { params }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        await dbConnect()
        const dua = await Dua.findById(id)

        if (!dua) {
            return NextResponse.json({ error: 'Dua not found' }, { status: 404 })
        }

        // Generate a shareable link
        const shareableLink = `${process.env.NEXT_PUBLIC_APP_URL}/shared-dua/${id}`

        return NextResponse.json({ shareableLink }, { status: 200 })
    } catch (error) {
        console.error('Error in POST /api/duas/[id]/share:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}