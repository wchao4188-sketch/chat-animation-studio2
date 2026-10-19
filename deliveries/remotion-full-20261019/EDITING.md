# 新世界｜Remotion 完整成片

本轮根据用户“直接出成片”制作，独立入口`src/full/index.tsx`，不覆盖v1/v2或上级旧工程成果。220秒、2560×1440、30fps、6600帧。48段原文完整保留。

## 运行

沿用现有依赖锁文件，无新增依赖。Remotion / CLI / media / fonts 4.0.536，React19.2.4，TypeScript5.9.3。

```bash
npm ci
npm run typecheck
npx remotion studio src/full/index.tsx --port=3103 --browser-executable=/usr/bin/chromium
bash scripts/render-full.sh
python scripts/quality-full.py
```

`/usr/bin/chromium`按本机浏览器路径调整。生成目录`output/full`。`npm run render`仍为旧样片命令，不用于完整片。源包包含实际混合音轨、字体、可编辑矢量与逐句时间轴，不需要重新配音或下载模型。

## 创作与编辑

`Film.tsx`内为确定性手机、海边矢量照片、屏幕内容、路径生长、条件分支、逻辑边界及双向交流。`timeline.json`保留48段完整原文及原配音时序，字幕按固定字符长度预分行，没有动态换行重排。开场`Intro.tsx`基于v2另存，仅去除样片标识与单独音乐轨；v2原源文件未改动。

照片始终保持照片身份，分支被标为可能或条件，没有将未经验证的判断当作事实；“了解她≠她喜欢你”表示逻辑边界，没有推断她不喜欢你。双向关系仅显示发起方向，不评分。结尾不提供正确答案，留出10秒以上停留。

## 声音

复用当前新世界素材`narration.wav`与48段原时间轴，未重新生成配音。音乐使用用户上传的`mmexport1792300994359.mp3`（实际为MP4容器），在175秒素材末尾用4秒交叉淡化延续，混合后为`public/full/soundtrack.m4a`。该混合音轨已随工程附带；重新渲染时直接使用它。音频做实际解码、响度、真峰值和静音检测；当前工具不支持人工听觉试听，不能把机器检测当作人工听审。

## 参考与素材

延续v2暖米色纸面、深色手机、克制橙红、编辑排版。主参考为已上传约62秒飞机幸存者偏差视频；迁移的是主体承载信息、局部建立、关系揭示、逻辑停顿的方式。没有使用原参考视频画面或音轨。

海边照片是本工程原创SVG示意，非真实女生的照片。字体为Noto CJK，许可随原public/fonts提供。用户音乐与已有配音按本次制作授权使用，不主张其版权。

实际检查见`output/full/验收记录.md`、`quality.json`和`NewWorld-Full-Keyframes.pdf`。人工听觉试听尚未完成。
