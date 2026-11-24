import {Link, useNavigate} from 'react-router-dom';
import { Sprout, ArrowUpRight, LogOut } from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/lib/auth/AuthContext';

export function Wordmark(){return <Link to="/" className="wordmark"><Sprout/><span>Our Story<span className="text-primary">.</span></span></Link>}
export function Header(){const {user,logout}=useAuth();const nav=useNavigate();return <header className="site-header"><Wordmark/><nav className="header-nav"><Link to="/templates">Templates</Link><Link to="/features">Features</Link><Link to="/pricing">Pricing</Link></nav><div className="header-actions">{user?(<><Link to="/workspace" className="sign-in">My designs</Link><Button variant="ghost" size="sm" onClick={()=>{logout();nav('/');}}><LogOut size={14}/></Button></>):<Link to="/auth" className="sign-in">Sign in</Link>}<Button variant="editorial" asChild><Link to="/editor?template=timeless">Create invitation <ArrowUpRight/></Link></Button></div></header>}
export function Footer(){return <footer className="site-footer"><Wordmark/><p>Made for your once-in-a-lifetime.</p><div className="flex gap-6"><Link to="/templates">Templates</Link><Link to="/pricing">Pricing</Link><span>© {new Date().getFullYear()} Our Story</span></div></footer>}
export function setPageMeta(title:string,description:string){if(typeof document!=='undefined'){document.title=`${title} | Our Story`;const m=document.querySelector('meta[name="description"]');if(m)m.setAttribute('content',description);}}
