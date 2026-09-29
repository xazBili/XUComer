import os

from paths import SOUNDS

BASE = SOUNDS

ORDER = {
    'keyboard': ['keytone_official', 'green_light', 'green_mid', 'green_heavy', 'blue_click',
                 'tactile', 'linear', 'green_press', 'green_bottom', 'short_tik', 'my_button_press'],
    'mouse': ['keytone_official', 'm_g203', 'm_superlight', 'm_deathadder', 'm_model_o',
              'm_bloody_v8', 'm_intellimouse', 'm_venom', 'm_trust', 'my_lr_click',
              'my_universfield', 'my_dragon_studio', 'm_default', 'm_click1'],
}

NAMES = {
    'keytone_official': 'KeyTone 官方示例',
    'green_light': '绿轴 · 轻',
    'green_mid': '绿轴 · 中',
    'green_heavy': '绿轴 · 重',
    'green_press': '绿轴 · 触发段',
    'green_bottom': '绿轴 · 触底段',
    'blue_click': '青轴 · 清脆',
    'tactile': '茶轴 · 段落感',
    'linear': '线性轴 · 柔和',
    'short_tik': '短促 · 轻点',
    'my_button_press': '备用 · 按键轻触',
    'm_default': '通用 · 标准',
    'm_click1': '通用 · 清脆',
    'm_bloody_v8': '血手幽灵 V8',
    'm_model_o': 'Glorious Model O',
    'm_intellimouse': 'IntelliMouse',
    'm_g203': '罗技 G203',
    'm_superlight': '罗技 GPW',
    'm_venom': 'Rapture Venom',
    'm_deathadder': '雷蛇 炼狱蝰蛇 V2',
    'm_trust': 'Trust GXT 152',
    'my_lr_click': '备用 · 左键音 / 右键音',
    'my_universfield': '备用 · 清脆点击',
    'my_dragon_studio': '备用 · 沉稳点击',
}


def wavs(path):
    if not os.path.isdir(path):
        return []
    return [os.path.join(path, f) for f in sorted(os.listdir(path)) if f.lower().endswith('.wav')]


def scan():
    result = {}
    for device in ('keyboard', 'mouse'):
        root = os.path.join(BASE, device)
        ids = list(ORDER.get(device, []))
        if os.path.isdir(root):
            for d in sorted(os.listdir(root)):
                if d not in ids and os.path.isdir(os.path.join(root, d)):
                    ids.append(d)
        items = []
        for pid in ids:
            p = os.path.join(root, pid)
            down = wavs(os.path.join(p, 'down'))
            if not down:
                continue
            items.append({'id': pid, 'name': NAMES.get(pid, pid), 'down': down,
                          'up': wavs(os.path.join(p, 'up'))})
        result[device] = items
    return result
