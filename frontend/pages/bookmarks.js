import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { bookmarksAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        description: '',
        tags: '',
    });

    useEffect(() => {
        fetchBookmarks();
    }, [searchQuery, tagFilter]);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (tagFilter) params.tags = tagFilter;

            const response = await bookmarksAPI.getAll(params);
            setBookmarks(response.data.data);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            ('Failed to fetch bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookmarkData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            if (editingBookmark) {
                await bookmarksAPI.update(editingBookmark._id, bookmarkData);
            } else {
                await bookmarksAPI.create(bookmarkData);
            }

            setShowModal(false);
            setFormData({ url: '', title: '', description: '', tags: '' });
            setEditingBookmark(null);
            fetchBookmarks();
        } catch (error) {
            console.error('Error saving bookmark:', error);
            toast.error(error.response?.data?.message || 'Failed to save bookmark');
        }
    };

    const handleEdit = (bookmark) => {
        setEditingBookmark(bookmark);
        setFormData({
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            tags: bookmark.tags.join(', '),
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return;

        try {
            await bookmarksAPI.delete(id);
            fetchBookmarks();
        } 
        catch (error) {
            console.error('Error deleting bookmark:', error);
            toast.error('Failed to delete bookmark');
        }
    };

    const toggleFavorite = async (bookmark) => {
        try {
            await bookmarksAPI.update(bookmark._id, { ...bookmark, isFavorite: !bookmark.isFavorite });
            fetchBookmarks();
        } 
        catch (error) {
            console.error('Error updating favorite:', error);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
                    <button
                        onClick={() => {
                            setEditingBookmark(null);
                            setFormData({ url: '', title: '', description: '', tags: '' });
                            setShowModal(true);
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                        + New Bookmark
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search bookmarks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Filter by tags (comma-separated)"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {/* Bookmarks List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No bookmarks found. Create your first bookmark!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{bookmark.title}</h3>
                                            <button
                                                onClick={() => toggleFavorite(bookmark)}
                                                className="text-xl"
                                            >
                                                {bookmark.isFavorite ? '⭐' : '☆'}
                                            </button>
                                        </div>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:text-primary-800 text-sm break-all"
                                        >
                                            {bookmark.url}
                                        </a>
                                    </div>
                                </div>
                                {bookmark.description && (
                                    <p className="text-gray-600 mb-3">{bookmark.description}</p>
                                )}
                                {bookmark.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {bookmark.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
                                    >
                                        Visit
                                    </a>
                                    <button
                                        onClick={() => handleEdit(bookmark)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bookmark._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                {editingBookmark ? 'Edit Bookmark' : 'Create New Bookmark'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title (leave empty to auto-fetch)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="web, design, resources"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        {editingBookmark ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingBookmark(null);
                                            setFormData({ url: '', title: '', description: '', tags: '' });
                                        }}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
