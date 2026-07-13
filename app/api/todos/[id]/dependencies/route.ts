import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { wouldCreateCycle } from '@/lib/dependency-utils';

interface Params {
  params: {
    id: string;
  };
}

// Add a dependency (prerequisiteId is provided in the body)
export async function POST(request: Request, { params }: Params) {
  const dependentId = parseInt(params.id);
  if (isNaN(dependentId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const { prerequisiteId } = await request.json();
    if (!prerequisiteId || isNaN(parseInt(prerequisiteId))) {
      return NextResponse.json({ error: 'Prerequisite ID is required' }, { status: 400 });
    }

    const prereqId = parseInt(prerequisiteId);

    // Can't depend on itself
    if (dependentId === prereqId) {
      return NextResponse.json({ error: 'A task cannot depend on itself' }, { status: 400 });
    }

    // Check if both todos exist
    const [dependent, prerequisite] = await Promise.all([
      prisma.todo.findUnique({ where: { id: dependentId } }),
      prisma.todo.findUnique({ where: { id: prereqId } }),
    ]);

    if (!dependent || !prerequisite) {
      return NextResponse.json({ error: 'One or both tasks not found' }, { status: 404 });
    }

    // Check if dependency already exists
    const existing = await prisma.todoDependency.findUnique({
      where: {
        dependentId_prerequisiteId: {
          dependentId,
          prerequisiteId: prereqId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Dependency already exists' }, { status: 400 });
    }

    // Check for circular dependency
    const todos = await prisma.todo.findMany({
      include: {
        dependsOn: true,
        dependentTasks: true,
      },
    });

    if (wouldCreateCycle(todos, dependentId, prereqId)) {
      return NextResponse.json(
        { error: 'Adding this dependency would create a circular dependency' },
        { status: 400 }
      );
    }

    // Create the dependency
    const dependency = await prisma.todoDependency.create({
      data: {
        dependentId,
        prerequisiteId: prereqId,
      },
    });

    return NextResponse.json(dependency, { status: 201 });
  } catch (error) {
    console.error('Error creating dependency:', error);
    return NextResponse.json({ error: 'Error creating dependency' }, { status: 500 });
  }
}

// Remove a dependency
export async function DELETE(request: Request, { params }: Params) {
  const dependentId = parseInt(params.id);
  if (isNaN(dependentId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const { prerequisiteId } = await request.json();
    if (!prerequisiteId || isNaN(parseInt(prerequisiteId))) {
      return NextResponse.json({ error: 'Prerequisite ID is required' }, { status: 400 });
    }

    const prereqId = parseInt(prerequisiteId);

    await prisma.todoDependency.delete({
      where: {
        dependentId_prerequisiteId: {
          dependentId,
          prerequisiteId: prereqId,
        },
      },
    });

    return NextResponse.json({ message: 'Dependency removed' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting dependency:', error);
    return NextResponse.json({ error: 'Error deleting dependency' }, { status: 500 });
  }
}
