import collections
import random
import threading

import pygame

MAX_LAYERS = 3
FADE_MS = 8


class Player:
    def __init__(self):
        pygame.mixer.pre_init(44100, -16, 1, 256)
        pygame.mixer.init()
        pygame.mixer.set_num_channels(96)
        self.lock = threading.Lock()
        self.cache = {}
        self.live = collections.defaultdict(list)
        self.pos = collections.defaultdict(int)

    def sound(self, path):
        s = self.cache.get(path)
        if s is None:
            s = pygame.mixer.Sound(path)
            s.set_volume(1.0)
            self.cache[path] = s
        return s

    def pick(self, group, files):
        n = len(files)
        if n == 1:
            return files[0]
        i = self.pos[group]
        j = random.randrange(1, n)
        self.pos[group] = (i + j) % n
        return files[self.pos[group]]

    def play(self, group, files, volume):
        if not files or volume <= 0:
            return
        with self.lock:
            live = [c for c in self.live[group] if c.get_busy()]
            while len(live) >= MAX_LAYERS:
                old = live.pop(0)
                old.fadeout(FADE_MS)
            path = self.pick(group, files)
            ch = pygame.mixer.find_channel()
            if ch is None:
                ch = self.reclaim(live)
                if ch is None:
                    return
            gain = volume / (1.0 + 0.32 * max(len(live), 1))
            ch.set_volume(gain if gain < 1.0 else 1.0)
            try:
                ch.play(self.sound(path))
            except Exception:
                return
            live.append(ch)
            self.live[group] = live

    def reclaim(self, live):
        for c in live:
            if not c.get_busy():
                return c
        if live:
            c = live.pop(0)
            c.fadeout(FADE_MS)
            return None
        return None

    def stop_all(self):
        with self.lock:
            pygame.mixer.stop()
            self.live.clear()
