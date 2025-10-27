
const OPENAI_KEY = process.env.OPENAI_API_KEY;
let OpenAI;
if (OPENAI_KEY) {
try { OpenAI = require('openai'); } catch (e) { OpenAI = null; }
}
async function aiReply(body) {
if (OPENAI_KEY && OpenAI) {
const client = new OpenAI.OpenAI({ apiKey: OPENAI_KEY });
const messages = body.messages || [];
const chatText = messages.map(m => `${m.user}: ${m.text}`).join('\n');
const prompt = `You are LOCOM assistant. Provide a short (2-3 sentences) 
friendly summary or reply to the conversation below. Conversation:\n\n$
{chatText}`;
const resp = await client.chat.completions.create({ model: 'gpt-4o-mini',
messages: [{ role: 'user', content: prompt }], max_tokens: 200 });
const content = resp.choices && resp.choices[0] && resp.choices[0].message
&& resp.choices[0].message.content;
return content || 'Sorry, no reply.';
} else {
const messages = body.messages || [];
if (!messages.length) return 'No messages to summarize.';
const last = messages.slice(-3);
const users = Array.from(new Set(last.map(m => m.user))).join(', ');
const summary = `Recent messages by ${users}: ` + last.map(m => `${m.user}: 
${m.text}`).join(' / ');
return summary.slice(0, 600);
}
}
module.exports = { aiReply };
exports.aiReply = aiReply;<