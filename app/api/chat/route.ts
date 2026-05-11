import { NextResponse } from 'next/server';
import { graph } from './agent';
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const authObject = await auth();
    const userId = authObject.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, threadId, action, toolCallId } = await req.json();

    if (!threadId) {
      return NextResponse.json({ error: "threadId is required" }, { status: 400 });
    }

    const config = { configurable: { thread_id: threadId } };

    if (action === "resume") {
      await graph.invoke(null, config);
    } else if (action === "reject") {
        await graph.updateState(config, {
            messages: [new ToolMessage({ tool_call_id: toolCallId, content: "User rejected the action." })]
        }, "agent");
        await graph.invoke(null, config);
    } else if (message) {
      await graph.invoke(
        { messages: [new HumanMessage(message)] },
        config
      );
    }

    const currentState = await graph.getState(config);
    const rawMessages = currentState.values.messages || [];
    
    // Map LangChain messages to a simple format for the frontend
    const messages = rawMessages.map((msg: any) => ({
      id: msg.id || Math.random().toString(),
      role: msg._getType() === 'human' ? 'user' : msg._getType() === 'ai' ? 'assistant' : 'tool',
      content: msg.content,
      toolCalls: msg.tool_calls || []
    }));

    return NextResponse.json({ 
      messages, 
      isPending: currentState.next?.length > 0,
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
