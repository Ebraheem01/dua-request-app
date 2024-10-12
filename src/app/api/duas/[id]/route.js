import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

export async function GET(req, { params }) {
    try {
        const { id } = params

        await dbConnect()
        const dua = await Dua.findById(id)

        if (!dua) {
            return NextResponse.json({ error: 'Dua not found' }, { status: 404 })
        }

        return NextResponse.json({ dua }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/duas/[id]:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}