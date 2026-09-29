# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


import random
import sys
import threading

import pygame
from PyQt5.QtCore import QTimer
from PyQt5.QtWidgets import QApplication, QFileDialog, QInputDialog, QMessageBox

import config as config_mod
import i18n as i18n_mod
import importer as importer_mod
import packs as packs_mod
import theme as theme_mod
from player import Player
from ui import MainWindow, Tray, app_icon


def key_id(key):
    vk = getattr(key, 'vk', None)
    if vk is not None:
        return 'v%d' % vk
    return 'c%s' % str(key).lower()


class Engine:
    def __init__(self, cfg, packs):
        self.cfg = cfg
        self.packs = packs
        self.player = Player()
        self.held = set()
        self.stopped = False
        self.kb = None
        self.ms = None
        self.start()

    def start(self):
        from pynput import keyboard, mouse
        self.kb = keyboard.Listener(on_press=self.on_press, on_release=self.on_release)
        self.ms = mouse.Listener(on_click=self.on_click)
        self.kb.daemon = True
        self.ms.daemon = True
        self.kb.start()
        self.ms.start()
        threading.Thread(target=self.watch, daemon=True).start()

    def watch(self):
        import time
        while not self.stopped:
            time.sleep(3)
            try:
                self.repair()
            except Exception:
                pass

    def repair(self):
        from pynput import keyboard, mouse
        if self.kb is None or not self.kb.is_alive():
            self.kb = keyboard.Listener(on_press=self.on_press, on_release=self.on_release)
            self.kb.daemon = True
            self.kb.start()
        if self.ms is None or not self.ms.is_alive():
            self.ms = mouse.Listener(on_click=self.on_click)
            self.ms.daemon = True
            self.ms.start()

    def stop(self):
        self.stopped = True
        try:
            self.player.stop_all()
            if self.kb:
                self.kb.stop()
            if self.ms:
                self.ms.stop()
        except Exception:
            pass

    def current(self, device):
        pid = self.cfg[device]['pack']
        for p in self.packs[device]:
            if p['id'] == pid:
                return p
        return self.packs[device][0] if self.packs[device] else None

    def on_press(self, key):
        try:
            if not self.cfg['enabled']:
                return
            kid = key_id(key)
            if kid in self.held:
                return
            self.held.add(kid)
            self.fire('keyboard', True)
        except Exception:
            pass

    def on_release(self, key):
        try:
            self.held.discard(key_id(key))
            if not self.cfg['enabled']:
                return
            self.fire('keyboard', False)
        except Exception:
            pass

    def on_click(self, x, y, button, pressed):
        try:
            if not self.cfg['enabled']:
                return
            self.fire('mouse', pressed)
        except Exception:
            pass

    def fire(self, device, down):
        if not self.cfg['enabled']:
            return
        if not self.cfg[device].get('on', True):
            return
        self.play(device, down)

    def play(self, device, down):
        c = self.cfg[device]
        if not down and not c['up']:
            return
        p = self.current(device)
        if not p:
            return
        files = p['down'] if down else p['up']
        if not files:
            return
        group = '%s_%s' % (device, 'down' if down else 'up')
        self.player.play(group, files, c['volume'] / 100.0)

    def test(self, device, down=True):
        self.play(device, True)


def main():
    app = QApplication(sys.argv)
    app.setQuitOnLastWindowClosed(False)

    cfg = config_mod.load()
    packs = packs_mod.scan()
    if not packs['keyboard'] and not packs['mouse']:
        QMessageBox.critical(None, config_mod.APP_NAME, i18n_mod.t('no_sounds'))
        raise SystemExit(i18n_mod.t('no_sounds'))

    i18n_mod.set_lang(cfg.get('lang', 'system'))
    theme_mod.CURRENT = cfg.get('theme', 'dark.midnight')
    app.setWindowIcon(app_icon())

    engine = Engine(cfg, packs)

    def save():
        if not cfg.get('enabled'):
            engine.held.clear()
        else:
            engine.repair()
        config_mod.save(cfg)

    def quit_app():
        engine.stop()
        save()
        app.quit()

    def reload_all(new_packs=None):
        new_packs = new_packs or packs_mod.scan()
        for d in ('keyboard', 'mouse'):
            window.apply_packs(d, new_packs)
        packs.clear()
        packs.update(new_packs)
        engine.packs = new_packs
        return new_packs

    def do_import(device):
        card = window.card_of(device)
        down_path, _ = QFileDialog.getOpenFileName(window, i18n_mod.t('pick_down'), '',
                                                   i18n_mod.t('filter'))
        if not down_path:
            return
        up_path = None
        if device == 'keyboard':
            ans = QMessageBox.question(
                window, i18n_mod.t('ask_up_title'), i18n_mod.t('ask_up'),
                QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
            if ans == QMessageBox.Yes:
                p, _ = QFileDialog.getOpenFileName(window, i18n_mod.t('pick_up'), '',
                                                   i18n_mod.t('filter'))
                if p:
                    up_path = p
        taken = set(p['id'] for p in packs[device])
        pid, default = packs_mod.next_name(device, taken)
        name, ok = QInputDialog.getText(window, i18n_mod.t('ask_name_title'),
                                        i18n_mod.t('ask_name'), text=default)
        if not ok:
            return
        card.set_busy(True)

        def work():
            try:
                n = importer_mod.import_pack(device, pid, down_path, up_path, name or default)
                QTimer.singleShot(0, lambda: done(pid, n, None))
            except Exception as e:
                QTimer.singleShot(0, lambda: done(pid, 0, str(e)))

        def done(pid, count, err):
            card.set_busy(False)
            if err:
                card.message(i18n_mod.t('fail', err))
                QMessageBox.warning(window, i18n_mod.t('fail_title'), str(err))
                return
            cfg[device]['pack'] = pid
            reload_all(packs_mod.scan())
            save()
            card.message(i18n_mod.t('done', count))
            engine.test(device, True)

        threading.Thread(target=work, daemon=True).start()

    def do_remove(device, pid):
        ans = QMessageBox.question(window, i18n_mod.t('del_title'), i18n_mod.t('del_body'),
                                   QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if ans != QMessageBox.Yes:
            return
        if not importer_mod.remove_pack(device, pid):
            QMessageBox.information(window, i18n_mod.t('del_denied'), i18n_mod.t('del_builtin'))
            return
        reload_all(packs_mod.scan())
        save()
        window.card_of(device).message(i18n_mod.t('deleted'))

    def do_lang(code):
        cfg['lang'] = code
        i18n_mod.set_lang(code)
        window.retranslate()
        tray.retranslate()
        save()

    def do_theme(tid):
        cfg['theme'] = tid
        theme_mod.CURRENT = tid
        window.apply_theme(tid)
        save()

    window = MainWindow(cfg, packs, save, engine.test, quit_app, do_import, do_remove,
                        do_lang, do_theme)
    tray = Tray(window, lambda: toggle(), quit_app, window.th)
    window.tray_icon = tray

    def toggle():
        cfg['enabled'] = not cfg['enabled']
        window.master.setChecked(cfg['enabled'])
        if cfg['enabled']:
            engine.repair()
        save()

    window.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
