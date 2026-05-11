"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Send, User, Image as ImageIcon, FileText, Loader2, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

export default function AskDocumentPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [threadId] = useState(() => uuidv4());

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isPending) return;
    
    const userMessage = input;
    setInput("");
    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMessage, toolCalls: [] }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, threadId })
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
      setIsPending(data.isPending);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHitlAction = async (action: "resume" | "reject", toolCallId: string) => {
    setIsLoading(true);
    setIsPending(false); // Optimistic UI
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, threadId, toolCallId })
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
      setIsPending(data.isPending);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find the pending tool call from the last assistant message
  const lastMessage = messages[messages.length - 1];
  const pendingToolCall = isPending && lastMessage?.role === "assistant" && lastMessage.toolCalls?.length > 0 
    ? lastMessage.toolCalls[0] 
    : null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl flex flex-col h-[85vh]">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          Agentic Assistant
        </h1>
        <p className="text-slate-500 mt-2">
          Ask questions about your uploaded documents, or ask the agent to process images. 
          Image processing is a <span className="font-semibold text-primary">Pro</span> feature and requires your approval (HITL).
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-primary/20 bg-slate-50">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Bot className="h-16 w-16 opacity-20" />
              <p>Hello! I can search your documents or process images using LangGraph.</p>
              <div className="flex gap-4 text-sm mt-4 opacity-70">
                <span className="flex items-center gap-1"><FileText className="h-4 w-4"/> Document QA (Free)</span>
                <span className="flex items-center gap-1"><ImageIcon className="h-4 w-4"/> Image Processing (Pro)</span>
              </div>
            </div>
          ) : (
           messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-primary/10 text-primary" : "bg-slate-800 text-white"}`}>
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  {m.content && typeof m.content === 'string' && (
                    <div className={`px-4 py-2 rounded-2xl ${m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"}`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  )}

                  {m.role === "assistant" && m.toolCalls?.map((tool: any, i: number) => (
                    <div key={i} className="text-xs flex flex-col gap-2 bg-yellow-50 border border-yellow-200 text-slate-700 px-4 py-3 rounded-xl font-mono shadow-sm">
                      <div className="flex items-center gap-2">
                         <Lock className="h-4 w-4 text-yellow-600" />
                         <span className="font-semibold text-yellow-700">Action Pending: {tool.name}</span>
                      </div>
                      <p className="text-slate-500 break-all">{JSON.stringify(tool.args)}</p>
                    </div>
                  ))}
                  
                  {m.role === "tool" && (
                    <div className="text-xs flex items-center gap-2 bg-green-50 border border-green-200 text-slate-600 px-3 py-1.5 rounded-full font-mono shadow-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Tool completed.</span>
                      {m.content?.includes("http") && (
                        <a href={m.content.match(/https?:\/\/[^\s]+/)?.[0]} target="_blank" rel="noreferrer" className="text-blue-500 underline ml-1">
                          View Result
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
           ))
          )}

          {isPending && pendingToolCall && (
            <div className="flex justify-start">
               <div className="flex gap-3 max-w-[80%] flex-row">
                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Lock size={16} />
                 </div>
                 <div className="flex flex-col gap-2 items-start bg-red-50 border border-red-200 p-4 rounded-2xl rounded-tl-none">
                    <p className="text-sm font-semibold text-red-800">Safety Check: Human Approval Required</p>
                    <p className="text-xs text-red-600 mb-2">The AI wants to run <strong>{pendingToolCall.name}</strong>. This action may modify data or use Pro credits.</p>
                    <div className="flex gap-2">
                       <button onClick={() => handleHitlAction("resume", pendingToolCall.id)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                         <CheckCircle size={14} /> Approve Action
                       </button>
                       <button onClick={() => handleHitlAction("reject", pendingToolCall.id)} className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                         <XCircle size={14} /> Reject
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
               <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Loader2 size={16} className="animate-spin" />
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleFormSubmit} className="flex gap-2 relative">
            <input
              className="flex-1 w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm pr-12"
              value={input}
              placeholder={isPending ? "Waiting for your approval above..." : "Ask about your documents or request image processing..."}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isPending}
            />
            <button 
              type="submit" 
              disabled={isLoading || isPending || !input.trim()}
              className="absolute right-2 top-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}