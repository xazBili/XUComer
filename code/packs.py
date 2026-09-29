# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


import os

import paths as paths_mod

ROOTS = (paths_mod.SOUNDS, paths_mod.USER_SOUNDS)

ORDER = {
    'keyboard': ['keytone_official', 'green_light', 'green_mid', 'green_heavy', 'blue_click',
                 'tactile', 'linear', 'green_press', 'green_bottom', 'short_tik', 'my_button_press'],
    'mouse': ['keytone_official', 'm_g203', 'm_superlight', 'm_deathadder', 'm_model_o',
              'm_bloody_v8', 'm_intellimouse', 'm_venom', 'm_trust', 'my_lr_click',
              'my_universfield', 'my_dragon_studio', 'm_default', 'm_click1'],
}

NAMES = {
    'keytone_official': 'KeyTone Official Sample',
    'green_light': 'XUComer Green Light',
    'green_mid': 'XUComer Green Mid',
    'green_heavy': 'XUComer Green Heavy',
    'green_press': 'XUComer Green Actuate',
    'green_bottom': 'XUComer Green Bottom',
    'blue_click': 'XUComer Blue Switch',
    'tactile': 'XUComer Brown Tactile',
    'linear': 'XUComer Linear Soft',
    'short_tik': 'XUComer Short Tick',
    'my_button_press': 'XUComer Light Tap',
    'm_default': 'XUComer Standard',
    'm_click1': 'XUComer Sharp Click',
    'm_bloody_v8': 'XUComer Bloody V8',
    'm_model_o': 'XUComer Glorious Model O',
    'm_intellimouse': 'XUComer IntelliMouse',
    'm_g203': 'XUComer Logitech G203',
    'm_superlight': 'XUComer Logitech GPX',
    'm_venom': 'XUComer Rapture Venom',
    'm_deathadder': 'XUComer Razer DeathAdder V2',
    'm_trust': 'XUComer Trust GXT 152',
    'my_lr_click': 'XUComer Duo Click',
    'my_universfield': 'XUComer Crisp Click',
    'my_dragon_studio': 'XUComer Deep Click',
}


def wavs(path):
    if not os.path.isdir(path):
        return []
    return [os.path.join(path, f) for f in sorted(os.listdir(path)) if f.lower().endswith('.wav')]


def _stored_name(path):
    f = os.path.join(path, 'name.txt')
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            s = fh.read().strip()
        return s or None
    except Exception:
        return None


def _make(path, device, pid):
    down = wavs(os.path.join(path, 'down'))
    if not down:
        return None
    up = [] if device == 'mouse' else wavs(os.path.join(path, 'up'))
    return {'id': pid,
            'name': _stored_name(path) or NAMES.get(pid, pid),
            'down': down,
            'up': up,
            'builtin': pid in ORDER.get(device, [])}


def next_name(device, taken):
    n = 1
    while True:
        name = 'XUComer Custom %d' % n
        pid = 'x_custom_%d' % n
        if pid not in taken:
            return pid, name
        n += 1


def scan():
    result = {}
    for device in ('keyboard', 'mouse'):
        items = []
        seen = set()
        for pid in ORDER.get(device, []):
            for root in ROOTS:
                it = _make(os.path.join(root, device, pid), device, pid)
                if it:
                    items.append(it)
                    seen.add(pid)
                    break
        extra = []
        for root in ROOTS:
            base = os.path.join(root, device)
            if not os.path.isdir(base):
                continue
            for d in sorted(os.listdir(base)):
                if d in seen or not os.path.isdir(os.path.join(base, d)):
                    continue
                seen.add(d)
                it = _make(os.path.join(base, d), device, d)
                if it:
                    extra.append(it)
        items.extend(extra)
        result[device] = items
    return result
