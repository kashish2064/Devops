import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, Check, Heart, Smartphone, Sparkles, Pencil, Send} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Header,Footer,setPageMeta} from '@/components/studio/shell';
import {TemplateGallery} from '@/components/studio/template-gallery';
import {InvitationArt} from '@/components/studio/invitation-art';
import {images,getTemplate} from '@/lib/studio/templates';

export default function Home(){
  useEffect(()=>setPageMeta('Your Love Story, Beautifully Invited','Beautiful wedding invitations, made personal. Discover elegant designs and create your own wedding website with Our Story.'),[]);
  return <><Header/><main>
    <section className="home-hero fade-in">
      <img className="hero-photo" src={images.garden} alt="An intimate garden wedding at a sunlit Italian villa"/>
      <div className="hero-copy">
        <div className="eyebrow text-primary">A beautiful beginning</div>
        <h1>Your Love Story,<br/><em>Beautifully</em><br/>Invited.</h1>
        <p>Create a wedding invitation as unique as your story.</p>
        <div className="hero-cta">
          <Button variant="ink" asChild><Link to="/templates">Explore designs <ArrowRight/></Link></Button>
          <Button variant="outline" size="lg" asChild><Link to="/editor?template=timeless">Create invitation</Link></Button>
        </div>
        <div className="hero-proof"><span className="stars">★★★★★</span><span>For the moments that matter most.</span></div>
      </div>
      <div className="hero-invitation"><InvitationArt template={getTemplate('garden')}/></div>
      <div className="hero-invitation-label"><Heart size={17} className="text-primary"/><span>A little glimpse of forever.</span></div>
    </section>
    <div className="trust-strip">
      <span><Sparkles size={13}/> Thoughtfully designed</span>
      <span><Pencil size={13}/> Uniquely yours</span>
      <span><Smartphone size={13}/> Beautiful on every screen</span>
      <span><Send size={13}/> Made to be shared</span>
    </div>
    <section className="editorial-container home-templates">
      <div className="section-heading">
        <div><div className="eyebrow text-primary">The design collection</div><h2>Find the one that feels like you.</h2><p>Different stories. Beautiful beginnings.</p></div>
        <Button variant="link" asChild><Link to="/templates">View all designs <ArrowRight/></Link></Button>
      </div>
      <TemplateGallery compact/>
    </section>
    <section className="steps-section">
      <div className="editorial-container">
        <div className="eyebrow text-primary">From your heart to their hands</div>
        <h2>A little magic. Three simple moments.</h2>
        <div className="steps-grid">
          <div><div className="step-visual"><div className="step-mini"><InvitationArt template={getTemplate('garden')}/></div><div className="step-mini"><InvitationArt template={getTemplate('sage')}/></div></div><h3>01. Find your design</h3><p>A collection made for every kind of love.</p></div>
          <div><div className="step-visual"><div className="step-mini"><InvitationArt template={getTemplate('timeless')}/></div><Pencil size={30} strokeWidth={1} className="text-primary"/></div><h3>02. Make it yours</h3><p>Your names. Your moments. Your story.</p></div>
          <div><div className="step-visual"><div className="step-mini"><InvitationArt template={getTemplate('golden')}/></div><Send size={30} strokeWidth={1} className="text-primary"/></div><h3>03. Share the joy</h3><p>One beautiful link. Everyone you love.</p></div>
        </div>
      </div>
    </section>
    <section className="testimonial-section editorial-container">
      <div className="text-primary text-xs">★★★★★</div>
      <blockquote>&ldquo;It felt so completely us. A beautiful little piece of our story, shared with everyone we love.&rdquo;</blockquote>
      <div className="text-xs text-muted-foreground">Olivia &amp; James <span className="mx-2">&mdash;</span> A sample love story</div>
    </section>
    <section className="editorial-container pb-16 text-center">
      <div className="eyebrow text-primary">Beautifully simple. Always.</div>
      <h2 className="text-[40px] my-4">Your story starts here.</h2>
      <div className="flex justify-center gap-5 text-[11px] text-muted-foreground mb-6">
        <span className="flex items-center gap-1"><Check size={13}/> Free to create</span>
        <span className="flex items-center gap-1"><Check size={13}/> Free to share</span>
      </div>
      <Button variant="editorial" asChild><Link to="/editor?template=timeless">Create your invitation <ArrowRight/></Link></Button>
    </section>
  </main><Footer/></>;
}
