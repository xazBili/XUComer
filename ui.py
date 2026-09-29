from PyQt5.QtCore import Qt, QPoint, QVariantAnimation
from PyQt5.QtGui import QColor, QPainter, QIcon, QPixmap, QFont
from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, QFrame, QComboBox,
                             QSlider, QCheckBox, QPushButton, QGraphicsDropShadowEffect,
                             QSystemTrayIcon, QMenu, QAction, QApplication, QSizePolicy)

ACCENT = '#4f8cff'

STYLE = """
QWidget#root { background:transparent; }
QFrame#panel { background:#1c1d21; border-radius:16px; }
QFrame#card { background:#24262b; border-radius:12px; }
QLabel#title { color:#eceef2; font-size:15px; font-weight:600; }
QLabel#name { color:#eceef2; font-size:13px; font-weight:600; }
QLabel#sub { color:#83858d; font-size:11px; }
QComboBox { background:#2e3138; color:#eceef2; border:1px solid #383b43; border-radius:8px;
            padding:6px 10px; min-height:18px; }
QComboBox::drop-down { border:none; width:20px; }
QComboBox::down-arrow { image:none; border-left:5px solid transparent; border-right:5px solid transparent;
            border-top:6px solid #9a9da5; width:0; height:0; margin-right:10px; }
QComboBox QAbstractItemView { background:#2e3138; color:#eceef2; border:1px solid #383b43;
            selection-background-color:#4f8cff; selection-color:#ffffff; outline:0;
            padding:6px; }
QComboBox QAbstractItemView::item { min-height:26px; padding-left:8px; padding-right:8px; }
QPushButton#ghost { background:#2e3138; color:#c9ccd4; border:none; border-radius:8px;
            padding:6px 14px; font-size:12px; }
QPushButton#ghost:hover { background:#383c45; color:#ffffff; }
QPushButton#close { background:transparent; color:#83858d; border:none; font-size:14px; }
QPushButton#close:hover { color:#ff6b6b; }
QSlider::groove:horizontal { height:4px; background:#383b43; border-radius:2px; }
QSlider::sub-page:horizontal { background:#4f8cff; border-radius:2px; }
QSlider::handle:horizontal { width:14px; margin:-5px 0; border-radius:7px; background:#ffffff; }
QCheckBox#plain { color:#a8abb3; font-size:12px; spacing:6px; }
QCheckBox#plain::indicator { width:16px; height:16px; border-radius:5px; border:1px solid #454951;
            background:#2e3138; }
QCheckBox#plain::indicator:checked { background:#4f8cff; border:1px solid #4f8cff; }
QMenu { background:#24262b; color:#eceef2; border:1px solid #383b43; padding:4px; }
QMenu::item { padding:6px 22px; border-radius:6px; }
QMenu::item:selected { background:#4f8cff; color:#ffffff; }
"""


def app_icon():
    pm = QPixmap(128, 128)
    pm.fill(Qt.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    p.setPen(Qt.NoPen)
    p.setBrush(QColor(ACCENT))
    p.drawRoundedRect(4, 4, 120, 120, 28, 28)
    p.setBrush(QColor('#ffffff'))
    p.drawRoundedRect(26, 40, 16, 48, 5, 5)
    p.drawRoundedRect(50, 40, 16, 48, 5, 5)
    p.drawRoundedRect(74, 40, 16, 48, 5, 5)
    p.drawRoundedRect(98, 40, 16, 48, 5, 5)
    p.setBrush(QColor(ACCENT))
    p.drawRoundedRect(26, 84, 88, 8, 4, 4)
    p.end()
    return QIcon(pm)


class Toggle(QCheckBox):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setText('')
        self.setCursor(Qt.PointingHandCursor)
        self.setFixedSize(46, 26)
        self.anim = QVariantAnimation(self)
        self.anim.setDuration(140)
        self.anim.valueChanged.connect(lambda v: self.update())
        self.toggled.connect(self.slide)

    def slide(self, checked):
        self.anim.stop()
        self.anim.setStartValue(0.0 if checked else 1.0)
        self.anim.setEndValue(1.0 if checked else 0.0)
        self.anim.start()

    def offset(self):
        checked = self.isChecked()
        t = self.anim.currentValue()
        if t is None:
            t = 1.0 if checked else 0.0
        return float(t)

    def paintEvent(self, e):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)
        p.setPen(Qt.NoPen)
        t = self.offset()
        off = QColor('#3a3d44')
        on = QColor(ACCENT)
        col = QColor(int(off.red() + (on.red() - off.red()) * t),
                     int(off.green() + (on.green() - off.green()) * t),
                     int(off.blue() + (on.blue() - off.blue()) * t))
        p.setBrush(col)
        p.drawRoundedRect(0, 0, self.width(), self.height(), self.height() / 2, self.height() / 2)
        d = self.height() - 8
        x = 4 + (self.width() - 8 - d) * t
        p.setBrush(QColor('#ffffff'))
        p.drawEllipse(int(x), 4, d, d)


