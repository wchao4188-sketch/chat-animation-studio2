import fs from 'node:fs';
import {CUES,SCRIPT} from '../src/content';
const stamp=(s:number)=>{const n=Math.round(s*1000);return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')},${String(n%1000).padStart(3,'0')}`;};
fs.writeFileSync('output/seaside-original.srt',CUES.map((c,i)=>`${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));
fs.writeFileSync('docs/SCHEME-B-ORIGINAL.txt',SCRIPT.join('\n\n')+'\n');
const actual=JSON.parse(fs.readFileSync('output/rendered-transcript.json','utf8')) as string[];
if(JSON.stringify(actual)!==JSON.stringify([...SCRIPT]))throw new Error('Rendered transcript differs from approved original');
console.log('All seven actual rendered text passages match the approved original exactly.');
