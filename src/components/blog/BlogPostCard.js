import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlogPostCard = ({ post }) => {
  return (
    <Link href={`/news/${post.slug}`}>
      <div className='border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col'>
        <div className="relative w-full h-48">
          <Image
            src={post.imageUrl}
            alt={`Image for ${post.title}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
