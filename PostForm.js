
import { useState } from 'react';
export default function >PostForm({ onPost }) {
const [email, setEmail] = useState('');
const [token, setToken] = useState('');
const [content, setContent] = useState('');
const [busy, setBusy] = useState(false);
// This demo supports posting as authenticated user by providing a JWT token
const submit = async (e) => {
e.preventDefault();
if (!content.trim()) return;
setBusy(true);
try {
const headers = { 'Content-Type': 'application/json' };
if (token) headers['Authorization'] = `Bearer ${token}`;
const res = await fetch('/api/posts', {
method: 'POST',
headers,
body: JSON.stringify({ content })
});
const data = await res.json();
if (data.post) onPost(data.post);
setContent('');
} catch (err) {
console.error(err);
alert('Failed to post');
} finally {
setBusy(false);
}
};
return (
<form onSubmit={submit}>
<div style={{marginBottom:8}}>
<input placeholder="JWT token (optional)" value={token}
onChange={e=>setToken(e.target.value)} style={{width:'100%', padding:8,
borderRadius:8}} />
</div>
<div style={{marginBottom:8}}>
<textarea placeholder="What's happening?" value={content}
onChange={e=>setContent(e.target.value)} style={{width:'100%', padding:8,
borderRadius:8, minHeight:80}} />
</div>
<div>
<button className="btn" disabled={busy}>{busy ? 'Posting...' : 'Post'}</
button>
</div>
</form>
);
}