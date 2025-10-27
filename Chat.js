
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
let socket;
export default function Chat() {
const [room, setRoom] = useState('global');
const [user, setUser] = useState('');
const [text, setText] = useState('');
const [messages, setMessages] = useState([]);
const messagesRef = useRef();
useEffect(() => {
socket = io(undefined, { autoConnect: true });
socket.on('connect', () => {
socket.emit('joinRoom', room);
});
socket.on('message', (msg) => setMessages(prev => [...prev, msg]));
return () => socket.disconnect();
}, []);
useEffect(() => {
if (socket && socket.connected) socket.emit('joinRoom', room);
}, [room]);
const send = () => {
if (!text.trim()) return;
const msg = { room, user: user || 'Anonymous', text, ts: Date.now() };
socket.emit('message', msg);
setText('');
setMessages(prev => [...prev, msg]);
};
return (
<div>
<div style={{marginBottom:12}}>
<input placeholder="Your name" value={user}
onChange={(e)=>setUser(e.target.value)} style={{padding:8, borderRadius:8}} />
<select value={room} onChange={e=>setRoom(e.target.value)}
style={{marginLeft:12, padding:8, borderRadius:8}}>
<option value="global">global</option>
<option value="news">news</option>
<option value="local">local</option>
</select>
</div>
<div style={{height:320, overflowY:'auto', border:'1px solid #eee',
padding:8, borderRadius:8, marginBottom:8}} ref={messagesRef}>
{messages.map((m, i) => (
<div key={i} style={{padding:6, borderBottom:'1px solid #f2f2f2'}}>
<strong>{m.user}</strong> <span className="small">· {new
Date(m.ts).toLocaleTimeString()}</span>
<div>{m.text}</div>
</div>
))}
</div>
<div style={{display:'flex', gap:8}}>
<input value={text} onChange={(e)=>setText(e.target.value)}
placeholder="Say something..." style={{flex:1, padding:8, borderRadius:8}} />
<button className="btn" onClick={send}>Send</button>
</div>
</div>
);
}