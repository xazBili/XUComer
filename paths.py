import os
import sys

if getattr(sys, 'frozen', False):
    APP_DIR = os.path.dirname(sys.executable)
    RES_DIR = getattr(sys, '_MEIPASS', APP_DIR)
else:
    APP_DIR = os.path.dirname(os.path.abspath(__file__))
    RES_DIR = APP_DIR

SOUNDS = os.path.join(RES_DIR, 'sounds')


def _settings_path():
    cands = [APP_DIR,
             os.path.join(os.path.expanduser('~'), 'AppData', 'Roaming', 'MKmer')]
    for c in cands:
        try:
            os.makedirs(c, exist_ok=True)
            t = os.path.join(c, '.wtest')
            with open(t, 'w') as f:
                f.write('1')
            os.remove(t)
            return os.path.join(c, 'settings.json')
        except Exception:
            continue
    return os.path.join(APP_DIR, 'settings.json')


SETTINGS = _settings_path()
MAIN = os.path.join(APP_DIR, 'main.py')
