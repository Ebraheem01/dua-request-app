'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Heart, MessageCircle, Share2, User, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


export default function SharedDua({ params }) {
    const { userId, isSignedIn } = useAuth()
    const [dua, setDua] =

        useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [supported, setSupported] = useState(false)
    const [commented, setCommented] = useState(false)
    const [expandedComments, setExpandedComments] = useState(false)
    const [showCommentOptions, setShowCommentOptions] = useState(false)

    useEffect(() => {
        fetchDua()
    }, [])

    const fetchDua = async () => {
        try {
            const response = await fetch(`/api/duas/${params.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch dua')
            }
            const data = await response.json()
            setDua(data.dua)
            setLoading(false)
        } catch (error) {
            setError('An error occurred while fetching the dua')
            setLoading(false)
        }
    }

    const handleSupport = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to support this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${dua._id}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to support dua')
            }
            const data = await response.json()
            setDua(prev => ({ ...prev, supportCount: data.supportCount }))
            setSupported(true)
            toast.success('Dua supported successfully')
        } catch (error) {
            toast.error('An error occurred while supporting the dua')
        }
    }

    const handleComment = async (comment) => {
        if (!isSignedIn) {
            toast.error('Please sign in to comment on this dua')
            return
        }

        if (commented) {
            toast.error('You have already commented on this dua')
            return
        }

        try {
            const response = await fetch(`/api/duas/${dua._id}/comment`, {
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
            setDua(prev => ({ ...prev, comments: [...(prev.comments || []), data.comment] }))
            setCommented(true)
            setShowCommentOptions(false)
            toast.success('Comment added successfully')
        } catch (error) {
            toast.error('An error occurred while commenting on the dua')
        }
    }

    const toggleCommentOptions = () => {
        setShowCommentOptions(prev => !prev)
    }

    const toggleExpandComments = () => {
        setExpandedComments(prev => !prev)
    }

    if (loading) return <div className="text-center py-4">Loading...</div>
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>
    if (!dua) return <div className="text-center py-4">Dua not found</div>

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to Home</Link>

                <SignedOut>
                    <SignInButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium" />
                </SignedOut>
            </div>
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
            <h1 className="text-2xl font-semibold mb-2 text-gray-700">{dua.title}</h1>
            <p className="text-gray-700 mb-4">{dua.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{dua.category}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleSupport}
                    className={`flex items-center ${supported ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                    disabled={supported}
                >
                    <Heart
                        className={`mr-1 ${supported ? 'fill-red-500' : ''}`}
                        size={20}
                    />
                    <span>{dua.supportCount || 0}</span>
                </button>
                <button
                    onClick={toggleCommentOptions}
                    className={`flex items-center ${commented ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
                    disabled={commented}
                >
                    <MessageCircle className="mr-1" size={20} />
                    <span>Comment</span>
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success('Link copied to clipboard')
                    }}
                    className="flex items-center text-gray-600 hover:text-green-600"
                >
                    <Share2 className="mr-1" size={20} />
                    <span>Share</span>
                </button>
            </div>
            {showCommentOptions && !commented && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {['Ameen', 'In Sha Allah', 'Alhamdullilah'].map((comment) => (
                        <button
                            key={comment}
                            onClick={() => handleComment(comment)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm"
                        >
                            {comment}
                        </button>
                    ))}
                </div>
            )}
            {dua.comments && dua.comments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2 text-gray-700">Comments:</h4>
                    <ul className="space-y-4">
                        {(expandedComments ? dua.comments : dua.comments.slice(-3)).map((comment, index) => (
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
                            onClick={toggleExpandComments}
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center"
                        >
                            {expandedComments ? (
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
    )
}