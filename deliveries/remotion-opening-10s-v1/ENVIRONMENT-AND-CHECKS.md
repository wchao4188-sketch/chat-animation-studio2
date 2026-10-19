# 新世界｜Remotion 开头10秒样片

独立目录 `/workspace/-/remotion-preview`。原Python工程和上级output里的既有MP4、工程ZIP、关键帧总览、验收记录均未覆盖；保存了其SHA-256并在渲染后复核一致。不访问或修改项目1。

## 可运行环境

- Node.js 24.19.0、npm 11.9.0、Chromium 154.0.8037.57、FFmpeg 7.1.5。
- Remotion、@remotion/cli、@remotion/media、@remotion/fonts全部固定4.0.536；React/React DOM 19.2.4；TypeScript 5.9.3。精确依赖树见package-lock.json。
- 全局npm列表因默认prefix目录不存在，不能据此判断已安装依赖；独立项目安装、实际导入、typecheck、Studio和渲染均已验证。

```bash
cd /workspace/-/remotion-preview
npm ci --no-audit --no-fund
npm run studio
npm run typecheck
npm run render
python scripts/quality_preview.py
```

Chromium路径由package.json中的`--browser-executable`指定。其他电脑若没有`/usr/bin/chromium`，改为本机浏览器可执行文件路径，或按Remotion官方方式获取其支持的浏览器。不要关闭TLS/完整性验证来安装依赖。

Studio已实际启动，并通过Remotion浏览器API打开，取得HTTP200、合成元数据、画面和音乐时间轴截图；见analysis/studio-check.json与studio-environment.png。这里的本地端口不是对外下载入口。未来云任务需重新启动Studio，不能依赖旧进程。

## 官方Skills

执行了用户提供的`npx -y skills@latest add remotion-dev/skills -g -y`。虽然CLI最终退出0，但日志明确显示无法创建`/home/agent/.agents`，全局安装失败，未计为成功。

随后在本目录执行：

```bash
npx -y skills@latest add remotion-dev/skills --agent codex -y
```

项目级安装成功，共12项技能，实际读取并使用了best-practices、create、markup、timing、audio、local-fonts、compositions、render和studio的指导。文件位于`.agents/skills/`，Codex可以直接读取；版本与来源哈希保存在skills-lock.json。官方站文档HTTPS请求被当前网络代理403拒绝；改用官方GitHub仓库的实际技能文件，没有把网页访问失败说成文档已读。

## 音乐：实际素材与分析

用户上传的`mmexport1792300994359.mp3`实际是MP4容器，175.007秒，含H.264画面与AAC/44.1kHz双声道音轨。先ffprobe检查，再提取音轨；只选前10秒作为本样片背景音乐，没有加入配音。`public/music-opening.wav`是用于最终渲染的选段，带80毫秒起音淡入和末400毫秒淡出，目标约-18 LUFS。

使用正向对数频谱差分、多频段起音包络与自相关。前30秒主要候选75.17 BPM（自相关约.389）和113.46 BPM（约.386）接近，存在拍速/细分歧义。它不是已经人工确认的小节或强弱拍谱；不能据此声称确定4/4或第一拍位置。

实测较强起音与动作：

| 时间 | 动作 |
|---|---|
| 0.845秒附近 | 聊天框描边完成，信息粒子向聊天窗口聚集 |
| 2.710秒附近 | 开始局部放大手机主体，标题下的路径描边完成 |
| 4.317秒附近 | 同一中心窗口转正、缩回；两位男生的聊天窗口从两侧进入，空间展开 |
| 6.961秒附近 | 两条认识关系路径建立，信息粒子沿同一数学路径到达 |
| 7.779秒起 | 原文提问开始竖向揭示，留出阅读时间 |
| 8.557秒附近 | 女生的窗口被线性环形标记聚焦，未推断好感或评分 |

详细数值、候选、置信度限制及事件图见analysis/music-analysis.json和music-events.png。首10秒中文ASR仅取得“嗯 lo”等非可靠文本，不能作为无任何人声的证明。没有新增口播。

## 设计与可编辑代码

src/Opening.tsx为完整主体、路径与动画；src/Root.tsx注册300帧合成；所有运动由useCurrentFrame、interpolate和确定性几何驱动。SVG路径生长、局部缩放、CSS透视/转角、实体边缘分层、构图重组、粒子沿路径聚集均实际参与成片。不依赖CSS真实时间动画，不使用Three.js或粒子库堆砌效果。

主参考仍是62.016秒的飞机视频。实际使用的是“稳定主体承载逐步建立的信息、局部变化与构图推进”的方法，而非复刻飞机或颜色。采用纸色、炭黑、朱砂与暖金，手机由近景进入三人空间。两位男生等尺度、等粒子数，不用亮度、线条粗细或数量表示好感。人物、手机和所有矢量素材原创绘制；没有引用参考视频的画面。两行原文按开头的语义顺序进入画面，不扩展后续整片。

字号、颜色、关键帧和路径都可在Opening.tsx修改。字体为本机Noto CJK的简体中文子集WOFF，通过官方@remotion/fonts实际加载，许可位于public/fonts/LICENSE-NOTO.txt。TTC格式推断和WOFF2缺少Brotli的方案均未采用；最终WOFF加载和渲染已经通过，没有为此额外安装Python依赖。

## 实际验收

output/NewWorld-Remotion-10s.mp4：2560×1440、16:9、30fps，300帧，视频10秒，容器约10.005秒。实际大小2,901,546字节。

- tsc通过；浏览器预览和字体实际加载通过。
- 全部300帧和音轨完整解码通过；查看61张覆盖全片的抽帧，并检查关键构图原生大图。
- 修复标题退出后残留、标题与中心主体重叠风险，以及背景关系线画到手机前面的层级问题；重新渲染后复核。
- 最终AAC/48kHz音轨与选段波形相关系数0.999961，测得偏移0毫秒；约-17.9 LUFS、真峰值-6.6dBFS，无削波。
- 前后帧差异记录在output/motion.json。分析没有将刻意阅读停顿当作动画错误。
- 既有上级成果SHA-256不变。

工具不支持音频输入，未进行人工完整试听；频谱分析、ASR、波形对照和响度检查不能冒充人耳试听，也不代表音乐学上的重拍判断已确认。视觉检查覆盖全时段抽帧，不声称人工逐帧实时观看。

本阶段停在10秒样片，没有扩展为整条视频。源代码包包含10秒音乐选段、本地字体、锁文件、官方Skills、分析及检查结果；不包含node_modules、缓存或175秒上传原文件。

独立下载源码包后，Remotion预览/渲染只需Node与浏览器。Python分析/检查脚本为可选，依赖见requirements-analysis.txt；未随包提供的上级旧成果不会被误报为已校验。
