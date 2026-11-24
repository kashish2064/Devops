import {useState,useEffect,useRef,type RefObject} from 'react';
import {X, MessageCircle, Facebook, Twitter, Copy, Download, FileText, Link2, Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';
import QRCode from 'qrcode';
import {toPng} from 'html-to-image';
import {jsPDF} from 'jspdf';

export function ShareModal({slug,canvasRef,onClose}:{slug:string|null;canvasRef:RefObject<HTMLDivElement|null>;onClose:()=>void}){
  const [copied,setCopied]=useState(false);
  const [qrUrl,setQrUrl]=useState('');
  const url=slug?`${window.location.origin}/i/${slug}`:window.location.href;

  useEffect(()=>{QRCode.toDataURL(url,{width:160,margin:1,color:{dark:'#2b1d12',light:'#faf6ef'}}).then(setQrUrl).catch(()=>{});},[url]);

  const message='You are cordially invited to celebrate our wedding. View our invitation here:';
  const encodedUrl=encodeURIComponent(url);
  const encodedMsg=encodeURIComponent(`${message} ${url}`);

  function copyLink(){navigator.clipboard.writeText(url).then(()=>{setCopied(true);toast('Link copied to clipboard');setTimeout(()=>setCopied(false),2000);}).catch(()=>toast.error('Could not copy link'));}

  async function downloadPng(){
    if(!canvasRef.current)return;
    try{const dataUrl=await toPng(canvasRef.current,{pixelRatio:2,cacheBust:true});const a=document.createElement('a');a.href=dataUrl;a.download='our-wedding-invitation.png';a.click();toast('PNG downloaded');}catch{toast.error('Could not export image');}
  }

  async function downloadPdf(){
    if(!canvasRef.current)return;
    try{
      const dataUrl=await toPng(canvasRef.current,{pixelRatio:2,cacheBust:true});
      const img=new Image();img.src=dataUrl;await new Promise(r=>img.onload=r);
      const pdf=new jsPDF({orientation:'portrait',unit:'px',format:[img.width,img.height]});
      pdf.addImage(dataUrl,'PNG',0,0,img.width,img.height);
      pdf.save('our-wedding-invitation.pdf');
      toast('PDF downloaded');
    }catch{toast.error('Could not export PDF');}
  }

  return <div className="modal-backdrop" onClick={onClose}>
    <div className="studio-modal share-modal" role="dialog" aria-modal="true" aria-label="Share your invitation" onClick={e=>e.stopPropagation()}>
      <Button className="modal-close" variant="ghost" size="icon" aria-label="Close" onClick={onClose}><X/></Button>
      <div className="eyebrow text-primary">Your invitation is ready</div>
      <h2>Share the joy.</h2>
      <p className="text-xs text-muted-foreground mt-2">Send your invitation to everyone you love.</p>
      <div className="share-options">
        <Button variant="whatsapp" onClick={()=>window.open(`https://wa.me/?text=${encodedMsg}`,'_blank')}><MessageCircle size={20}/>WhatsApp</Button>
        <Button variant="default" onClick={()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMsg}`,'_blank')}><Facebook size={20}/>Facebook</Button>
        <Button variant="default" onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodedMsg}`,'_blank')}><Twitter size={20}/>X / Twitter</Button>
        <Button variant="paper" onClick={copyLink}>{copied?<Check size={20}/>:<Link2 size={20}/>}{copied?'Copied':'Copy link'}</Button>
        <Button variant="paper" onClick={downloadPng}><Download size={20}/>Download PNG</Button>
        <Button variant="paper" onClick={downloadPdf}><FileText size={20}/>Download PDF</Button>
      </div>
      {qrUrl&&<div className="flex flex-col items-center gap-2 mt-3"><img src={qrUrl} alt="QR code for invitation link" width={120} height={120}/><span className="text-[9px] text-muted-foreground">Scan to open</span></div>}
      <div className="form-field mt-4"><label>Direct link</label><div className="flex gap-2"><input className="studio-input" readOnly value={url} onClick={e=>(e.target as HTMLInputElement).select()}/><Button variant="ghost" size="icon" onClick={copyLink}><Copy size={14}/></Button></div></div>
    </div>
  </div>;
}
