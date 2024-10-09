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

        await dbConnect()
        const dua = await Dua.findById(params.id)

        if (!dua) {
            return NextResponse.json({ error: 'Dua not found' }, { status: 404 })
        }

        const supportIndex = dua.supporters.indexOf(userId)
        if (supportIndex === -1) {
            dua.supporters.push(userId)
            dua.supportCount = (dua.supportCount || 0) + 1
        } else {
            dua.supporters.splice(supportIndex, 1)
            dua.supportCount = Math.max((dua.supportCount || 0) - 1, 0)
        }

        await dua.save()

        return NextResponse.json({ message: 'Dua support updated successfully', supportCount: dua.supportCount }, { status: 200 })
    } catch (error) {
        console.error('Error in POST /api/duas/[id]/support:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}