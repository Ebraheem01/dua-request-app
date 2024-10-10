import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
        await dbConnect()
        const deletedDua = await Dua.findByIdAndDelete(id)

        if (!deletedDua) {
            return NextResponse.json({ error: 'Dua not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Dua deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error in DELETE /api/admin/duas/[id]:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}