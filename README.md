# Hanzi Writer — 微信小程序适配版

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 本项目是 [chanind/hanzi-writer](https://github.com/chanind/hanzi-writer) 的微信小程序适配分支，在原版基础上修改了渲染层代码，使其能够在微信小程序的 Canvas 2D 环境中正常工作。

Hanzi Writer 是一个免费开源的 JavaScript 汉字笔顺动画和笔画练习库，支持简体和繁体汉字。

[原版在线演示](https://chanind.github.io/hanzi-writer/demo.html)

---

## ⚠️ 本次更新说明（重要）

**修复：微信小程序中笔顺动画卡在第一笔、来回播放无法完成的问题。**

- **症状**：调用 `animateCharacter()` 后，笔顺动画只在第一笔上来回往复，永远画不完，后面的笔画一笔都不画。
- **根因**：动画时钟时基不同源。小程序没有 `performance` 全局对象，`performanceNow` 退化为 `Date.now()`（epoch 毫秒级，约 1.7e12）；而 Taro / 小程序注入的 `requestAnimationFrame` 回调时间戳是 `Date.now() - loadTime`（几千级）。两者相差整个 epoch，导致动画进度计算 `progress = (rafTimestamp - performanceNow()) / duration` 长期为负、卡在第一笔来回震荡。
- **修复方式**：在 `src/utils.ts` 中新增 `hasPerformance` 判断——当环境没有 `performance` 时，`requestAnimationFrame` / `cancelAnimationFrame` 统一退回 `setTimeout` / `clearTimeout` 兜底，回调时间戳改用 `performanceNow()`，保证 `performanceNow`、`requestAnimationFrame`、`cancelAnimationFrame` 三个时钟同源。H5 环境（有 `performance`）行为完全不变。

| 文件 | 改动内容 |
|------|---------|
| `src/utils.ts` | 新增 `hasPerformance` 判断；无 `performance` 时三时钟退回 `Date.now()` + `setTimeout`/`clearTimeout` 兜底 |

---

## 目录

- [为什么需要适配](#为什么需要适配)
- [源码修改说明](#源码修改说明)
- [快速开始](#快速开始)
- [API 说明](#api-说明)
- [构建与开发](#构建与开发)
- [数据结构与数据源](#数据结构与数据源)
- [与上游差异对照](#与上游差异对照)
- [许可](#许可)

---

## 为什么需要适配

原版 `hanzi-writer` 基于浏览器 DOM API 实现，在微信小程序中存在以下不兼容问题：

| 问题 | 原版行为 | 小程序限制 |
|------|---------|-----------|
| **DOM 操作** | 使用 `document.getElementById` / `document.createElement` | 小程序无 `document` 全局对象 |
| **节点尺寸** | 调用 `setAttribute('width', ...)` / `getBoundingClientRect()` | 小程序 Canvas 不支持这些方法 |
| **事件绑定** | 使用 `document.addEventListener` 监听全局 `mouseup` / `touchend` | 小程序 Canvas 无全局事件机制 |
| **Path2D** | 使用 `new Path2D()` 构造笔画路径 | 小程序 Canvas 2D 不支持 `Path2D`（会报警告） |

适配版针对上述问题逐一修改了源码，用小程序兼容的方式替代了浏览器专属 API。

---

## 源码修改说明

基于原版 `v3.0.0` 源码，共修改 **5 个核心文件**：

### 1. `src/renderers/canvas/RenderTarget.ts`（核心改动）

Canvas 渲染目标是小程序适配的核心，主要改动：

- **`init()` 静态方法**：移除 `document.getElementById` / `document.createElement` 逻辑，直接接收 Canvas 节点引用
- **尺寸设置**：用 `canvas.width = ...` 替代 `setAttribute()`；新增 `updateDimensions()` 方法供页面动态调整
- **`getBoundingClientRect()`**：返回基于 Canvas 实际尺寸的虚拟矩形（因为小程序中没有真实的 DOM 布局）
- **事件系统重构**：Canvas 版改为**手动触发模式**——通过 `emitTouchStart(x, y)` / `emitTouchMove(x, y)` / `emitTouchEnd()` 三个方法供小程序页面在 `touchstart` / `touchmove` / `touchend` 事件中主动调用

```typescript
// 小程序中触摸事件的转发方式
canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  renderTarget.emitTouchStart(touch.x, touch.y);
});
```

### 2. `src/renderers/RenderTargetBase.ts`

`addPointerEndListener()` 将 `document.addEventListener` 改为 `this.node.addEventListener`，避免依赖全局 `document` 对象。

### 3. `src/renderers/canvas/CharacterRenderer.ts`

将 `StrokeRenderer` 构造时的 Path2D 参数设为 `false`，禁用 Path2D 路径构建，避免小程序环境报警告。

### 4. `rollup.config.js`

TypeScript 编译配置增加 `target: 'es5'` 以保证最大兼容性，同时 `skipLibCheck: true` 跳过类型库检查以加速构建。CJS 输出关闭 `sourcemap`，避免 `//# sourceMappingURL=` 在小程序构建 npm 时产生警告。

### 5. `src/utils.ts`（时钟时基修复）

修复小程序中笔顺动画卡在第一笔的问题。小程序没有 `performance` 全局对象，原实现里 `performanceNow` 退化为 `Date.now()`（epoch 毫秒级），而 Taro 注入的 `requestAnimationFrame` 回调时间戳是 `Date.now() - loadTime`（几千级），两者时基差整个 epoch，导致动画进度计算错乱、卡在第一笔来回播放。

改动新增 `hasPerformance` 判断：当环境没有 `performance` 时，`requestAnimationFrame` / `cancelAnimationFrame` 统一退回 `setTimeout` / `clearTimeout` 兜底，回调时间戳改用 `performanceNow()`，保证三个时钟同源。H5（有 `performance`）行为不变。详见顶部「本次更新说明」。

---

## 快速开始

### 安装

本仓库包含**时钟时基修复**（解决小程序笔顺动画卡在第一笔的 bug，见顶部「本次更新说明」）。上游 npm 包 `hanzi-writer-wechatmini@3.0.1` 尚未包含此修复，请优先安装本仓库版本（本包发布名为 **`hanzi-writer-weapp`**）：

```bash
# 方式一：直接从 GitHub 安装（推荐，仓库已提交 dist 产物，装完即可用）
npm install git+https://github.com/guanlulu222/hanzi-writer-wechat.git

# 方式二：HTTPS 被拦截时用 SSH
npm install git+ssh://git@github.com:guanlulu222/hanzi-writer-wechat.git

# 方式三：npm 发布后（需先 npm login）
npm install hanzi-writer-weapp
```

或在 `package.json` 里直接写依赖：

```json
{
  "dependencies": {
    "hanzi-writer-weapp": "github:guanlulu222/hanzi-writer-wechat#master"
  }
}
```

安装后在微信开发者工具中点击 **工具 → 构建 npm**，即会自动将 `dist/index.cjs.js` 复制到 `miniprogram_npm/hanzi-writer-weapp/index.js` 供项目使用。

> **为什么不用 `npm install hanzi-writer-wechatmini`？** 那是上游 npm 源（作者 `wooaooo`），不含本次时钟修复。若你的项目里 Taro/Vite 能直接解析 npm 包（不走「构建 npm」），也可直接把本仓库 `dist/index.cjs.js` / `dist/index.esm.js` 拷贝进 `node_modules/hanzi-writer-weapp/dist/` 覆盖同名文件。

### 基本用法

以下是在小程序页面中使用 Hanzi Writer 的完整示例：

#### 1. WXML 模板

```html
<view class="stroke-wrapper">
  <canvas
    type="2d"
    id="strokeCanvas"
    style="width: 300px; height: 300px;"
    bindtouchstart="onTouchStart"
    bindtouchmove="onTouchMove"
    bindtouchend="onTouchEnd"
  />
</view>
```

#### 2. TS/JS 页面逻辑

```typescript
import HanziWriter from 'hanzi-writer-weapp';

Page({
  _writer: null as any,
  _renderTarget: null as any,

  onLoad() {
    this.initCanvas();
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#strokeCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const dpr = wx.getWindowInfo().pixelRatio;

        // 设置 Canvas 实际像素尺寸
        canvas.width = 300 * dpr;
        canvas.height = 300 * dpr;

        // 创建 HanziWriter 实例
        this._writer = HanziWriter.create(canvas, '汉', {
          width: 300 * dpr,
          height: 300 * dpr,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 300,
          showCharacter: true,
          showOutline: true,
        });

        // 获取 RenderTarget 用于事件转发（仅 quiz/test 模式需要）
        this._renderTarget = (this._writer as any).target;
      });
  },

  // ── 触摸事件转发到 HanziWriter ──
  onTouchStart(e: any) {
    const touch = e.touches[0];
    this._renderTarget?.emitTouchStart(touch.x, touch.y);
  },

  onTouchMove(e: any) {
    const touch = e.touches[0];
    this._renderTarget?.emitTouchMove(touch.x, touch.y);
  },

  onTouchEnd() {
    this._renderTarget?.emitTouchEnd();
  },
});
```

> **注意**：仅 `quiz`（笔顺练习）和 `stroke`（逐笔绘制）等需要用户交互的模式才需要设置触摸事件转发。纯动画演示模式（`animateCharacter`）不需要。

---

## API 说明

### HanziWriter.create(element, character, options?)

创建 HanziWriter 实例并加载汉字。参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `element` | `HTMLCanvasElement` | **小程序中直接传入 Canvas 节点引用**（非字符串 ID） |
| `character` | `string` | 要显示的汉字 |
| `options` | `object` | 配置选项（见下方） |

### 配置选项

```typescript
interface HanziWriterOptions {
  width?: number;                // Canvas 宽度（像素）
  height?: number;               // Canvas 高度（像素）
  padding?: number;              // 内边距（默认 5）
  showOutline?: boolean;         // 显示笔画轮廓
  showCharacter?: boolean;       // 显示完整汉字
  showHintAfterMisses?: number;  // 答错 N 次后显示提示
  highlightColor?: string;       // 正确笔画高亮色
  strokeColor?: string;          // 笔画颜色
  outlineColor?: string;         // 轮廓颜色
  radicalColor?: string;         // 部首颜色
  strokeAnimationSpeed?: number; // 笔画动画速度（1=正常）
  delayBetweenStrokes?: number;  // 笔画间延迟（ms）
  delayBetweenLoops?: number;    // 循环间延迟（ms）
  charDataLoader?: Function;     // 自定义汉字数据加载器
  onLoadCharDataSuccess?: Function;  // 数据加载成功回调
  onLoadCharDataError?: Function;    // 数据加载失败回调
  // ... 更多选项见原版文档
}
```

### 核心方法

| 方法 | 说明 |
|------|------|
| `animateCharacter()` | 播放汉字笔顺动画 |
| `loopCharacterAnimation()` | 循环播放笔顺动画 |
| `showCharacter()` | 显示完整汉字 |
| `showOutline()` | 显示笔画轮廓 |
| `hideCharacter()` | 隐藏汉字 |
| `hideOutline()` | 隐藏轮廓 |
| `quiz(options?)` | 启动笔顺练习模式 |
| `setCharacter(character)` | 切换汉字 |
| `updateDimensions({ width, height })` | 动态更新 Canvas 尺寸 |

### 小程序新增方法

| 方法 | 说明 |
|------|------|
| `renderTarget.emitTouchStart(x, y)` | 手动触发触摸开始事件 |
| `renderTarget.emitTouchMove(x, y)` | 手动触发触摸移动事件 |
| `renderTarget.emitTouchEnd()` | 手动触发触摸结束事件 |
| `renderTarget.updateDimensions(w, h)` | 更新 Canvas 渲染尺寸 |

---

## 构建与开发

```bash
yarn install       # 安装依赖
yarn build         # 编译
yarn test          # 运行测试
yarn typecheck     # TypeScript 类型检查
```

构建产物输出到 `dist/` 目录：

| 文件 | 格式 | 说明 |
|------|------|------|
| `dist/index.cjs.js` | CommonJS | **小程序构建 npm 使用的入口** |
| `dist/index.esm.js` | ES Module | 现代打包工具使用 |
| `dist/hanzi-writer.js` | IIFE | 浏览器直接引用 |
| `dist/hanzi-writer.min.js` | IIFE (minified) | 浏览器引用（压缩版） |

---

## 数据结构与数据源

Hanzi Writer 使用的汉字 SVG 和笔顺数据来自 [Make me a Hanzi](https://github.com/skishore/makemeahanzi) 项目，经过微调后托管在 [Hanzi Writer Data](https://github.com/chanind/hanzi-writer-data) 仓库。

默认情况下，字符数据从 jsDelivr CDN 加载。在小程序中，你可能需要实现自定义 `charDataLoader` 来配合离线或内网环境：

```typescript
const writer = HanziWriter.create(canvas, '汉', {
  charDataLoader: (char: string, onComplete: Function) => {
    // 自定义数据加载逻辑
    // onComplete({ strokes: [...], medians: [...] })
  },
});
```

---

## 与上游差异对照

| 文件 | 改动内容 | 影响范围 |
|------|---------|---------|
| `src/renderers/canvas/RenderTarget.ts` | `init()` 去除 DOM 操作；新增 `emitTouch*` 方法；`getBoundingClientRect()` 重写；`updateDimensions` 兼容 `string\|number` | Canvas 初始化、触摸交互 |
| `src/renderers/RenderTargetBase.ts` | `addPointerEndListener` DOM 事件改为节点事件 | Canvas/SVG 触摸结束监听 |
| `src/renderers/canvas/CharacterRenderer.ts` | 禁用 Path2D（传入 `false`） | Canvas 笔画渲染 |
| `src/utils.ts` | 添加 `declare const global: any`；新增 `hasPerformance` 判断，无 `performance` 时三时钟退回 `Date.now()` + `setTimeout`/`clearTimeout` 兜底 | 解决 `types: []` 下找不到 `global` 的类型错误；修复小程序笔顺动画卡在第一笔 |
| `src/Mutation.ts` | 添加 `declare namespace NodeJS` | 解决 `NodeJS.Timeout` 类型缺失 |
| `rollup.config.js` | `target: es5` + `skipLibCheck` + CJS `sourcemap: false` | 构建兼容性与产出清洁度 |
| `package.json` | 添加 `miniprogram` 字段，Windows 兼容 build 脚本 | 微信小程序 npm 支持 |

---

## 许可

Hanzi Writer 基于 [MIT](https://raw.githubusercontent.com/chanind/hanzi-writer/master/LICENSE) 许可发布。

Hanzi Writer 的汉字数据源自 [Make Me A Hanzi](https://github.com/skishore/makemeahanzi) 项目，该项目从 [文鼎科技](http://www.arphic.com/) 的字体中提取数据，文鼎科技于 1999 年在宽松许可下发布了这些字体。你可以根据文鼎科技发布的大众授权条款重新分发和/或修改这些数据。许可副本见 [ARPHICPL.TXT](https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/ARPHICPL.TXT)。
