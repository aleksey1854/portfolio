import os
import sys
import numpy as np
from PIL import Image, ImageFilter

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img") + os.sep
OUT = sys.argv[1] if len(sys.argv) > 1 else SRC
os.makedirs(OUT, exist_ok=True)


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float) / 255


def lum(rgb):
    return rgb[..., 0] * .2126 + rgb[..., 1] * .7152 + rgb[..., 2] * .0722


def grade(rgb, dark, light, lo, hi, gamma):
    l = lum(rgb)
    l = np.clip((l - lo) / (hi - lo), 0, 1) ** gamma
    return dark * (1 - l[..., None]) + light * l[..., None]


base = np.asarray(Image.open(SRC + "layer-base.webp").convert("RGB").filter(ImageFilter.MedianFilter(5))).astype(float) / 255
h, w, _ = base.shape
b = grade(base, hexrgb("#7d8a79"), hexrgb("#eef0e6"), .0, .32, .55)
yy, xx = np.mgrid[0:h, 0:w]
fog = np.clip(1 - yy / h * 1.15, 0, 1) ** 1.3
b = b * (1 - fog[..., None] * .55) + hexrgb("#f3f2ea") * fog[..., None] * .55
sun = np.exp(-(((xx - w * .58) / (w * .32)) ** 2 + ((yy + h * .1) / (h * .55)) ** 2))
b = b * (1 - sun[..., None] * .35) + hexrgb("#fbf0d6") * sun[..., None] * .35
Image.fromarray((np.clip(b, 0, 1) * 255).astype("uint8")).save(OUT + "day-base.webp", "WEBP", quality=80, method=6)


def layer(name, dark, light, lo, hi, gamma, haze, haze_color):
    im = Image.open(SRC + name).convert("RGBA")
    arr = np.asarray(im).astype(float) / 255
    rgb, a = arr[..., :3], arr[..., 3]
    g = grade(rgb, hexrgb(dark), hexrgb(light), lo, hi, gamma)
    g = g * (1 - haze) + hexrgb(haze_color) * haze
    out = np.dstack([np.clip(g, 0, 1), a])
    Image.fromarray((out * 255).astype("uint8"), "RGBA").save(OUT + "day-" + name.split("-")[1], "WEBP", quality=80, alpha_quality=90, method=6)


layer("layer-middle.webp", "#465643", "#a3b09b", .0, .22, .7, .22, "#e9ece2")
layer("layer-front.webp", "#26332a", "#677a60", .0, .2, .8, .04, "#e9ece2")


for f in sorted(os.listdir(OUT)):
    print(f, os.path.getsize(OUT + f) // 1024, "KB")
