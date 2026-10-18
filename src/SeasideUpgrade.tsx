import React from 'react';
import {AbsoluteFill,CanvasImage,Interactive,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {SANS,SERIF} from './style';
import {mix,partial,pointAt,progress,show,type Cubic} from './timeline';
import {cameraAt,designTime,DESTINATIONS,focusPath,focusPoints,HERO,ORIGIN,PHOTO_PATH,SEA_PATH} from './upgrade-timeline';
import {SCRIPT} from './content';
import {useFrameAudit} from './useFrameAudit';
import './fonts';

const INK='#F6F0E5',MINT='#ACD4C7',SAND='#E6C29B';
type WordsProps={id:string;x:number;y:number;width:number;size:number;children:React.ReactNode;opacity?:number;serif?:boolean;color?:string;align?:'left'|'center';lineHeight?:number};
const Words=({id,x,y,width,size,children,opacity=1,serif=false,color=INK,align='left',lineHeight=1.5}:WordsProps)=><div data-qa={id} style={{position:'absolute',left:x,top:y,width,fontFamily:serif?SERIF:SANS,fontSize:size,lineHeight,whiteSpace:'pre-line',color,opacity,textAlign:align,fontWeight:400}}>{children}</div>;
const Growing=({curve,p,color,width=5}:{curve:Cubic;p:number;color:string;width?:number})=>{
 if(p<=0)return null;const tip=pointAt(curve,p);
 return <><path data-connection d={partial(curve,p)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>{p<1&&<circle cx={tip.x} cy={tip.y} r={7} fill={color}/>}</>;
};

function UpgradeInner({audit=false}:{audit?:boolean}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps,t=designTime(time),camera=cameraAt(time);
 useFrameAudit(audit,frame);
 const upperOpacity=1-.72*progress(t,28.3,29.7)+.72*progress(t,40.2,41.6);
 const photoStart=progress(t,21.8,23.6),photoEnd=progress(t,23.7,24.9);
 const sea=progress(t,30.1,31.5),travel=progress(t,31.7,33.1),view=progress(t,33.4,34.6),why=progress(t,35,36.5);
 const windowOpacity=show(t,21.8,40.2,.5);
 const focus=focusPoints(t),left=focus[0].x,top=focus[0].y,right=focus[16].x,bottom=focus[32].y;
 const quoteOpacity=1-progress(t,19.2,19.6);
 return <AbsoluteFill data-qa-stage style={{background:'#17383B',overflow:'hidden',fontFamily:SANS}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 20% 45%,#3E5C59 0%,#234440 46%,#152E32 100%)'}}/>
  {/* One 6000×3000 scene. The camera moves; the photograph and all relationship anchors remain fixed. */}
  <div style={{position:'absolute',left:0,top:0,width:6000,height:3000,transformOrigin:'0 0',transform:`translate(${1280-camera.cx*camera.scale}px,${720+camera.oy-camera.cy*camera.scale}px) scale(${camera.scale})`}}>
   <CanvasImage src={staticFile('assets/seaside.png')} style={{position:'absolute',left:HERO.x,top:HERO.y,width:HERO.w,height:HERO.h,objectFit:'cover'}}/>
   <div style={{position:'absolute',left:HERO.x,top:HERO.y,width:HERO.w,height:HERO.h,background:'linear-gradient(0deg,rgba(9,32,35,.55),transparent 29%)'}}/>
   <svg width={6000} height={3000} style={{position:'absolute',inset:0}} aria-hidden>
    <defs>
     <mask id="focus-outside"><rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} fill="white"/><path d={focusPath(t)} fill="black"/></mask>
     <clipPath id="focus-inside"><path d={focusPath(t)}/></clipPath>
    </defs>
    <g opacity={windowOpacity}>
     <rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} fill="#102E31" opacity={.26} mask="url(#focus-outside)"/>
     <path d={focusPath(t)} fill="none" stroke={INK} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress(t,21.8,23.2)}/>
     <g clipPath="url(#focus-inside)" opacity={.34*(1-progress(t,28.3,29.7))} stroke={INK} strokeWidth={2}>
      <line x1={mix(left,right,1/3)} y1={top} x2={mix(left,right,1/3)} y2={bottom}/><line x1={mix(left,right,2/3)} y1={top} x2={mix(left,right,2/3)} y2={bottom}/>
      <line x1={left} y1={mix(top,bottom,1/3)} x2={right} y2={mix(top,bottom,1/3)}/><line x1={left} y1={mix(top,bottom,2/3)} x2={right} y2={mix(top,bottom,2/3)}/>
     </g>
    </g>
    <g opacity={upperOpacity}>
     <Growing curve={PHOTO_PATH} p={photoStart} color={SAND}/>
     {photoEnd>0&&<path data-connection d={`M2800 740 L${mix(2800,3450,photoEnd)} 740`} stroke={SAND} strokeWidth={5} fill="none" strokeLinecap="round"/>}
     {photoStart>.99&&<circle cx={2800} cy={740} r={8} stroke={SAND} strokeWidth={3} fill="#234440"/>}
     {photoEnd>.99&&<circle cx={3450} cy={740} r={7} fill={SAND}/>}
    </g>
    <Growing curve={SEA_PATH} p={sea} color={MINT}/>
    <Growing curve={DESTINATIONS.travel} p={travel} color={MINT}/>
    <Growing curve={DESTINATIONS.view} p={view} color={MINT}/>
    <Growing curve={DESTINATIONS.why} p={why} color={MINT}/>
    {sea>.99&&<circle cx={2750} cy={1500} r={8} stroke={MINT} strokeWidth={3} fill="#234440"/>}
    {photoStart>0&&<circle cx={ORIGIN.x} cy={ORIGIN.y} r={10} fill="#17383B" stroke={INK} strokeWidth={3}/>} 
    {travel>.99&&<circle cx={3500} cy={1200} r={7} fill={MINT}/>}
    {view>.99&&<circle cx={3650} cy={1500} r={7} fill={MINT}/>}
    {why>.99&&<circle cx={3350} cy={1780} r={7} fill={MINT}/>}
   </svg>
   <Words id="source-label" x={900} y={1665} width={850} size={64} opacity={progress(t,21.2,21.6)}>海边照片</Words>
   <div style={{opacity:upperOpacity}}>
    <Words id="photo-preference" x={2670} y={585} width={650} size={88} color={SAND} opacity={progress(t,22.8,23.2)}>喜欢拍照</Words>
    <Words id="photography" x={3260} y={510} width={550} size={150} serif color={SAND} opacity={progress(t,24.4,24.8)}>摄影</Words>
   </div>
   <Words id="sea-preference" x={2600} y={1240} width={850} size={104} color={MINT} opacity={progress(t,30.8,31.2)}>喜欢大海</Words>
   <Words id="travel" x={3580} y={1050} width={600} size={128} serif color={MINT} opacity={progress(t,32.6,33)}>旅行</Words>
   <Words id="view" x={3730} y={1350} width={600} size={128} serif color={MINT} opacity={progress(t,34.1,34.5)}>风景</Words>
   <Words id="why" x={3430} y={1680} width={800} size={76} color={MINT} opacity={progress(t,36,36.4)} lineHeight={1.4}>她为什么喜欢{'\n'}那种环境</Words>
  </div>

  {/* Screen-space reading layers remain still while every long sentence is being read. */}
  <AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(0deg,rgba(10,30,34,.65),transparent 50%)',opacity:1-progress(t,3.5,3.8)}}/>
  <Words id="intro" x={180} y={930} width={1850} size={104} serif opacity={show(t,.55,3.8)} lineHeight={1.4}>比如你看到她发的{'\n'}海边照片。</Words>
  <div style={{opacity:quoteOpacity}}>
   <Words id="you-can-say" x={1515} y={180} width={850} size={48} color="#B6C5BA" opacity={progress(t,5.3,5.6)}>你可以说：</Words>
   <Words id="quote-1" x={1515} y={310} width={870} size={64} opacity={progress(t,5.8,6.15)} lineHeight={1.6}>“你那几张海边{'\n'}照片拍得挺好看的，</Words>
   <Words id="quote-2" x={1515} y={585} width={870} size={64} opacity={progress(t,9.4,9.75)} lineHeight={1.6}>我之前也想去海边{'\n'}待几天。</Words>
   <Words id="quote-3" x={1515} y={860} width={870} size={64} opacity={progress(t,12.9,13.25)} lineHeight={1.6}>你是比较喜欢<span style={{color:MINT}}>大海</span>，{'\n'}还是单纯喜欢<span style={{color:SAND}}>拍照</span>？”</Words>
  </div>
  <Words id="caption-photo" x={180} y={1180} width={2200} size={64} opacity={show(t,21.5,28.2)} align="center">{SCRIPT[3]}</Words>
  <Words id="caption-sea" x={180} y={1115} width={2200} size={60} opacity={show(t,30,39.9)} align="center" lineHeight={1.45}>如果她说喜欢大海，那你就可以聊旅行、风景，{'\n'}甚至她为什么喜欢那种环境。</Words>
  <Words id="notice" x={180} y={985} width={2200} size={58} opacity={show(t,41.9,43.8)} align="center">{SCRIPT[5]}</Words>
  <Words id="conclusion" x={180} y={1030} width={2200} size={86} serif opacity={progress(t,44,44.45)} lineHeight={1.3} align="center">同样是一张照片，{'\n'}你们聊出来的东西可能<span style={{color:MINT}}>完全不一样。</span></Words>
 </AbsoluteFill>;
}
export const SeasideUpgrade=Interactive.create({Component:UpgradeInner,layout:'absolute-fill'});
