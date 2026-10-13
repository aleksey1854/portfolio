(function () {
	'use strict';

	var root = document.documentElement;

	var clamp = function (v, min, max) {
		return v < min ? min : v > max ? max : v;
	};

	var pad = function (n) {
		return n < 10 ? '0' + n : String(n);
	};

	var label = function (work) {
		var name = work.querySelector('.work__title [data-t]');
		return (name ? name.textContent : work.getAttribute('data-nav')) || '';
	};

	var topbar = document.getElementById('topbar');
	var hero = document.querySelector('.hero');
	var contact = document.getElementById('contact');
	var section = document.getElementById('work');
	var stage = document.getElementById('stage');
	var stageNav = document.getElementById('stageNav');
	var counter = document.getElementById('count');
	var nowLabel = document.getElementById('stageNow');
	var cards = stage ? Array.prototype.slice.call(stage.querySelectorAll('.work')) : [];

	var yearNode = document.getElementById('year');
	if (yearNode) yearNode.textContent = String(new Date().getFullYear());

	var hasGsap = !!(window.gsap && window.ScrollTrigger);
	var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

	if (hasGsap) gsap.registerPlugin(ScrollTrigger);

	var lenis = null;

	function lenisTick(time) {
		lenis.raf(time * 1000);
	}

	function startLenis() {
		if (lenis || calm.matches || !window.Lenis) return;

		lenis = new window.Lenis({
			duration: 1.05,
			smoothWheel: true,
			syncTouch: false,
			wheelMultiplier: 0.9,
			anchors: true
		});

		window.siteLenis = lenis;

		if (hasGsap) {
			lenis.on('scroll', ScrollTrigger.update);
			gsap.ticker.add(lenisTick);
			gsap.ticker.lagSmoothing(0);
		} else {
			window.requestAnimationFrame(function raf(time) {
				if (!lenis) return;
				lenis.raf(time);
				window.requestAnimationFrame(raf);
			});
		}
	}

	function stopLenis() {
		if (!lenis) return;
		if (hasGsap) gsap.ticker.remove(lenisTick);
		lenis.destroy();
		lenis = null;
		window.siteLenis = null;
	}

	var heroBottom = 0;
	var contactTop = 0;

	function measure() {
		heroBottom = hero ? hero.offsetHeight : 0;
		contactTop = contact ? contact.getBoundingClientRect().top + window.pageYOffset : 0;
	}

	function render() {
		var y = window.pageYOffset;

		if (y < heroBottom + 240) root.style.setProperty('--scrollTop', y + 'px');

		if (topbar) topbar.classList.toggle('is-stuck', y > 40);

		if (contact && contactTop - y < window.innerHeight * 1.5) {
			var entered = clamp(y + window.innerHeight - contactTop, 0, window.innerHeight * 1.6);
			contact.style.setProperty('--contactShift', entered + 'px');
		}
	}

	var ticking = false;

	function onScroll() {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(function () {
			ticking = false;
			render();
		});
	}

	var stack = null;
	var active = -1;

	function setActive(index) {
		if (index === active) return;
		active = index;

		cards.forEach(function (card, n) {
			card.inert = stack ? n !== index : false;
		});

		if (counter) counter.textContent = pad(index + 1);
		if (nowLabel) nowLabel.textContent = label(cards[index]);
		if (stageNav) {
			var items = stageNav.children;
			for (var k = 0; k < items.length; k++) items[k].classList.toggle('is-current', k === index);
		}
	}

	function go(index) {
		index = clamp(index, 0, cards.length - 1);

		var top;
		if (stack) {
			var st = stack.timeline.scrollTrigger;
			top = st.start + (st.end - st.start) * (index / stack.duration);
		} else {
			top = cards[index].getBoundingClientRect().top + window.pageYOffset - 90;
		}

		if (lenis) lenis.scrollTo(top);
		else window.scrollTo({ top: top, behavior: calm.matches ? 'auto' : 'smooth' });
	}

	function buildNav() {
		if (!stageNav || !cards.length) return;

		var total = counter && counter.parentNode.querySelector('small');
		if (total) total.textContent = '/ ' + pad(cards.length);

		cards.forEach(function (card, i) {
			var item = document.createElement('li');
			var button = document.createElement('button');
			var name = label(card);

			button.type = 'button';
			button.title = name;
			button.setAttribute('aria-label', pad(i + 1) + ' — ' + name);
			button.addEventListener('click', function () { go(i); });

			item.appendChild(button);
			stageNav.appendChild(item);
		});
	}

	function fits() {
		return cards.every(function (card) {
			var cs = window.getComputedStyle(card);
			var room = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
			return card.querySelector('.work__inner').scrollHeight <= room + 1;
		});
	}

	var mm = null;

	function buildStack() {
		if (!hasGsap || cards.length < 2) return;

		if (mm) mm.revert();
		mm = gsap.matchMedia();

		mm.add('(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)', function () {
			section.classList.add('is-stacked');

			if (!fits()) {
				section.classList.remove('is-stacked');
				return;
			}

			cards.forEach(function (card, i) {
				gsap.set(card, { yPercent: i ? 100 : 0, zIndex: i + 1 });
			});

			var duration = cards.length - 1 + 0.35;

			var timeline = gsap.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: stage,
					pin: stage,
					start: 'top top',
					end: function () { return '+=' + Math.round(window.innerHeight * duration); },
					scrub: 0.35,
					invalidateOnRefresh: true
				},
				onUpdate: function () {
					setActive(Math.min(cards.length - 1, Math.floor(this.time() + 0.45)));
				}
			});

			cards.slice(1).forEach(function (card, i) {
				timeline
					.to(card, { yPercent: 0, duration: 1 }, i)
					.to(cards[i], { scale: 0.94, duration: 1 }, i)
					.to(cards[i].querySelector('.work__shade'), { opacity: 0.55, duration: 1 }, i);

				if (i > 0) timeline.set(cards[i - 1], { visibility: 'hidden' }, i);
			});

			timeline.to({}, { duration: 0.35 });

			stack = { timeline: timeline, duration: duration };
			active = -1;
			setActive(0);

			return function () {
				section.classList.remove('is-stacked');
				stack = null;
				active = -1;
				cards.forEach(function (card) { card.inert = false; });
			};
		});
	}

	buildNav();
	startLenis();
	buildStack();
	measure();
	render();

	window.addEventListener('scroll', onScroll, { passive: true });

	if (hasGsap) {
		ScrollTrigger.addEventListener('refresh', function () {
			measure();
			render();
		});
	} else {
		window.addEventListener('resize', function () { measure(); render(); });
	}

	window.addEventListener('load', function () {
		if (hasGsap) ScrollTrigger.refresh();
		measure();
		render();
	});

	document.addEventListener('langchange', function () {
		if (nowLabel && cards[active]) nowLabel.textContent = label(cards[active]);
		if (stageNav) {
			var items = stageNav.querySelectorAll('button');
			for (var i = 0; i < items.length; i++) {
				var name = label(cards[i]);
				items[i].title = name;
				items[i].setAttribute('aria-label', pad(i + 1) + ' — ' + name);
			}
		}
		if (hasGsap) {
			buildStack();
			ScrollTrigger.refresh();
		} else {
			measure();
			render();
		}
	});

	var resizeTimer = null;
	window.addEventListener('resize', function () {
		if (!hasGsap) return;
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(function () {
			var y = window.pageYOffset;
			buildStack();
			ScrollTrigger.refresh();
			if (lenis) lenis.scrollTo(y, { immediate: true });
		}, 220);
	});

	if (hasGsap && document.fonts && document.fonts.ready) {
		document.fonts.ready.then(function () {
			buildStack();
			ScrollTrigger.refresh();
		});
	}

	var onCalm = function () {
		if (calm.matches) stopLenis();
		else startLenis();
	};
	if (calm.addEventListener) calm.addEventListener('change', onCalm);
	else if (calm.addListener) calm.addListener(onCalm);
})();


