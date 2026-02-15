import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import BookmarkManager from '@/components/BookmarkManager'

export default async function Home() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    let bookmarks: any[] = []

    if (user) {
        const { data } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            bookmarks = data
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Bookmarks</h1>
                    </div>
                    <AuthButton user={user} />
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                            Your bookmarks, reimagined.
                        </h2>
                        <p className="text-lg text-gray-600 max-w-lg mb-8">
                            A private, elegant space to keep your favorite links organized and accessible.
                            Sign in to get started.
                        </p>
                        <div className="p-1 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 border border-gray-200 shadow-sm">
                            <div className="bg-white rounded-xl p-8">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-500">Secure • Real-time • Simple</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <BookmarkManager initialBookmarks={bookmarks} user={user} />
                )}
            </div>
        </main>
    )
}
