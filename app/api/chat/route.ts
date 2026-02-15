import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { retrieveContext, buildRAGPrompt } from '@/lib/gemini/rag';
import { generateStreamingChatResponse } from '@/lib/gemini/client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is a member
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roles = (sessionClaims?.metadata as any)?.role || [];
    const isMember = roles.includes('member') || roles.includes('admin');

    if (!isMember) {
      return NextResponse.json({ error: 'Members only' }, { status: 403 });
    }

    // Get the user's message
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Retrieve relevant context using RAG
    const context = await retrieveContext(message, 5);

    // Build the RAG prompt
    const systemPrompt = await buildRAGPrompt(message, context);

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateStreamingChatResponse('', systemPrompt)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
