import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCriticalPath } from '@/lib/dependency-utils';

async function fetchPexelsImage(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || apiKey === 'your_pexels_api_key_here') {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('Pexels API error:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        dependsOn: true,
        dependentTasks: true,
      },
    });

    const result = calculateCriticalPath(todos);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, dueDate } = await request.json();
    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!dueDate) {
      return NextResponse.json({ error: 'Due date is required' }, { status: 400 });
    }

    const imageUrl = await fetchPexelsImage(title);

    const todo = await prisma.todo.create({
      data: {
        title,
        dueDate: new Date(dueDate + 'T00:00:00'),
        imageUrl,
      },
      include: {
        dependsOn: true,
        dependentTasks: true,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
}