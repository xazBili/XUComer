import collections
import random
import sys

import pygame
from PyQt5.QtWidgets import QApplication

import config as config_mod
import packs as packs_mod
from player import Player
from ui import MainWindow, Tray, app_icon


class Engine:
    def __init__(self, cfg, packs):
        self.cfg = cfg
        self.packs = packs
        self.player = Player()
        self.held = set()
        self.start()

    def start(self):
        from pynput import keyboard, mouse
        self.kb = keyboard.Listener(on_press=self.on_press, on_release=self.on_release)
        self.ms = mouse.Listener(on_click=self.on_click)
        self.kb.daemon = True
        self.ms.daemon = True
        self.kb.start()
        self.ms.start()

    def stop(self):
        try:
            self.player.stop_all()
            self.kb.stop()
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
        if not self.cfg['enabled']:
            return
        kid = getattr(key, 'char', None) or str(key)
        if kid in self.held:
            return
        self.held.add(kid)
        self.fire('keyboard', True)

    def on_release(self, key):
        kid = getattr(key, 'char', None) or str(key)
        self.held.discard(kid)
        if not self.cfg['enabled']:
            return
        self.fire('keyboard', False)

    def on_click(self, x, y, button, pressed):
        if not self.cfg['enabled']:
            return
        self.fire('mouse', pressed)

    def fire(self, device, down):
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
        self.fire(device, True)


def main():
    app = QApplication(sys.argv)
    app.setQuitOnLastWindowClosed(False)
    app.setWindowIcon(app_icon())

    cfg = config_mod.load()
    packs = packs_mod.scan()
    if not packs['keyboard'] and not packs['mouse']:
        raise SystemExit('未找到音效文件')

    engine = Engine(cfg, packs)

    def save():
        config_mod.save(cfg)

    def quit_app():
        engine.stop()
        save()
        app.quit()

    window = MainWindow(cfg, packs, save, engine.test, quit_app)
    tray = Tray(window, lambda: toggle(), quit_app)
    window.tray_icon = tray

    def toggle():
        cfg['enabled'] = not cfg['enabled']
        window.master.setChecked(cfg['enabled'])
        save()

    window.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
