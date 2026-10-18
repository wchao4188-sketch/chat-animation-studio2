import {mix,progress,type Cubic,type Point} from './timeline';

export const UPGRADE_SECONDS=54;
export const UPGRADE_FRAMES=1620;
/** Give the opening reveal 3.3s rather than rushing the large camera displacement. */
export function designTime(time:number):number{return time<3.8?time:time<7.1?3.8+(time-3.8)*1.3/3.3:time-2;}
export type CameraPose={cx:number;cy:number;scale:number;oy:number};
export const POSES={
 opening:{cx:1400,cy:1120,scale:1.48,oy:0},
 quote:{cx:2100,cy:1150,scale:.94,oy:0},
 photography:{cx:2250,cy:1060,scale:.78,oy:0},
 sea:{cx:2550,cy:1320,scale:.68,oy:0},
 overview:{cx:2300,cy:1220,scale:.59,oy:-145},
} satisfies Record<string,CameraPose>;
export function cameraAt(t:number):CameraPose{
 t=designTime(t);
 let pose:CameraPose=POSES.opening;
 for(const [start,end,target] of [[3.8,5.1,POSES.quote],[19.7,21.2,POSES.photography],[28.3,29.7,POSES.sea],[40.2,41.6,POSES.overview]] as const){
  const p=progress(t,start,end);
  pose={cx:mix(pose.cx,target.cx,p),cy:mix(pose.cy,target.cy,p),scale:mix(pose.scale,target.scale,p),oy:mix(pose.oy,target.oy,p)};
 }
 return pose;
}
export const HERO={x:500,y:500,w:1800,h:1350};
export const ORIGIN={x:2300,y:1175};
export const PHOTO_PATH:Cubic=[ORIGIN,{x:2490,y:1175},{x:2470,y:740},{x:2800,y:740}];
export const SEA_PATH:Cubic=[ORIGIN,{x:2510,y:1175},{x:2490,y:1500},{x:2750,y:1500}];
export const DESTINATIONS={
 travel:[SEA_PATH[3],{x:3040,y:1500},{x:3140,y:1200},{x:3500,y:1200}],
 view:[SEA_PATH[3],{x:3100,y:1500},{x:3290,y:1500},{x:3650,y:1500}],
 why:[SEA_PATH[3],{x:3030,y:1500},{x:3030,y:1780},{x:3350,y:1780}],
} satisfies Record<string,Cubic>;

/** Equal-count, aligned perimeter samples. Only an observation window changes shape; the photograph never warps. */
function rectangle(cx:number,cy:number,w:number,h:number):Point[]{
 const corners=[{x:cx-w/2,y:cy-h/2},{x:cx+w/2,y:cy-h/2},{x:cx+w/2,y:cy+h/2},{x:cx-w/2,y:cy+h/2}];
 return corners.flatMap((a,i)=>Array.from({length:16},(_,j)=>({x:mix(a.x,corners[(i+1)%4].x,j/16),y:mix(a.y,corners[(i+1)%4].y,j/16)})));
}
export const FOCUS_PHOTO=rectangle(1400,1170,1400,900);
export const FOCUS_SEA=rectangle(1400,1125,1660,590);
export function focusPoints(t:number):Point[]{const p=progress(t,28.3,29.7);return FOCUS_PHOTO.map((a,i)=>({x:mix(a.x,FOCUS_SEA[i].x,p),y:mix(a.y,FOCUS_SEA[i].y,p)}));}
export function focusPath(t:number):string{return focusPoints(t).map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ')+' Z';}
export function screenPoint(p:Point,t:number):Point{const c=cameraAt(t);return{x:1280+(p.x-c.cx)*c.scale,y:720+c.oy+(p.y-c.cy)*c.scale};}
export const UPGRADE_CUES=[
 {start:.55,end:3.8}, {start:7.3,end:21.6},{start:7.8,end:21.6},
 {start:23.5,end:30.2},{start:32,end:41.9},{start:43.9,end:45.8},{start:46,end:54},
] as const;
