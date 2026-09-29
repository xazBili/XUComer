<div align="center">

<img src="docs/assets/img/icon.png" width="96" alt="XUComer">

# XUComer

**让每一次敲击都有回响。**

开源的键盘 / 鼠标按键音效模拟器 · MIT 许可 · 免费 · 无需联网

[**下载**](https://github.com/xazBili/XUComer/releases/latest) · [**官网**](https://xazbili.github.io/XUComer/) · [**使用指南**](https://xazbili.github.io/XUComer/guide.html)

</div>

---

## 它是什么

常驻后台，全局监听你的每一次按键，实时播放对应的按键音。

- **40 套主题** — 深浅色、玻璃拟态、各种配色，界面即时切换
- **18 种语言** — 也可跟随系统自动识别
- **11 套键盘音 + 14 套鼠标音** — 青轴、茶轴、线性、闷厚低频……还有各家经典鼠标的声音
- **按下 / 抬起分别发声** — 不是简单重复一声「嗒」
- **自定义音效** — 导入自己的音频，自动切分、变体生成
- **托盘常驻** — 可最小化到系统托盘，支持开机自启
- **绿色免安装** — 解压即用，不写注册表，设置不落盘

## 下载

到 [Releases](https://github.com/xazBili/XUComer/releases/latest) 下载，按你的系统位数选：

| 版本 | 适用 | 大小 |
|---|---|---|
| `XUComer-win-x64.zip` | 64 位 Windows（绝大多数人） | ~110 MB |
| `XUComer-win-x86.zip` | 32 位 Windows | ~91 MB |

解压后直接运行 `XUComer.exe`，**不要**把 exe 单独拖出来——它需要同目录的 `_internal` 文件夹。

> 支持 Windows 10 / 11。首次运行若被 SmartScreen 拦下，点「更多信息」→「仍要运行」即可。

## 从源码运行

```bash
pip install PyQt5 pygame pynput
cd code
python main.py
```

## 仓库结构

```
code/     桌面端源码与素材（Python + PyQt5 + pygame + pynput）
docs/     官网静态站（GitHub Pages）
exe/      打包产物，不入库，见 Releases
```

各模块职责见 [`code/README.md`](code/README.md)，打包命令也在那里。

## 许可

[MIT License](code/LICENSE) © 2026 XUComer

内置音效的出处与许可详见 [`code/音效来源.txt`](code/音效来源.txt)。
