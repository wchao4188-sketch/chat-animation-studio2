import {spawnSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
fs.mkdirSync('output',{recursive:true});
const run=(bin:string,args:string[])=>{const r=spawnSync(bin,args,{stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);};
run(path.resolve('node_modules/.bin/remotion'),['render','src/index.ts','Seaside','output/seaside-render-master.mp4','--browser-executable=/usr/bin/chromium','--codec=h264','--crf=17','--pixel-format=yuv420p','--concurrency=4']);
// Remotion's JPEG-based master is full-range. Explicitly normalize delivery to limited-range Rec.709.
run('ffmpeg',['-hide_banner','-y','-i','output/seaside-render-master.mp4','-vf','scale=in_range=pc:out_range=tv:out_color_matrix=bt709','-c:v','libx264','-preset','medium','-crf','17','-threads','4','-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-an','output/seaside-1440p.mp4']);
