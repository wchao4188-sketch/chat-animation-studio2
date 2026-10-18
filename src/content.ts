/** User-approved original wording. Never infer a real reply from a conditional example. */
export const SCRIPT = [
  '比如你看到她发的海边照片。',
  '你可以说：',
  '“你那几张海边照片拍得挺好看的，我之前也想去海边待几天。你是比较喜欢大海，还是单纯喜欢拍照？”',
  '如果她说喜欢拍照，那你就往摄影方向聊。',
  '如果她说喜欢大海，那你就可以聊旅行、风景，甚至她为什么喜欢那种环境。',
  '你发现没有？',
  '同样是一张照片，你们聊出来的东西可能完全不一样。',
] as const;

export const QUOTE = [
  '“你那几张海边照片拍得挺好看的，',
  '我之前也想去海边待几天。',
  '你是比较喜欢大海，还是单纯喜欢拍照？”',
] as const;

export const CUES = [
  {start: 0.7, end: 3.7, text: SCRIPT[0]},
  {start: 4.2, end: 5.2, text: SCRIPT[1]},
  {start: 4.9, end: 18.4, text: SCRIPT[2]},
  {start: 20.6, end: 27.0, text: SCRIPT[3]},
  {start: 27.6, end: 37.6, text: SCRIPT[4]},
  {start: 38.6, end: 40.8, text: SCRIPT[5]},
  {start: 41.1, end: 48.0, text: SCRIPT[6]},
] as const;
