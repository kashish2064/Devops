import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Heart, X, Search, ArrowRight, Eye} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {InvitationArt} from './invitation-art';
import {categories,filterTemplates,templates,type Template} from '@/lib/studio/templates';
import {favoritesApi} from '@/api/client';
import {useAuth} from '@/lib/auth/AuthContext';
import {toast} from 'sonner';
export function TemplateGallery({compact=false}:{compact?:boolean}){
 const [category,setCategory]=useState('All'); const [search,setSearch]=useState(''); const [preview,setPreview]=useState<Template|null>(null); const [favorites,setFavorites]=useState<string[]>([]);
 const {user}=useAuth();
 useEffect(()=>{if(!user)return;favoritesApi.list().then(d=>setFavorites(d.favorites)).catch(()=>{});},[user]);
 async function favorite(id:string){if(!user){toast('Sign in to save your favorite designs');return;}const has=favorites.includes(id);try{if(has){await favoritesApi.remove(id);setFavorites(p=>p.filter(x=>x!==id));}else{await favoritesApi.add(id);setFavorites(p=>[...p,id]);}}catch(e:any){toast.error(e.message);}}
 const shown=filterTemplates(templates,category,search).slice(0,compact?4:15);
 return <><div className={compact?'':'gallery-toolbar'}><div className="category-pills">{(compact?categories.slice(0,6):categories).map(c=><Button key={c} size="sm" variant={category===c?'default':'ghost'} onClick={()=>setCategory(c)}>{c}</Button>)}</div>{!compact&&<label className="search-field"><Search size={15}/><input aria-label="Search templates" placeholder="Find your perfect design" value={search} onChange={e=>setSearch(e.target.value)}/></label>}</div><div className="template-grid">{shown.map(t=><article className="template-item" key={t.id}><div className="template-preview-frame"><Button variant="ghost" size="icon" className={`favorite-button ${favorites.includes(t.id)?'favorite-active':''}`} aria-label={`Favorite ${t.name}`} onClick={()=>favorite(t.id)}><Heart size={15} fill={favorites.includes(t.id)?'currentColor':'none'}/></Button><InvitationArt template={t}/><div className="template-hover"><Button variant="paper" size="sm" onClick={()=>setPreview(t)}><Eye/> Preview</Button><Button size="sm" variant="editorial" asChild><Link to={`/editor?template=${t.id}`}>Customize <ArrowRight/></Link></Button></div></div><div className="template-caption"><div><h3>{t.name}</h3><p>{t.category} collection</p></div><span className="text-[9px] text-primary">FREE</span></div></article>)}</div>{shown.length===0&&<div className="empty-state">No designs found.</div>}{preview&&<div className="modal-backdrop" onClick={()=>setPreview(null)}><div className="studio-modal" role="dialog" aria-modal="true" aria-label={`${preview.name} preview`} onClick={e=>e.stopPropagation()}><Button className="modal-close" variant="ghost" size="icon" aria-label="Close preview" onClick={()=>setPreview(null)}><X/></Button><div className="preview-modal-grid"><InvitationArt template={preview}/><div><div className="eyebrow text-primary">{preview.category} collection</div><h2>{preview.name}</h2><p>A little glimpse of your forever.</p><Button variant="editorial" asChild><Link to={`/editor?template=${preview.id}`}>Make it yours <ArrowRight/></Link></Button></div></div></div></div>}</>;
}
