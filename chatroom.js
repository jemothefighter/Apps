
import dynamic from 'next/dynamic';
const Chat = dynamic(() => import('../components/Chat'), { ssr: false });
export default function Chatroom() {
return (
<div className="container">
<div className="header">
<h1>LOCOM Chatroom</h1>
</div>
<div className="card"><Chat /></div>
</div>
);
}