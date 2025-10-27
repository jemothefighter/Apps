
import { useEffect, useState } from 'react';
import FeedList from '../components/FeedList';
import PostForm from '../components/PostForm';
export default function FeedPage() {
const [feeds, setFeeds] = useState([]);
const [posts, setPosts] = useState([]);
const fetchFeeds = async () => {
const res = await fetch('/api/feeds');
const data = await res.json();
setFeeds(data.feeds || []);
};
const fetchPosts = async () => {
const res = await fetch('/api/posts');
const data = await res.json();
setPosts(data.posts || []);
};
useEffect(() => {
fetchFeeds();
fetchPosts();
}, []);
const handleNewPost = (p) => {
setPosts([p, ...posts]);
};
return (
<div className="container">
<div className="header">
<h1>LOCOM Feed</h1>
</div>
<div style={{display:'grid', gridTemplateColumns: '1fr 380px', gap:16}}>
<div>
<div className="card" style={{marginBottom:16}}>
<h3>External feeds</h3>
<FeedList feeds={feeds} />
<button className="btn" onClick={fetchFeeds} style={{marginTop:12}}
>Refresh</button>
</div>
<div className="card">
<h3>Local posts</h3>
{posts.length === 0 && <p className="small">No posts yet.</p>}
{posts.map((p) => (
<div key={p.id} className="feed-item">
<strong>{p.authorName}</strong> · <span className="small">{new
Date(p.createdAt).toLocaleString()}</span>
<div>{p.content}</div>
</div>
))}
</div>
</div>
<div>
<div className="card">
<h3>Post something</h3>
<PostForm onPost={handleNewPost} />
</div>
<div className="card" style={{marginTop:16}}>
<h3>Trusted sources</h3>
<ul>
<li>Daily Monitor (monitor.co.ug)</li>
<li>MBU (mbu.ac.ug)</li>
<li>Any RSS-enabled site — system tries RSS then scrapes HTML
</li>
</ul>
</div>
</div>
</div>
</div>
);
}