import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Removed edge runtime to avoid build-time import issues
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check if required services are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: 'AI chat not configured',
          message: 'This is a demo environment. To enable AI chat, configure Supabase and Gemini API credentials.'
        },
        { status: 503 }
      );
    }

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

    // Dynamic imports to avoid build-time issues
    const { retrieveContext, buildRAGPrompt } = await import('@/lib/gemini/rag');
    const { generateStreamingChatResponse } = await import('@/lib/gemini/client');

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
