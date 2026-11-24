import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Header,Footer,setPageMeta} from '@/components/studio/shell';
import {Button} from '@/components/ui/button';
import {InvitationArt} from '@/components/studio/invitation-art';
import {invitationsApi} from '@/api/client';
import {useAuth} from '@/lib/auth/AuthContext';
import {getTemplate} from '@/lib/studio/templates';
import {toast} from 'sonner';
import {Plus,Trash2,Pencil,Share2,Eye,Loader2} from 'lucide-react';

export default function Workspace(){
  const navigate=useNavigate();
  const {user,loading:authLoading}=useAuth();
  const [invitations,setInvitations]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>setPageMeta('My Designs','Your saved wedding invitations.'),[]);
  useEffect(()=>{
    if(authLoading)return;
    if(!user){navigate('/auth?redirect=workspace');return;}
    invitationsApi.list().then((data:any)=>setInvitations(data.invitations)).catch(()=>{}).finally(()=>setLoading(false));
  },[user,authLoading,navigate]);

  async function remove(id:string){
    if(!confirm('Delete this invitation? This cannot be undone.'))return;
    try{await invitationsApi.remove(id);setInvitations(p=>p.filter(i=>(i._id||i.id)!==id));toast('Invitation deleted');}catch(e:any){toast.error(e.message);}
  }

  if(authLoading||loading)return <><Header/><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary"/></div></>;
  if(!user)return null;

  return <><Header/><main className="workspace-main">
    <div className="workspace-heading">
      <div><div className="eyebrow text-primary">Your workspace</div><h1>My Designs</h1></div>
      <Button variant="editorial" asChild><a href="/editor?template=timeless"><Plus size={15}/>New invitation</a></Button>
    </div>
    {invitations.length===0?(
      <div className="text-center py-20">
        <div className="text-5xl mb-4">✦</div>
        <h2 className="text-2xl mb-2">No invitations yet</h2>
        <p className="text-xs text-muted-foreground mb-6">Create your first beautiful wedding invitation.</p>
        <Button variant="editorial" asChild><a href="/editor?template=timeless"><Plus size={15}/>Create invitation</a></Button>
      </div>
    ):(
      <div className="workspace-grid">
        {invitations.map(inv=>{
          const id=inv._id||inv.id;
          const template=getTemplate(inv.templateId||'timeless');
          const content=inv.content||{};
          return <div key={id} className="template-item">
            <div className="workspace-design">
              <InvitationArt template={template} firstName={content.firstName} secondName={content.secondName} date={content.date} venue={content.venue}/>
            </div>
            <div className="template-caption">
              <div>
                <h3>{inv.name||'Untitled'}</h3>
                <p>{inv.published?'Published':'Draft'} · {new Date(inv.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="sm" asChild><a href={`/editor?id=${id}`}><Pencil size={13}/>Edit</a></Button>
              {inv.published&&inv.slug&&<Button variant="ghost" size="sm" asChild><a href={`/i/${inv.slug}`} target="_blank" rel="noreferrer"><Eye size={13}/>View</a></Button>}
              {inv.published&&inv.slug&&<Button variant="ghost" size="sm" asChild><a href={`/editor?id=${id}`}><Share2 size={13}/>Share</a></Button>}
              <Button variant="ghost" size="icon" onClick={()=>remove(id)} aria-label="Delete"><Trash2 size={13}/></Button>
            </div>
          </div>;
        })}
      </div>
    )}
  </main><Footer/></>;
}
