# XUComer 1.0 - Keyboard & Mouse Click Sound Simulator
# Copyright (c) 2026 XUComer. Released under the MIT License.
# See the LICENSE file in the same directory.


import array
import os
import wave

import packs
import pygame

from paths import USER_SOUNDS

SR = 44100
MAX_MS = 260
RATIOS = [0.955, 0.978, 1.025, 1.05, 0.93, 1.07]


def _read_wav(path):
    w = wave.open(path, 'rb')
    ch = w.getnchannels()
    sw = w.getsampwidth()
    sr = w.getframerate()
    n = w.getnframes()
    raw = w.readframes(n)
    w.close()
    if sw == 2:
        d = array.array('h')
        d.frombytes(raw)
    elif sw == 1:
        d = array.array('h', [((b - 128) << 8) for b in raw])
    elif sw == 3:
        d = array.array('h')
        d.frombytes(raw[:len(raw) // 3 * 3])
        d = array.array('h', [int((v >> 8)) for v in _u24(raw)])
    else:
        return array.array('h')
    if ch == 2:
        mono = array.array('h', [0] * (len(d) // 2))
        for i in range(len(mono)):
            mono[i] = (d[2 * i] + d[2 * i + 1]) // 2
        d = mono
    if sr != SR:
        d = _resample(d, sr / SR)
    return d


def _u24(raw):
    return array.array('i', [
        (raw[i] | (raw[i + 1] << 8) | (raw[i + 2] << 16)) -
        (1 << 24 if raw[i + 2] & 0x80 else 0)
        for i in range(0, len(raw) - 2, 3)
    ])


def _resample(d, ratio):
    n = int(len(d) / ratio)
    if n < 8:
        return d
    out = array.array('h', [0] * n)
    for i in range(n):
        pos = i * ratio
        j = int(pos)
        if j + 1 >= len(d):
            out[i] = d[-1] if d else 0
        else:
            t = pos - j
            out[i] = int(d[j] * (1 - t) + d[j + 1] * t)
    return out


def _peak(d):
    if not d:
        return 0
    hi = 0
    for v in d:
        a = v if v >= 0 else -v
        if a > hi:
            hi = a
    return hi


def _trim(d, ratio=0.02, pad_ms=4):
    if not d:
        return d
    peak = _peak(d) or 1
    th = peak * ratio
    win = 64
    n = len(d) // win
    first = -1
    last = -1
    for i in range(n):
        seg = d[i * win:(i + 1) * win]
        if _peak(seg) > th:
            if first < 0:
                first = i
            last = i
    if first < 0:
        return d
    pad = int(SR * pad_ms / 1000)
    s = max(0, first * win - pad)
    e = min(len(d), (last + 1) * win + pad)
    return d[s:e]


def _dedc(d):
    if not d:
        return d
    mean = sum(d) // len(d)
    return array.array('h', [int(max(-32767, min(32767, v - mean))) for v in d])


def _scale(d, f):
    return array.array('h', [int(max(-32767, min(32767, v * f))) for v in d])


def _normalize(d, target=0.88):
    peak = _peak(d) or 1
    return _scale(d, target * 32767 / peak)


def _fade(d, fi_ms=1.5, fo_ms=12):
    d = array.array('h', d)
    fi = int(SR * fi_ms / 1000)
    fo = int(SR * fo_ms / 1000)
    if len(d) <= fi + fo + 8:
        return d
    for i in range(fi):
        d[i] = int(d[i] * i / fi)
    for i in range(fo):
        d[-1 - i] = int(d[-1 - i] * (i / fo))
    return d


def _limit(d, max_ms=MAX_MS):
    m = int(SR * max_ms / 1000)
    if len(d) > m:
        d = array.array('h', d[:m])
        f = int(SR * 0.012)
        for i in range(f):
            d[-1 - i] = int(d[-1 - i] * (i / f))
    return d


def _write(path, d):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w = wave.open(path, 'wb')
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(d.tobytes())
    w.close()


def _clean(d):
    d = _dedc(d)
    d = _trim(d)
    d = _limit(d)
    d = _fade(d)
    return _normalize(d)


def _split_hits(d, min_gap_ms=90, thresh=0.06):
    if not d:
        return []
    peak = _peak(d) or 1
    th = peak * thresh
    win = 128
    n = len(d) // win
    hot = []
    for i in range(n):
        if _peak(d[i * win:(i + 1) * win]) > th:
            hot.append(i)
    if not hot:
        return [d]
    segs = []
    start = hot[0]
    prev = hot[0]
    gap = max(1, int(SR * min_gap_ms / 1000 / win))
    for i in hot[1:]:
        if i - prev > gap:
            segs.append((start * win, prev * win))
            start = i
        prev = i
    segs.append((start * win, (prev + 1) * win))
    pad = int(SR * 0.01)
    out = []
    for s, e in segs:
        s = max(0, s - pad)
        e = min(len(d), e + pad)
        seg = array.array('h', d[s:e])
        if len(seg) > int(SR * 0.02):
            out.append(seg)
    return out or [d]


def decode(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == '.wav':
        return _read_wav(path)
    if not pygame.mixer.get_init():
        pygame.mixer.init(SR, -16, 1, 256)
    snd = pygame.mixer.Sound(path)
    raw = snd.get_raw()
    d = array.array('h')
    d.frombytes(raw)
    return d


def build_variants(d):
    hits = _split_hits(array.array('h', d))
    base = [_clean(h) for h in hits[:4]]
    base = [b for b in base if len(b) > int(SR * 0.015)]
    if not base:
        base = [_clean(array.array('h', d))]
    out = list(base)
    i = 0
    while len(out) < 4 and i < len(RATIOS):
        out.append(_clean(_resample(base[(len(out) - 1) % len(base)], RATIOS[i])))
        i += 1
    return out


def import_pack(device, pack_id, down_path, up_path=None, name=None):
    base = os.path.join(USER_SOUNDS, device, pack_id)
    _clear(base)
    variants = build_variants(decode(down_path))
    down_dir = os.path.join(base, 'down')
    for i, v in enumerate(variants, 1):
        _write(os.path.join(down_dir, '%02d.wav' % i), v)
    count = len(variants)
    if device == 'keyboard':
        up_dir = os.path.join(base, 'up')
        if up_path:
            ups = build_variants(decode(up_path))
        else:
            ups = [derive_release(v) for v in variants]
        ups = [u for u in ups if len(u) > int(SR * 0.015)]
        if ups:
            for i, u in enumerate(ups[:4], 1):
                _write(os.path.join(up_dir, '%02d.wav' % i), u)
            count += len(ups[:4])
    if name:
        try:
            with open(os.path.join(base, 'name.txt'), 'w', encoding='utf-8') as f:
                f.write(name.strip() or pack_id)
        except Exception:
            pass
    return count


def _clear(base):
    import shutil
    if os.path.isdir(base):
        shutil.rmtree(base, ignore_errors=True)


def remove_pack(device, pack_id):
    import shutil
    if pack_id in packs.ORDER.get(device, []):
        return False
    base = os.path.join(USER_SOUNDS, device, pack_id)
    if os.path.isdir(base):
        shutil.rmtree(base, ignore_errors=True)
        return True
    return False


def derive_release(d, ratio=0.94, gain=0.45, target=0.6):
    if len(d) < 200:
        return array.array('h', d)
    tail = array.array('h', d[int(len(d) * 0.45):])
    tail = _dedc(tail)
    tail = _resample(tail, ratio)
    tail = _scale(tail, gain)
    if len(tail) < 200:
        return array.array('h', d)
    return _fade(_normalize(tail, target), 1.5, 14)
