import copy
import json
import os
import sys

from paths import APP_DIR, SETTINGS

PATH = SETTINGS
APP_NAME = 'MKmer'
RUN_KEY = r'Software\Microsoft\Windows\CurrentVersion\Run'

DEFAULTS = {
    'enabled': True,
    'keyboard': {'pack': 'green_light', 'volume': 70, 'up': True},
    'mouse': {'pack': 'm_g203', 'volume': 70, 'up': False},
    'tray': True,
    'autostart': False,
}


def load():
    cfg = copy.deepcopy(DEFAULTS)
    try:
        with open(PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for k, v in data.items():
            if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                cfg[k].update(v)
            else:
                cfg[k] = v
    except Exception:
        pass
    return cfg


def save(cfg):
    for p in (PATH, os.path.join(APP_DIR, 'settings.json'),
              os.path.join(os.path.expanduser('~'), 'AppData', 'Roaming', 'MKmer', 'settings.json')):
        try:
            os.makedirs(os.path.dirname(p), exist_ok=True)
            with open(p, 'w', encoding='utf-8') as f:
                json.dump(cfg, f, ensure_ascii=False, indent=2)
            return True
        except Exception:
            continue
    return False


def launch_cmd():
    if getattr(sys, 'frozen', False):
        return '"%s"' % sys.executable
    exe = sys.executable
    if exe.lower().endswith('python.exe'):
        exe = exe[:-10] + 'pythonw.exe'
    return '"%s" "%s"' % (exe, os.path.join(APP_DIR, 'main.py'))


def set_autostart(on):
    import winreg
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, RUN_KEY, 0, winreg.KEY_SET_VALUE)
        if on:
            winreg.SetValueEx(key, APP_NAME, 0, winreg.REG_SZ, launch_cmd())
        else:
            try:
                winreg.DeleteValue(key, APP_NAME)
            except FileNotFoundError:
                pass
        winreg.CloseKey(key)
        return True
    except Exception:
        return False


def is_autostart():
    import winreg
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, RUN_KEY, 0, winreg.KEY_READ)
        val, _ = winreg.QueryValueEx(key, APP_NAME)
        winreg.CloseKey(key)
        return bool(val)
    except Exception:
        return False
