import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {setPageMeta} from '@/components/studio/shell';
import {Button} from '@/components/ui/button';
import {invitationsApi} from '@/api/client';
import {rsvpApi} from '@/api/client';
import {getTemplate,prettyDate,countdown,type Design} from '@/lib/studio/templates';
import {toast} from 'sonner';
import {Calendar,Clock,MapPin,Loader2,Heart,Check} from 'lucide-react';

export default function Invitation(){
  const {slug}=useParams<{slug:string}>();
  const [design,setDesign]=useState<Design|null>(null);
  const [templateName,setTemplateName]=useState('');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [rsvpDone,setRsvpDone]=useState(false);
  const [rsvpForm,setRsvpForm]=useState({guestName:'',email:'',attending:true,guests:1,message:''});

  useEffect(()=>{setPageMeta('Wedding Invitation','You are cordially invited.');},[]);

  useEffect(()=>{
    if(!slug)return;
    invitationsApi.getBySlug(slug).then((data:any)=>{
      const inv=data.invitation;
      setDesign({...inv.content} as Design);
      const t=getTemplate(inv.templateId);
      setTemplateName(t.name);
      if(inv.name)setPageMeta(inv.name,`${inv.content?.firstName||''} & ${inv.content?.secondName||''} invite you to their wedding`);
    }).catch((e:any)=>setError(e.message||'Invitation not found')).finally(()=>setLoading(false));
  },[slug]);

  function submitRsvp(e:React.FormEvent){
    e.preventDefault();
    if(!slug)return;
    rsvpApi.submit({slug,guestName:rsvpForm.guestName,email:rsvpForm.email,attending:rsvpForm.attending,guests:rsvpForm.guests,message:rsvpForm.message})
      .then(()=>{setRsvpDone(true);toast('Thank you for your response!');})
      .catch((e:any)=>toast.error(e.message));
  }

  if(loading)return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary"/></div>;
  if(error||!design)return <div className="flex flex-col items-center justify-center min-h-screen gap-4"><h1 className="text-5xl">Invitation not found</h1><p className="text-sm text-muted-foreground">This invitation may have been removed or is no longer published.</p><Button variant="editorial" asChild><a href="/">Go home</a></Button></div>;

  const days=countdown(design.date);

  return <div>
    {/* Cover */}
    <section className="public-cover">
      {design.photo&&<img src={design.photo} alt=""/>}
      <div className="relative z-10 text-center px-6">
        <div className="eyebrow">{templateName}</div>
        <h1>{design.firstName}<br/>&amp; {design.secondName}</h1>
        <p className="text-sm opacity-90 mt-4">{prettyDate(design.date)}</p>
      </div>
    </section>

    {/* Message */}
    {design.message&&(
      <section className="public-section">
        <div className="eyebrow text-primary">A message from us</div>
        <h2>With love</h2>
        <p>{design.message}</p>
      </section>
    )}

    {/* Countdown */}
    <section className="public-section" style={{background:'var(--accent)'}}>
      <div className="eyebrow text-primary">The countdown begins</div>
      <h2>{days>0?`Only ${days} ${days===1?'day':'days'} to go!`:'Today is the day!'}</h2>
      {days>0&&(
        <div className="countdown">
          <div><strong>{days}</strong><span>Days</span></div>
          <div><strong>{Math.floor((new Date(design.date).getTime()-Date.now())/3600000)%24}</strong><span>Hours</span></div>
          <div><strong>{Math.floor((new Date(design.date).getTime()-Date.now())/60000)%60}</strong><span>Minutes</span></div>
        </div>
      )}
    </section>

    {/* Events */}
    {design.events&&design.events.length>0&&(
      <section className="public-section">
        <div className="eyebrow text-primary">The celebration</div>
        <h2>When &amp; where</h2>
        <div className="event-list">
          {design.events.map((ev,i)=>(
            <div key={i} className="event-item">
              <div className="eyebrow text-primary">{ev.name}</div>
              <h3>{prettyDate(ev.date)}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-2 justify-center"><Clock size={12}/>{ev.time}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 justify-center"><MapPin size={12}/>{ev.venue}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Venue */}
    {design.venue&&(
      <section className="public-section">
        <div className="eyebrow text-primary">The venue</div>
        <h2>{design.venue}</h2>
        {design.address&&<p>{design.address}</p>}
      </section>
    )}

    {/* Gallery */}
    {design.photos&&design.photos.length>0&&(
      <section className="public-section">
        <div className="eyebrow text-primary">A few moments</div>
        <h2>Our story in photos</h2>
        <div className="public-gallery">
          {design.photos.map((p,i)=>(<img key={i} src={p} alt={`Photo ${i+1}`}/>))}
        </div>
      </section>
    )}

    {/* RSVP */}
    <section className="public-section" style={{borderTop:'1px solid var(--border)'}}>
      <div className="eyebrow text-primary">Will you join us?</div>
      <h2>RSVP</h2>
      {rsvpDone?(
        <div className="text-center py-8">
          <Check size={40} className="text-primary mx-auto mb-4"/>
          <p className="text-lg">Thank you for your response!</p>
          <p className="text-xs text-muted-foreground mt-2">We can't wait to celebrate with you.</p>
        </div>
      ):(
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <div className="form-field"><label>Your name</label><input required value={rsvpForm.guestName} onChange={e=>setRsvpForm(f=>({...f,guestName:e.target.value}))} placeholder="Your full name"/></div>
          <div className="form-field"><label>Email (optional)</label><input type="email" value={rsvpForm.email} onChange={e=>setRsvpForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com"/></div>
          <div className="form-field"><label>Will you attend?</label>
            <div className="flex gap-3">
              <Button type="button" variant={rsvpForm.attending?'editorial':'outline'} size="sm" onClick={()=>setRsvpForm(f=>({...f,attending:true}))}>Joyfully accepts</Button>
              <Button type="button" variant={!rsvpForm.attending?'editorial':'outline'} size="sm" onClick={()=>setRsvpForm(f=>({...f,attending:false}))}>Regretfully declines</Button>
            </div>
          </div>
          {rsvpForm.attending&&(
            <div className="form-field"><label>Number of guests</label>
              <select value={rsvpForm.guests} onChange={e=>setRsvpForm(f=>({...f,guests:Number(e.target.value)}))}>
                {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}
          <div className="form-field"><label>Message (optional)</label><textarea value={rsvpForm.message} onChange={e=>setRsvpForm(f=>({...f,message:e.target.value}))} placeholder="Leave a note for the couple…"/></div>
          <Button variant="editorial" type="submit" className="w-full mt-2">Send response</Button>
        </form>
      )}
      <div className="text-center mt-12 pb-10 text-xs text-muted-foreground flex items-center justify-center gap-2">
        <Heart size={12} className="text-primary"/> Made with Our Story
      </div>
    </section>
  </div>;
}