(function () {
	'use strict';

	var box = document.getElementById('box');
	if (!box) return;

	var img = document.getElementById('boxImg');
	var vid = document.getElementById('boxVideo');
	var frame = document.getElementById('boxFrame');
	var liveBar = document.getElementById('boxLiveBar');
	var newTab = document.getElementById('boxNewTab');
	var title = document.getElementById('boxTitle');
	var count = document.getElementById('boxCount');
	var prev = document.getElementById('boxPrev');
	var next = document.getElementById('boxNext');
	var close = document.getElementById('boxClose');
	var bg = box.querySelector('.box__bg');

	var shots = [];
	var at = 0;
	var opener = null;
	var scrollLock = 0;

	var isVideo = function (src) { return /\.mp4$/.test(src); };

	function t(key, fallback) {
		var api = window.I18N;
		if (!api) return fallback;
		var dict = api.dict[document.documentElement.lang] || api.dict.ru;
		return dict[key] || api.dict.ru[key] || fallback;
	}

	function cardName(shot) {
		var card = shot.closest('.work');
		var name = card ? card.querySelector('.work__title [data-t]') : null;
		return name ? name.textContent : (card ? card.getAttribute('data-nav') || '' : '');
	}

	function lockScroll(on) {
		var lenis = window.siteLenis;

		if (lenis) {
			if (on) lenis.stop();
			else lenis.start();
			return;
		}

		if (on) {
			scrollLock = window.pageYOffset;
			document.body.style.position = 'fixed';
			document.body.style.top = -scrollLock + 'px';
			document.body.style.width = '100%';
		} else {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			var was = document.documentElement.style.scrollBehavior;
			document.documentElement.style.scrollBehavior = 'auto';
			window.scrollTo(0, scrollLock);
			document.documentElement.style.scrollBehavior = was;
		}
	}

	function veil(on) {
		['#topbar', 'main', 'footer'].forEach(function (sel) {
			var node = document.querySelector(sel);
			if (node) node.inert = on;
		});
	}

	function mark(shot) {
		var extra = (shot.getAttribute('data-shots') || '').split('|').filter(Boolean);
		var live = shot.getAttribute('data-live');
		if (!extra.length && !live) return;

		shot.setAttribute('role', 'button');
		shot.setAttribute('tabindex', '0');
		if (!extra.length) {
			shot.setAttribute('aria-label', t('run.here', 'Запустить'));
			return;
		}

		var hint = shot.querySelector('.work__more');
		if (!hint) {
			hint = document.createElement('span');
			hint.className = 'work__more';
			hint.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg><i></i>';
			shot.appendChild(hint);
		}

		var hasVideo = extra.some(isVideo);

		hint.querySelector('svg').innerHTML = hasVideo
			? '<path d="M8 5.5v13l11-6.5-11-6.5" fill="currentColor" stroke="none"/>'
			: '<rect x="3" y="6" width="13" height="13" rx="1.5"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h10A1.5 1.5 0 0 1 21 4.5v10a1.5 1.5 0 0 1-1.5 1.5H18"/>';

		var label = hasVideo
			? t('shot.video', 'Видео')
			: (extra.length + 1) + ' ' + t('shot.screens', 'экрана');

		hint.querySelector('i').textContent = label;

		var badge = shot.querySelector('.work__badge');
		shot.setAttribute('aria-label', (badge ? badge.textContent + ' ' : '') + label + '. ' + t('shot.open', 'Открыть экраны проекта'));
	}

	function markAll() {
		var list = document.querySelectorAll('.work__shot[data-shots], .work__shot[data-live]');
		for (var i = 0; i < list.length; i++) mark(list[i]);
	}

	function show() {
		var src = shots[at];
		var video = isVideo(src);

		vid.pause();
		vid.hidden = !video;
		img.hidden = video;

		if (video) {
			if (vid.getAttribute('src') !== src) vid.setAttribute('src', src);
			vid.currentTime = 0;
			var playing = vid.play();
			if (playing && playing.catch) playing.catch(function () {});
		} else {
			img.src = src;
			img.alt = title.textContent + ', ' + (at + 1);
		}

		count.textContent = (at + 1) + ' / ' + shots.length;
		prev.disabled = at === 0;
		next.disabled = at === shots.length - 1;

		var after = shots[at + 1];
		if (after && !isVideo(after)) new Image().src = after;
	}

	function openWindow(shot) {
		opener = shot;
		title.textContent = cardName(shot);
		box.hidden = false;
		lockScroll(true);
		veil(true);
		close.focus();
	}

	function openShots(shot) {
		var main = shot.querySelector('img');
		var extra = (shot.getAttribute('data-shots') || '').split('|').filter(Boolean);
		if (!main || !extra.length) return;

		shots = [main.getAttribute('src')].concat(extra);

		shots.sort(function (x, y) { return (isVideo(y) ? 1 : 0) - (isVideo(x) ? 1 : 0); });
		at = 0;

		box.classList.remove('is-live');
		liveBar.hidden = true;
		frame.hidden = true;
		prev.hidden = false;
		next.hidden = false;

		show();
		openWindow(shot);
	}

	function openLive(shot) {
		var url = shot.getAttribute('data-live');
		if (!url) return;

		box.classList.add('is-live');
		liveBar.hidden = false;
		newTab.href = url;

		img.hidden = true;
		vid.pause();
		vid.hidden = true;
		frame.hidden = false;
		frame.title = cardName(shot);
		frame.src = url;

		prev.hidden = true;
		next.hidden = true;
		count.textContent = '';

		openWindow(shot);
	}

	function hide() {
		box.hidden = true;
		box.classList.remove('is-live');

		img.src = '';
		vid.pause();
		vid.removeAttribute('src');
		vid.load();

		frame.src = 'about:blank';
		frame.hidden = true;

		veil(false);
		lockScroll(false);

		if (opener) {
			opener.focus && opener.focus();
			opener = null;
		}
	}

	function step(delta) {
		if (box.classList.contains('is-live')) return;
		var to = at + delta;
		if (to < 0 || to >= shots.length) return;
		at = to;
		show();
	}

	function activate(shot) {
		if (shot.hasAttribute('data-shots')) openShots(shot);
		else openLive(shot);
	}

	document.addEventListener('click', function (e) {
		if (!e.target.closest) return;

		var run = e.target.closest('[data-run]');
		if (run) {
			var card = run.closest('.work');
			var target = card && card.querySelector('.work__shot[data-live]');
			if (target) {
				e.preventDefault();
				openLive(target);
			}
			return;
		}

		var shot = e.target.closest('.work__shot[data-shots], .work__shot[data-live]');
		if (shot) {
			e.preventDefault();
			activate(shot);
		}
	});

	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		var shot = e.target.closest ? e.target.closest('.work__shot[role="button"]') : null;
		if (!shot) return;
		e.preventDefault();
		activate(shot);
	});

	var touchX = null;
	var touchY = 0;

	box.addEventListener('touchstart', function (e) {
		if (e.touches.length !== 1) { touchX = null; return; }
		touchX = e.touches[0].clientX;
		touchY = e.touches[0].clientY;
	}, { passive: true });

	box.addEventListener('touchend', function (e) {
		if (touchX === null) return;
		var dx = e.changedTouches[0].clientX - touchX;
		var dy = e.changedTouches[0].clientY - touchY;
		touchX = null;
		if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
	});

	prev.addEventListener('click', function () { step(-1); });
	next.addEventListener('click', function () { step(1); });
	close.addEventListener('click', hide);
	bg.addEventListener('click', hide);

	document.addEventListener('keydown', function (e) {
		if (box.hidden) return;
		if (e.key === 'Escape') hide();
		else if (e.key === 'ArrowLeft') step(-1);
		else if (e.key === 'ArrowRight') step(1);
	});

	document.addEventListener('langchange', markAll);
	markAll();
})();

