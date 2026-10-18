from pathlib import Path
import zipfile,json,hashlib

root=Path(__file__).resolve().parent.parent;out=root/'output/v0.2'
source=out/'chat-animation-studio2-source-v0.2.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED) as z:
 for name in ['package.json','package-lock.json','tsconfig.json','README.md','.gitignore','.npmrc','skills-lock.json']:
  z.write(root/name,Path('chat-animation-studio2')/name)
 for directory in ['src','scripts','docs','public','.agents']:
  for p in sorted((root/directory).rglob('*')):
   if p.is_file():z.write(p,Path('chat-animation-studio2')/p.relative_to(root))
 assert z.testzip() is None
delivery=out/'chat-animation-studio2-delivery-v0.2.zip'
with zipfile.ZipFile(delivery,'w',zipfile.ZIP_DEFLATED) as z:
 for p in [source,out/'seaside-1440p.mp4',out/'QUALITY.json',out/'QUALITY.md',out/'frame-quality.json',out/'ffprobe.json',out/'seaside-original.srt']+sorted(out.glob('*.jpg'))+sorted((out/'keyframes').glob('*.jpg')):
  z.write(p,p.relative_to(out))
 assert z.testzip() is None
results={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [source,delivery,out/'seaside-1440p.mp4']}
(out/'MANIFEST.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
