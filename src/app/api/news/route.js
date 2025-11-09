import { NextResponse } from 'next/server';
import { posts } from '@/data/posts';

// In-memory data store
let newsPosts = [...posts];

// GET handler to retrieve all posts
export async function GET() {
  return NextResponse.json(newsPosts);
}

// POST handler to add a new post
export async function POST(request) {
  try {
    const newPost = await request.json();
    newPost.id = newsPosts.length + 1; // Simple ID generation
    newsPosts.unshift(newPost); // Add to the beginning of the array
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding post', error }, { status: 500 });
  }
}
