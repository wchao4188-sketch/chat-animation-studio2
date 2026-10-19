# 新世界｜从答案到线索

知识科普动态图形成片。2560×1440、16:9、30fps，140.8667秒。

本次按用户最新要求取消暖色：使用中性炭黑、银白、灰绿与克制红色。没有以先前咖啡馆竖屏短剧为模板，也没有覆盖任何旧版本。

## 打开与渲染

Node.js 24，npm 11，系统 Chromium。工程使用 Remotion 4.0.536、React 19.2.4、TypeScript 5.9.3，未新增依赖。

```bash
npm ci
npm run studio
npm run render
```

默认 Chromium 路径是 `/usr/bin/chromium`。其他系统请将 package.json 和 scripts/render.sh 中的 `--browser-executable` 改为实际浏览器路径，或移除该参数并使用 Remotion 管理的浏览器。Linux 上本次实际使用上述路径验证；没有声称在 Windows 上运行过。

`src/Film.tsx` 为讲解与图形，`src/Objects.tsx` 为可编辑 SVG 手机、照片和路径，`src/motion.ts` 为共享坐标与确定性运动，`src/timeline.json` 为48段原文口播时间，`src/events.json` 为动作起点，`src/captions.json` 为按毫秒分段的可编辑字幕。

`public/audio/master.m4a` 是成片实际使用的混音。`public/audio/user-music-source.m4a` 是从指定素材无重编码抽出的 AAC 片段；素材虽然扩展名是 MP3，实际容器为 MP4/AAC。音乐未作循环、变速或改曲。

## 内容与视觉依据

原始完整文案见 `原文.md`，48段文字与原顺序保留。短句“哪里人”因自动识别不稳定，用相同Melo声线按原词重读一条，时长与原片段保持一致，原始文件仍保留；字幕和文案没有变更。普通段落语速约1.55倍，重点段落约1.30倍，长示例约1.35倍，采用保持音高的音频变速。结尾问题之后留约5.5秒，不提供答案。

主参考为已提供的62秒飞机幸存者偏差视频；本片迁移的是稳定主体、累计信息、局部揭示、解释转折的组织方式。它没有复用原视频画面、音效或飞机题材。`参考对齐与边界.md` 记录实际依据与限制。

## 素材与再编辑

字体为 Noto Sans/Serif CJK，授权见 licenses。手机、线条、人物头像、海边示意图均为工程中的可编辑矢量图，不代表真实人物或真实朋友圈截图。

原有配音来自此前工程的 Melo 本地 TTS；工程包内包含原始逐段 WAV，无须重新下载模型或生成配音即可渲染。文件 `assets/original-timeline.json` 和 `assets/original-voice/` 是本次保留的原始语音依据。

如需重混，安装 Python 的 numpy/scipy/fonttools，确保 FFmpeg 可调用，然后运行 `python scripts/audio.py`。正常渲染不需要执行此脚本。脚本使用已包含的音频和原始语音，不依赖作者工作区路径。脚本重新生成的分析会记录抽取后音源的 SHA-256，原上传容器的 SHA-256 仍保留在说明中。

本工程不包含 node_modules、浏览器或模型。`npm ci` 按锁文件安装。验收记录将软件检查、画面检查和未完成的人耳试听分别列出，不能将技术通过视为达到参考片艺术水准的证明。
