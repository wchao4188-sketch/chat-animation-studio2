import {useLayoutEffect} from 'react';
export function useFrameAudit(audit:boolean,frame:number){
 useLayoutEffect(()=>{
  if(!audit)return;
  const stage=document.querySelector('[data-qa-stage]')!.getBoundingClientRect();
  const visible=(el:Element)=>{let o=1;for(let e:Element|null=el;e;e=e.parentElement)o*=Number(getComputedStyle(e).opacity);return o>.98;};
  const texts=Array.from(document.querySelectorAll('[data-qa]')).filter(visible).map(el=>{
   const rects:{x:number;y:number;w:number;h:number}[]=[];const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node:Node|null;
   while((node=walk.nextNode())){const range=document.createRange();range.selectNodeContents(node);for(const r of Array.from(range.getClientRects()))if(r.width>1&&r.height>1)rects.push({x:r.x-stage.x,y:r.y-stage.y,w:r.width,h:r.height});}
   return{id:el.getAttribute('data-qa'),text:el.textContent,rects};
  });
  const violations:string[]=[];
  for(const a of texts)for(const r of a.rects)if(r.x<153.6||r.x+r.w>2406.4||r.y<100.8||r.y+r.h>1296)violations.push(`safe:${a.id}`);
  for(let a=0;a<texts.length;a++)for(let b=a+1;b<texts.length;b++)for(const r of texts[a].rects)for(const q of texts[b].rects)if(r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y)violations.push(`text-overlap:${texts[a].id}/${texts[b].id}`);
  for(const p of Array.from(document.querySelectorAll('svg path[data-connection]')).filter(visible)){
   const path=p as SVGPathElement,matrix=path.getScreenCTM();if(!matrix)continue;
   const length=path.getTotalLength();for(let i=0;i<=160;i++){const q=path.getPointAtLength(length*i/160),z=new DOMPoint(q.x,q.y).matrixTransform(matrix);const x=z.x-stage.x,y=z.y-stage.y;
    for(const a of texts)for(const r of a.rects)if(x>r.x-4&&x<r.x+r.w+4&&y>r.y-4&&y<r.y+r.h+4)violations.push(`line-text:${a.id}`);
   }
  }
  console.log('UPGRADE_QA:'+JSON.stringify({frame,texts,violations:[...new Set(violations)],fontsReady:document.fonts.check('64px SeasideSans')&&document.fonts.check('86px SeasideSerif')}));
 },[audit,frame]);
}
