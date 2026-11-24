import {useState,useEffect,useRef} from 'react';
import {useSearchParams,useNavigate} from 'react-router-dom';
import {Rnd} from 'react-rnd';
import {Button} from '@/components/ui/button';
import {InvitationArt} from '@/components/studio/invitation-art';
import {ShareModal} from '@/components/studio/share-modal';
import {templates,getTemplate,newDesign,prettyDate,type Design,type CanvasElement} from '@/lib/studio/templates';
import {invitationsApi} from '@/api/client';
import {useAuth} from '@/lib/auth/AuthContext';
import {toast} from 'sonner';
import {
  Pencil,Type,Layout,Image as ImageIcon,ArrowLeft,Plus,Trash2,
  Share2,Eye,Bold,Italic,AlignLeft,AlignCenter,AlignRight,Save,Loader2,
} from 'lucide-react';

type Tool='details'|'text'|'template'|'background';

const SWATCHES=[
  {label:'Ivory',value:'var(--paper)'},
  {label:'Sage',value:'var(--sage)'},
  {label:'Wine',value:'var(--wine)'},
  {label:'Midnight',value:'var(--foreground)'},
  {label:'Blush',value:'var(--accent)'},
];

const FONTS=['Cormorant Garamond','Manrope'];

const COLORS=['var(--foreground)','var(--paper)','var(--primary)','var(--sage)','var(--wine)','#ffffff','#1a1a1a'];

