# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


from PyQt5.QtCore import Qt, QPoint, QVariantAnimation
from PyQt5.QtGui import QColor, QPainter, QIcon, QPixmap, QFont
from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, QFrame, QComboBox,
                             QSlider, QCheckBox, QPushButton, QGraphicsDropShadowEffect,
                             QSystemTrayIcon, QMenu, QAction, QApplication, QSizePolicy)

import i18n
import theme


def accent_of(th=None):
    return (th or theme.get(theme.CURRENT))['accent']


def app_icon(th=None):
    th = th or theme.get(theme.CURRENT)
    acc = QColor(th['accent'])
    pm = QPixmap(128, 128)
    pm.fill(Qt.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    p.setPen(Qt.NoPen)
    p.setBrush(acc)
    p.drawRoundedRect(4, 4, 120, 120, 28, 28)
    p.setBrush(QColor('#ffffff'))
    p.drawRoundedRect(26, 40, 16, 48, 5, 5)
    p.drawRoundedRect(50, 40, 16, 48, 5, 5)
    p.drawRoundedRect(74, 40, 16, 48, 5, 5)
    p.drawRoundedRect(98, 40, 16, 48, 5, 5)
    p.setBrush(acc)
    p.drawRoundedRect(26, 84, 88, 8, 4, 4)
    p.end()
    return QIcon(pm)


class Toggle(QCheckBox):
    def __init__(self, th=None, parent=None):
        super().__init__(parent)
        self.th = th or theme.get(theme.CURRENT)
        self.setText('')
        self.setCursor(Qt.PointingHandCursor)
        self.setFixedSize(46, 26)
        self.anim = QVariantAnimation(self)
        self.anim.setDuration(140)
        self.anim.valueChanged.connect(lambda v: self.update())
        self.toggled.connect(self.slide)

    def hitButton(self, pos):
        return self.rect().contains(pos)

    def set_theme(self, th):
        self.th = th
        self.update()

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
        off = QColor(self.th['border'])
        on = QColor(self.th['accent'])
        col = QColor(int(off.red() + (on.red() - off.red()) * t),
                     int(off.green() + (on.green() - off.green()) * t),
                     int(off.blue() + (on.blue() - off.blue()) * t))
        p.setBrush(col)
        p.drawRoundedRect(0, 0, self.width(), self.height(), self.height() / 2, self.height() / 2)
        d = self.height() - 8
        x = 4 + (self.width() - 8 - d) * t
        pen = QColor('#00000022')
        p.setPen(pen)
        p.setBrush(QColor(self.th['knob']))
        p.drawEllipse(int(x), 4, d, d)


class Card(QFrame):
    def __init__(self, name_key, desc_key, th=None):
        super().__init__()
        self.setObjectName('card')
        self.texts = []
        root = QVBoxLayout(self)
        root.setContentsMargins(16, 14, 16, 14)
        root.setSpacing(10)

        head = QHBoxLayout()
        left = QVBoxLayout()
        left.setSpacing(2)
        n = QLabel()
        n.setObjectName('name')
        s = QLabel()
        s.setObjectName('sub')
        left.addWidget(n)
        left.addWidget(s)
        head.addLayout(left)
        head.addStretch(1)
        self.on = Toggle(th)
        self.on.setToolTip(i18n.t('device_tip'))
        head.addWidget(self.on)
        self.test = QPushButton()
        self.test.setObjectName('ghost')
        self.test.setCursor(Qt.PointingHandCursor)
        head.addWidget(self.test)
        self.root = root
        root.addLayout(head)
        self.texts.append((n, name_key))
        self.texts.append((s, desc_key))
        self.texts.append((self.test, 'test'))

        self.combo = QComboBox()
        self.combo.setCursor(Qt.PointingHandCursor)
        self.combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        view = self.combo.view()
        view.setSpacing(2)
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

        self.up = QCheckBox()
        self.up.setObjectName('plain')
        self.up.setCursor(Qt.PointingHandCursor)
        root.addWidget(self.up)
        self.texts.append((self.up, 'up'))

        acts = QHBoxLayout()
        acts.setSpacing(8)
        self.imp = QPushButton()
        self.imp.setObjectName('ghost')
        self.imp.setCursor(Qt.PointingHandCursor)
        self.del_btn = QPushButton()
        self.del_btn.setObjectName('ghost')
        self.del_btn.setCursor(Qt.PointingHandCursor)
        acts.addWidget(self.imp)
        acts.addWidget(self.del_btn)
        acts.addStretch(1)
        root.addLayout(acts)
        self.texts.append((self.imp, 'import'))
        self.texts.append((self.del_btn, 'delete'))

        self.tip = QLabel('')
        self.tip.setObjectName('sub')
        self.tip.setWordWrap(True)
        self.tip.hide()
        root.addWidget(self.tip)
        self.device_on = True
        self.busy = False
        self.has_up = False
        self.custom = False

    def apply_enabled(self):
        for w in (self.test, self.combo, self.slider, self.imp):
            w.setEnabled(self.device_on)
        self.up.setEnabled(self.device_on and self.has_up)
        self.del_btn.setEnabled(self.device_on and self.custom)

    def set_metrics(self, th):
        self.root.setContentsMargins(th['pad'], int(th['pad'] * 0.85), th['pad'],
                                     int(th['pad'] * 0.85))
        self.root.setSpacing(th['gap'])

    def set_enabled(self, on):
        self.device_on = bool(on)
        self.apply_enabled()

    def set_busy(self, busy, text=''):
        self.busy = bool(busy)
        for w in (self.test, self.imp, self.del_btn, self.combo):
            w.setEnabled(self.device_on and not self.busy)
        if busy:
            self.tip.setText(text or i18n.t('busy'))
            self.tip.show()
        else:
            self.tip.hide()

    def message(self, text):
        self.tip.setText(text)
        self.tip.show()

    def reload(self, items, pid):
        self.combo.blockSignals(True)
        self.combo.clear()
        for p in items:
            self.combo.addItem(p['name'], p['id'])
        idx = self.combo.findData(pid)
        if idx >= 0:
            self.combo.setCurrentIndex(idx)
        self.combo.blockSignals(False)


class MainWindow(QWidget):
    def __init__(self, cfg, packs, on_change, on_test, on_quit, on_import=None, on_remove=None,
                 on_lang=None, on_theme=None):
        super().__init__()
        self.cfg = cfg
        self.packs = packs
        self.on_change = on_change
        self.on_test = on_test
        self.on_quit = on_quit
        self.on_import = on_import
        self.on_remove = on_remove
        self.on_lang = on_lang
        self.on_theme = on_theme
        self.drag = None
        self._i18n = []
        self.settings_open = bool(self.cfg.get('settings_open', False))
        self.build()

    def txt(self, widget, key):
        self._i18n.append((widget, key))
        widget.setText(i18n.t(key))
        return widget

    def build(self):
        self.setObjectName('root')
        self.th = theme.get(self.cfg.get('theme', 'dark.midnight'))
        self.setStyleSheet(theme.build_style(self.th))
        self.setWindowFlags(Qt.FramelessWindowHint)
        self.setFixedWidth(self.th['width'])
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setAutoFillBackground(False)

        root = QVBoxLayout(self)
        root.setContentsMargins(12, 12, 12, 12)
        root.setSpacing(0)

        panel = QFrame()
        panel.setObjectName('panel')
        self.shadow = QGraphicsDropShadowEffect(self)
        self.shadow.setBlurRadius(28)
        self.shadow.setOffset(0, 6)
        self.shadow.setColor(QColor(0, 0, 0, self.th['shadow']))
        panel.setGraphicsEffect(self.shadow)
        root.addWidget(panel)

        lay = QVBoxLayout(panel)
        lay.setContentsMargins(16, 12, 16, 14)
        lay.setSpacing(12)

        bar = QHBoxLayout()
        self.title_label = QLabel()
        self.title_label.setObjectName('title')
        bar.addWidget(self.title_label)
        bar.addStretch(1)
        self.gear = QPushButton('⚙')
        self.gear.setObjectName('icon')
        self.gear.setFixedSize(24, 24)
        self.gear.setCursor(Qt.PointingHandCursor)
        self.gear.setToolTip(i18n.t('settings_tip'))
        bar.addWidget(self.gear)
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
        self.master_label = QLabel()
        self.master_label.setObjectName('name')
        hl.addWidget(self.master_label)
        hl.addStretch(1)
        self.master = Toggle(self.th)
        hl.addWidget(self.master)
        lay.addWidget(head)

        self.kb = Card('keyboard', 'keyboard_desc', self.th)
        self.ms = Card('mouse', 'mouse_desc', self.th)
        lay.addWidget(self.kb)
        lay.addWidget(self.ms)

        self.settings_card = QFrame(self)
        self.settings_card.setWindowFlags(Qt.Tool | Qt.FramelessWindowHint)
        self.settings_card.setAttribute(Qt.WA_ShowWithoutActivating, True)
        self.settings_card.setAttribute(Qt.WA_TranslucentBackground, True)
        sl = QVBoxLayout(self.settings_card)
        sl.setContentsMargins(18, 8, 18, 18)
        sl.setSpacing(0)

        self.settings_panel = QFrame()
        self.settings_panel.setObjectName('card')
        self.settings_panel.setCursor(Qt.ArrowCursor)
        ss = QGraphicsDropShadowEffect(self.settings_panel)
        ss.setBlurRadius(28)
        ss.setOffset(0, 6)
        ss.setColor(QColor(0, 0, 0, 150))
        self.settings_panel.setGraphicsEffect(ss)
        pl = QVBoxLayout(self.settings_panel)
        pl.setContentsMargins(16, 12, 16, 12)
        pl.setSpacing(10)
        sl.addWidget(self.settings_panel)

        self.settings_body = QWidget()
        bl = QVBoxLayout(self.settings_body)
        bl.setContentsMargins(0, 2, 0, 0)
        bl.setSpacing(10)

        lang_row = QHBoxLayout()
        lang_row.setSpacing(10)
        self.lang_label = QLabel()
        self.lang_label.setObjectName('sub')
        self.lang_label.setFixedWidth(52)
        self.lang_combo = QComboBox()
        self.lang_combo.setCursor(Qt.PointingHandCursor)
        self.lang_combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        lang_row.addWidget(self.lang_label)
        lang_row.addWidget(self.lang_combo)
        bl.addLayout(lang_row)

        theme_row = QHBoxLayout()
        theme_row.setSpacing(10)
        self.theme_label = QLabel()
        self.theme_label.setObjectName('sub')
        self.theme_label.setFixedWidth(52)
        self.theme_combo = QComboBox()
        self.theme_combo.setCursor(Qt.PointingHandCursor)
        self.theme_combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        theme_row.addWidget(self.theme_label)
        theme_row.addWidget(self.theme_combo)
        bl.addLayout(theme_row)

        self.auto = QCheckBox()
        self.auto.setObjectName('plain')
        self.auto.setCursor(Qt.PointingHandCursor)
        self.tray = QCheckBox()
        self.tray.setObjectName('plain')
        self.tray.setCursor(Qt.PointingHandCursor)
        bl.addWidget(self.auto)
        bl.addWidget(self.tray)

        self.quit = QPushButton()
        self.quit.setObjectName('ghost')
        self.quit.setCursor(Qt.PointingHandCursor)
        bl.addWidget(self.quit)

        pl.addWidget(self.settings_body)
        self.settings_card.hide()

        self.fill_lang()
        self.fill_theme()

        for card in (self.kb, self.ms):
            for w, key in card.texts:
                self.txt(w, key)
        self.txt(self.title_label, 'title')
        self.txt(self.master_label, 'master')
        self.txt(self.lang_label, 'language')
        self.txt(self.theme_label, 'theme')
        self.txt(self.auto, 'autostart')
        self.txt(self.tray, 'tray')
        self.txt(self.quit, 'quit')
        self.setWindowTitle(self.title_label.text())
        self.sync_settings_btn()

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
            card.on.setChecked(c.get('on', True))
            card.set_metrics(self.th)
            card.up.setEnabled(bool(card_up_files(self.packs, device, c['pack'])))

        self.gear.clicked.connect(self.toggle_settings)
        self.master.toggled.connect(lambda v: self.change('enabled', bool(v)))
        self.auto.toggled.connect(self.toggle_autostart)
        self.tray.toggled.connect(lambda v: self.change('tray', bool(v)))
        self.quit.clicked.connect(self.on_quit)
        self.lang_combo.currentIndexChanged.connect(lambda i: self.switch_lang(i))
        self.theme_combo.currentIndexChanged.connect(lambda i: self.switch_theme(i))
        for device, card in (('keyboard', self.kb), ('mouse', self.ms)):
            card.combo.currentIndexChanged.connect(lambda i, d=device, c=card: self.switch_pack(d, c))
            card.slider.valueChanged.connect(lambda v, d=device, c=card: self.change_volume(d, c, v))
            card.up.toggled.connect(lambda v, d=device: self.change(d + '_up', bool(v), True))
            card.on.toggled.connect(lambda v, d=device: self.toggle_device(d, bool(v)))
            card.test.clicked.connect(lambda _, d=device: self.on_test(d, True))
            card.imp.clicked.connect(lambda _, d=device: self.do_import(d))
            card.del_btn.clicked.connect(lambda _, d=device, c=card: self.do_remove(d, c.combo.currentData()))
        self.refresh_states()

    def card_of(self, device):
        return self.kb if device == 'keyboard' else self.ms

    def toggle_settings(self):
        self.set_settings_open(not self.settings_open)
        self.on_change()

    def set_settings_open(self, open_):
        open_ = bool(open_)
        self.settings_open = open_
        self.cfg['settings_open'] = open_
        self.settings_card.setVisible(open_ and self.isVisible())
        if open_ and self.isVisible():
            self.place_settings()

    def place_settings(self):
        card = self.settings_card
        lay = card.layout()
        if lay is not None:
            lay.activate()
        h = max(120, lay.sizeHint().height() if lay is not None else 120)
        w = self.width()
        card.resize(w, h)
        app = QApplication.instance()
        scr = app.primaryScreen().availableGeometry() if app else None
        geo = self.frameGeometry()
        x, y = geo.left(), geo.bottom() + 6
        if scr is not None:
            if y + h > scr.bottom():
                y = max(scr.top(), geo.top() - h - 6)
            x = min(max(scr.left(), x), max(scr.left(), scr.right() - w))
        card.move(x, y)

    def sync_settings_btn(self):
        self.gear.setToolTip(i18n.t('settings_tip'))

    def refresh_states(self):
        for device, card in (('keyboard', self.kb), ('mouse', self.ms)):
            pid = card.combo.currentData()
            card.custom = False
            card.has_up = False
            for p in self.packs[device]:
                if p['id'] == pid:
                    card.custom = not p.get('builtin', True)
                    card.has_up = bool(p['up'])
            card.set_enabled(self.cfg[device].get('on', True))

    def toggle_device(self, device, on):
        self.cfg[device]['on'] = on
        self.card_of(device).set_enabled(on)
        self.on_change()

    def do_import(self, device):
        if self.on_import:
            self.on_import(device)

    def do_remove(self, device, pid):
        if self.on_remove:
            self.on_remove(device, pid)

    def switch_lang(self, index):
        code = self.lang_combo.itemData(index)
        if code and self.on_lang:
            self.on_lang(code)

    def switch_theme(self, index):
        tid = self.theme_combo.itemData(index)
        if tid and self.on_theme:
            self.on_theme(tid)

    def fill_lang(self):
        cur = self.cfg.get('lang', 'system')
        self.lang_combo.blockSignals(True)
        self.lang_combo.clear()
        self.lang_combo.addItem(i18n.t('system'), 'system')
        for code, label in i18n.LANGS:
            self.lang_combo.addItem(label, code)
        self.lang_combo.setCurrentIndex(max(self.lang_combo.findData(cur), 0))
        self.lang_combo.blockSignals(False)

    def fill_theme(self):
        cur = self.cfg.get('theme', 'dark.midnight')
        self.theme_combo.blockSignals(True)
        self.theme_combo.clear()
        for th_item in theme.THEMES:
            pix = QPixmap(16, 16)
            pix.fill(QColor(th_item['accent']))
            self.theme_combo.addItem(QIcon(pix),
                                     theme.name(th_item['id'], i18n.get_lang()), th_item['id'])
        self.theme_combo.setCurrentIndex(max(self.theme_combo.findData(cur), 0))
        self.theme_combo.blockSignals(False)

    def retranslate(self):
        for w, key in self._i18n:
            w.setText(i18n.t(key))
        self.kb.on.setToolTip(i18n.t('device_tip'))
        self.ms.on.setToolTip(i18n.t('device_tip'))
        self.gear.setToolTip(i18n.t('settings_tip'))
        for card in (self.kb, self.ms):
            if not card.up.isEnabled():
                card.up.setToolTip(i18n.t('up_none'))
        self.setWindowTitle(self.title_label.text())
        self.fill_lang()
        self.fill_theme()

    def apply_theme(self, tid):
        self.th = theme.get(tid)
        self.setStyleSheet(theme.build_style(self.th))
        self.settings_card.setStyleSheet(theme.build_style(self.th))
        self.setFixedWidth(self.th['width'])
        self.shadow.setColor(QColor(0, 0, 0, self.th['shadow']))
        self.master.set_theme(self.th)
        for card in (self.kb, self.ms):
            card.on.set_theme(self.th)
            card.set_metrics(self.th)
        self.settings_panel.layout().setSpacing(self.th['gap'])
        self.setWindowIcon(app_icon(self.th))
        app = QApplication.instance()
        if app:
            app.setWindowIcon(app_icon(self.th))
        if getattr(self, 'tray_icon', None):
            self.tray_icon.set_icon(self.th)

    def toggle_autostart(self, state):
        import config as config_mod
        ok = config_mod.set_autostart(bool(state))
        self.auto.setChecked(ok and bool(state))
        self.change('autostart', self.auto.isChecked())

    def switch_pack(self, device, card):
        pid = card.combo.currentData()
        self.cfg[device]['pack'] = pid
        self.refresh_states()
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

    def apply_packs(self, device, packs):
        self.packs = packs
        card = self.card_of(device)
        pid = self.cfg[device]['pack']
        card.reload(packs[device], pid)
        self.cfg[device]['pack'] = card.combo.currentData() or pid
        card.up.setEnabled(bool(card_up_files(packs, device, self.cfg[device]['pack'])))
        self.refresh_states()

    def closeEvent(self, e):
        if self.cfg.get('tray') and getattr(self, 'tray_icon', None):
            e.ignore()
            self.hide()
            self.tray_icon.icon.showMessage(i18n.t('title'), i18n.t('tray_msg'),
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

    def moveEvent(self, e):
        if getattr(self, 'settings_open', False):
            self.place_settings()

    def showEvent(self, e):
        if getattr(self, 'settings_open', False):
            self.set_settings_open(True)

    def hideEvent(self, e):
        self.settings_card.hide()

    def resizeEvent(self, e):
        if getattr(self, 'settings_open', False):
            self.place_settings()


def card_up_files(packs, device, pid):
    for p in packs[device]:
        if p['id'] == pid:
            return p['up']
    return []


class Tray:
    def __init__(self, window, on_toggle, on_quit, th=None):
        self.window = window
        self.th = th or theme.get(theme.CURRENT)
        self.icon = QSystemTrayIcon(app_icon(self.th), window)
        self.act_show = QAction()
        self.act_toggle = QAction()
        self.act_quit = QAction()
        self.menu = QMenu()
        self.build_menu()
        self.act_show.triggered.connect(self.show_window)
        self.act_toggle.triggered.connect(on_toggle)
        self.act_quit.triggered.connect(on_quit)
        self.icon.activated.connect(lambda r: self.show_window() if r == QSystemTrayIcon.DoubleClick else None)
        self.icon.setToolTip(i18n.t('tip'))
        self.icon.show()

    def build_menu(self):
        menu = QMenu()
        menu.setStyleSheet(theme.build_style(self.th))
        menu.addAction(self.act_show)
        menu.addAction(self.act_toggle)
        menu.addSeparator()
        menu.addAction(self.act_quit)
        self.retranslate()
        self.icon.setContextMenu(menu)
        self.menu = menu

    def retranslate(self):
        self.act_show.setText(i18n.t('tray_show'))
        self.act_toggle.setText(i18n.t('tray_toggle'))
        self.act_quit.setText(i18n.t('tray_quit'))
        self.icon.setToolTip(i18n.t('tip'))

    def set_icon(self, th):
        self.th = th
        self.icon.setIcon(app_icon(th))
        self.menu.setStyleSheet(theme.build_style(th))
        self.retranslate()

    def show_window(self):
        self.window.showNormal()
        self.window.raise_()
        self.window.activateWindow()
