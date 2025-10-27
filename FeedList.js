
export default function FeedList({ feeds = [] }) {
if (!feeds || feeds.length === 0) return <p className="small">No external
feed items available.</p>;
return (
<div>
{feeds.map((item, idx) => (
<div key={idx} className="feed-item">
<a href={item.link} target="_blank"
rel="noreferrer"><strong>{item.title}</strong></a>
<div className="small">{item.source} · {new Date(item.isoDate ||
item.pubDate || Date.now()).toLocaleString()}</div>
<p>{item.contentSnippet || item.content || ''}</p>
</div>
))}
</div>
);
}