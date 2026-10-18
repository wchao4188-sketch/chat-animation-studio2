"""Create self-contained source and delivery archives; never include caches or credentials."""
from pathlib import Path
import zipfile,hashlib,json

root=Path(__file__).resolve().parent.parent
out=root/'output';out.mkdir(exist_ok=True)
source=out/'chat-animation-studio2-source-v0.1.0.zip'
source_dirs=['src','scripts','docs','public','.agents']
source_files=['package.json','package-lock.json','tsconfig.json','README.md','.gitignore','.npmrc','skills-lock.json']
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED) as z:
 for name in source_files:
  p=root/name
  z.write(p,Path('chat-animation-studio2')/name)
 for name in source_dirs:
  for p in sorted((root/name).rglob('*')):
   if p.is_file():z.write(p,Path('chat-animation-studio2')/p.relative_to(root))
 assert z.testzip() is None

delivery_files=[source.name,'seaside-1440p.mp4','seaside-original.srt','keyframes-contact.jpg','photo-transition-contact.jpg','path-transition-contact.jpg','QUALITY.md','QUALITY.json','frame-quality.json','ffprobe.json','rendered-transcript.json']
manifest={name:{'bytes':(out/name).stat().st_size,'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()} for name in delivery_files}
(out/'MANIFEST.json').write_text(json.dumps(manifest,indent=2))
delivery=out/'chat-animation-studio2-delivery-v0.1.0.zip'
with zipfile.ZipFile(delivery,'w',zipfile.ZIP_DEFLATED) as z:
 for name in delivery_files+['MANIFEST.json']:z.write(out/name,name)
 for p in sorted((out/'decoded').glob('*.png')):z.write(p,Path('keyframes')/p.name)
 assert z.testzip() is None
print(json.dumps({'source_bytes':source.stat().st_size,'delivery_bytes':delivery.stat().st_size,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'delivery_sha256':hashlib.sha256(delivery.read_bytes()).hexdigest(),'external_upload':'not completed'},indent=2))
