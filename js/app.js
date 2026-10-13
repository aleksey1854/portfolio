/* =============================================================================
   Arystan Alhanov — портфолио

   • Первый экран — слоистый параллакс из собственного проекта «parallax»:
     позиция прокрутки уходит в CSS-переменную --scrollTop, мягкость даёт
     transition на трансформе.
   • Плавная прокрутка страницы — Lenis в официальной связке с GSAP
     ScrollTrigger (так её описывает документация Lenis).
   • Раздел «Работы» — стопка карточек (stacking cards) на ScrollTrigger:
     сцена закрепляется, каждая следующая карточка выезжает снизу,
     предыдущая уменьшается и темнеет. Схема — каноническое демо GSAP.

   Если библиотеки не загрузились, страница остаётся обычным списком.
   ========================================================================== */

(function () {
	'use strict';

	var root = document.documentElement;

	var clamp = function (v, min, max) {
		return v < min ? min : v > max ? max : v;
	};

	var pad = function (n) {
		return n < 10 ? '0' + n : String(n);
	};

	// подпись работы берём из заголовка карточки: он переводится вместе с сайтом
	var label = function (work) {
		var name = work.querySelector('.work__title [data-t]');
		return (name ? name.textContent : work.getAttribute('data-nav')) || '';
	};

	/* ---------------------------------------------------------------- узлы */

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

	/* ---------------------------------------------------- плавная прокрутка

	   Настройки повторяют рабочий портфолио-референс: длительность около
	   секунды, колесо чуть медленнее родного, на тач-устройствах — родная
	   прокрутка (syncTouch: false), иначе на телефоне она «плывёт». */

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

	/* ------------------------------------------- параллакс, шапка, контакты */

	var heroBottom = 0;
	var contactTop = 0;

	function measure() {
		heroBottom = hero ? hero.offsetHeight : 0;
		contactTop = contact ? contact.getBoundingClientRect().top + window.pageYOffset : 0;
	}

	function render() {
		var y = window.pageYOffset;

		// Пишем переменную только пока герой на экране: запись в :root
		// пересчитывает стили всего документа, ниже это лишняя работа.
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

	/* ------------------------------------------------------ стопка карточек */

	var stack = null;       // { timeline, duration } — пока режим включён
	var active = -1;

	function setActive(index) {
		if (index === active) return;
		active = index;

		// в стопке видна одна карточка — остальные с клавиатуры недоступны
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

	// переход к карточке: в стопке — к её месту на таймлайне, в списке — к ней самой
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

		// «/ 10» в счётчике считаем по карточкам — при добавлении работы править нечего
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

	// влезает ли каждая карточка в экран целиком (с учётом текущего языка)
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

		// Стопка только там, где карточка во весь экран помещается целиком.
		// Иначе — обычный список: на телефоне, на низких окнах, при reduced motion.
		mm.add('(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)', function () {
			section.classList.add('is-stacked');

			// страховка: если самая длинная карточка не помещается — остаёмся списком
			if (!fits()) {
				section.classList.remove('is-stacked');
				return;
			}

			cards.forEach(function (card, i) {
				gsap.set(card, { yPercent: i ? 100 : 0, zIndex: i + 1 });
			});

			// хвост в 0.35 даёт последней карточке постоять, прежде чем сцена отпустит
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

				// карточку, полностью закрытую следующей, не рисуем вовсе:
				// иначе под шестой каждый кадр отрисовываются все пять предыдущих
				if (i > 0) timeline.set(cards[i - 1], { visibility: 'hidden' }, i);
			});

			timeline.to({}, { duration: 0.35 });

			stack = { timeline: timeline, duration: duration };
			active = -1;
			setActive(0);

			// matchMedia сам откатит все set/to при выходе из условия — снимаем только своё
			return function () {
				section.classList.remove('is-stacked');
				stack = null;
				active = -1;
				cards.forEach(function (card) { card.inert = false; });
			};
		});
	}

	/* ---------------------------------------------------------------- запуск */

	buildNav();
	startLenis();
	buildStack();
	measure();
	render();

	window.addEventListener('scroll', onScroll, { passive: true });

	if (hasGsap) {
		// пин добавляет высоту странице — координаты контактов пересчитываем после него
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

	// смена языка: переводим подписи сцены и пересчитываем высоты в списке
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

	// высота окна меняет, влезает ли карточка, — проверяем заново после ресайза
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

	// размеры текста окончательные только после загрузки шрифтов
	if (hasGsap && document.fonts && document.fonts.ready) {
		document.fonts.ready.then(function () {
			buildStack();
			ScrollTrigger.refresh();
		});
	}

	// системная настройка «уменьшать движение» может поменяться на лету
	var onCalm = function () {
		if (calm.matches) stopLenis();
		else startLenis();
	};
	if (calm.addEventListener) calm.addEventListener('change', onCalm);
	else if (calm.addListener) calm.addListener(onCalm);
})();


