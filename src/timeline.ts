/** All time is composition time. No wall clock, CSS animation, or unseeded randomness. */
export const DURATION = 48;
export const FPS = 30;
export const TOTAL_FRAMES = DURATION * FPS;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => {const t=clamp(v); return t*t*(3-2*t);};
export const progress = (time: number, start: number, end: number) => smooth((time-start)/(end-start));
export const show = (time: number, start: number, end=100, fade=.28) => progress(time,start,start+fade)*(1-progress(time,end-fade,end));
export const mix = (a: number,b: number,t: number) => a+(b-a)*t;

export const PHOTO = {large:{x:205,y:288,w:900,h:700},small:{x:256,y:475,w:614,h:460}};
export function photoBox(t:number) {
  const p=progress(t,19,20.3);
  return {x:mix(PHOTO.large.x,PHOTO.small.x,p),y:mix(PHOTO.large.y,PHOTO.small.y,p),w:mix(PHOTO.large.w,PHOTO.small.w,p),h:mix(PHOTO.large.h,PHOTO.small.h,p)};
}
export function camera(t:number) {const p=progress(t,37.65,38.55); return {scale:mix(1,.91,p),y:mix(0,-82,p)};}

export type Point = {x:number;y:number};
export type Cubic = readonly [Point,Point,Point,Point];
export const UPPER: Cubic=[{x:870,y:705},{x:1050,y:705},{x:1030,y:480},{x:1290,y:480}];
export const LOWER: Cubic=[{x:870,y:705},{x:1040,y:705},{x:1040,y:870},{x:1290,y:870}];
export const TRAVEL: Cubic=[{x:1290,y:870},{x:1530,y:870},{x:1580,y:740},{x:1850,y:740}];
export const VIEW: Cubic=[{x:1290,y:870},{x:1530,y:870},{x:1590,y:900},{x:1850,y:900}];
export const WHY: Cubic=[{x:1290,y:870},{x:1520,y:870},{x:1570,y:1060},{x:1850,y:1060}];
export function pointAt(c:Cubic,t:number):Point {
 const u=1-t;return {x:u*u*u*c[0].x+3*u*u*t*c[1].x+3*u*t*t*c[2].x+t*t*t*c[3].x,y:u*u*u*c[0].y+3*u*u*t*c[1].y+3*u*t*t*c[2].y+t*t*t*c[3].y};
}
export function path(c:Cubic):string {return `M${c[0].x},${c[0].y} C${c[1].x},${c[1].y} ${c[2].x},${c[2].y} ${c[3].x},${c[3].y}`;}
/** De Casteljau subdivision gives the exact partial curve and a truly attached endpoint. */
export function partial(c:Cubic,t:number):string {
 const p=clamp(t);const lerp=(a:Point,b:Point):Point=>({x:mix(a.x,b.x,p),y:mix(a.y,b.y,p)});
 const a=lerp(c[0],c[1]),b=lerp(c[1],c[2]),d=lerp(c[2],c[3]);const e=lerp(a,b),f=lerp(b,d),g=lerp(e,f);
 return path([c[0],a,e,g]);
}
