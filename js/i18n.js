/* =============================================================================
   Три языка: английский по умолчанию, казахский и русский.

   Английский текст лежит прямо в разметке, поэтому страница читается и без
   скрипта, и поисковиком. Здесь только замены: элемент помечается data-t
   (текст), data-t-html (разметка внутри), data-t-alt (alt картинки) или
   data-t-label (aria-label). Ключи одинаковые во всех трёх словарях.

   Правила текста (проверяются сканерами unslop-text и avoid-ai-design):
   без длинных тире, без оборота «не X, а Y», без капса в подписях,
   обычными предложениями, только факты, которые можно проверить.

   Казахский текст нужно вычитать носителю перед публикацией.
   ========================================================================== */

(function () {
	'use strict';

	var T = {};

	/* ------------------------------------------------------------- English */

	T.en = {
		'nav.work': 'Work',
		'nav.about': 'About',
		'nav.contact': 'Contact',
		'meta.title': 'Arystan Alhanov, web designer and developer',
		'nav.sections': 'Sections',
		'nav.lang': 'Site language',

		'hero.name': 'Arystan Alhanov',
		'hero.lede': 'Web designer and developer from Pavlodar. Below are ten projects I built. Several of them run right on this page: open one and try it.',

		'works.title': 'Work',
		'works.hint.deck': 'Scroll to move through the projects or jump with the strip at the bottom. “Run here” opens a project live in a window.',
		'works.hint.flat': 'Client sites first, then internal tools and two scroll experiments.',
		'works.jump': 'Jump to a project',

		'work.stack': 'Built with',
		'run.here': 'Run here',
		'run.live': 'Running live',
		'run.newtab': 'Open in a new tab',
		'link.code': 'Code on GitHub',
		'note.prototype': 'Prototype for a client',
		'note.internal': 'Internal system, closed to the public',
		'note.personal': 'Personal tool',
		'note.client': 'Client project',
		'run.original': 'Run the 2025 original',
		'badge.concept': 'Concept',

		'shot.screens': 'screens',
		'shot.video': 'Video',
		'shot.open': 'Open the project screens',
		'box.prev': 'Previous screen',
		'box.next': 'Next screen',
		'box.close': 'Close',

		'w1.name': 'Medeu Hotel',
		'w1.kind': 'Hotel website, Kostanay',
		'w1.alt': 'First screen of the Medeu hotel website',
		'w1.text': 'Rooms, restaurant, banquet hall and concerts for a hotel in Kostanay. The site is plain HTML, CSS and JavaScript in three languages, with light and dark themes. The booking window adds up the stay while the guest fills it in and sends the total to the manager on WhatsApp. Metrica and GA4 track every visitor source through UTM tags, and the owner gets a report by email once a month. Prices and photos live in two files that he edits himself.',

		'w2.name': 'Sayahat',
		'w2.kind': 'Catalogue of a city market, Kostanay',
		'w2.alt': 'Catalogue page of the Sayahat market site',
		'w2.text': 'A directory of the shops at Sayahat market, with a page for every seller, dashboards for shop owners and an admin panel. People search in Kazakh and in Russian, so the search knows Kazakh word endings and synonyms across the two languages. Loose matches appear only when there are no exact ones, and fifty tests cover the engine. Built on Next.js with Postgres and Prisma, with JSON-LD markup for search engines. The logo came out of this project too.',

		'w3.name': 'Tikhiy Bereg',
		'w3.kind': 'Booking site for lakeside cabins near Rudny',
		'w3.alt': 'First screen of the lakeside cabins booking site',
		'w3.text': 'Guests pick their dates and see right away which cabins are free and what the stay costs, without calling anyone. Every date in the calendar shows its price. The site counts weekday and weekend rates separately, filters cabins by party size and works out the prepayment. One HTML file, two languages, a summer look and a winter look.',

		'w4.name': 'Tikhiy Bereg, lite',
		'w4.kind': 'The same resort, simpler version',
		'w4.alt': 'First screen of the cabins site with a request form',
		'w4.text': 'Same design and the same texts, with a request form in place of instant booking. The calendar shows how busy the resort is, the guest leaves a request and the manager confirms it. I made both versions so the client could see what the more expensive one adds.',

		'w5.name': 'EuroOil',
		'w5.kind': 'Fuel station network, Pavlodar region. Redesign concept',
		'w5.alt': 'Redesign concept for the EuroOil fuel network site',
		'w5.text': 'In 2025 I built seven pages for EuroOil: home, stations, services, offers and jobs, on Bootstrap, with my own language switcher over the translation widget. That layout has aged, so the picture shows a redesign concept. The first screen now opens with fuel prices, the nearest station and the loyalty card, which is what a driver comes for.',

		'w6.name': 'Quality control',
		'w6.kind': 'Workstation for a contact centre quality team',
		'w6.alt': 'Interface concept for the contact centre quality control workstation',
		'w6.text': 'A call scoring system for a contact centre with 175 operators in ten groups. I wrote the first version on Google Apps Script over spreadsheets. When it outgrew them, I rewrote it on Next.js and Postgres: fourteen tables, thirty-seven API handlers, scores and reports in SQL, salted passwords and protection against password guessing. The new version had to give exactly the same numbers as the old one, and 417 parity checks confirm that it does. The picture is an interface concept over the same data.',

		'w7.name': 'Developer Hub',
		'w7.kind': 'Desktop app for my own routine',
		'w7.alt': 'Developer Hub desktop app with its modules',
		'w7.text': 'A home for my Python scripts. I drop a folder into modules/ and it shows up in the sidebar. There are six so far: transcription (faster-whisper on my own machine, pyannote to tell the speakers apart, then a model reads the transcript), video compression, a document parser, a duplicate finder for music, an Excel importer and a chat client for OneAPI. The picture shows the next step on the roadmap: a form that builds itself from each module’s manifest.',

		'w8.name': 'Switch on & go',
		'w8.kind': 'One-page site for a hospitality consultant',
		'w8.alt': 'Switch on and go page, switched on',
		'w8.text': 'The client sent voice notes with a single request: the site should be a switch. While it is off, the page sits in cold grey metal. Flip it, and the page warms up and shows the offer and the contacts. Three hundred lines in one file, with no images.',

		'w9.name': 'Forest Vine',
		'w9.kind': 'Parallax experiment, 2023',
		'w9.alt': 'First screen of the Forest Vine parallax experiment',
		'w9.text': 'Three layers of forest move at different speeds. The scroll position goes into a CSS variable, and a plain CSS transition on the transform makes the movement soft. GSAP only smooths the page scroll. The forest at the top of this page comes from here.',

		'w10.name': '3D Scroll',
		'w10.kind': 'Depth experiment, 2023',
		'w10.alt': 'Gallery frames standing along the Z axis',
		'w10.text': 'A gallery that moves into the screen as you scroll. Frames stand along the Z axis and fly past the viewer. It runs on CSS perspective, preserve-3d and a few lines of arithmetic, with no library.',

		'about.title': 'About',
		'about.p1': 'I’m Arystan, a web designer and developer from Pavlodar. I take a site from the first sketch to a working page on a host, and I leave instructions for whoever looks after it next.',
		'about.p2': 'I trained as a software developer with a qualification in web design. For a year from September 2025 I also ran marketing for VESLA, a sushi delivery chain in five cities: ads on Meta, Google and Yandex, the Yandex Eda and Chocofood aggregators, iiko integrations, listings on 2GIS and the maps, and food cost across the whole menu.',
		'about.p3': 'That year changed how I start a project. My first questions are where visitors will come from and what they should manage to do on the page. On the hotel site this turned into UTM tags, counters, a monthly report and a booking form that shows the price right away.',
		'about.p4': 'Most projects go the same way. I learn what the client sells and who buys it, set up the grid, type and colours before writing code, build for the phone first, add the parts that move, connect analytics and hand the site over with a README and a short video for the people who will edit it.',

		'tools.title': 'Tools',
		'tools.design': 'Design and layout',
		'tools.design.list': 'HTML, CSS, SVG, responsive layout, typography, motion',
		'tools.front': 'Frontend',
		'tools.back': 'Data and backend',
		'tools.ship': 'Analytics and publishing',

		'contact.title': 'Write to me',
		'contact.text': 'I usually answer within a day. If your project looks like one of the above, say which one and we will get to the point faster.',
		'contact.email': 'Email',

		'footer.city': 'Pavlodar',
		'footer.note': 'The forest at the top is my parallax experiment from 2023.',
		'footer.top': 'Back to top'
	};

	/* -------------------------------------------------------------- Қазақша */

	T.kk = {
		'nav.work': 'Жұмыстар',
		'nav.about': 'Мен туралы',
		'nav.contact': 'Байланыс',
		'meta.title': 'Арыстан Алханов, веб-дизайнер және әзірлеуші',
		'nav.sections': 'Бөлімдер',
		'nav.lang': 'Сайт тілі',

		'hero.name': 'Арыстан Алханов',
		'hero.lede': 'Павлодарлық веб-дизайнер және әзірлеушімін. Төменде мен жасаған он жоба. Бірнешеуі дәл осы бетте жұмыс істейді: ашыңыз да, байқап көріңіз.',

		'works.title': 'Жұмыстар',
		'works.hint.deck': 'Жобаларды парақтау үшін айналдырыңыз немесе төмендегі жолақпен өтіңіз. «Іске қосу» жобаны терезеде тірідей ашады.',
		'works.hint.flat': 'Алдымен клиенттерге арналған сайттар, содан кейін ішкі құралдар мен айналдыру бойынша екі тәжірибе.',
		'works.jump': 'Жобаға өту',

		'work.stack': 'Технологиялар',
		'run.here': 'Іске қосу',
		'run.live': 'Тірідей жұмыс істеп тұр',
		'run.newtab': 'Жаңа бетте ашу',
		'link.code': 'GitHub-тағы код',
		'note.prototype': 'Клиентке арналған прототип',
		'note.internal': 'Ішкі жүйе, сыртқа жабық',
		'note.personal': 'Жеке құрал',
		'note.client': 'Клиент жобасы',
		'run.original': '2025 жылғы нұсқаны іске қосу',
		'badge.concept': 'Тұжырым',

		'shot.screens': 'экран',
		'shot.video': 'Бейне',
		'shot.open': 'Жоба экрандарын ашу',
		'box.prev': 'Алдыңғы экран',
		'box.next': 'Келесі экран',
		'box.close': 'Жабу',

		'w1.name': 'Medeu Hotel',
		'w1.kind': 'Қонақ үй кешенінің сайты, Қостанай',
		'w1.alt': 'Medeu қонақ үйі сайтының бірінші экраны',
		'w1.text': 'Қостанайдағы қонақ үйдің нөмірлері, мейрамханасы, банкет залы мен концерттері. Сайт таза HTML, CSS және JavaScript-те, үш тілде, ашық және қою тақырыппен. Брондау терезесі қонақ оны толтырып жатқанда бағаны санайды да, дайын соманы менеджерге WhatsApp арқылы жібереді. Метрика мен GA4 әр келушінің қайдан келгенін UTM белгілері бойынша көреді, иесі айына бір рет поштаға есеп алады. Бағалар мен фотолар екі файлда, оларды иесі өзі түзетеді.',

		'w2.name': 'Саяхат',
		'w2.kind': 'Қала базарының каталогы, Қостанай',
		'w2.alt': 'Саяхат базары сайтының каталог беті',
		'w2.text': '«Саяхат» базарындағы дүкендер витринасы: әр сатушының өз беті, иелерінің кабинеті және әкімші панелі бар. Адамдар қазақша да, орысша да іздейді, сондықтан іздеу қазақ жалғауларын және екі тіл арасындағы синонимдерді біледі. Дәл сәйкестік болмағанда ғана жуық нәтижелер шығады, қозғалтқышты елу тест тексереді. Next.js, Prisma арқылы Postgres, іздеу жүйелеріне арналған JSON-LD белгілері. Логотип те осы жобадан туды.',

		'w3.name': 'Тихий Берег',
		'w3.kind': 'Брондауы бар демалыс базасының сайты, Рудный маңы',
		'w3.alt': 'Брондауы бар демалыс базасы сайтының бірінші экраны',
		'w3.text': 'Қонақ күндерді таңдайды да, қай үй бос екенін және демалыс қанша тұратынын бірден көреді, ешкімге қоңырау шалудың қажеті жоқ. Күнтізбедегі әр күннің өз бағасы бар. Сайт жұмыс күндері мен демалыс күндерін бөлек санайды, үйлерді қонақ санына қарай іріктейді және алдын ала төлемді есептейді. Бір HTML файл, екі тіл, жазғы және қысқы безендіру.',

		'w4.name': 'Тихий Берег, лайт',
		'w4.kind': 'Сол демалыс базасы, қарапайым нұсқа',
		'w4.alt': 'Өтінім формасы бар демалыс базасы сайтының бірінші экраны',
		'w4.text': 'Дизайн да, мәтін де сол, тек жедел брондаудың орнында өтінім формасы. Күнтізбе базаның жүктемесін көрсетеді, қонақ өтінім қалдырады, әкімші оны растайды. Екі нұсқаны да тапсырыс беруші қымбатырағы не қосатынын көрсін деп жасадым.',

		'w5.name': 'EuroOil',
		'w5.kind': 'Жанармай құю станцияларының желісі, Павлодар облысы. Редизайн тұжырымы',
		'w5.alt': 'EuroOil жанармай желісі сайтының редизайн тұжырымы',
		'w5.text': '2025 жылы EuroOil үшін жеті бет жасадым: басты бет, мекенжайлар, қызметтер, акциялар және бос жұмыс орындары. Bootstrap-та, аударма виджетінің үстінен өзімнің тіл ауыстырғышыммен. Ол беттеме ескірді, сондықтан суретте редизайн тұжырымы. Бірінші экран енді жанармай бағасынан, ең жақын станциядан және клиент картасынан басталады, жүргізуші дәл соған келеді.',

		'w6.name': 'Сапа бақылауы',
		'w6.kind': 'Байланыс орталығының сапа бөліміне арналған АЖО',
		'w6.alt': 'Байланыс орталығының сапа бақылау АЖО интерфейсінің тұжырымы',
		'w6.text': 'Он топтағы 175 операторы бар байланыс орталығына арналған қоңырауларды бағалау жүйесі. Алғашқы нұсқасын кестелердің үстінен Google Apps Script-те өзім жаздым. Жүйе кестелерге сыймай қалғанда, оны Next.js пен Postgres-те қайта жаздым: он төрт кесте, отыз жеті API өңдеушісі, ұпайлар мен есептер SQL-де, тұзы бар парольдер және парольді іріктеп табудан қорғаныс. Жаңа нұсқа ескісімен дәл бірдей сандар беруі керек еді, мұны 417 паритет тексерісі растайды. Суретте сол деректердің үстіндегі интерфейс тұжырымы.',

		'w7.name': 'Developer Hub',
		'w7.kind': 'Күнделікті жұмысыма арналған жұмыс үстелі қосымшасы',
		'w7.alt': 'Модульдері бар Developer Hub жұмыс үстелі қосымшасы',
		'w7.text': 'Менің Python скрипттерімнің үйі. modules/ ішіне қалта салсам, ол бүйір мәзірде пайда болады. Әзірге алты модуль бар: транскрипция (faster-whisper компьютердің өзінде, сөйлеушілерді pyannote ажыратады, содан кейін мәтінді модель талдайды), бейнені сығу, құжаттарды талдағыш, музыкадағы қайталанымдарды іздеу, Excel-ге импорт және OneAPI чаты. Суретте келесі қадам: әр модульдің манифесінен өзі жиналатын форма.',

		'w8.name': 'Switch on & go',
		'w8.kind': 'Қонақжайлылық саласындағы кеңесшіге арналған бір беттік сайт',
		'w8.alt': 'Қосулы күйдегі Switch on and go беті',
		'w8.text': 'Тапсырыс беруші бір ғана талабы бар дауыстық хабарламалар жіберді: сайт ауыстырғыш болуы керек. Ол өшірулі тұрғанда бет суық сұр металда тұрады. Бір басқанда бет жылынып, ұсыныс пен байланыстарды көрсетеді. Бір файлда үш жүз жол, бірде-бір сурет жоқ.',

		'w9.name': 'Forest Vine',
		'w9.kind': 'Параллакс тәжірибесі, 2023',
		'w9.alt': 'Forest Vine параллакс тәжірибесінің бірінші экраны',
		'w9.text': 'Орманның үш қабаты әртүрлі жылдамдықпен жылжиды. Айналдыру орны CSS айнымалысына түседі, ал қозғалысқа жұмсақтықты трансформдағы қарапайым CSS transition береді. GSAP тек беттің айналуын тегістейді. Осы сайттың басындағы орман осы жерден алынған.',

		'w10.name': '3D Scroll',
		'w10.kind': 'Тереңдік тәжірибесі, 2023',
		'w10.alt': 'Z осі бойымен тұрған галерея кадрлары',
		'w10.text': 'Айналдырған сайын экранның ішіне кететін галерея. Кадрлар Z осінде тұрады да, көрерменнің жанынан ұшып өтеді. CSS perspective, preserve-3d және бірнеше жол арифметикамен жұмыс істейді, кітапханасыз.',

		'about.title': 'Мен туралы',
		'about.p1': 'Менің атым Арыстан, павлодарлық веб-дизайнер және әзірлеушімін. Сайтты алғашқы нобайдан хостингтегі жұмыс істейтін бетке дейін жеткіземін және оны әрі қарай жүргізетін адамға нұсқаулық қалдырамын.',
		'about.p2': 'Білімім бойынша веб-дизайнер біліктілігі бар бағдарламалық қамтамасыз ету әзірлеушісімін. 2025 жылдың қыркүйегінен бастап бір жыл бес қалада жұмыс істейтін VESLA суши жеткізу желісінің маркетингін жүргіздім: Meta, Google және Яндекстегі жарнама, Яндекс Еда мен Chocofood агрегаторлары, iiko интеграциялары, 2ГИС пен карталардағы карточкалар, бүкіл мәзір бойынша өзіндік құн.',
		'about.p3': 'Сол жыл жобаны неден бастайтынымды өзгертті. Алғашқы сұрақтарым: адамдар қайдан келеді және бетте не істеп үлгеруі керек. Қонақ үй сайтында бұдан UTM белгілері, санауыштар, ай сайынғы есеп және бағаны бірден көрсететін брондау формасы шықты.',
		'about.p4': 'Жобалардың көбі бір жолмен жүреді. Тапсырыс беруші не сататынын және кім сатып алатынын анықтаймын, кодқа дейін торды, қаріптерді және түстерді жинаймын, алдымен телефонға беттеймін, қозғалатын бөліктерді қосамын, аналитиканы қосамын және сайтты README мен оны түзететін адамдарға арналған қысқа бейнемен бірге тапсырамын.',

		'tools.title': 'Құралдар',
		'tools.design': 'Дизайн және беттеме',
		'tools.design.list': 'HTML, CSS, SVG, бейімделгіш беттеме, типографика, анимация',
		'tools.front': 'Фронтенд',
		'tools.back': 'Деректер және бэкенд',
		'tools.ship': 'Аналитика және жариялау',

		'contact.title': 'Маған жазыңыз',
		'contact.text': 'Әдетте бір күн ішінде жауап беремін. Жобаңыз жоғарыдағылардың біріне ұқсаса, қайсысы екенін айтыңыз, солай тезірек келісеміз.',
		'contact.email': 'Пошта',

		'footer.city': 'Павлодар',
		'footer.note': 'Беттің жоғарғы жағындағы орман 2023 жылғы параллакс тәжірибемнен алынған.',
		'footer.top': 'Жоғарыға'
	};

	/* -------------------------------------------------------------- Русский */

	T.ru = {
		'nav.work': 'Работы',
		'nav.about': 'Обо мне',
		'nav.contact': 'Контакты',
		'meta.title': 'Арыстан Алханов, веб-дизайнер и разработчик',
		'nav.sections': 'Разделы',
		'nav.lang': 'Язык сайта',

		'hero.name': 'Арыстан Алханов',
		'hero.lede': 'Веб-дизайнер и разработчик из Павлодара. Ниже десять проектов, которые я сделал. Несколько из них работают прямо на этой странице: откройте и попробуйте.',

		'works.title': 'Работы',
		'works.hint.deck': 'Прокручивайте, чтобы листать проекты, или переходите по полосе внизу. «Запустить» открывает проект вживую в окне.',
		'works.hint.flat': 'Сначала сайты для клиентов, потом внутренние инструменты и два эксперимента со скроллом.',
		'works.jump': 'Перейти к проекту',

		'work.stack': 'Сделано на',
		'run.here': 'Запустить',
		'run.live': 'Работает вживую',
		'run.newtab': 'Открыть в новой вкладке',
		'link.code': 'Код на GitHub',
		'note.prototype': 'Прототип для клиента',
		'note.internal': 'Внутренняя система, закрыта для внешних',
		'note.personal': 'Личный инструмент',
		'note.client': 'Проект клиента',
		'run.original': 'Запустить оригинал 2025 года',
		'badge.concept': 'Концепт',

		'shot.screens': 'экрана',
		'shot.video': 'Видео',
		'shot.open': 'Открыть экраны проекта',
		'box.prev': 'Предыдущий экран',
		'box.next': 'Следующий экран',
		'box.close': 'Закрыть',

		'w1.name': 'Medeu Hotel',
		'w1.kind': 'Сайт гостиничного комплекса, Костанай',
		'w1.alt': 'Первый экран сайта гостиничного комплекса Medeu',
		'w1.text': 'Номера, ресторан, банкетный зал и концерты отеля в Костанае. Сайт на чистых HTML, CSS и JavaScript, на трёх языках, со светлой и тёмной темой. Окно брони считает стоимость, пока гость его заполняет, и отправляет менеджеру в WhatsApp готовую сумму. Метрика и GA4 видят, откуда пришёл каждый посетитель, по UTM-меткам, раз в месяц владелец получает отчёт на почту. Цены и фотографии лежат в двух файлах, их он правит сам.',

		'w2.name': 'Саяхат',
		'w2.kind': 'Каталог городского рынка, Костанай',
		'w2.alt': 'Страница каталога сайта рынка «Саяхат»',
		'w2.text': 'Витрина магазинов рынка «Саяхат»: у каждого продавца своя страница, у владельцев кабинеты, есть админка. Люди ищут по-казахски и по-русски, поэтому поиск знает казахские окончания и синонимы между двумя языками. Неточные совпадения появляются, только когда нет точных, движок проверяют пятьдесят тестов. Next.js, Postgres через Prisma, микроразметка JSON-LD для поисковиков. Логотип родился в этом же проекте.',

		'w3.name': 'Тихий Берег',
		'w3.kind': 'Сайт базы отдыха с бронированием, под Рудным',
		'w3.alt': 'Первый экран сайта базы отдыха с бронированием',
		'w3.text': 'Гость выбирает даты и сразу видит, какие домики свободны и сколько стоит отдых, звонить никуда не нужно. У каждого числа в календаре своя цена. Сайт считает будни и выходные отдельно, подбирает домики по числу гостей и рассчитывает предоплату. Один HTML-файл, два языка, летнее и зимнее оформление.',

		'w4.name': 'Тихий Берег, лайт',
		'w4.kind': 'Та же база отдыха, простая версия',
		'w4.alt': 'Первый экран сайта базы отдыха с формой заявки',
		'w4.text': 'Тот же дизайн и те же тексты, только вместо мгновенной брони форма заявки. Календарь показывает загрузку базы, гость оставляет заявку, администратор её подтверждает. Обе версии я сделал, чтобы заказчик видел, что добавляет более дорогая.',

		'w5.name': 'EuroOil',
		'w5.kind': 'Сеть АЗС, Павлодарская область. Концепт редизайна',
		'w5.alt': 'Концепт редизайна сайта сети АЗС EuroOil',
		'w5.text': 'В 2025 году я сделал для EuroOil семь страниц: главная, адреса, услуги, акции и вакансии, на Bootstrap, со своим переключателем языков поверх виджета перевода. Эта вёрстка устарела, поэтому на снимке концепт редизайна. Первый экран теперь начинается с цен на топливо, ближайшей станции и карты клиента, за этим водитель и приходит.',

		'w6.name': 'Контроль качества',
		'w6.kind': 'АРМ отдела контроля качества контакт-центра',
		'w6.alt': 'Концепт интерфейса АРМ контроля качества контакт-центра',
		'w6.text': 'Система оценки звонков для контакт-центра на 175 операторов в десяти группах. Первую версию я написал на Google Apps Script поверх таблиц. Когда система из них выросла, я переписал её на Next.js и Postgres: четырнадцать таблиц, тридцать семь обработчиков API, баллы и отчёты на SQL, пароли с солью и защита от подбора. Новая версия должна была давать ровно те же цифры, что и старая, и это подтверждают 417 проверок паритета. На снимке концепт интерфейса поверх тех же данных.',

		'w7.name': 'Developer Hub',
		'w7.kind': 'Десктопное приложение для своей рутины',
		'w7.alt': 'Десктопное приложение Developer Hub с модулями',
		'w7.text': 'Дом для моих Python-скриптов. Кладу папку в modules/, и она появляется в боковом меню. Модулей пока шесть: транскрибация (faster-whisper прямо на компьютере, pyannote различает говорящих, затем модель разбирает расшифровку), сжатие видео, парсер документов, поиск дублей в музыке, импорт в Excel и чат с OneAPI. На снимке следующий шаг: форма, которая сама собирается из манифеста модуля.',

		'w8.name': 'Switch on & go',
		'w8.kind': 'Одностраничник для консультанта в гостеприимстве',
		'w8.alt': 'Страница Switch on and go во включённом состоянии',
		'w8.text': 'Заказчица прислала голосовые с одним требованием: сайт должен быть тумблером. Пока он выключен, страница стоит в холодном сером металле. Щелчок, и она теплеет и показывает оффер и контакты. Триста строк в одном файле, ни одной картинки.',

		'w9.name': 'Forest Vine',
		'w9.kind': 'Эксперимент с параллаксом, 2023',
		'w9.alt': 'Первый экран эксперимента с параллаксом Forest Vine',
		'w9.text': 'Три слоя леса едут с разной скоростью. Положение прокрутки уходит в CSS-переменную, а мягкость движению даёт обычный CSS-transition на трансформе. GSAP только сглаживает прокрутку страницы. Лес в начале этого сайта взят отсюда.',

		'w10.name': '3D Scroll',
		'w10.kind': 'Эксперимент с глубиной, 2023',
		'w10.alt': 'Кадры галереи на оси Z',
		'w10.text': 'Галерея, которая при прокрутке уходит в экран. Кадры стоят на оси Z и пролетают мимо зрителя. Работает на CSS perspective, preserve-3d и нескольких строках арифметики, без библиотек.',

		'about.title': 'Обо мне',
		'about.p1': 'Меня зовут Арыстан, я веб-дизайнер и разработчик из Павлодара. Довожу сайт от первого наброска до рабочей страницы на хостинге и оставляю инструкцию тому, кто будет вести его дальше.',
		'about.p2': 'По образованию я разработчик ПО с квалификацией веб-дизайнера. С сентября 2025 года год вёл маркетинг VESLA, сети доставки суши в пяти городах: реклама в Meta, Google и Яндексе, агрегаторы Яндекс Еда и Chocofood, интеграции с iiko, карточки в 2ГИС и на картах, себестоимость по всему меню.',
		'about.p3': 'Этот год поменял то, с чего я начинаю проект. Первые вопросы: откуда придут люди и что они должны успеть сделать на странице. На сайте отеля из этого выросли UTM-метки, счётчики, ежемесячный отчёт и форма брони, которая сразу показывает цену.',
		'about.p4': 'Большинство проектов идут одним путём. Разбираюсь, что продаёт заказчик и кто покупает, собираю сетку, шрифты и цвета до кода, верстаю сначала под телефон, добавляю то, что двигается, подключаю аналитику и отдаю сайт вместе с README и коротким видео для тех, кто будет его править.',

		'tools.title': 'Инструменты',
		'tools.design': 'Дизайн и вёрстка',
		'tools.design.list': 'HTML, CSS, SVG, адаптивная вёрстка, типографика, анимация',
		'tools.front': 'Фронтенд',
		'tools.back': 'Данные и бэкенд',
		'tools.ship': 'Аналитика и публикация',

		'contact.title': 'Напишите мне',
		'contact.text': 'Обычно отвечаю в течение дня. Если ваш проект похож на какой-то из тех, что выше, назовите его, так мы быстрее договоримся.',
		'contact.email': 'Почта',

		'footer.city': 'Павлодар',
		'footer.note': 'Лес вверху страницы взят из моего эксперимента с параллаксом 2023 года.',
		'footer.top': 'Наверх'
	};

	/* ------------------------------------------------------------- механика */

	var LANGS = ['ru', 'kk', 'en'];
	var BASE = 'ru';
	var STORE = 'alhanov.language';

	function pick(node, attr, key, lang) {
		var dict = T[lang] || T[BASE];
		var value = dict[key];
		if (value === undefined) value = T[BASE][key];
		if (value === undefined) return;

		if (attr === 'text') node.textContent = value;
		else if (attr === 'html') node.innerHTML = value;
		else node.setAttribute(attr, value);
	}

	function apply(lang, remember) {
		if (LANGS.indexOf(lang) < 0) lang = BASE;

		document.documentElement.lang = lang;
		if (T[lang]['meta.title']) document.title = T[lang]['meta.title'];

		var i, nodes;

		nodes = document.querySelectorAll('[data-t]');
		for (i = 0; i < nodes.length; i++) pick(nodes[i], 'text', nodes[i].getAttribute('data-t'), lang);

		nodes = document.querySelectorAll('[data-t-html]');
		for (i = 0; i < nodes.length; i++) pick(nodes[i], 'html', nodes[i].getAttribute('data-t-html'), lang);

		nodes = document.querySelectorAll('[data-t-alt]');
		for (i = 0; i < nodes.length; i++) pick(nodes[i], 'alt', nodes[i].getAttribute('data-t-alt'), lang);

		nodes = document.querySelectorAll('[data-t-label]');
		for (i = 0; i < nodes.length; i++) pick(nodes[i], 'aria-label', nodes[i].getAttribute('data-t-label'), lang);

		var buttons = document.querySelectorAll('#lang button');
		for (i = 0; i < buttons.length; i++) {
			var on = buttons[i].getAttribute('data-lang') === lang;
			buttons[i].classList.toggle('is-on', on);
			buttons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
		}

		/* запоминаем только то, что человек выбрал сам: иначе первый же заход
		   навсегда закрепил бы язык по умолчанию */
		if (remember) {
			try { window.localStorage.setItem(STORE, lang); } catch (e) { /* приватный режим */ }
		}

		document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
	}

	function saved() {
		try { return window.localStorage.getItem(STORE); } catch (e) { return null; }
	}

	/* Русский — язык по умолчанию. Автовыбор по языку браузера включается
	   заменой строки ниже на: apply(saved() || guess()); */
	function guess() {
		var nav = (navigator.language || BASE).slice(0, 2).toLowerCase();
		return LANGS.indexOf(nav) >= 0 ? nav : BASE;
	}

	window.I18N = { dict: T, langs: LANGS, apply: apply, guess: guess };

	document.addEventListener('DOMContentLoaded', function () {
		var box = document.getElementById('lang');
		if (box) {
			box.addEventListener('click', function (e) {
				var button = e.target.closest('button[data-lang]');
				if (button) apply(button.getAttribute('data-lang'), true);
			});
		}

		apply(saved() || BASE);
	});
})();
