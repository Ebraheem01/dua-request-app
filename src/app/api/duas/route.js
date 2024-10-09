import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Dua from '@/models/Dua'

export async function POST(req) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { title, description, category, isAnonymous, firstName, profileImageUrl } = await req.json()

        await dbConnect()
        const dua = new Dua({
            userId,
            title,
            description,
            category,
            isAnonymous,
            firstName: isAnonymous ? null : firstName,
            profileImageUrl: isAnonymous ? null : profileImageUrl,
        })
        await dua.save()

        return NextResponse.json({ message: 'Dua created successfully', dua }, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const filter = searchParams.get('filter')
        const sort = searchParams.get('sort')

        let query = {}
        if (filter && filter !== 'all') {
            query.category = filter
        }

        let sortOption = {}
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 }
        } else if (sort === 'most-supported') {
            sortOption = { supportCount: -1 }
        } else {
            sortOption = { createdAt: -1 }
        }

        const duas = await Dua.find(query).sort(sortOption)
        return NextResponse.json({ duas }, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/duas:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}