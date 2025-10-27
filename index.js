
import Link from 'next/link';
export default function Home() {
return (
<div className="container">
<div className="header">
<h1>LOCOM</h1>
<div>
<Link href="/feed"><a style={{marginRight:12}}>Feed</a></Link>
<Link href="/chatroom"><a>Chatroom</a></Link>
</div>
</div>
<div className="card">
<h2>Connect to the outside world</h2>
<p className="small">View aggregated feeds, post updates, and join live
chat rooms. Auth-required actions exist for posting.</p>
<hr />
<p>Quick links:</p>
<ul>
<li><Link href="/feed"><a>Feed & external sources</a></Link></li>
<li><Link href="/chatroom"><a>Realtime Chatroom</a></Link></li>
</ul>
</div>
</div>
);
}
9