export default function Editor(){
  const [searchParams,setSearchParams]=useSearchParams();
  const navigate=useNavigate();
  const {user,loading:authLoading}=useAuth();
  const editId=searchParams.get('id');
  const templateId=searchParams.get('template')||'timeless';

  const [design,setDesign]=useState<Design>(()=>newDesign(templateId));
  const [activeTool,setActiveTool]=useState<Tool>('details');
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [title,setTitle]=useState('Untitled invitation');
  const [saveState,setSaveState]=useState<'idle'|'saving'|'saved'>('idle');
  const [invitationId,setInvitationId]=useState<string|null>(editId);
  const [slug,setSlug]=useState<string|null>(null);
  const [shareOpen,setShareOpen]=useState(false);
  const [loadingExisting,setLoadingExisting]=useState(!!editId);
  const canvasRef=useRef<HTMLDivElement>(null);

  const selectedElement=design.elements.find(e=>e.id===selectedId)||null;

  // Load existing invitation if editing
  useEffect(()=>{
    if(!editId||!user)return;
    setLoadingExisting(true);
    invitationsApi.get(editId).then((data:any)=>{
      const inv=data.invitation;
      if(inv.name)setTitle(inv.name);
      if(inv.slug)setSlug(inv.slug);
      if(inv.content&&typeof inv.content==='object'){
        setDesign({...newDesign(inv.templateId||templateId),...inv.content});
      }
    }).catch(()=>toast.error('Could not load invitation')).finally(()=>setLoadingExisting(false));
  },[editId,user]);

  function updateElement(id:string,patch:Partial<CanvasElement>){
    setDesign(d=>({...d,elements:d.elements.map(e=>e.id===id?{...e,...patch}:e)}));
  }

  function addText(){
    const id=`el-${Date.now()}`;
    const el:CanvasElement={id,kind:'text',text:'New text',x:60,y:280,width:300,height:45,font:'Cormorant Garamond',size:22,color:'var(--foreground)',bold:false,italic:false,align:'center',spacing:0};
    setDesign(d=>({...d,elements:[...d.elements,el]}));
    setSelectedId(id);
    setActiveTool('text');
  }

  function deleteElement(id:string){
    setDesign(d=>({...d,elements:d.elements.filter(e=>e.id!==id)}));
    setSelectedId(null);
  }

  function updateDetail(field:keyof Design,value:string){
    setDesign(d=>({...d,[field]:value}) as Design);
    // Sync corresponding text element
    const map:Record<string,string>={firstName:'first',secondName:'second',date:'date',venue:'venue',message:'intro'};
    const elId=map[field as string];
    if(elId){
      const displayValue=field==='date'?prettyDate(value).toUpperCase():value;
      setDesign(d=>({...d,[field]:value,elements:d.elements.map(e=>e.id===elId?{...e,text:displayValue}:e)}) as Design);
    }
  }

  function switchTemplate(id:string){
    const t=getTemplate(id);
    setDesign(d=>{
      const bg=t.style==='sage'?'var(--sage)':t.style==='wine'?'var(--wine)':t.style==='night'?'var(--foreground)':t.style==='blush'?'var(--accent)':'var(--paper)';
      return {...d,background:bg};
    });
    setSearchParams({template:id});
  }

  async function save(){
    if(!user){toast('Sign in to save your invitation');navigate('/auth?redirect=editor');return;}
    setSaveState('saving');
    try{
      if(invitationId){
        await invitationsApi.update(invitationId,{name:title,content:design});
      }else{
        const data:any=await invitationsApi.create({name:title,templateId,content:design});
        const newId=data.invitation._id||data.invitation.id;
        setInvitationId(newId);
      }
      setSaveState('saved');
      setTimeout(()=>setSaveState('idle'),2000);
    }catch(e:any){toast.error(e.message);setSaveState('idle');}
  }

  async function publishAndShare(){
    if(!user){toast('Sign in to share your invitation');navigate('/auth?redirect=editor');return;}
    setSaveState('saving');
    try{
      let id=invitationId;
      if(!id){
        const data:any=await invitationsApi.create({name:title,templateId,content:design,published:true});
        id=data.invitation._id||data.invitation.id;
        setInvitationId(id);
        setSlug(data.invitation.slug);
      }else{
        const data:any=await invitationsApi.update(id,{published:true,name:title,content:design});
        setSlug(data.invitation.slug);
      }
      setSaveState('idle');
      setShareOpen(true);
      toast('Your invitation is live!');
    }catch(e:any){toast.error(e.message);setSaveState('idle');}
  }

  if(loadingExisting){
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary"/></div>;
  }

  return <div className="editor">
    {/* Top bar */}
    <div className="editor-topbar">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={()=>navigate('/workspace')} aria-label="Back"><ArrowLeft size={18}/></Button>
        <input className="editor-title" value={title} onChange={e=>setTitle(e.target.value)} aria-label="Invitation name"/>
      </div>
      <div className="flex items-center gap-3">
        <span className="editor-save desktop-only">
          {saveState==='saving'?'Saving…':saveState==='saved'?'Saved ✓':'Unsaved changes'}
        </span>
        <Button variant="ghost" size="sm" onClick={save} disabled={saveState==='saving'}>
          <Save size={15}/><span className="desktop-only">Save</span>
        </Button>
        {slug&&<Button variant="ghost" size="sm" asChild><a href={`/i/${slug}`} target="_blank" rel="noreferrer"><Eye size={15}/><span className="desktop-only">Preview</span></a></Button>}
        <Button variant="editorial" size="sm" onClick={publishAndShare} disabled={saveState==='saving'}>
          <Share2 size={15}/>Publish & Share
        </Button>
      </div>
    </div>

    <div className="editor-body">
      {/* Left rail */}
      <div className="editor-rail">
        {([['details',Pencil,'Details'],['text',Type,'Text'],['template',Layout,'Template'],['background',ImageIcon,'Background']] as const).map(([tool,Icon,label])=>
          <Button key={tool} variant={activeTool===tool?'default':'ghost'} onClick={()=>setActiveTool(tool)}>
            <Icon size={18}/>{label}
          </Button>
        )}
      </div>

      {/* Panel */}
      <div className="editor-panel">
        {activeTool==='details'&&<DetailsPanel design={design} update={updateDetail}/>}
        {activeTool==='text'&&<TextPanel design={design} selectedId={selectedId} onSelect={setSelectedId} onAdd={addText} onDelete={deleteElement}/>}
        {activeTool==='template'&&<TemplatePanel currentId={templateId} onSelect={switchTemplate}/>}
        {activeTool==='background'&&<BackgroundPanel design={design} setDesign={setDesign}/>}
      </div>

      {/* Canvas work area */}
      <div className="editor-workarea">
        <div className="canvas-wrap">
          <div className="editable-canvas" ref={canvasRef} style={{background:design.background}} onClick={e=>{if(e.target===e.currentTarget||e.target===canvasRef.current)setSelectedId(null)}}>
            {design.photo&&<img className="canvas-bg" src={design.photo} alt=""/>}
            {design.elements.map(el=>(
              <Rnd
                key={el.id}
                position={{x:el.x,y:el.y}}
                size={{width:el.width,height:el.height}}
                bounds="parent"
                enableResizing={false}
                onDragStart={()=>setSelectedId(el.id)}
                onDragStop={(_,d)=>updateElement(el.id,{x:Math.round(d.x),y:Math.round(d.y)})}
                style={{cursor:'move'}}
              >
                <div
                  className={`canvas-text ${selectedId===el.id?'canvas-selected':''}`}
                  style={{
                    fontFamily:`'${el.font}',serif`,
                    fontSize:`${el.size}px`,
                    color:el.color,
                    fontWeight:el.bold?'700':'400',
                    fontStyle:el.italic?'italic':'normal',
                    textAlign:el.align,
                    letterSpacing:`${el.spacing}px`,
                  }}
                  onClick={e=>{e.stopPropagation();setSelectedId(el.id);}}
                >
                  {el.text}
                </div>
              </Rnd>
            ))}
          </div>
        </div>
        <div className="canvas-footer">Drag text to reposition · Click to edit</div>
      </div>

      {/* Context panel */}
      <div className="editor-context">
        {selectedElement?(
          <ContextPanel element={selectedElement} update={(patch)=>updateElement(selectedElement.id,patch)} onDelete={()=>deleteElement(selectedElement.id)}/>
        ):(
          <div>
            <h2>Details</h2>
            <p className="text-xs text-muted-foreground">Click any text on the canvas to edit it. Use the left panel to change invitation details, templates, or background.</p>
          </div>
        )}
      </div>
    </div>

    {shareOpen&&<ShareModal slug={slug} canvasRef={canvasRef} onClose={()=>setShareOpen(false)}/>}
  </div>;
}

