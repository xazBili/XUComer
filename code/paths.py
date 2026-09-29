# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


import os
import shutil
import sys

APP_NAME = 'XUComer'
LEGACY_NAME = 'MKmer'

if getattr(sys, 'frozen', False):
    APP_DIR = os.path.dirname(sys.executable)
    RES_DIR = getattr(sys, '_MEIPASS', APP_DIR)
else:
    APP_DIR = os.path.dirname(os.path.abspath(__file__))
    RES_DIR = APP_DIR

SOUNDS = os.path.join(RES_DIR, 'sounds')


def _writable(*cands):
    for c in cands:
        try:
            os.makedirs(c, exist_ok=True)
            t = os.path.join(c, '.wtest')
            with open(t, 'w') as f:
                f.write('1')
            os.remove(t)
            return c
        except Exception:
            continue
    return APP_DIR


def _migrate(dst):
    src = dst.replace(APP_NAME, LEGACY_NAME)
    if src == dst or not os.path.isdir(src):
        return
    for f in os.listdir(src):
        if f in ('settings.json', 'sounds') and not os.path.exists(os.path.join(dst, f)):
            try:
                shutil.move(os.path.join(src, f), os.path.join(dst, f))
            except Exception:
                continue


DATA_DIR = _writable(os.path.join(os.path.expanduser('~'), 'AppData', 'Roaming', APP_NAME),
                     APP_DIR)
_migrate(DATA_DIR)
USER_SOUNDS = os.path.join(DATA_DIR, 'sounds')


def _settings_path():
    for c in (DATA_DIR, APP_DIR):
        try:
            os.makedirs(c, exist_ok=True)
            t = os.path.join(c, '.wtest')
            with open(t, 'w') as f:
                f.write('1')
            os.remove(t)
        except Exception:
            continue
        target = os.path.join(c, 'settings.json')
        if not os.path.exists(target):
            for legacy in (os.path.join(APP_DIR, 'settings.json'),
                           os.path.join(os.path.expanduser('~'), 'AppData', 'Roaming',
                                        LEGACY_NAME, 'settings.json')):
                if os.path.exists(legacy) and os.path.abspath(legacy) != os.path.abspath(target):
                    try:
                        shutil.copy2(legacy, target)
                        break
                    except Exception:
                        continue
        return target
    return os.path.join(APP_DIR, 'settings.json')


SETTINGS = _settings_path()
MAIN = os.path.join(APP_DIR, 'main.py')
