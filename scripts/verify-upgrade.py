"""Decode and inspect the actual upgraded movie, including full-timeline contact sheets."""
from pathlib import Path
import subprocess,json,hashlib
from PIL import Image,ImageDraw
import numpy as np

root=Path(__file__).resolve().parent.parent;out=root/'output/v0.2';movie=out/'seaside-1440p.mp4'
decoded=out/'decoded';decoded.mkdir(exist_ok=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(movie)]))
(out/'ffprobe.json').write_text(json.dumps(probe,indent=2))
v=next(x for x in probe['streams'] if x['codec_type']=='video')
assert (v['width'],v['height'],v['r_frame_rate'],v['pix_fmt'],v['codec_name'],int(v['nb_read_frames']))==(2560,1440,'30/1','yuv420p','h264',1620)
assert abs(float(probe['format']['duration'])-54)<.001
check=subprocess.run(['ffmpeg','-v','error','-threads','2','-i',str(movie),'-f','null','-'],capture_output=True,text=True)
(out/'decode.log').write_text(check.stderr);assert check.returncode==0 and not check.stderr.strip()
qa=json.loads((out/'frame-quality.json').read_text());keys=qa['frames']
assert len(qa['audits'])>=23 and qa['sameFrameIdentical'] and qa['readingIntervalIdentical'] and qa['transcriptMatches']
assert all(not x['violations'] and x['fontsReady'] for x in qa['audits'])
# Every half second for whole-film visual review, plus finer samples at both camera/morph transitions.
frames=sorted(set(keys+list(range(0,1620,15))+list(range(114,216,6))+list(range(909,954,3))))
# Keep the expression shallow: hundreds of summed eq() terms exceed FFmpeg's expression parser depth.
select=('not(mod(n,15))+between(n,114,210)*not(mod(n-114,6))+between(n,909,951)*not(mod(n-909,3))+'+'+'.join(f'eq(n,{f})' for f in keys)).replace(',',r'\,')
subprocess.run(['ffmpeg','-v','error','-threads','2','-y','-i',str(movie),'-vf',f'select={select}','-fps_mode','vfr','-threads','1',str(decoded/'extract-%03d.png')],check=True)
images=sorted(decoded.glob('extract-*.png'));assert len(images)==len(frames)
for p,f in zip(images,frames):p.rename(decoded/f'{f:04}.png')

def contact(selected,name,cols=3,width=640):
 h=width*9//16;cellh=h+34;rows=(len(selected)+cols-1)//cols
 image=Image.new('RGB',(cols*width,rows*cellh),'#17383B');draw=ImageDraw.Draw(image)
 for i,f in enumerate(selected):
  im=Image.open(decoded/f'{f:04}.png').resize((width,h),Image.Resampling.LANCZOS);x=i%cols*width;y=i//cols*cellh
  image.paste(im,(x,y));draw.text((x+12,y+h+9),f'FRAME {f:04}  /  {f/30:.2f}s',fill='#F6F0E5')
 image.save(out/name,quality=93)
contact([60,150,300,510,650,765,810,915,1020,1170,1350,1440],'keyframes-contact.jpg')
contact(list(range(114,216,6)),'camera-transition.jpg',4,480)
contact(list(range(909,954,3)),'focus-morph-transition.jpg',4,480)
whole=list(range(0,1620,15))
for i in range(0,len(whole),18):contact(whole[i:i+18],f'whole-film-{i//18+1:02}.jpg',3,640)
keydir=out/'keyframes';keydir.mkdir(exist_ok=True)
for f in keys:Image.open(decoded/f'{f:04}.png').save(keydir/f'{f:04}.jpg',quality=95)

a=np.array(Image.open(decoded/'0510.png')).astype(float);b=np.array(Image.open(decoded/'0540.png')).astype(float)
raw=subprocess.check_output(['ffmpeg','-v','error','-threads','2','-i',str(movie),'-vf','scale=160:90,format=gray','-threads','1','-f','rawvideo','-'])
low=np.frombuffer(raw,dtype=np.uint8).reshape((-1,90,160)).astype(float);assert len(low)==1620
changes=np.abs(np.diff(low,axis=0)).mean(axis=(1,2))
result={'version':'0.2.0-visual-upgrade','file':movie.name,'bytes':movie.stat().st_size,'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'width':2560,'height':1440,'fps':'30/1','duration_seconds':54,'decoded_frames':1620,'codec':v['codec_name'],'pixel_format':v['pix_fmt'],'color_space':v.get('color_space'),'color_range':v.get('color_range'),'full_decode_exit':check.returncode,'decode_errors':check.stderr,'audit_sample_frames':len(qa['audits']),'rendered_original_text_exact_match':qa['transcriptMatches'],'deterministic_repeat_png_identical':qa['sameFrameIdentical'],'stable_reading_png_identical':qa['readingIntervalIdentical'],'encoded_reading_17s_18s_mean_rgb_difference_0_to_255':float(np.abs(a-b).mean()),'whole_movie_visual_sample_step_seconds':.5,'decoded_sample_frames':frames,'motion_summary':{'pairs':len(changes),'max_mean_luma_difference':float(changes.max()),'at_frame':int(changes.argmax()+1),'p99':float(np.percentile(changes,99))},'audio':'none','limits':['Visual contact review is sampled, not a claim of manual viewing of all 1620 full-resolution frames.','Whole-frame motion statistics do not replace local geometry and text checks.','Existing photograph is AI-generated illustrative material.','Camera, layout, timing, palette and focus-window design are project originals; the uploaded document supplied techniques only.']}
(out/'QUALITY.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
