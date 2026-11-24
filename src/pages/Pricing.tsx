import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Header,Footer,setPageMeta} from '@/components/studio/shell';
import {Button} from '@/components/ui/button';
import {Check,ArrowRight} from 'lucide-react';

export default function Pricing(){
  useEffect(()=>setPageMeta('Simple, Free Wedding Invitations','Create, personalize, publish and share your wedding invitation for free with Our Story.'),[]);
  return <><Header/><main className="editorial-container">
    <div className="page-intro text-center"><div className="eyebrow text-primary">Less to worry about. More to love.</div><h1>Beautiful invitations. Freely yours.</h1><p>All the little details, included.</p></div>
    <div className="max-w-md mx-auto py-12">
      <div className="price-card featured">
        <div className="eyebrow text-primary">Your complete wedding invitation</div>
        <h2 className="mt-3">Our Story</h2>
        <div className="price">Free <span className="font-sans text-xs text-muted-foreground">for now</span></div>
        <ul>{['All 15 invitation designs','Personal invitation editor','Your own wedding website','Photo galleries & multiple events','RSVP and guest responses','WhatsApp sharing & QR code','PNG & PDF downloads'].map(x=><li key={x}><Check size={15} className="text-primary"/>{x}</li>)}</ul>
        <Button variant="editorial" className="w-full mt-5" asChild><Link to="/editor?template=timeless">Create invitation <ArrowRight/></Link></Button>
      </div>
    </div>
  </main><Footer/></>;
}
