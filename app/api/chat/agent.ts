import { MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({ 
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
	api_key: process.env.CLOUDINARY_API_KEY, 
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Tools
export const queryDocument = tool(
  async ({ question }, config) => {
    // In a real scenario, use vector search here. 
    // We'll mock it for now since we haven't embedded documents yet.
    return `Mock result: The user uploaded a document that says they want a square image.`;
  },
  {
    name: "queryDocument",
    description: "Query the user's uploaded documents for answers.",
    schema: z.object({
      question: z.string().describe("The question to ask about the documents."),
    }),
  }
);

export const processImage = tool(
  async ({ publicId, action }, config) => {
    // This tool modifies data/costs money, so it requires HITL
    try {
      let url = "";
      switch (action) {
        case 'crop_square':
          url = cloudinary.url(publicId, { width: 500, height: 500, crop: "fill", gravity: "auto" });
          break;
        case 'remove_background':
          url = cloudinary.url(publicId, { effect: "background_removal" });
          break;
        case 'optimize':
          url = cloudinary.url(publicId, { fetch_format: "auto", quality: "auto" });
          break;
      }
      return `Image processed successfully. URL: ${url}`;
    } catch (error: any) {
      return `Error processing image: ${error.message}`;
    }
  },
  {
    name: "processImage",
    description: "Process an image using Cloudinary (Requires human approval).",
    schema: z.object({
      publicId: z.string().describe("The Cloudinary public ID of the image."),
      action: z.enum(['crop_square', 'remove_background', 'optimize']).describe("The action to perform."),
    }),
  }
);

const tools = [queryDocument, processImage];
const toolNode = new ToolNode(tools);

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
}).bindTools(tools);

// Define graph nodes
async function callModel(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const response = await llm.invoke([
    { role: "system", content: "You are an AI assistant. Use the tools provided to help the user. If they ask to process an image, you MUST use the processImage tool, which will ask for their approval." },
    ...messages
  ]);
  return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as any;
  
  if (lastMessage.tool_calls?.length) {
    // If any tool call is high risk (processImage), we route to "hitl_node" or just let LangGraph interrupt before "tools".
    // For simplicity, we just route to "tools". We will configure `interruptBefore: ["tools"]` in the graph compilation.
    return "tools";
  }
  return "__end__";
}

// Build Graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

// Compile with a MemorySaver to persist state and support HITL
export const checkpointer = new MemorySaver();
export const graph = workflow.compile({
  checkpointer,
  interruptBefore: ["tools"] // Interrupt before ANY tool execution. We can make this dynamic if needed.
});
