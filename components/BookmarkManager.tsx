'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkManager({ initialBookmarks, user }: { initialBookmarks: Bookmark[], user: User }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const addBookmark = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const url = formData.get('url') as string
        const formElement = e.currentTarget

        // Create temporary ID for optimistic update
        const tempId = Math.random().toString(36).substring(7)
        const newBookmark: Bookmark = {
            id: tempId,
            title,
            url,
            created_at: new Date().toISOString(),
        }

        // Optimistic update: add to state immediately
        setBookmarks((prev) => [newBookmark, ...prev])
        formElement.reset()

        const { error } = await supabase.from('bookmarks').insert({ title, url, user_id: user.id })

        if (error) {
            // Rollback optimistic update on error
            setBookmarks((prev) => prev.filter((b) => b.id !== tempId))
            console.error('Error adding bookmark:', error)
            alert('Failed to add bookmark')
        }
    }

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Failed to delete bookmark')
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={addBookmark} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Bookmark</h2>
                <div className="flex flex-col gap-4">
                    <input
                        name="title"
                        placeholder="Title (e.g., My Portfolio)"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
                    />
                    <div className="flex gap-2">
                        <input
                            name="url"
                            type="url"
                            placeholder="https://..."
                            required
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </form>

            <div className="space-y-4">
                {bookmarks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        No bookmarks yet. Add one above!
                    </div>
                ) : (
                    bookmarks.map((bookmark) => (
                        <div
                            key={bookmark.id}
                            className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                        >
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-0"
                            >
                                <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {bookmark.title}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
                            </a>
                            <button
                                onClick={() => deleteBookmark(bookmark.id)}
                                className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Delete bookmark"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