(function () {
	'use strict';

	if (!window.matchMedia) return;
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if (!matchMedia('(hover: none) and (pointer: coarse)').matches) return;

	var hero = document.querySelector('.hero');
	var layers = document.querySelector('.layers');
	if (!hero || !layers) return;

	var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

	function word(key, fallback) {
		var api = window.I18N;
		if (!api) return fallback;
		var dict = api.dict[document.documentElement.lang] || api.dict.ru;
		return dict[key] || fallback;
	}

	if ('DeviceOrientationEvent' in window) {
		var base = null;
		var pending = null;
		var sensorless = false;

		var tilt = function () {
			hero.style.setProperty('--tiltX', pending.x.toFixed(3));
			hero.style.setProperty('--tiltY', pending.y.toFixed(3));
			pending = null;
		};

		var orient = function (e) {
			if (e.beta === null || e.gamma === null) {
				sensorless = true;
				return;
			}
			if (!base) {
				base = { b: e.beta, g: e.gamma };
				hero.classList.add('has-tilt');
			}
			base.b += (e.beta - base.b) * .004;
			base.g += (e.gamma - base.g) * .004;
			var next = { x: clamp((e.gamma - base.g) / 22, -1, 1), y: clamp((e.beta - base.b) / 22, -1, 1) };
			if (!pending) requestAnimationFrame(tilt);
			pending = next;
		};

		window.addEventListener('deviceorientation', orient);

		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			setTimeout(function () {
				if (base || sensorless) return;
				var ask = document.createElement('button');
				ask.type = 'button';
				ask.className = 'tilt-ask';
				ask.setAttribute('data-t', 'tilt.ask');
				ask.textContent = word('tilt.ask', 'Включить наклон');
				layers.appendChild(ask);
				ask.addEventListener('click', function () {
					DeviceOrientationEvent.requestPermission().then(function () { ask.remove(); }, function () { ask.remove(); });
				});
			}, 1200);
		}
	}

	var canvas = document.createElement('canvas');
	canvas.className = 'flies';
	canvas.setAttribute('aria-hidden', 'true');
	layers.appendChild(canvas);

	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0;
	var H = 0;
	var flies = [];
	var finger = null;
	var release = 0;
	var visible = true;
	var running = false;

	var sprite = document.createElement('canvas');
	sprite.width = sprite.height = 64;
	var sctx = sprite.getContext('2d');
	var glow = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
	glow.addColorStop(0, 'rgba(255, 236, 170, 1)');
	glow.addColorStop(.18, 'rgba(255, 214, 120, .85)');
	glow.addColorStop(.45, 'rgba(255, 190, 90, .22)');
	glow.addColorStop(1, 'rgba(255, 180, 80, 0)');
	sctx.fillStyle = glow;
	sctx.fillRect(0, 0, 64, 64);

	function size() {
		W = layers.clientWidth;
		H = layers.clientHeight;
		canvas.width = Math.round(W * dpr);
		canvas.height = Math.round(H * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function spawn() {
		flies = [];
		for (var i = 0; i < 34; i++) {
			flies.push({
				x: Math.random() * W,
				y: H * .25 + Math.random() * H * .6,
				vx: (Math.random() - .5) * .4,
				vy: (Math.random() - .5) * .4,
				r: 9 + Math.random() * 12,
				phase: Math.random() * Math.PI * 2,
				speed: .6 + Math.random() * 1.6,
				orbit: 20 + Math.random() * 60,
				spin: Math.random() < .5 ? -1 : 1
			});
		}
	}

	function frame(t) {
		if (!visible) { running = false; return; }
		ctx.clearRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'lighter';

		for (var i = 0; i < flies.length; i++) {
			var f = flies[i];

			if (finger) {
				var dx = finger.x - f.x;
				var dy = finger.y - f.y;
				var d = Math.sqrt(dx * dx + dy * dy) || 1;
				var pull = clamp((d - f.orbit) / 900, -.06, .06);
				f.vx += dx / d * pull * 3 + (-dy / d) * .05 * f.spin;
				f.vy += dy / d * pull * 3 + (dx / d) * .05 * f.spin;
			} else {
				f.vx += (Math.random() - .5) * .06;
				f.vy += (Math.random() - .5) * .06;
			}

			f.vx *= finger ? .94 : .985;
			f.vy *= finger ? .94 : .985;
			var max = finger ? 4.2 : .7;
			var sp = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
			if (sp > max) { f.vx *= max / sp; f.vy *= max / sp; }

			f.x += f.vx;
			f.y += f.vy;
			if (f.x < -20) f.x = W + 20; else if (f.x > W + 20) f.x = -20;
			if (f.y < H * .08) f.vy += .03; else if (f.y > H * .94) f.vy -= .03;

			var blink = .5 + .5 * Math.sin(t / 1000 * f.speed + f.phase);
			ctx.globalAlpha = .18 + .82 * blink * blink * blink;
			ctx.drawImage(sprite, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
		}

		ctx.globalAlpha = 1;
		requestAnimationFrame(frame);
	}

	function start() {
		if (running || !visible) return;
		running = true;
		requestAnimationFrame(frame);
	}

	function point(touchPoint) {
		var r = layers.getBoundingClientRect();
		finger = { x: touchPoint.clientX - r.left, y: touchPoint.clientY - r.top };
	}

	layers.addEventListener('touchstart', function (e) {
		clearTimeout(release);
		point(e.touches[0]);
	}, { passive: true });

	layers.addEventListener('touchmove', function (e) { point(e.touches[0]); }, { passive: true });

	layers.addEventListener('touchend', function () {
		clearTimeout(release);
		release = setTimeout(function () { finger = null; }, 1800);
	}, { passive: true });

	new IntersectionObserver(function (entries) {
		visible = entries[0].isIntersecting;
		start();
	}).observe(layers);

	window.addEventListener('resize', size);
	size();
	spawn();
	start();

	var saveData = navigator.connection && navigator.connection.saveData;
	if (saveData) return;

	var watch = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			var shot = entry.target;
			var vid = shot.querySelector('.work__alive');

			if (entry.intersectionRatio < .6) {
				if (vid) vid.pause();
				return;
			}

			if (!vid) {
				vid = document.createElement('video');
				vid.className = 'work__alive';
				vid.muted = true;
				vid.loop = true;
				vid.playsInline = true;
				vid.setAttribute('muted', '');
				vid.setAttribute('playsinline', '');
				vid.setAttribute('aria-hidden', 'true');
				vid.src = shot.getAttribute('data-shots').split('|').filter(function (s) { return /\.mp4$/.test(s); })[0];
				vid.addEventListener('playing', function () { shot.classList.add('is-alive'); });
				shot.appendChild(vid);
			}

			var playing = vid.play();
			if (playing && playing.catch) playing.catch(function () {});
		});
	}, { threshold: [0, .6] });

	var shots = document.querySelectorAll('.work__shot[data-shots]');
	for (var i = 0; i < shots.length; i++) {
		if (/\.mp4(\||$)/.test(shots[i].getAttribute('data-shots'))) watch.observe(shots[i]);
	}
})();
