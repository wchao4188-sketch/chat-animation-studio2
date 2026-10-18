# chat-animation-studio2

独立的 Remotion + React + SVG 动画工程。首个成片为方案二「海边照片与不同话题分支」，48秒，2560×1440，30fps。

本工程自包含，不读取或修改 `chat-animation-studio`，不引用旧项目、旧预览或旧素材。`docs/VISUAL-SPEC-v0.2-RC1.md` 是独立保存的规范副本。

## 开始编辑

```sh
npm ci
npm run studio
```

在有桌面浏览器的机器上运行 Studio。默认使用当前环境 `/usr/bin/chromium`；其他机器按 Remotion CLI 的 `--browser-executable` 参数选择自己的 Chrome，或移除该参数让 Remotion 管理浏览器。

## 真实渲染与检查

```sh
npm run typecheck
npm test
npm run frames
npm run render
```

- `src/content.ts`：用户原文、分组与时间定位。
- `src/timeline.ts`：统一时间轴、照片位置、镜头与连续贝塞尔路径。
- `src/Seaside.tsx`：照片、动态排版、关系分支和结论。
- `src/style.ts`：本片独立美术色彩与字体角色。
- `scripts/quality.test.ts`：文案完整性、路径锚点、连续性与静止区间检查。
- `scripts/render-frames.ts`：真实帧渲染、文字/线条空间检查、确定性对比。
- `output/seaside-1440p.mp4`：真实H.264成片，不是HTML演示。
- `output/frames/`：源渲染关键帧；`output/frame-quality.json`：采样检查数据。

所有动画只依赖 `useCurrentFrame()`、`useVideoConfig()` 和纯函数时间轴，无系统时钟、未设种子随机数或CSS动画。路径延伸使用De Casteljau精确子曲线，端点始终附着。没有为使用新库强行引入轮廓形变。

## 素材与限制

- `public/assets/seaside.png` 为本次原创AI生成的海边示意照片，不是女生真实朋友圈照片；没有人物或关系暗示。下载Unsplash素材的请求被环境代理拒绝，未绕过网络或TLS验证。
- 中文使用本地Noto Sans/Serif CJK SC子集字体，许可见 `public/fonts/LICENSE-NOTO.txt`。完整字体保留供后续扩展文案。
- 本片为**无配音、无配乐的视觉审阅版**。不声称已完成声音制作。
- 所有条件示例保留“如果”，不伪造女生实际回答，不增加好感概率、排名、性格诊断或其他原文外结论。
- 参考原则与本项目原创坐标、配色、构图、排时分开，见 `docs/IMPLEMENTATION.md`。
- 自动空间检查覆盖所列采样帧，不等于对每帧进行语义或视觉审美验收。

## 交付

源工程包不包含 `node_modules`、缓存或认证信息，可由锁文件恢复依赖。成片和预览另附交付包。

已有成片与工程包存放于本公开仓库的 `downloads/`，使用以下链接直接下载：

- [MP4成片](https://github.com/wchao4188-sketch/chat-animation-studio2/raw/refs/heads/main/downloads/seaside-1440p.mp4)
- [完整交付包：视频、可编辑工程、关键帧、字幕与质量记录](https://github.com/wchao4188-sketch/chat-animation-studio2/raw/refs/heads/main/downloads/chat-animation-studio2-delivery-v0.1.0.zip)
- [仅可编辑源工程](https://github.com/wchao4188-sketch/chat-animation-studio2/raw/refs/heads/main/downloads/chat-animation-studio2-source-v0.1.0.zip)
- [成片关键帧总览](https://github.com/wchao4188-sketch/chat-animation-studio2/raw/refs/heads/main/downloads/keyframes-contact.jpg)

使用已有文件上传，没有重新渲染或重新生成压缩包。包内关于下载受阻的说明记录的是打包时状态；当前交付状态以本页为准。Release附件上传接口拒绝了当前集成凭据，因此使用仓库文件直下载，不宣称它们是Release附件。
