"""Inspect the real MP4, extract encoded frames, and package measured quality evidence."""
from pathlib import Path
import subprocess,json,hashlib
from PIL import Image,ImageDraw
import numpy as np

root=Path(__file__).resolve().parent.parent
out=root/'output'; movie=out/'seaside-1440p.mp4'; decoded=out/'decoded'; decoded.mkdir(exist_ok=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(movie)]))
(out/'ffprobe.json').write_text(json.dumps(probe,indent=2))
v=next(s for s in probe['streams'] if s['codec_type']=='video')
assert (v['width'],v['height'],v['r_frame_rate'],v['pix_fmt'],v['codec_name'],int(v['nb_read_frames']))==(2560,1440,'30/1','yuv420p','h264',1440)
assert abs(float(probe['format']['duration'])-48)<.001
check=subprocess.run(['ffmpeg','-v','error','-i',str(movie),'-f','null','-'],capture_output=True,text=True)
(out/'decode.log').write_text(check.stderr)
assert check.returncode==0 and not check.stderr.strip()
frames=sorted(set([0,60,180,300,450,480,555,585,648,735,795,855,945,1065,1185,1290,1439]+list(range(570,613,6))+list(range(630,709,6))))
select='+'.join(f'eq(n,{f})' for f in frames)
subprocess.run(['ffmpeg','-v','error','-threads','2','-y','-i',str(movie),'-vf',f'select={select.replace(",",chr(92)+",")}', '-fps_mode','vfr','-threads','1',str(decoded/'extract-%03d.png')],check=True)
images=sorted(decoded.glob('extract-*.png'));assert len(images)==len(frames)
for p,f in zip(images,frames):p.rename(decoded/f'{f:04}.png')

def contact(selected,target,cols=3,width=640):
 h=width*9//16;cellh=h+34;rows=(len(selected)+cols-1)//cols
 sheet=Image.new('RGB',(cols*width,rows*cellh),'#E9E6DE');draw=ImageDraw.Draw(sheet)
 for i,f in enumerate(selected):
  im=Image.open(decoded/f'{f:04}.png').resize((width,h),Image.Resampling.LANCZOS)
  x=i%cols*width;y=i//cols*cellh;sheet.paste(im,(x,y));draw.text((x+12,y+h+9),f'FRAME {f:04}   /   {f/30:.2f}s',fill='#273B3C')
 sheet.save(out/target,quality=92)
contact([60,180,450,585,648,735,855,945,1065,1185,1290,1439],'keyframes-contact.jpg')
contact(list(range(570,613,6)),'photo-transition-contact.jpg',4,480)
contact(list(range(630,709,6)),'path-transition-contact.jpg',4,480)
q=json.loads((out/'frame-quality.json').read_text())
assert len(q['audits'])>=17 and q['sameFrameIdentical'] and q['staticIntervalIdentical']
assert all(not a['violations'] and a['fontsReady'] for a in q['audits'])
a=np.array(Image.open(decoded/'0450.png')).astype(float);b=np.array(Image.open(decoded/'0480.png')).astype(float)
delta=float(np.abs(a-b).mean())
raw=subprocess.check_output(['ffmpeg','-v','error','-threads','2','-i',str(movie),'-vf','scale=160:90,format=gray','-threads','1','-f','rawvideo','-'])
low=np.frombuffer(raw,dtype=np.uint8).reshape((-1,90,160)).astype(float)
assert len(low)==1440
changes=np.abs(np.diff(low,axis=0)).mean(axis=(1,2))
report={'file':movie.name,'bytes':movie.stat().st_size,'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'duration_seconds':float(probe['format']['duration']),'decoded_frames':int(v['nb_read_frames']),'codec':v['codec_name'],'pixel_format':v['pix_fmt'],'color_range':v.get('color_range'),'color_space':v.get('color_space'),'full_decode_exit':check.returncode,'full_decode_errors':check.stderr,'audio':'none — silent visual review edition','rendered_layout_audit_frames':len(q['audits']),'source_same_frame_repeat_identical':q['sameFrameIdentical'],'source_static_15s_16s_identical':q['staticIntervalIdentical'],'encoded_static_15s_16s_mean_absolute_rgb_difference_0_to_255':delta,'all_frame_low_resolution_motion_measurement':{'frame_pairs':len(changes),'max_mean_luma_difference_0_to_255':float(changes.max()),'largest_change_at_frame':int(changes.argmax()+1),'p99':float(np.percentile(changes,99))},'encoded_frame_samples':frames,'limits':['Layout and visual samples do not constitute every-frame semantic inspection.','Low-resolution motion statistics cannot certify individual glyphs or line continuity.','No voiceover or music has been produced.','Photo is generated illustrative material, not an actual social post.','External download delivery remains blocked until a real upload succeeds.']}
(out/'QUALITY.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
