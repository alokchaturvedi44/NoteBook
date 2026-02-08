import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/notes');
        }
    }, [router]);

    return (
        <Layout>
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to Notes & Bookmark Manager
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Organize your thoughts and favorite links in one place
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-2xl font-semibold mb-2">Notes</h3>
                        <p className="text-gray-600">
                            Create, organize, and search your notes with tags. Mark favorites for quick access.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-4xl mb-4">🔖</div>
                        <h3 className="text-2xl font-semibold mb-2">Bookmarks</h3>
                        <p className="text-gray-600">
                            Save your favorite websites with auto-fetched titles. Filter by tags and search easily.
                        </p>
                    </div>
                </div>

                <div className="space-x-4">
                    <Link
                        href="/notes"
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium text-lg"
                    >
                        Try Without Account
                    </Link>
                    <Link
                        href="/login"
                        className="inline-block bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium text-lg"
                    >
                        Login
                    </Link>
                </div>

                <div className="mt-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Features</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-left">
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">🔍 Search & Filter</h4>
                            <p className="text-sm text-gray-600">Quickly find notes and bookmarks with text search and tag filtering</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">⭐ Favorites</h4>
                            <p className="text-sm text-gray-600">Mark important items as favorites for easy access</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">🔐 Optional Auth</h4>
                            <p className="text-sm text-gray-600">Use without an account or create one to sync across devices</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">🏷️ Tag System</h4>
                            <p className="text-sm text-gray-600">Organize with flexible tagging for both notes and bookmarks</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">🤖 Auto-fetch Titles</h4>
                            <p className="text-sm text-gray-600">Automatically fetch page titles from bookmark URLs</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">📱 Responsive</h4>
                            <p className="text-sm text-gray-600">Works seamlessly on desktop, tablet, and mobile devices</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