class Card(QFrame):
    def __init__(self, name, desc):
        super().__init__()
        self.setObjectName('card')
        root = QVBoxLayout(self)
        root.setContentsMargins(16, 14, 16, 14)
        root.setSpacing(10)

        head = QHBoxLayout()
        left = QVBoxLayout()
        left.setSpacing(2)
        n = QLabel(name)
        n.setObjectName('name')
        s = QLabel(desc)
        s.setObjectName('sub')
        left.addWidget(n)
        left.addWidget(s)
        head.addLayout(left)
        head.addStretch(1)
        self.test = QPushButton('试听')
        self.test.setObjectName('ghost')
        self.test.setCursor(Qt.PointingHandCursor)
        head.addWidget(self.test)
        root.addLayout(head)

        self.combo = QComboBox()
        self.combo.setCursor(Qt.PointingHandCursor)
        self.combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        view = self.combo.view()
        view.setSpacing(2)
        view.setStyleSheet('QListView::item { padding:6px 10px; border-radius:6px; }'
                           'QListView::item:selected { background:#4f8cff; color:#ffffff; }')
        root.addWidget(self.combo)

        vol = QHBoxLayout()
        vol.setSpacing(10)
        self.slider = QSlider(Qt.Horizontal)
        self.slider.setRange(0, 100)
        self.slider.setCursor(Qt.PointingHandCursor)
        self.vol_label = QLabel('70')
        self.vol_label.setObjectName('sub')
        self.vol_label.setFixedWidth(28)
        self.vol_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        vol.addWidget(self.slider)
        vol.addWidget(self.vol_label)
        root.addLayout(vol)

        self.up = QCheckBox('抬起音（松开时发声）')
        self.up.setObjectName('plain')
        self.up.setCursor(Qt.PointingHandCursor)
        root.addWidget(self.up)


