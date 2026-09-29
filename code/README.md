# XUComer 1.0

键盘 / 鼠标按键音效模拟器。本仓库是**源代码**仓库。

> 许可：MIT License。详见 [`LICENSE`](LICENSE)。

## 目录

```
main.py      入口 / 事件引擎 / 全局监听与自检
ui.py        窗口、卡片、开关、设置浮窗、托盘
theme.py     40 套主题 + QSS 生成
i18n.py      18 种语言 + 系统语言识别
player.py    播放：通道池、叠音上限、淡出、音量衰减
packs.py     音效包扫描与命名（内置 + 自定义）
config.py    配置读写 / 开机自启注册表
paths.py     开发与打包两种运行方式的路径解析
importer.py  音频解码、切分、清理、变体生成
sounds/      内置音效：keyboard|mouse / 包名 / down|up / NN.wav
icon/        XUComer.ico
```

## 运行

```bash
pip install PyQt5 pygame pynput
python main.py
```

成品：`..\exe\x64\XUComer.exe`、`..\exe\x86\XUComer.exe`（整个目录一起拷）。

## 打包

`--icon` 与 `--add-data` 必须写绝对路径（`--specpath` 会让相对路径基于 spec 目录解析）。

```bash
python -m PyInstaller --noconfirm --onedir --windowed --name XUComer \
  --icon "<绝对路径>/code/icon/XUComer.ico" \
  --distpath ../exe/x64 --workpath ../build/x64 --specpath ../build/x64 \
  --add-data "<绝对路径>/code/sounds;sounds" \
  --exclude-module tkinter --exclude-module PyQt6 \
  --exclude-module PyQt5.QtWebEngineWidgets --exclude-module numpy main.py
```

产物在 `../exe/x64/XUComer/`，内容上提一层即扁平结构。

32 位同理，但必须用 32 位 Python（PyInstaller 不能跨架构），把 `--distpath` / `--workpath`  
换成 x86；隔离工具链 `%USERPROFILE%\.cache\py313x86\python.exe` 由  
`python-3.13.15-embed-win32.zip` 解压后用 `get-pip.py` 装 pip 得到。

音频内联为数据，图标只写入 PE 资源、不作为数据打包。

## 素材

音效出处与许可见 `音效来源.txt`。
