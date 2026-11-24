import garden from '@/assets/wedding-garden.asset.json';
import couple from '@/assets/wedding-couple.asset.json';
import floral from '@/assets/wedding-floral.asset.json';
export const images = { garden: garden.url, couple: couple.url, floral: floral.url };
export const categories = ['All', 'Traditional', 'Minimal', 'Floral', 'Luxury', 'Modern', 'Nepali', 'South Asian'];
export type Template = { id:string; name:string; category:string; style:string; active?:boolean };
export const templates:Template[] = [
{id:'timeless',name:'Timeless Romance',category:'Minimal',style:'border'},
{id:'garden',name:'Garden of Love',category:'Floral',style:'floral'},
{id:'golden',name:'Golden Hour',category:'Luxury',style:'photo'},
{id:'sage',name:'Sage & Serenity',category:'Modern',style:'sage'},
{id:'royal',name:'Royal Vows',category:'Traditional',style:'wine'},
{id:'blush',name:'Blush Reverie',category:'Floral',style:'blush'},
{id:'arch',name:'The Ivory Arch',category:'Minimal',style:'arch'},
{id:'modern',name:'Simply Together',category:'Modern',style:'modern'},
{id:'nepali',name:'शुभ विवाह',category:'Nepali',style:'nepali'},
{id:'linen',name:'Written in Linen',category:'Minimal',style:'linen'},
{id:'botanical',name:'Wildflower Poetry',category:'Floral',style:'botanical'},
{id:'midnight',name:'Midnight in Paris',category:'Luxury',style:'night'},
{id:'portrait',name:'A Moment Forever',category:'Modern',style:'split'},
{id:'heritage',name:'Heritage & Hearts',category:'South Asian',style:'wine'},
{id:'eternal',name:'An Eternal Promise',category:'Traditional',style:'border'}];
export function getTemplate(id:string) { return templates.find(t=>t.id===id) ?? templates[0] ?? {id:'timeless',name:'Timeless Romance',category:'Minimal',style:'border'}; }
export function filterTemplates(items:Template[],category:string,search:string) { return items.filter(t=>(category==='All'||t.category===category)&&`${t.name} ${t.category}`.toLowerCase().includes(search.toLowerCase())); }
export type EventDetails = { name:string; date:string; time:string; venue:string };
export type CanvasElement = { id:string; kind:'text'|'image'; text:string; x:number; y:number; width:number; height:number; font:string; size:number; color:string; bold:boolean; italic:boolean; align:'left'|'center'|'right'; spacing:number };
export type Design = { firstName:string; secondName:string; date:string; time:string; venue:string; address:string; message:string; photo:string; photos:string[]; events:EventDetails[]; background:string; elements:CanvasElement[] };
const text = (id:string,value:string,y:number,size:number,height=50):CanvasElement=>({id,kind:'text',text:value,x:40,y,width:340,height,font:'Cormorant Garamond',size,color:'var(--foreground)',bold:false,italic:false,align:'center',spacing:0});
export function newDesign(templateId='timeless'):Design { const t=getTemplate(templateId); const nepali=t.style==='nepali'; return {firstName:nepali?'आर्या':'Olivia',secondName:nepali?'आदित्य':'James',date:'2027-06-14',time:'16:00',venue:'Villa Balbiano',address:'Lake Como, Italy',message:'Together with our families, we invite you to celebrate the beginning of our forever. Your presence would mean the world to us.',photo:images.couple,photos:[],events:[{name:'Wedding ceremony',date:'2027-06-14',time:'16:00',venue:'Villa Balbiano'},{name:'Dinner & dancing',date:'2027-06-14',time:'18:00',venue:'The garden terrace'}],background:t.style==='sage'?'var(--sage)':t.style==='wine'?'var(--wine)':t.style==='night'?'var(--foreground)':t.style==='blush'?'var(--accent)':'var(--paper)',elements:[text('intro',nepali?'शुभ विवाह':'TOGETHER WITH THEIR FAMILIES',115,11,35),text('first',nepali?'आर्या':'Olivia',190,65,78),text('amp','&',265,40,55),text('second',nepali?'आदित्य':'James',325,65,78),text('date','JUNE 14, 2027',438,14,35),text('venue','Villa Balbiano · Lake Como',480,18,45)]}; }
export function prettyDate(value:string) { const date=new Date(value+'T12:00:00'); return Number.isNaN(date.getTime())?value:date.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}); }
export function countdown(date:string, now=Date.now()) { const days=Math.max(0,Math.floor((new Date(date).getTime()-now)/86400000)); return days; }
