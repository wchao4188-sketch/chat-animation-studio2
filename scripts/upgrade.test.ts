import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt,DESTINATIONS,focusPoints,HERO,ORIGIN,PHOTO_PATH,POSES,SEA_PATH,screenPoint,UPGRADE_FRAMES} from '../src/upgrade-timeline';
import {pointAt,progress} from '../src/timeline';
test('all topic routes stay attached to the same photograph on every camera frame',()=>{
 assert.deepEqual(ORIGIN,{x:HERO.x+HERO.w,y:1175});
 assert.deepEqual(PHOTO_PATH[0],ORIGIN);assert.deepEqual(SEA_PATH[0],ORIGIN);
 for(const c of Object.values(DESTINATIONS))assert.deepEqual(c[0],SEA_PATH[3]);
 for(let f=0;f<UPGRADE_FRAMES;f++){const t=f/30;assert.deepEqual(screenPoint(PHOTO_PATH[0],t),screenPoint(SEA_PATH[0],t));}
});
test('virtual camera is continuous, deterministic, and completely still during reading',()=>{
 for(const [a,b] of [[8.2,21.2],[26.9,30.2],[32,41.9],[46.5,54]])for(let f=Math.ceil(a*30);f<b*30;f++)assert.deepEqual(cameraAt(f/30),cameraAt(a));
 let prev=screenPoint(ORIGIN,0);
 for(let f=0;f<UPGRADE_FRAMES;f++){const t=f/30,c=cameraAt(t),p=screenPoint(ORIGIN,t);assert.deepEqual(c,cameraAt(t));assert.ok(Math.hypot(p.x-prev.x,p.y-prev.y)<22);prev=p;}
 assert.deepEqual(cameraAt(53),POSES.overview);
});
test('64-point observation-window interpolation remains convex, aligned, and non-inverted',()=>{
 for(let f=0;f<UPGRADE_FRAMES;f++){
  const ps=focusPoints(f/30);assert.equal(ps.length,64);let area=0;
  for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%64],c=ps[(i+2)%64];area+=a.x*b.y-b.x*a.y;assert.ok((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x)>-1e-6);assert.ok(a.x>=HERO.x&&a.x<=HERO.x+HERO.w&&a.y>=HERO.y&&a.y<=HERO.y+HERO.h);}
  assert.ok(area>0);
 }
});
test('growing curve tips have no jump, reversal or malformed coordinates',()=>{
 for(const [curve,start,end] of [[PHOTO_PATH,21.8,23.6],[SEA_PATH,30.1,31.5],[DESTINATIONS.travel,31.7,33.1],[DESTINATIONS.view,33.4,34.6],[DESTINATIONS.why,35,36.5]] as const){
  let prev=pointAt(curve,0);for(let f=Math.floor(start*30);f<=Math.ceil(end*30);f++){const p=pointAt(curve,progress(f/30,start,end));assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(Math.hypot(p.x-prev.x,p.y-prev.y)<44);assert.ok(p.x>=prev.x-1e-8);prev=p;}
 }
});