/* =============================================================================
   Разворот: экраны, ролик или живой проект

   У снимка работы бывает два атрибута:
   • data-shots — дополнительные экраны и ролики через «|», клик по снимку
     открывает их по очереди (ролик всегда первым);
   • data-live — адрес проекта, кнопка «Запустить» открывает его вживую
     в окне поверх страницы. Если экранов нет, живой проект открывает
     и клик по снимку.
   ========================================================================== */

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

	/* -------------------------------------------- прокрутка на время окна */

	function lockScroll(on) {
		var lenis = window.siteLenis;

		if (lenis) {
			if (on) lenis.stop();
			else lenis.start();
			return;
		}

		// без Lenis — классическая заморозка body с возвратом на то же место
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

	// пока открыто окно, остальная страница не должна ловить фокус
	function veil(on) {
		['#topbar', 'main', 'footer'].forEach(function (sel) {
			var node = document.querySelector(sel);
			if (node) node.inert = on;
		});
	}

	/* ------------------------------------------------- подпись на снимке */

	function mark(shot) {
		var extra = (shot.getAttribute('data-shots') || '').split('|').filter(Boolean);
		var live = shot.getAttribute('data-live');
		if (!extra.length && !live) return;

		shot.setAttribute('role', 'button');
		shot.setAttribute('tabindex', '0');
		shot.setAttribute('aria-label', extra.length ? t('shot.open', 'Открыть экраны проекта') : t('run.here', 'Запустить'));

		if (!extra.length) return;

		var hint = shot.querySelector('.work__more');
		if (!hint) {
			hint = document.createElement('span');
			hint.className = 'work__more';
			hint.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg><i></i>';
			shot.appendChild(hint);
		}

		var hasVideo = extra.some(isVideo);

		// у ролика — треугольник, у набора экранов — стопка кадров
		hint.querySelector('svg').innerHTML = hasVideo
			? '<path d="M8 5.5v13l11-6.5-11-6.5" fill="currentColor" stroke="none"/>'
			: '<rect x="3" y="6" width="13" height="13" rx="1.5"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h10A1.5 1.5 0 0 1 21 4.5v10a1.5 1.5 0 0 1-1.5 1.5H18"/>';

		hint.querySelector('i').textContent = hasVideo
			? t('shot.video', 'Видео')
			: (extra.length + 1) + ' ' + t('shot.screens', 'экрана');
	}

	function markAll() {
		var list = document.querySelectorAll('.work__shot[data-shots], .work__shot[data-live]');
		for (var i = 0; i < list.length; i++) mark(list[i]);
	}

	/* ------------------------------------------------------- показ кадра */

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
			if (playing && playing.catch) playing.catch(function () { /* автозапуск может быть запрещён */ });
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

		// ролик показываем первым: движение убедительнее статики
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

		// живой проект выгружаем целиком: у него может играть звук и крутиться анимация
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

	/* --------------------------------------------------------------- события */

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
