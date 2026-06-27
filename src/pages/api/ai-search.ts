/**
 * AI Search API endpoint (stub)
 *
 * This endpoint receives a question from the frontend,
 * and should call an LLM API with the llms.txt content as context.
 *
 * TODO: Change `prerender` to `false` and implement the actual LLM integration
 * when backend is ready. The current GET endpoint is a placeholder.
 */
import type { APIRoute } from 'astro';

export const prerender = true;

// Placeholder GET endpoint (static)
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'AI Search API endpoint is ready. Backend LLM integration pending.',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

/*
 * When backend is ready, change prerender to false and use this POST handler:
 *
 * export const prerender = false;
 *
 * export const POST: APIRoute = async ({ request }) => {
 *   try {
 *     const { question } = await request.json();
 *
 *     if (!question || typeof question !== 'string') {
 *       return new Response(
 *         JSON.stringify({ error: '缺少 question 参数' }),
 *         { status: 400, headers: { 'Content-Type': 'application/json' } }
 *       );
 *     }
 *
 *     // 1. Fetch llms.txt content:
 *     //    const llmsTxt = await fetch(`${new URL(request.url).origin}/llms.txt`).then(r => r.text());
 *     //
 *     // 2. Build prompt with context:
 *     //    const prompt = `基于以下文档内容回答用户问题:\n\n${llmsTxt}\n\n用户问题: ${question}\n\n回答:`;
 *     //
 *     // 3. Call LLM API (OpenAI-compatible / Workers AI / etc):
 *     //    const response = await fetch('YOUR_LLM_API_URL', {
 *     //      method: 'POST',
 *     //      headers: {
 *     //        'Content-Type': 'application/json',
 *     //        'Authorization': `Bearer ${import.meta.env.LLM_API_KEY}`,
 *     //      },
 *     //      body: JSON.stringify({ model: 'your-model', messages: [{ role: 'user', content: prompt }], stream: true }),
 *     //    });
 *     //
 *     // 4. Stream SSE response back to client
 *
 *     // Placeholder streaming response
 *     const encoder = new TextEncoder();
 *     const placeholderAnswer = `这是一个占位回复。你问的是: "${question}"\n\n后端 AI 服务尚未配置，请参考代码中的 TODO 注释完成 LLM 集成。`;
 *
 *     const stream = new ReadableStream({
 *       async start(controller) {
 *         const chunks = placeholderAnswer.match(/.{1,10}/gs) || [placeholderAnswer];
 *         for (const chunk of chunks) {
 *           const data = JSON.stringify({ content: chunk });
 *           controller.enqueue(encoder.encode(`data: ${data}\n\n`));
 *           await new Promise((r) => setTimeout(r, 30));
 *         }
 *         controller.enqueue(encoder.encode('data: [DONE]\n\n'));
 *         controller.close();
 *       },
 *     });
 *
 *     return new Response(stream, {
 *       headers: {
 *         'Content-Type': 'text/event-stream',
 *         'Cache-Control': 'no-cache',
 *         'Connection': 'keep-alive',
 *       },
 *     });
 *   } catch (err) {
 *     const message = err instanceof Error ? err.message : '服务器内部错误';
 *     return new Response(
 *       JSON.stringify({ error: message }),
 *       { status: 500, headers: { 'Content-Type': 'application/json' } }
 *     );
 *   }
 * };
 *
 * // Preflight CORS
 * export const OPTIONS: APIRoute = async () => {
 *   return new Response(null, {
 *     headers: {
 *       'Access-Control-Allow-Origin': '*',
 *       'Access-Control-Allow-Methods': 'POST, OPTIONS',
 *       'Access-Control-Allow-Headers': 'Content-Type',
 *     },
 *   });
 * };
 */
