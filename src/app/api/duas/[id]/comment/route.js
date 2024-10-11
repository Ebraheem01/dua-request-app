import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

const PREDEFINED_COMMENTS = [
    'Ameen',
    'In Sha Allah',
    'Alhamdullilah',
    'Indeed we belong to Allah, and indeed to Him we will return',
    'O Allah, grant him/her success in what You love and are pleased with.',
    'O Allah, cure him/her with a healing that leaves no illness behind.',
    'O Allah, forgive him/her and have mercy on him/her.',
    'O Allah, protect him/her from all directions.',
    'O Allah, make the journey easy for him/her and shorten its distance.',
    'O Allah, bless his/her life, provision, and all his/her affairs.',
    'O Allah, make his/her affairs easy, relieve his/her worry, and remove his/her distress.',
    'O Allah, forgive him, elevate his rank, and make his grave spacious and fill it with light.',
    'O Allah, prolong his/her life in Your obedience, bless him/her in their provision, and rectify all their affairs.',
    'O Allah, guide him/her and grant him/her a good end.'
]

export async function POST(req, { params }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const { comment } = await req.json()

        if (!PREDEFINED_COMMENTS.includes(comment)) {
            return NextResponse.json({ error: 'Invalid comment' }, { status: 400 })
        }

        await dbConnect()
        const dua = await Dua.findById(id)

        if (!dua) {
            return NextResponse.json({ error: 'Dua not found' }, { status: 404 })
        }

        const existingComment = dua.comments.find(c => c.userId === userId)
        if (existingComment) {
            return NextResponse.json({ error: 'You have already commented on this dua' }, { status: 400 })
        }

        const user = await currentUser()
        const userIdentifier = `${user.firstName} ${user.lastName}`
        const profileImageUrl = user.imageUrl

        dua.comments.push({
            userId,
            comment,
            userIdentifier,
            profileImageUrl,
            createdAt: new Date()
        })
        await dua.save()

        return NextResponse.json({
            message: 'Comment added successfully',
            comment: {
                userId,
                comment,
                userIdentifier,
                profileImageUrl,
                createdAt: new Date()
            }
        }, { status: 200 })
    } catch (error) {
        console.error('Error in POST /api/duas/[id]/comment:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}