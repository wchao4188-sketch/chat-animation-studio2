import {bundle} from '@remotion/bundler';
import {openBrowser,renderStill,selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const main=async()=>{
const root=process.cwd();const output=path.join(root,'output/frames');fs.mkdirSync(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(root,'.cache/bundle')});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
const composition=await selectComposition({serveUrl,id:'Seaside',puppeteerInstance:browser,inputProps:{audit:true}});
const requested=[0,60,180,300,450,480,555,585,648,735,795,855,945,1065,1185,1290,1439];
const audits:unknown[]=[];
for(const frame of requested){
 await renderStill({serveUrl,composition,frame,output:path.join(output,`${String(frame).padStart(4,'0')}.png`),puppeteerInstance:browser,inputProps:{audit:true},onBrowserLog:log=>{if(log.text.startsWith('FRAME_QA:'))audits.push(JSON.parse(log.text.slice('FRAME_QA:'.length)));}});
 console.log(`Frame ${frame} complete`);
}
await renderStill({serveUrl,composition,frame:450,output:path.join(output,'0450-repeat.png'),puppeteerInstance:browser});
await browser.close({silent:true});
const hash=(name:string)=>createHash('sha256').update(fs.readFileSync(path.join(output,name))).digest('hex');
const result={composition,requestedFrames:requested,audits,sameFrameIdentical:hash('0450.png')===hash('0450-repeat.png'),staticIntervalIdentical:hash('0450.png')===hash('0480.png')};
fs.writeFileSync(path.join(root,'output/frame-quality.json'),JSON.stringify(result,null,2));
const violations=(audits as {violations:string[]}[]).flatMap(a=>a.violations);if(audits.length<requested.length||violations.length||!result.sameFrameIdentical||!result.staticIntervalIdentical)throw new Error(`Quality check failed: audits=${audits.length}; ${JSON.stringify([...new Set(violations)])}`);
};
main().catch(e=>{console.error(e);process.exitCode=1;});