// --- Sub-panels ---

function DetailsPanel({design,update}:{design:Design;update:(field:keyof Design,value:string)=>void}){
  return <div>
    <h2>Invitation Details</h2>
    <div className="form-field"><label>First Name</label><input value={design.firstName} onChange={e=>update('firstName',e.target.value)}/></div>
    <div className="form-field"><label>Second Name</label><input value={design.secondName} onChange={e=>update('secondName',e.target.value)}/></div>
    <div className="form-field"><label>Date</label><input type="date" value={design.date} onChange={e=>update('date',e.target.value)}/></div>
    <div className="form-field"><label>Time</label><input value={design.time} onChange={e=>update('time',e.target.value)}/></div>
    <div className="form-field"><label>Venue</label><input value={design.venue} onChange={e=>update('venue',e.target.value)}/></div>
    <div className="form-field"><label>Address</label><input value={design.address} onChange={e=>update('address',e.target.value)}/></div>
    <div className="form-field"><label>Message</label><textarea value={design.message} onChange={e=>update('message',e.target.value)}/></div>
  </div>;
}

function TextPanel({design,selectedId,onSelect,onAdd,onDelete}:{design:Design;selectedId:string|null;onSelect:(id:string)=>void;onAdd:()=>void;onDelete:(id:string)=>void}){
  return <div>
    <h2>Text Elements</h2>
    <Button variant="outline" size="sm" className="w-full mb-4" onClick={onAdd}><Plus size={14}/>Add text</Button>
    {design.elements.map(el=>(
      <div key={el.id} className={`form-field ${selectedId===el.id?'':''}`} style={{cursor:'pointer',padding:'10px 12px',border:selectedId===el.id?'1px solid var(--primary)':'1px solid var(--border)',borderRadius:'4px',marginBottom:'8px'}} onClick={()=>onSelect(el.id)}>
        <div className="flex items-center justify-between">
          <span className="text-xs truncate" style={{fontFamily:`'${el.font}'`}}>{el.text||'(empty)'}</span>
          <Button variant="ghost" size="icon" onClick={e=>{e.stopPropagation();onDelete(el.id);}} aria-label="Delete element"><Trash2 size={13}/></Button>
        </div>
      </div>
    ))}
  </div>;
}

