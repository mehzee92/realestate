'use client';

import { useState } from 'react';

const AddNewsModal = ({ isOpen, onClose, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // This will store the URL after upload
  const [imageFile, setImageFile] = useState(null); // This will store the selected file
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let finalImageUrl = imageUrl; // Use existing URL if no new file is selected

    if (imageFile) {
      // --- FILE UPLOAD LOGIC GOES HERE ---
      // In a real application, you would upload imageFile to a server
      // and get a URL back. For now, we'll just log it.

      // Example: const uploadRes = await fetch('/api/upload-image', { method: 'POST', body: formData });
      // Example: const uploadData = await uploadRes.json();
      // Example: finalImageUrl = uploadData.url;
      
      // For demonstration, we'll just use a dummy URL or the file name
      finalImageUrl = `/images/${imageFile.name}`; // Placeholder URL
    }

    const newPost = {
      title,
      author,
      imageUrl: finalImageUrl,
      content,
      date: new Date().toISOString(),
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) {
        throw new Error('Failed to add new post');
      }

      // Clear form and close modal
      setTitle('');
      setAuthor('');
      setImageUrl('');
      setImageFile(null);
      setContent('');
      onPostAdded(); // Callback to notify parent component
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed py-10 inset-0  bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 h-[95%] overflow-y-auto rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Add New News Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {imageFile && <p className="text-sm text-gray-500 mt-1">Selected: {imageFile.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL (auto-filled or manual)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., /images/my-image.jpg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 p-2 rounded mr-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsModal;
