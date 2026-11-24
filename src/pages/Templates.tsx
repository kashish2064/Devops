import {useEffect} from 'react';
import {Header,Footer,setPageMeta} from '@/components/studio/shell';
import {TemplateGallery} from '@/components/studio/template-gallery';

export default function Templates(){
  useEffect(()=>setPageMeta('The Wedding Design Collection','Explore 15 elegant wedding invitation designs, from floral and minimal to traditional Nepali invitations.'),[]);
  return <><Header/><main className="editorial-container gallery-content">
    <div className="page-intro"><div className="eyebrow text-primary">Thoughtfully designed. Uniquely yours.</div><h1>A design for every love story.</h1><p>Find the one that feels like you.</p></div>
    <TemplateGallery/>
  </main><Footer/></>;
}
