# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


CURRENT = 'dark.midnight'


def T(name_zh, name_en, key, accent, light=False, **kw):
    base = dict(name={'zh': name_zh, 'en': name_en}, id=key, accent=accent, light=light,
                panel='#1c1d21', card='#24262b', input='#2e3138', border='#383b43',
                hover='#383c45', text='#eceef2', sub='#83858d', knob='#ffffff', line='#2a2c31',
                shadow=170, r_panel=16, r_card=12, r_ctl=8, bw=0, pad=16, gap=10, fs=15,
                width=360)
    if light:
        base.update(panel='#f3f4f7', card='#ffffff', input='#eceff3', border='#d9dde4',
                    hover='#e1e5ea', text='#1b1c20', sub='#6d727c', knob='#ffffff',
                    line='#e6e9ee', shadow=80, bw=0)
    base.update(kw)
    return base


THEMES = [
    T('午夜蓝', 'Midnight', 'dark.midnight', '#4f8cff'),
    T('石墨灰', 'Graphite', 'dark.graphite', '#9aa2ad', input='#33363d', border='#3f434b'),
    T('碳纤青', 'Carbon Cyan', 'dark.carbon', '#22d3ee', panel='#141619', card='#1b1e22'),
    T('翡翠绿', 'Emerald', 'dark.emerald', '#34d399', panel='#141a18', card='#1b2320'),
    T('紫罗兰', 'Violet', 'dark.violet', '#a78bfa', panel='#191622', card='#221d2e'),
    T('玫红', 'Rose', 'dark.rose', '#fb7185', panel='#1d1618', card='#261c20'),
    T('琥珀', 'Amber', 'dark.amber', '#fbbf24', panel='#1c1913', card='#252017'),
    T('赛博朋克', 'Cyberpunk', 'dark.cyber', '#e879f9', panel='#16121f', card='#211a2e',
      input='#2c2340', border='#3a2f52'),
    T('熔岩红', 'Lava', 'dark.lava', '#ef4444', panel='#1b1414', card='#251a1a'),
    T('深海', 'Ocean', 'dark.ocean', '#0ea5e9', panel='#111a22', card='#182430'),
    T('森林', 'Forest', 'dark.forest', '#22c55e', panel='#131a15', card='#1a241d'),
    T('北欧', 'Nord', 'dark.nord', '#88c0d6', panel='#2e3440', card='#3b4252',
      input='#434c5e', border='#4c566a'),
    T('香槟金', 'Champagne', 'dark.gold', '#d9b26a', panel='#1b1814', card='#241f19'),
    T('日落', 'Sunset', 'dark.sunset', '#fb923c', panel='#1c1520', card='#261c2b'),
    T('极简黑', 'Mono', 'dark.mono', '#e5e7eb', panel='#0d0d0e', card='#161618',
      input='#232326', border='#2f2f33'),
    T('方角蓝图', 'Blueprint', 'dark.blocks', '#60a5fa', panel='#14171c', card='#1b1f26',
      input='#22262e', border='#333a45', line='#333a45', r_panel=4, r_card=2, r_ctl=2,
      bw=1, pad=14, gap=8),
    T('胶囊霓虹', 'Neon Pill', 'dark.pill', '#22d3ee', panel='#191320', card='#221a2c',
      input='#2b2340', border='#392f52', r_panel=22, r_card=18, r_ctl=13, pad=18, gap=12),
    T('扁平暗夜', 'Flat Night', 'dark.flat', '#f472b6', panel='#18191c', card='#18191c',
      input='#24262b', border='#2e3137', line='#2e3137', bw=1, r_card=10, gap=8),
    T('描边暗夜', 'Wireframe', 'dark.wire', '#a3e635', panel='#121312', card='#121312',
      input='#171916', border='#3f4a35', line='#3f4a35', bw=1, r_panel=8, r_card=8, r_ctl=6),
    T('军绿', 'Olive', 'dark.olive', '#a3b18a', panel='#191b16', card='#21241d'),
    T('摩卡', 'Mocha', 'dark.mocha', '#c8a27a', panel='#1b1714', card='#241e19'),
    T('午夜繁星', 'Starry', 'dark.night', '#818cf8', panel='#0f1020', card='#171a2e',
      input='#21254a', border='#2e3459'),
    T('藏青商务', 'Navy', 'dark.navy', '#64b5f6', panel='#131b26', card='#1a2432',
      input='#24303f', border='#33414f', r_card=8, r_ctl=6, gap=8),
    T('玫瑰石英', 'Quartz', 'dark.quartz', '#f9a8d4', panel='#1f1720', card='#291e27'),
    T('工业灰', 'Industrial', 'dark.industrial', '#cbd5e1', panel='#1a1a1a', card='#202020',
      input='#2b2b2b', border='#3d3d3d', line='#3d3d3d', bw=1, r_panel=2, r_card=2, r_ctl=2,
      pad=12, gap=7, fs=14, width=336),
    T('巧克力', 'Choco', 'dark.choco', '#b07d4b', panel='#1d1712', card='#262019'),
    T('极光', 'Aurora', 'dark.aurora', '#5eead4', panel='#0f1a1c', card='#16262a',
      input='#1e3338', border='#2b4a50'),
    T('深空黑', 'Deep Space', 'dark.space', '#7dd3fc', panel='#0b0d10', card='#12151a',
      input='#1a1e25', border='#262c35', r_card=14, r_ctl=10, pad=18, width=376, fs=16),

    T('冰蓝', 'Ice', 'light.ice', '#3b82f6', light=True),
    T('纸白', 'Paper', 'light.paper', '#2563eb', light=True),
    T('樱花', 'Sakura', 'light.sakura', '#ec4899', light=True, panel='#fdf2f6'),
    T('薄荷', 'Mint', 'light.mint', '#10b981', light=True, panel='#f0faf5'),
    T('拿铁', 'Latte', 'light.latte', '#b45309', light=True, panel='#f7f2ec', card='#fffdfa'),
    T('云雾', 'Cloud', 'light.cloud', '#6366f1', light=True, panel='#eef0f6',
      r_panel=20, r_card=16, r_ctl=12, pad=18, gap=12, fs=16, width=376),
    T('方格纸', 'Grid', 'light.grid', '#0f766e', light=True, panel='#f6f7f5', card='#ffffff',
      border='#c9cdc4', line='#c9cdc4', bw=1, r_panel=4, r_card=2, r_ctl=2, pad=14, gap=8,
      fs=14, width=344),
    T('扁平浅色', 'Flat Light', 'light.flat', '#111827', light=True, panel='#f0f1f3',
      card='#f0f1f3', input='#e4e6ea', border='#dadde2', line='#dadde2', bw=1, gap=8),
    T('珊瑚', 'Coral', 'light.coral', '#f43f5e', light=True, panel='#fff2f2'),
    T('抹茶', 'Matcha', 'light.matcha', '#65a30d', light=True, panel='#f6faea'),
    T('雪松', 'Cedar', 'light.cedar', '#0891b2', light=True, panel='#eef7fa'),
    T('奶油', 'Cream', 'light.cream', '#92400e', light=True, panel='#fdf8f0',
      card='#fffdf8', r_panel=18, r_card=14, pad=18, width=368),
]

