import os
import sys
import cv2
import numpy as np

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

img = cv2.imread(SRC, cv2.IMREAD_COLOR)
H, W = img.shape[:2]
f = img.astype(np.float32) / 255
L = (f[..., 2] * .2126 + f[..., 1] * .7152 + f[..., 0] * .0722)
L = cv2.GaussianBlur(L, (0, 0), 1.2)

yy = np.linspace(0, 1, H)[:, None] * np.ones((1, W))
xx = np.ones((H, 1)) * np.linspace(0, 1, W)[None, :]


def key(lo, hi):
    return np.clip((hi - L) / (hi - lo), 0, 1)


def band(y0, y1, soft):
    a = np.clip((yy - y0) / soft, 0, 1)
    b = np.clip((y1 - yy) / soft, 0, 1)
    return a * b


front_key = key(.40, .62)
front = front_key * band(.6, 1.2, .05)
right_trees = front_key * band(.55, 1.2, .04) * np.clip((xx - .58) / .04, 0, 1)
front = np.maximum(front, right_trees)

mid_key = key(.36, .58)
mid = mid_key * band(.37, .64, .04) * np.clip((xx - .08) / .05, 0, 1) * np.clip((.86 - xx) / .05, 0, 1)
mid = mid * (1 - front)

def clean(a):
    a = cv2.GaussianBlur(a.astype(np.float32), (0, 0), .8)
    return np.clip(a, 0, 1)

front = clean(front)
mid = clean(mid)

def inpaint(base, alpha):
    m = (alpha > .06).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((11, 11), np.uint8), iterations=2)
    sw, sh = W // 10, H // 10
    small = cv2.resize(base, (sw, sh), interpolation=cv2.INTER_AREA)
    ms = cv2.resize(m, (sw, sh), interpolation=cv2.INTER_AREA)
    ms = (ms > 20).astype(np.uint8) * 255
    filled = cv2.inpaint(small, ms, 12, cv2.INPAINT_NS)
    filled = cv2.GaussianBlur(filled, (0, 0), 2.2)
    filled = cv2.resize(filled, (W, H), interpolation=cv2.INTER_CUBIC)
    noise = np.random.default_rng(3).normal(0, 2.2, base.shape).astype(np.float32)
    filled = np.clip(filled.astype(np.float32) + noise, 0, 255)
    k = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 14)[..., None]
    k = np.clip(k * 1.6, 0, 1)
    return (base.astype(np.float32) * (1 - k) + filled * k).astype(np.uint8)


base = inpaint(img, np.maximum(front, mid))
mid_bg = inpaint(img, front)

cv2.imwrite(os.path.join(OUT, 'base.png'), base)
mid_rgba = np.dstack([mid_bg, (mid * 255).astype(np.uint8)])
front_rgba = np.dstack([img, (front * 255).astype(np.uint8)])
cv2.imwrite(os.path.join(OUT, 'mid.png'), mid_rgba)
cv2.imwrite(os.path.join(OUT, 'front.png'), front_rgba)
cv2.imwrite(os.path.join(OUT, 'mask-front.png'), (front * 255).astype(np.uint8))
cv2.imwrite(os.path.join(OUT, 'mask-mid.png'), (mid * 255).astype(np.uint8))
print('ok', W, H)

if len(sys.argv) > 3:
    from PIL import Image
    web = sys.argv[3]
    for src, dst in (('base.png', 'day-base.webp'), ('mid.png', 'day-middle.webp'), ('front.png', 'day-front.webp')):
        im = Image.open(os.path.join(OUT, src)).convert('RGBA' if src != 'base.png' else 'RGB')
        if src != 'base.png':
            a = np.asarray(im).copy()
            a[a[..., 3] < 14] = 0
            im = Image.fromarray(a, 'RGBA')
        im = im.resize((2560, round(im.height * 2560 / im.width)), Image.LANCZOS)
        opts = dict(quality=78, method=6)
        if src != 'base.png':
            opts['alpha_quality'] = 85
        im.save(os.path.join(web, dst), 'WEBP', **opts)
        print(dst, os.path.getsize(os.path.join(web, dst)) // 1024, 'KB')