function TemplatePanel({currentId,onSelect}:{currentId:string;onSelect:(id:string)=>void}){
  return <div>
    <h2>Choose a Template</h2>
    <div className="editor-panel-grid">
      {templates.map(t=>(
        <button key={t.id} onClick={()=>onSelect(t.id)} style={{border:t.id===currentId?'2px solid var(--primary)':'1px solid var(--border)',borderRadius:'4px',padding:'4px',background:'var(--secondary)',cursor:'pointer'}} aria-label={`Select ${t.name}`}>
          <InvitationArt template={t}/>
        </button>
      ))}
    </div>
  </div>;
}

function BackgroundPanel({design,setDesign}:{design:Design;setDesign:React.Dispatch<React.SetStateAction<Design>>}){
  return <div>
    <h2>Background</h2>
    <div className="swatches">
      {SWATCHES.map(s=>(
        <button key={s.value} title={s.label} onClick={()=>setDesign(d=>({...d,background:s.value}))} style={{background:s.value,outline:design.background===s.value?'2px solid var(--primary)':'1px solid var(--border)'}}/>
      ))}
    </div>
    <div className="form-field">
      <label>Photo URL</label>
      <input placeholder="https://…" value={design.photo} onChange={e=>setDesign(d=>({...d,photo:e.target.value}))}/>
    </div>
    {design.photo&&(
      <Button variant="ghost" size="sm" className="w-full" onClick={()=>setDesign(d=>({...d,photo:''}))}>
        <Trash2 size={13}/>Remove photo
      </Button>
    )}
  </div>;
}

function ContextPanel({element,update,onDelete}:{element:CanvasElement;update:(patch:Partial<CanvasElement>)=>void;onDelete:()=>void}){
  return <div>
    <h2>Edit Text</h2>
    <div className="form-field"><label>Content</label><textarea value={element.text} onChange={e=>update({text:e.target.value})}/></div>
    <div className="form-field"><label>Font</label>
      <select value={element.font} onChange={e=>update({font:e.target.value})}>
        {FONTS.map(f=><option key={f} value={f}>{f}</option>)}
      </select>
    </div>
    <div className="form-field"><label>Size ({element.size}px)</label>
      <input type="range" min="6" max="48" value={element.size} onChange={e=>update({size:Number(e.target.value)})}/>
    </div>
    <div className="form-field"><label>Color</label>
      <div className="swatches">
        {COLORS.map(c=>(
          <button key={c} title={c} onClick={()=>update({color:c})} style={{background:c,outline:element.color===c?'2px solid var(--primary)':'1px solid var(--border)'}}/>
        ))}
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      <Button variant={element.bold?'default':'ghost'} size="icon" onClick={()=>update({bold:!element.bold})} aria-label="Bold"><Bold size={15}/></Button>
      <Button variant={element.italic?'default':'ghost'} size="icon" onClick={()=>update({italic:!element.italic})} aria-label="Italic"><Italic size={15}/></Button>
    </div>
    <div className="form-field"><label>Alignment</label>
      <div className="flex gap-2">
        <Button variant={element.align==='left'?'default':'ghost'} size="icon" onClick={()=>update({align:'left'})} aria-label="Left"><AlignLeft size={15}/></Button>
        <Button variant={element.align==='center'?'default':'ghost'} size="icon" onClick={()=>update({align:'center'})} aria-label="Center"><AlignCenter size={15}/></Button>
        <Button variant={element.align==='right'?'default':'ghost'} size="icon" onClick={()=>update({align:'right'})} aria-label="Right"><AlignRight size={15}/></Button>
      </div>
    </div>
    <div className="form-field"><label>Letter spacing ({element.spacing}px)</label>
      <input type="range" min="0" max="10" value={element.spacing} onChange={e=>update({spacing:Number(e.target.value)})}/>
    </div>
    <Button variant="ghost" size="sm" className="w-full" onClick={onDelete}><Trash2 size={13}/>Delete element</Button>
  </div>;
}