BY_ID = dict((t['id'], t) for t in THEMES)


def get(tid):
    return BY_ID.get(tid) or BY_ID['dark.midnight']


def name(tid, lang='zh'):
    n = get(tid)['name']
    return n.get('zh', n['en']) if str(lang).startswith('zh') else n.get('en', n['zh'])


def build_style(th):
    v = dict(panel=th['panel'], card=th['card'], text=th['text'], sub=th['sub'],
             input=th['input'], border=th['border'], hover=th['hover'], accent=th['accent'],
             knob=th['knob'], line=th['line'], r_panel=th['r_panel'], r_card=th['r_card'],
             r_ctl=th['r_ctl'], bw=th['bw'], pad=th['pad'], gap=th['gap'], fs=th['fs'])
    v['bline'] = '%dpx solid %s' % (th['bw'], th['line']) if th['bw'] else 'none'
    v['rKnob'] = th['r_ctl'] // 2
    return """
QWidget#root { background:transparent; }
QFrame#panel { background:%(panel)s; border-radius:%(r_panel)spx; }
QFrame#card { background:%(card)s; border-radius:%(r_card)spx; border:%(bline)s; }
QLabel#title { color:%(text)s; font-size:%(fs)spx; font-weight:600; }
QLabel#name { color:%(text)s; font-size:13px; font-weight:600; }
QLabel#sub { color:%(sub)s; font-size:11px; }
QComboBox { background:%(input)s; color:%(text)s; border:%(bline)s; border-radius:%(r_ctl)spx;
            padding:6px 10px; min-height:18px; }
QComboBox::drop-down { border:none; width:20px; }
QComboBox::down-arrow { image:none; border-left:5px solid transparent; border-right:5px solid transparent;
            border-top:6px solid %(sub)s; width:0; height:0; margin-right:10px; }
QComboBox QAbstractItemView { background:%(input)s; color:%(text)s; border:1px solid %(border)s;
            selection-background-color:%(accent)s; selection-color:#ffffff; outline:0;
            padding:6px; }
QComboBox QAbstractItemView::item { min-height:26px; padding-left:8px; padding-right:8px; }
QPushButton#ghost { background:%(input)s; color:%(sub)s; border:none; border-radius:%(r_ctl)spx;
            padding:6px 14px; font-size:12px; }
QPushButton#ghost:hover { background:%(hover)s; color:%(text)s; }
QPushButton#ghost:disabled { color:%(border)s; }
QPushButton#icon { background:%(input)s; color:%(sub)s; border:none;
            border-radius:%(rKnob)spx; font-size:13px; }
QPushButton#icon:hover { background:%(hover)s; color:%(text)s; }
QPushButton#close { background:transparent; color:%(sub)s; border:none; font-size:14px; }
QPushButton#close:hover { color:#ff6b6b; }
QSlider::groove:horizontal { height:4px; background:%(border)s; border-radius:2px; }
QSlider::sub-page:horizontal { background:%(accent)s; border-radius:2px; }
QSlider::handle:horizontal { width:14px; margin:-5px 0; border-radius:7px; background:%(knob)s; }
QCheckBox#plain { color:%(sub)s; font-size:12px; spacing:6px; }
QCheckBox#plain::indicator { width:16px; height:16px; border-radius:5px; border:1px solid %(border)s;
            background:%(input)s; }
QCheckBox#plain::indicator:checked { background:%(accent)s; border:1px solid %(accent)s; }
QCheckBox#plain:disabled { color:%(border)s; }
QToolTip { background:%(card)s; color:%(text)s; border:1px solid %(border)s; }
QMenu { background:%(card)s; color:%(text)s; border:1px solid %(border)s; padding:4px; }
QMenu::item { padding:6px 22px; border-radius:6px; }
QMenu::item:selected { background:%(accent)s; color:#ffffff; }
""" % v
