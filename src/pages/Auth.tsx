import {useState,useEffect} from 'react';
import {useNavigate,useSearchParams,Link} from 'react-router-dom';
import {Header,setPageMeta} from '@/components/studio/shell';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/lib/auth/AuthContext';
import {images} from '@/lib/studio/templates';
import {toast} from 'sonner';
import {Loader2} from 'lucide-react';

export default function Auth(){
  const [searchParams]=useSearchParams();
  const navigate=useNavigate();
  const {user,loading,login,register}=useAuth();
  const redirect=searchParams.get('redirect')||'workspace';
  const [mode,setMode]=useState<'login'|'signup'>('signup');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>setPageMeta('Welcome to Our Story','Sign in or create your account to start designing beautiful wedding invitations.'),[]);
  useEffect(()=>{if(!loading&&user)navigate(`/${redirect}`);},[user,loading,redirect,navigate]);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setSubmitting(true);
    try{
      if(mode==='signup'){if(!name.trim()){toast.error('Please enter your name');setSubmitting(false);return;}await register(name,email,password);}
      else{await login(email,password);}
      toast(mode==='signup'?'Welcome to Our Story!':'Welcome back!');
      navigate(`/${redirect}`);
    }catch(e:any){toast.error(e.message);}
    setSubmitting(false);
  }

  return <><Header/><div className="auth-page">
    <div className="auth-image">
      <img src={images.garden} alt="An intimate garden wedding"/>
      <blockquote>Your story,<br/>beautifully invited.</blockquote>
    </div>
    <div className="auth-form">
      <div className="eyebrow text-primary">{mode==='signup'?'Begin your story':'Welcome back'}</div>
      <h1>{mode==='signup'?'Create your account':'Sign in'}</h1>
      <p>{mode==='signup'?'Start designing your wedding invitation in minutes.':'Continue designing your perfect invitation.'}</p>
      <form onSubmit={handleSubmit}>
        {mode==='signup'&&<div className="form-field"><label>Your name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Olivia Bennett" autoComplete="name"/></div>}
        <div className="form-field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="olivia@example.com" autoComplete="email" required/></div>
        <div className="form-field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode==='signup'?'new-password':'current-password'} required/></div>
        <Button variant="editorial" className="w-full mt-2" type="submit" disabled={submitting}>
          {submitting?<Loader2 size={16} className="animate-spin"/>:mode==='signup'?'Create account':'Sign in'}
        </Button>
      </form>
      <p className="text-center mt-5 text-xs text-muted-foreground">
        {mode==='signup'?'Already have an account?':'New to Our Story?'}{' '}
        <Link to={`/auth?redirect=${redirect}`} onClick={e=>{e.preventDefault();setMode(mode==='signup'?'login':'signup');}} className="text-primary underline">
          {mode==='signup'?'Sign in':'Create an account'}
        </Link>
      </p>
    </div>
  </div></>;
}
