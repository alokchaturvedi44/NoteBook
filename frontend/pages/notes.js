import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { notesAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    useEffect(() => {
        fetchNotes();
    }, [searchQuery, tagFilter]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (tagFilter) params.tags = tagFilter;

            const response = await notesAPI.getAll(params);
            setNotes(response.data.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const noteData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            if(editingNote) {
                await notesAPI.update(editingNote._id, noteData);
                toast.success('Note updated successfully!');
            } 
            else{
                await notesAPI.create(noteData);
                toast.success('Note created successfully!');
            }
            setShowModal(false);
            setFormData({ title: '', content: '', tags: '' });
            setEditingNote(null);
            fetchNotes();
        } 
        catch(error){
            console.error('Error saving note:', error);
            toast.error(error.response?.data?.message || 'Failed to save note');
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags.join(', '),
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await notesAPI.delete(id);
            toast.success('Note deleted successfully!'); 
            fetchNotes();
        } 
        catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    const toggleFavorite = async (note) => {
        try {
            await notesAPI.update(note._id, { ...note, isFavorite: !note.isFavorite });
            toast.success(note.isFavorite ? 'Removed from favorites' : 'Added to favorites');
            fetchNotes();
        } 
        catch (error) {
            console.error('Error updating favorite:', error);
             toast.error('Failed to update favorite');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                    <button
                        onClick={() => {
                            setEditingNote(null);
                            setFormData({ title: '', content: '', tags: '' });
                            setShowModal(true);
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                        + New Note
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search notes..."
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

                {/* Notes Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No notes found. Create your first note!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map((note) => (
                            <div key={note._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900 flex-1">{note.title}</h3>
                                    <button
                                        onClick={() => toggleFavorite(note)}
                                        className="text-2xl"
                                    >
                                        {note.isFavorite ? '⭐' : '☆'}
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                                {note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {note.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
                                {editingNote ? 'Edit Note' : 'Create New Note'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                                        placeholder="javascript, tutorial, coding"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        {editingNote ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingNote(null);
                                            setFormData({ title: '', content: '', tags: '' });
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
