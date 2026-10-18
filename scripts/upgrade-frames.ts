import {bundle} from '@remotion/bundler';
import {openBrowser,renderStill,selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {SCRIPT} from '../src/content';
async function main(){
 const out=path.resolve('output/v0.2');fs.mkdirSync(`${out}/frames`,{recursive:true});
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:path.resolve('.cache/upgrade-bundle')});
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
 const composition=await selectComposition({serveUrl,id:'SeasideUpgrade',puppeteerInstance:browser,inputProps:{audit:true}});
 const frames=[0,60,150,210,300,510,540,650,690,720,765,810,870,915,960,1020,1080,1170,1250,1290,1350,1440,1619];
 const audits:{frame:number;texts:{id:string;text:string}[];violations:string[];fontsReady:boolean}[]=[];
 try{for(const frame of frames){await renderStill({serveUrl,composition,frame,output:`${out}/frames/${String(frame).padStart(4,'0')}.png`,puppeteerInstance:browser,onBrowserLog:log=>{if(log.text.startsWith('UPGRADE_QA:'))audits.push(JSON.parse(log.text.slice(11)));}});console.log(`Upgrade frame ${frame}`);}
  await renderStill({serveUrl,composition,frame:510,output:`${out}/frames/0510-repeat.png`,puppeteerInstance:browser});
 }finally{await browser.close({silent:true});}
 const hash=(name:string)=>createHash('sha256').update(fs.readFileSync(`${out}/frames/${name}`)).digest('hex');
 const text=(f:number,id:string)=>audits.find(a=>a.frame===f)?.texts.find(x=>x.id===id)?.text??'';
 const rendered=[text(60,'intro'),text(510,'you-can-say'),['quote-1','quote-2','quote-3'].map(id=>text(510,id)).join(''),text(810,'caption-photo'),text(1170,'caption-sea'),text(1350,'notice'),text(1440,'conclusion')].map(x=>x.replace(/\s/g,''));
 const result={composition,frames,audits,renderedTranscript:rendered,transcriptMatches:JSON.stringify(rendered)===JSON.stringify([...SCRIPT]),sameFrameIdentical:hash('0510.png')===hash('0510-repeat.png'),readingIntervalIdentical:hash('0510.png')===hash('0540.png')};
 fs.writeFileSync(`${out}/frame-quality.json`,JSON.stringify(result,null,2));
 const problems=[...new Set(audits.flatMap(a=>a.violations))];if(audits.length<frames.length||problems.length||!result.transcriptMatches||!result.sameFrameIdentical||!result.readingIntervalIdentical||audits.some(a=>!a.fontsReady))throw Error(JSON.stringify({problems,transcript:rendered,audits:audits.length}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
