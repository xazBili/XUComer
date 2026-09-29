# MKmer

键盘 / 鼠标按键音效模拟软件（Python + PyQt5）。全局监听键鼠事件，实时播放轴体级按键音，支持快速连打不卡顿。

## 运行

- 直接双击 `exe/MKmer.exe`（单文件，无需安装 Python 与依赖）
- 开发调试：`python main.py`

依赖：`PyQt5 pygame pynput`

## 功能

- 全局键盘监听：按下 / 抬起分别发声（抬起音可单独开关）
- 全局鼠标监听：左键、右键点击发声
- 11 组键盘音效包 + 14 组鼠标音效包，下拉即切、自动试听
- 键盘与鼠标音量独立调节
- 全局启用开关；托盘图标（双击唤出，右键暂停 / 退出）
- 关闭窗口最小化到托盘，可设置开机自启
- 无边框深色界面，按住顶部标题区拖动
- 设置自动保存到程序同目录 `settings.json`

## 连点为什么不会卡

- `pynput` 回调只做一次入队，播放全部在独立线程池 + 通道池完成，回调永不阻塞
- 每个音效组最多同时叠 3 层：超出时最旧一层 8ms 淡出，而不是硬切（消除爆音）
- 叠音时音量按 `1 / (1 + 0.32 * 层数)` 自动衰减，快速连打不糊、不炸
- 音效样本在入库时统一做：直流去除 → 首尾静音裁剪 → 限长 180ms → 首 1.5ms / 尾 10ms 淡入淡出 → 峰值归一化到 0.88

## 音效包

键盘（11 组）
| 名称 | 说明 |
| --- | --- |
| KeyTone 官方示例 | 取自 KeyTone 项目内置示例音 |
| 绿轴 · 轻 / 中 / 重 | Outemu 绿轴三种按压力度实录，带抬起音 |
| 绿轴 · 触发段 / 触底段 | 拆分触发、触底阶段，带抬起音 |
| 青轴 · 清脆 | 清脆段落感 |
| 茶轴 · 段落感 | 轻微段落 |
| 线性轴 · 柔和 | 无段落线性 |
| 短促 · 轻点 | 极短轻触音 |
| 备用 · 按键轻触 | 用户自带素材 |

鼠标（14 组）：KeyTone 官方示例、罗技 G203 / GPW、雷蛇炼狱蝰蛇 V2、Glorious Model O、
血手幽灵 V8、IntelliMouse、Rapture Venom、Trust GXT 152、通用标准 / 清脆、
备用 · 左键音 / 右键音、备用 · 清脆点击、备用 · 沉稳点击

素材出处与许可见 `音效来源.txt`。

## 目录结构

```
main.py        入口、事件引擎、全局监听
ui.py          界面（无边框窗口、卡片、开关、托盘）
player.py      播放核心：通道池、叠音上限、淡出、音量衰减
packs.py       音效包扫描与中文命名
config.py      配置读写、开机自启注册表
paths.py       开发 / 打包两种运行方式的路径解析
sounds/        音效素材（keyboard / mouse / 包名 / down|up / NN.wav）
icon/          程序图标
exe/           打包产物
0_备用音效/     用户自带的原始参考素材
```

## 重新打包

```
python -m PyInstaller --noconfirm --onefile --windowed --name MKmer ^
  --icon icon/MKmer.ico --distpath exe --workpath build2 --specpath build2 ^
  --add-data "sounds;sounds" --exclude-module tkinter --exclude-module PyQt6 ^
  --exclude-module PyQt5.QtWebEngineWidgets --exclude-module numpy main.py
```
