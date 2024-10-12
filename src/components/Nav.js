import Link from 'next/link'
import { MoonStar } from 'lucide-react'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


export default function Nav({ page }) {
    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center justify-center ">
                        <MoonStar className=" mr-2" /> DuaShare
                    </Link>
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            {page === 'dashboard' && <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>}
                            {page === 'home' && <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Dashboard
                            </Link>}

                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium" afterSignInUrl="/" />
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )

}