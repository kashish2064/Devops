import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Header,Footer,setPageMeta} from '@/components/studio/shell';
import {InvitationArt} from '@/components/studio/invitation-art';
import {getTemplate} from '@/lib/studio/templates';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';

export default function Features(){
  useEffect(()=>setPageMeta('Made for Your Wedding','Personal wedding stationery, photo galleries, event schedules and easy sharing for your celebration.'),[]);
  return <><Header/><main className="editorial-container">
    <div className="page-intro text-center"><div className="eyebrow text-primary">Every detail. Beautifully together.</div><h1>More than an invitation.</h1><p>Your celebration, in one beautiful place.</p></div>
    <div className="steps-grid py-14">
      <div><InvitationArt template={getTemplate('garden')}/><h2 className="text-3xl mt-6">A personal touch</h2><p className="text-xs text-muted-foreground mt-3">Your names, your photographs, your words.</p></div>
      <div><InvitationArt template={getTemplate('golden')}/><h2 className="text-3xl mt-6">Every beautiful moment</h2><p className="text-xs text-muted-foreground mt-3">Ceremony, celebration, and everything in between.</p></div>
      <div><InvitationArt template={getTemplate('sage')}/><h2 className="text-3xl mt-6">Everyone you love</h2><p className="text-xs text-muted-foreground mt-3">Easy sharing. Thoughtful RSVPs.</p></div>
    </div>
    <div className="text-center pb-16"><Button variant="editorial" asChild><Link to="/templates">Find your design <ArrowRight/></Link></Button></div>
  </main><Footer/></>;
}
