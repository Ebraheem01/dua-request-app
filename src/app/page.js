'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Filter, SortDesc, PlusCircle } from 'lucide-react'
import DuaRequestForm from '@/components/DuaRequestForm'
import DuaList from '@/components/DuaList'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useAuth()
  const [showDuaForm, setShowDuaForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DuaShare
            </Link>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium" afterSignInUrl="/" />
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DuaShare</h1>
          <p className="text-xl text-gray-600 mb-6">Share and support each other through prayers</p>

          <button
            onClick={() => setShowDuaForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center"
          >
            <PlusCircle className="mr-2" size={24} />
            Request Dua
          </button>
        </div>

        {showDuaForm && (
          <DuaRequestForm onClose={() => setShowDuaForm(false)} />
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="all">All Categories</option>
                <option value="health">Health</option>
                <option value="success">Success</option>
                <option value="family">Family</option>
              </select>
              <Filter className="text-gray-500" />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-supported">Most Supported</option>
              </select>
              <SortDesc className="text-gray-500" />
            </div>
          </div>

          <DuaList filter={filter} sort={sort} />
        </div>
      </main>
    </div>
  )
}