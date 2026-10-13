import math
import os
import random
import sys

W, H = 1920, 1080

PALETTES = {
    'dawn': {
        'sky': ['#fbe9d0', '#f8d3b4', '#f2b9a0'],
        'sun': '#fff4dc',
        'glow': '#ffe1b8',
        'ridges': ['#efb9a4', '#df9a8e', '#c27d82', '#9a6475', '#6a4a5e', '#3d3243'],
        'mist': '#f7d9c4',
    },
    'calm': {
        'sky': ['#f4f1e8', '#ebeadf', '#dde2d4'],
        'sun': '#fffaf0',
        'glow': '#f7ecd2',
        'ridges': ['#d7ddce', '#bfc9b8', '#a3b29e', '#82947f', '#5d6f5c', '#34433a'],
        'mist': '#eef0e6',
    },
}


def ridge(seed, base, amp, rough, step=12):
    rnd = random.Random(seed)
    phases = [rnd.random() * 6.28 for _ in range(6)]
    pts = []
    for x in range(-40, W + 41, step):
        t = x / W
        y = base
        y += math.sin(t * 2.1 * math.pi + phases[0]) * amp * .55
        y += math.sin(t * 4.7 * math.pi + phases[1]) * amp * .28
        y += math.sin(t * 9.3 * math.pi + phases[2]) * amp * .12 * rough
        y += math.sin(t * 19.1 * math.pi + phases[3]) * amp * .05 * rough
        y += (rnd.random() - .5) * amp * .06 * rough
        pts.append((x, y))
    return pts


def path_of(pts):
    d = 'M-40 %d ' % (H + 40)
    d += ' '.join('L%d %.1f' % (x, y) for x, y in pts)
    d += ' L%d %d Z' % (W + 40, H + 40)
    return d


def pines(pts, seed, size, density):
    rnd = random.Random(seed)
    out = []
    x = -30.0
    while x < W + 30:
        i = min(range(len(pts)), key=lambda k: abs(pts[k][0] - x))
        y = pts[i][1] + size * .18
        h = size * (.72 + rnd.random() * .5)
        w = h * (.44 + rnd.random() * .1)
        lean = (rnd.random() - .5) * w * .08
        d = ''
        for k in range(4):
            top = y - h + k * h * .19
            bottom = y - h * .46 + k * h * .15
            half = w / 2 * (.42 + k * .2)
            d += 'M%.1f %.1f L%.1f %.1f L%.1f %.1f Z ' % (x + lean * (1 - k / 3), top, x - half, bottom, x + half, bottom)
        d += 'M%.1f %.1f h%.1f v%.1f h%.1f Z ' % (x - w * .05, y - h * .1, w * .1, h * .2, -w * .1)
        out.append(d)
        x += size * (density + rnd.random() * density * .8)
    return ''.join(out)


def svg(defs, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" preserveAspectRatio="xMidYMid slice">'
            '<defs>%s</defs>%s</svg>' % (W, H, W, H, defs, body))


def mist(color, y0, y1, a0, a1, gid):
    return ('<linearGradient id="%s" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="%s" stop-opacity="%s"/><stop offset="1" stop-color="%s" stop-opacity="%s"/></linearGradient>' % (gid, color, a0, color, a1),
            '<rect x="0" y="%d" width="%d" height="%d" fill="url(#%s)"/>' % (y0, W, y1 - y0, gid))


def build(name, out):
    p = PALETTES[name]
    r = p['ridges']

    sky = ('<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">'
           '<stop offset="0" stop-color="%s"/><stop offset=".55" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
           '<radialGradient id="glow" cx=".56" cy=".27" r=".42"><stop offset="0" stop-color="%s" stop-opacity=".95"/><stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
           % (p['sky'][0], p['sky'][1], p['sky'][2], p['glow'], p['glow']))
    m1d, m1 = mist(p['mist'], 440, H, 0, .85, 'm1')
    body = ('<rect width="%d" height="%d" fill="url(#sky)"/><rect width="%d" height="%d" fill="url(#glow)"/>'
            '<circle cx="%d" cy="%d" r="64" fill="%s"/>' % (W, H, W, H, int(W * .56), int(H * .27), p['sun']))
    body += '<path d="%s" fill="%s"/>' % (path_of(ridge(1, 470, 110, .6)), r[0])
    body += '<path d="%s" fill="%s"/>' % (path_of(ridge(2, 540, 100, .8)), r[1])
    body += m1
    open(out + 'day-base.svg', 'w').write(svg(sky + m1d, body))

    m2d, m2 = mist(p['mist'], 600, 760, 0, .55, 'm2')
    g3 = ridge(3, 610, 60, 1)
    g4 = ridge(4, 660, 55, 1)
    body = '<path d="%s" fill="%s"/>' % (path_of(g3), r[2])
    body += '<path d="%s" fill="%s"/>' % (pines(g3, 31, 40, .26), r[2])
    body += '<path d="%s" fill="%s"/>' % (path_of(g4), r[3])
    body += '<path d="%s" fill="%s"/>' % (pines(g4, 41, 62, .24), r[3])
    body += m2
    open(out + 'day-middle.svg', 'w').write(svg(m2d, body))

    g5 = ridge(5, 715, 45, 1)
    g6 = ridge(6, 775, 35, 1)
    body = '<path d="%s" fill="%s"/>' % (path_of(g5), r[4])
    body += '<path d="%s" fill="%s"/>' % (pines(g5, 51, 104, .22), r[4])
    body += '<path d="%s" fill="%s"/>' % (path_of(g6), r[5])
    body += '<path d="%s" fill="%s"/>' % (pines(g6, 61, 168, .2), r[5])
    open(out + 'day-front.svg', 'w').write(svg('', body))

    for f in ('day-base.svg', 'day-middle.svg', 'day-front.svg'):
        print(name, f, os.path.getsize(out + f) // 1024, 'KB')


if __name__ == '__main__':
    name = sys.argv[1] if len(sys.argv) > 1 else 'dawn'
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'img') + os.sep
    os.makedirs(out, exist_ok=True)
    build(name, out)
