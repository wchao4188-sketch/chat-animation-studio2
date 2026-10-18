import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CUES,QUOTE,SCRIPT} from '../src/content';
import {camera,FPS,LOWER,partial,PHOTO,photoBox,pointAt,progress,TOTAL_FRAMES,TRAVEL,UPPER,VIEW,WHY} from '../src/timeline';

test('approved original dialogue is complete, in order, including conditional language',()=>{
 assert.equal(QUOTE.join(''),SCRIPT[2]);
 assert.deepEqual(CUES.map(c=>c.text),[...SCRIPT]);
 for(const cue of CUES){assert.ok(cue.end>cue.start);assert.ok(cue.end<=48);}
 assert.ok(SCRIPT[3].startsWith('如果她说'));
 assert.ok(SCRIPT[4].startsWith('如果她说'));
 assert.equal(TOTAL_FRAMES,48*FPS);
});
test('photo reaches fixed endpoints and remains still throughout reading',()=>{
 assert.deepEqual(photoBox(3),PHOTO.large);assert.deepEqual(photoBox(22),PHOTO.small);
 for(let f=150;f<550;f++)assert.deepEqual(photoBox(f/FPS),PHOTO.large);
 for(let f=620;f<1100;f++)assert.deepEqual(photoBox(f/FPS),PHOTO.small);
 assert.deepEqual(camera(42),camera(47));
});
test('continuous curves share exact anchor nodes; no invalid or nondeterministic paths',()=>{
 assert.deepEqual(UPPER[0],LOWER[0]);
 for(const branch of [TRAVEL,VIEW,WHY])assert.deepEqual(LOWER[3],branch[0]);
 for(const curve of [UPPER,LOWER,TRAVEL,VIEW,WHY]){
  assert.deepEqual(pointAt(curve,0),curve[0]);assert.deepEqual(pointAt(curve,1),curve[3]);
  for(let i=0;i<=100;i++){const p=i/100;const d=partial(curve,p);assert.equal(d,partial(curve,p));assert.ok(!/NaN|Infinity/.test(d));}
 }
});
test('frame-sampled path tips advance continuously, without overshoot or wraparound',()=>{
 const curves=[{curve:UPPER,start:21.05,end:22.35},{curve:LOWER,start:28,end:29.25},{curve:TRAVEL,start:29.45,end:30.55},{curve:VIEW,start:31.2,end:32.3},{curve:WHY,start:33.25,end:34.65}];
 for(const {curve,start,end} of curves){let prev=pointAt(curve,0);for(let f=Math.floor(start*FPS);f<=Math.ceil(end*FPS);f++){const current=pointAt(curve,progress(f/FPS,start,end));assert.ok(Math.hypot(current.x-prev.x,current.y-prev.y)<36);assert.ok(current.x>=prev.x-1e-8);prev=current;}}
});