class MainWindow(QWidget):
    def __init__(self, cfg, packs, on_change, on_test, on_quit):
        super().__init__()
        self.cfg = cfg
        self.packs = packs
        self.on_change = on_change
        self.on_test = on_test
        self.on_quit = on_quit
        self.drag = None
        self.build()

    def build(self):
        self.setObjectName('root')
        self.setStyleSheet(STYLE)
        self.setWindowFlags(Qt.FramelessWindowHint)
        self.setFixedWidth(360)
        self.setWindowTitle('MKmer')
        self.setWindowIcon(app_icon())
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setAutoFillBackground(False)

        root = QVBoxLayout(self)
        root.setContentsMargins(12, 12, 12, 12)
        root.setSpacing(0)

        panel = QFrame()
        panel.setObjectName('panel')
        shadow = QGraphicsDropShadowEffect(self)
        shadow.setBlurRadius(28)
        shadow.setOffset(0, 6)
        shadow.setColor(QColor(0, 0, 0, 170))
        panel.setGraphicsEffect(shadow)
        root.addWidget(panel)

        lay = QVBoxLayout(panel)
        lay.setContentsMargins(16, 12, 16, 14)
        lay.setSpacing(12)

        bar = QHBoxLayout()
        t = QLabel('MKmer')
        t.setObjectName('title')
        bar.addWidget(t)
        bar.addStretch(1)
        mini = QPushButton('—')
        mini.setObjectName('close')
        mini.setFixedSize(24, 24)
        mini.setCursor(Qt.PointingHandCursor)
        mini.clicked.connect(self.showMinimized)
        close = QPushButton('✕')
        close.setObjectName('close')
        close.setFixedSize(24, 24)
        close.setCursor(Qt.PointingHandCursor)
        close.clicked.connect(self.close)
        bar.addWidget(mini)
        bar.addWidget(close)
        lay.addLayout(bar)

        head = QFrame()
        head.setObjectName('card')
        hl = QHBoxLayout(head)
        hl.setContentsMargins(16, 12, 16, 12)
        ht = QLabel('全局启用')
        ht.setObjectName('name')
        hl.addWidget(ht)
        hl.addStretch(1)
        self.master = Toggle()
        hl.addWidget(self.master)
        lay.addWidget(head)

        self.kb = Card('键盘音效', '按下与松开时播放')
        self.ms = Card('鼠标音效', '左右键点击时播放')
        lay.addWidget(self.kb)
        lay.addWidget(self.ms)

        foot = QFrame()
        foot.setObjectName('card')
        fl = QVBoxLayout(foot)
        fl.setContentsMargins(16, 12, 16, 12)
        fl.setSpacing(8)
        self.auto = QCheckBox('开机自启')
        self.auto.setObjectName('plain')
        self.auto.setCursor(Qt.PointingHandCursor)
        self.tray = QCheckBox('关闭时最小化到托盘')
        self.tray.setObjectName('plain')
        self.tray.setCursor(Qt.PointingHandCursor)
        fl.addWidget(self.auto)
        fl.addWidget(self.tray)
        lay.addWidget(foot)

        self.quit = QPushButton('退出程序')
        self.quit.setObjectName('ghost')
        self.quit.setCursor(Qt.PointingHandCursor)
        lay.addWidget(self.quit)

        for device, card in (('keyboard', self.kb), ('mouse', self.ms)):
            for p in self.packs[device]:
                card.combo.addItem(p['name'], p['id'])

        self.master.setChecked(self.cfg['enabled'])
        self.auto.setChecked(self.cfg['autostart'])
        self.tray.setChecked(self.cfg['tray'])
        for device, card in (('keyboard', self.kb), ('mouse', self.ms)):
            c = self.cfg[device]
            idx = card.combo.findData(c['pack'])
            card.combo.setCurrentIndex(max(idx, 0))
            card.slider.setValue(c['volume'])
            card.vol_label.setText(str(c['volume']))
            card.up.setChecked(c['up'])
            card.up.setEnabled(bool(card_up_files(self.packs, device, c['pack'])))

        self.master.stateChanged.connect(lambda s: self.change('enabled', bool(s)))
        self.auto.stateChanged.connect(self.toggle_autostart)
        self.tray.stateChanged.connect(lambda s: self.change('tray', bool(s)))
        self.quit.clicked.connect(self.on_quit)
        for device, card in (('keyboard', self.kb), ('mouse', self.ms)):
            card.combo.currentIndexChanged.connect(lambda i, d=device, c=card: self.switch_pack(d, c))
            card.slider.valueChanged.connect(lambda v, d=device, c=card: self.change_volume(d, c, v))
            card.up.stateChanged.connect(lambda s, d=device: self.change(d + '_up', bool(s), True))
            card.test.clicked.connect(lambda _, d=device: self.on_test(d, True))

    def toggle_autostart(self, state):
        import config as config_mod
        ok = config_mod.set_autostart(bool(state))
        self.auto.setChecked(ok and bool(state))
        self.change('autostart', self.auto.isChecked())

    def switch_pack(self, device, card):
        pid = card.combo.currentData()
        self.cfg[device]['pack'] = pid
        card.up.setEnabled(bool(card_up_files(self.packs, device, pid)))
        self.on_change()
        self.on_test(device, True)

    def change_volume(self, device, card, value):
        card.vol_label.setText(str(value))
        self.cfg[device]['volume'] = value
        self.on_change()

    def change(self, key, value, nested=False):
        if nested:
            device, field = key.split('_', 1)
            self.cfg[device][field] = value
        else:
            self.cfg[key] = value
        self.on_change()

    def closeEvent(self, e):
        if self.cfg.get('tray') and getattr(self, 'tray_icon', None):
            e.ignore()
            self.hide()
            self.tray_icon.icon.showMessage('MKmer', '已在后台运行',
                                            QSystemTrayIcon.Information, 1500)
        else:
            self.on_quit()

    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton and e.pos().y() < 60:
            self.drag = e.globalPos() - self.frameGeometry().topLeft()
            e.accept()

    def mouseMoveEvent(self, e):
        if self.drag is not None:
            self.move(e.globalPos() - self.drag)
            e.accept()

    def mouseReleaseEvent(self, e):
        self.drag = None


def card_up_files(packs, device, pid):
    for p in packs[device]:
        if p['id'] == pid:
            return p['up']
    return []


class Tray:
    def __init__(self, window, on_toggle, on_quit):
        self.window = window
        self.icon = QSystemTrayIcon(app_icon(), window)
        self.icon.setToolTip('MKmer · 键鼠音效')
        menu = QMenu()
        menu.setStyleSheet(STYLE)
        self.act_show = QAction('显示窗口')
        self.act_toggle = QAction('暂停 / 继续')
        self.act_quit = QAction('退出')
        menu.addAction(self.act_show)
        menu.addAction(self.act_toggle)
        menu.addSeparator()
        menu.addAction(self.act_quit)
        self.icon.setContextMenu(menu)
        self.act_show.triggered.connect(self.show_window)
        self.act_toggle.triggered.connect(on_toggle)
        self.act_quit.triggered.connect(on_quit)
        self.icon.activated.connect(lambda r: self.show_window() if r == QSystemTrayIcon.DoubleClick else None)
        self.icon.show()

    def show_window(self):
        self.window.showNormal()
        self.window.raise_()
        self.window.activateWindow()
