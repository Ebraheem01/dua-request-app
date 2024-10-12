'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Heart, MessageCircle, Share2, User, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

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

export default function DuaList({ filter, sort }) {
    const { userId, isSignedIn } = useAuth()
    const [duas, setDuas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [supportedDuas, setSupportedDuas] = useState({})
    const [commentedDuas, setCommentedDuas] = useState({})
    const [expandedComments, setExpandedComments] = useState({})
    const [showCommentOptions, setShowCommentOptions] = useState({})

    useEffect(() => {
        fetchDuas()
        if (isSignedIn) {
            fetchSupportedDuas()
            fetchCommentedDuas()
        }
    }, [filter, sort, isSignedIn])

    const fetchDuas = async () => {
        try {
            const response = await fetch(`/api/duas?filter=${filter}&sort=${sort}`)
            if (!response.ok) {
                throw new Error('Failed to fetch duas')
            }
            const data = await response.json()
            setDuas(data.duas)
            setLoading(false)
        } catch (error) {
            setError('An error occurred while fetching duas')
            setLoading(false)
        }
    }

    const fetchSupportedDuas = async () => {
        try {
            const response = await fetch('/api/user/supported-duas')
            if (!response.ok) {
                throw new Error('Failed to fetch supported duas')
            }
            const data = await response.json()
            setSupportedDuas(data.supportedDuas.reduce((acc, duaId) => {
                acc[duaId] = true
                return acc
            }, {}))
        } catch (error) {
            console.error('Error fetching supported duas:', error)
        }
    }

    const fetchCommentedDuas = async () => {
        try {
            const response = await fetch('/api/user/commented-duas')
            if (!response.ok) {
                throw new Error('Failed to fetch commented duas')
            }
            const data = await response.json()
            setCommentedDuas(data.commentedDuas.reduce((acc, duaId) => {
                acc[duaId] = true
                return acc
            }, {}))
        } catch (error) {
            console.error('Error fetching commented duas:', error)
        }
    }

    const handleSupport = async (duaId) => {
        if (!isSignedIn) {
            toast.error('Please sign in to support this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${duaId}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to support dua')
            }
            const data = await response.json()
            setSupportedDuas(prev => ({ ...prev, [duaId]: !prev[duaId] }))
            setDuas(duas.map(dua =>
                dua._id === duaId ? { ...dua, supportCount: data.supportCount } : dua
            ))
            toast.success('Dua supported successfully')
        } catch (error) {
            toast.error('An error occurred while supporting the dua')
        }
    }

    const handleComment = async (duaId, comment) => {
        if (!isSignedIn) {
            toast.error('Please sign in to comment on this dua')
            return
        }

        if (commentedDuas[duaId]) {
            toast.error('You have already commented on this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${duaId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment }),
            })
            if (!response.ok) {
                throw new Error('Failed to comment on dua')
            }
            const data = await response.json()
            setCommentedDuas(prev => ({ ...prev, [duaId]: true }))
            setDuas(duas.map(dua =>
                dua._id === duaId ? { ...dua, comments: [...(dua.comments || []), data.comment] } : dua
            ))
            setShowCommentOptions(prev => ({ ...prev, [duaId]: false }))
            toast.success('Comment added successfully')
        } catch (error) {
            toast.error('An error occurred while commenting on the dua')
        }
    }

    const handleShare = async (duaId) => {
        if (!isSignedIn) {
            toast.error('Please sign in to share this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${duaId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to generate shareable link')
            }
            const data = await response.json()

            // Copy the shareable link to clipboard
            await navigator.clipboard.writeText(data.shareableLink)
            toast.success('Shareable link copied to clipboard')
        } catch (error) {
            toast.error('An error occurred while generating the shareable link')
        }
    }

    const toggleCommentOptions = (duaId) => {
        setShowCommentOptions(prev => ({ ...prev, [duaId]: !prev[duaId] }))
    }

    const toggleExpandComments = (duaId) => {
        setExpandedComments(prev => ({ ...prev, [duaId]: !prev[duaId] }))
    }

    if (loading) return <div className="text-center py-4">Loading...</div>
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>

    return (
        <div className="space-y-6">
            {duas.map((dua) => (
                <div key={dua._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        {dua.isAnonymous ? (
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                                <User className="text-gray-600" size={24} />
                            </div>
                        ) : (
                            <Image
                                src={dua.profileImageUrl || '/placeholder-user.jpg'}
                                alt={`${dua.userIdentifier || 'User'}'s profile`}
                                width={40}
                                height={40}
                                className="rounded-full mr-3"
                            />
                        )}
                        <div>
                            <p className="font-semibold text-gray-700">
                                {dua.isAnonymous ? 'Anonymous' : dua.userIdentifier}
                            </p>
                            <p className="text-sm text-gray-500">{new Date(dua.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">{dua.title}</h3>
                    <p className="text-gray-700 mb-4">{dua.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{dua.category}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handleSupport(dua._id)}
                            className="flex items-center text-gray-600 hover:text-red-600"
                        >
                            <Heart
                                className={`mr-1 ${supportedDuas[dua._id] ? 'fill-red-500 text-red-500' : ''}`}
                                size={20}
                            />
                            <span>{dua.supportCount || 0}</span>
                        </button>
                        <button
                            onClick={() => toggleCommentOptions(dua._id)}
                            className={`flex items-center ${commentedDuas[dua._id] ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
                            disabled={commentedDuas[dua._id]}
                        >
                            <MessageCircle className="mr-1" size={20} />
                            <span>Comment</span>
                        </button>
                        <button onClick={() => handleShare(dua._id)} className="flex items-center text-gray-600 hover:text-green-600">
                            <Share2 className="mr-1" size={20} />
                            <span>Share</span>
                        </button>
                    </div>
                    {showCommentOptions[dua._id] && !commentedDuas[dua._id] && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {PREDEFINED_COMMENTS.map((comment) => (
                                <button
                                    key={comment}
                                    onClick={() => handleComment(dua._id, comment)}
                                    className="bg-green-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm max-w-full break-words"
                                >
                                    {comment}
                                </button>
                            ))}
                        </div>
                    )}
                    {dua.comments && dua.comments.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold mb-2 text-gray-400">Comments:</h4>
                            <ul className="space-y-4">
                                {(expandedComments[dua._id] ? dua.comments : dua.comments.slice(-3)).map((comment, index) => (
                                    <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                                        <div className="flex items-center mb-1">
                                            <Image
                                                src={comment.profileImageUrl || '/placeholder-user.jpg'}
                                                alt={`${comment.userIdentifier || 'User'}'s profile`}
                                                width={24}
                                                height={24}
                                                className="rounded-full mr-2"
                                            />
                                            <span className="font-semibold mr-2">{comment.userIdentifier || 'Anonymous'}</span>
                                            <span className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p>{comment.comment}</p>
                                    </li>
                                ))}
                            </ul>
                            {dua.comments.length > 3 && (
                                <button
                                    onClick={() => toggleExpandComments(dua._id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center"
                                >
                                    {expandedComments[dua._id] ? (
                                        <>
                                            <ChevronUp size={16} className="mr-1" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={16} className="mr-1" />
                                            Read more ({dua.comments.length - 3} more)
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}