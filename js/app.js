const EXTERNAL_ASSETS={"c4hero": "assets/backgrounds/c4hero.svg", "warehouse": "assets/backgrounds/warehouse.svg", "lab": "assets/backgrounds/lab.svg", "greenhouse": "assets/backgrounds/greenhouse.svg", "hunger": "assets/backgrounds/hunger.svg", "root": "assets/backgrounds/root.svg", "ritualist": "assets/backgrounds/ritualist.svg", "apartment": "assets/backgrounds/apartment.svg", "shop": "assets/backgrounds/shop.svg", "yard": "assets/backgrounds/yard.svg", "roof": "assets/backgrounds/roof.svg", "home": "assets/backgrounds/home.svg", "c2home": "assets/backgrounds/c2home.svg", "morven": "assets/characters/morven.svg", "liora": "assets/characters/liora.svg", "celeste": "assets/characters/celeste.svg", "eren": "assets/characters/eren.svg", "nika": "assets/characters/nika.svg", "selesta": "assets/characters/celeste.svg"};
const ART_V3_SCENES={
  c2home:"assets/art-v3/parents-home.webp",
  apartment:"assets/art-v3/parents-home.webp",
  shop:"assets/art-v3/alchemy-lab.webp",
  yard:"assets/art-v3/neighbor-yard.webp",
  c2alchemy:"assets/art-v3/alchemy-lab.webp",
  c4hero:"assets/art-v3/alchemy-lab.webp",
  warehouse:"assets/art-v3/neighbor-yard.webp",
  lab:"assets/art-v3/alchemy-lab.webp",
  greenhouse:"assets/art-v3/neighbor-yard.webp"
};
const ART_V3_PORTRAITS={
  morven:"assets/art-v3/morven.webp",
  liora:"assets/art-v3/liora.webp",
  celeste:"assets/art-v3/celeste.webp",
  selesta:"assets/art-v3/celeste.webp",
  nika:"assets/art-v3/nika.webp"
};

(function () {
  'use strict';

  const SAVE_KEY = 'magicRpgVerticalSliceV1.save';
  const BACKUP_KEY = 'magicRpgVerticalSliceV1.backup';
  const SAVE_VERSION = 7;
  const CONTENT_VERSION = 'vertical-slice-v1.2.2';

  const itemCatalog = {
    mother_medallion: { id:'mother_medallion', name:'Медальон матери', category:'key', categoryLabel:'Ключевой предмет', description:'Остался после событий «Пробуждения». На металле едва заметно дрожит магический след.', icon:'medallion' },
    shadow_page: { id:'shadow_page', name:'Страница о Теневом духе', category:'knowledge', categoryLabel:'Знание', description:'Первая запись Книги Теней, созданная после пробуждения силы героя.', icon:'page' },
    test_crystal: { id:'test_crystal', name:'Тестовый кристалл', category:'test', categoryLabel:'Технический предмет', description:'Нужен только для проверки инвентаря и сохранения. В сюжет не входит.', icon:'crystal' },
    cleansing_mixture: { id:'cleansing_mixture', name:'Очищающая смесь', category:'consumable', categoryLabel:'Расходник', description:'Смесь, приготовленная для безопасного Очищения Памятного плюща. Качество зависит от расследования и алхимии.', icon:'flask' },
    memorial_ivy_page: { id:'memorial_ivy_page', name:'Запись о Памятном плюще', category:'knowledge', categoryLabel:'Знание', description:'Плющ питается незавершёнными воспоминаниями. Его можно спасти Очищением, если сохранить хотя бы одну Корневую Связь.', icon:'page' },
    memorial_seed: { id:'memorial_seed', name:'Очищенное семя памяти', category:'key', categoryLabel:'Ключевой предмет', description:'Внутри семени хранится обрывок голоса матери. Оно спокойно только рядом с защитным контуром дома.', icon:'leaf' },
    greenhouse_plan: { id:'greenhouse_plan', name:'Проект домашней теплицы', category:'knowledge', categoryLabel:'Проект комнаты', description:'Набросок матери: защитное стекло, лунная почва и отдельный контур для растений, питающихся магией.', icon:'leaf' }
  };

  const companions = {
    morven: {
      id:'morven', name:'Морвен', subtitle:'Проклятый наставник', initials:'М', rarity:'Эпический', direction:'Дух', roles:'Контролёр · Исследователь', unlock:'Получен в главе 1', group:'story',
      active:'Хищное внимание — раскрывает намерение и отмечает скрытую Связь.', reaction:'Девять жизней — один раз принимает отрицательный эффект вместо героя.', passive:'Циничный совет — первый Поиск в миссии не тратит действие.', resonance:'Утерянная формула — раскрывает намерения и отменяет одно из них.'
    },
    liora: { id:'liora', name:'Лиора Вейн', subtitle:'Оперативник Первого Света', initials:'Л', rarity:'Эпическая', direction:'Свет', roles:'Защитник · Печати', unlock:'Откроется в уровне 3', group:'story' },
    celeste: { id:'celeste', name:'Селеста Роу', subtitle:'Городская алхимик', initials:'С', rarity:'Эпическая', direction:'Алхимия', roles:'Очиститель · Поддержка', unlock:'Откроется в уровне 4', group:'story' },
    eren: { id:'eren', name:'Эрен Кросс', subtitle:'Запретный маг', initials:'Э', rarity:'Эпический', direction:'Тьма', roles:'Покров · Риск', unlock:'Откроется в уровне 6', group:'story' },
    nika: { id:'nika', name:'Ника Моррис', subtitle:'Связь с обычным миром', initials:'Н', rarity:'Редкая', direction:'Мирской путь', roles:'Исследователь · Поддержка', unlock:'Откроется в уровне 7', group:'story' },
    asha: { id:'asha', name:'Аша Вейл', subtitle:'Дух-защитница', initials:'А', rarity:'Легендарная', direction:'Дух', roles:'Защитник · Поддержка', unlock:'Бесплатный договор новичка после уровня 2', group:'contract', note:'Демонстрационная боевая версия. Полный комплект способностей подключится позже.' },
    quiet_echo: { id:'quiet_echo', name:'Тихий отголосок', subtitle:'Дух-помощник', initials:'О', rarity:'Редкий', direction:'Дух', roles:'Поддержка', unlock:'Договор новичка', group:'contract', note:'Демонстрационная боевая версия.' },
    archive_scribe: { id:'archive_scribe', name:'Архивный писец', subtitle:'Помощник Ордена', initials:'П', rarity:'Редкий', direction:'Свет', roles:'Исследователь', unlock:'Договор новичка', group:'contract', note:'Демонстрационная боевая версия.' },
    trail_hound: { id:'trail_hound', name:'Следовой фамильяр', subtitle:'Магический помощник', initials:'Ф', rarity:'Редкий', direction:'Мирской путь', roles:'Исследователь · Контроль', unlock:'Договор новичка', group:'contract', note:'Демонстрационная боевая версия.' }
  };

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9.5 20v-6h5v6"/></svg>',
    cases: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 5h10l2 3v11H5V8l2-3Z"/><path d="M5 9h14M9 5V3h6v2"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
    companions: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M13 15c3.8-.7 6.3 1.2 7 5"/></svg>',
    journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z"/><path d="M7 20a2 2 0 0 1 0-4h12M9 8h6M9 11h5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.7-1.7l1-1.8-2.1-2.1-1.8 1a7 7 0 0 0-1.7-.7L11 2.5H8l-.6 2.1a7 7 0 0 0-1.7.7l-1.8-1-2.1 2.1 1 1.8a7 7 0 0 0-.7 1.7l-2.1.6v3l2.1.6c.2.6.4 1.2.7 1.7l-1 1.8 2.1 2.1 1.8-1c.5.3 1.1.5 1.7.7l.6 2.1h3l.6-2.1c.6-.2 1.2-.4 1.7-.7l1.8 1 2.1-2.1-1-1.8c.3-.5.5-1.1.7-1.7l2.1-.6Z" transform="translate(2 0) scale(.83)"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23V5.5Z"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M4 21c4-6 8-9 14-13"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="m12 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 5 7 7-7 7"/></svg>',
    medallion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3h8l-1 4a7 7 0 1 1-6 0L8 3Z"/><circle cx="12" cy="14" r="3"/><path d="m10 3 2 4 2-4"/></svg>',
    crystal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m12 2 6 6-2 12H8L6 8l6-6Z"/><path d="m6 8 6 4 6-4M12 12v8"/></svg>',
    page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2h9l4 4v16H6V2Z"/><path d="M15 2v5h4M9 11h7M9 15h7M9 19h4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>'
  };

  let save = null;
  let currentScreen = 'home';
  let inventoryFilter = 'all';
  let selectedHeroType = 'warlock';
  let modalOpen = false;

  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');
  const saveIndicator = document.getElementById('save-indicator');

  function nowIso() { return new Date().toISOString(); }

  function createChapter2State() {
    return {
      status:'available', stage:'intro', homeSeen:{ wreath:false, photo:false, phone:false, door:false },
      time:6, location:'apartment', clues:{ photo:false, soil:false, hairpin:false, dew:false }, investSeen:{},
      alchemy:{ order:[], temp:null, stopped:false, charge:null, quality:null, score:0 }, battle:null,
      ending:null, resolutionApplied:false, summon:{ claimed:false, results:[], echoes:0 }
    };
  }

  const chapter2Locations = {
    apartment:{ label:'Квартира', scene:'apartment', items:[
      { id:'dreamer', icon:'◉', name:'Спящая свидетельница', desc:'Повторяет слова женщины из общего сна.', cost:1, text:'Свидетельница шепчет: «Посади меня там, где меня забыли». На ладони остаётся зелёный след.' },
      { id:'photo', icon:'▧', name:'Семейная фотография', desc:'Рамка оплетена тонким корнем.', cost:1, clue:'photo', text:'Первая Корневая Связь: фотография удерживает образ матери героя.' }
    ]},
    shop:{ label:'Цветочная лавка', scene:'shop', items:[
      { id:'ledger', icon:'≡', name:'Журнал поставок', desc:'Последний заказ оформляла мать героя.', cost:1, text:'В журнале есть пометка: «Не давать укорениться в памяти владельца».' },
      { id:'soil', icon:'●', name:'Погребальная земля', desc:'Запах совпадает с землёй у побегов.', cost:1, clue:'soil', text:'Вторая Связь: земля с могилы. Она питает незавершённое прощание.' },
      { id:'dew', icon:'◌', name:'Лунная роса', desc:'Редкий ингредиент для мягкого Очищения.', cost:1, clue:'dew', optional:true, text:'Найден флакон чистой лунной росы. Она поможет сохранить семя.' }
    ]},
    yard:{ label:'Двор', scene:'yard', items:[
      { id:'witness', icon:'人', name:'Жилец у клумбы', desc:'Его тянет прикоснуться к корням.', cost:1, text:'Жилец узнаёт серебряную заколку под металлической решёткой.' },
      { id:'hairpin', icon:'✦', name:'Серебряная заколка', desc:'Под решёткой пульсирует третий корень.', cost:1, clue:'hairpin', text:'Третья Связь: заколка матери удерживает невыполненное обещание.' }
    ]}
  };

  const novicePull = [
    {id:'asha', stars:5}, {id:'quiet_echo', stars:3}, {id:'trail_hound', stars:3}, {id:'archive_scribe', stars:3},
    {id:'quiet_echo', stars:3}, {id:'trail_hound', stars:3}, {id:'archive_scribe', stars:3},
    {id:'quiet_echo', stars:3}, {id:'trail_hound', stars:3}, {id:'archive_scribe', stars:3}
  ];

  function createDefaultSave(heroType, heroName) {
    const now = nowIso();
    return {
      saveVersion: SAVE_VERSION,
      contentVersion: CONTENT_VERSION,
      revision: 1,
      createdAt: now,
      updatedAt: now,
      profile: {
        heroId: heroType,
        heroName: heroName || (heroType === 'witch' ? 'Александра' : 'Александр'),
        heroLevel: 2,
        heroXp: 0,
        heroXpToNext: 100,
        accountLevel: 2
      },
      currencies: { coins: 120, magicShards: 0 },
      progression: {
        currentScreen: 'home',
        activeQuestId: 'chapter_02_roots_of_memory',
        chapters: {
          chapter_01_awakening: { status: 'completed', progress: 100 },
          chapter_02_roots_of_memory: { status: 'available', progress: 0 },
          chapter_03_first_light: { status: 'locked', progress: 0 }
        }
      },
      story: {
        flags: { 'chapter_01.awakening_complete': true, 'chapter_01.morven_joined': true },
        decisions: {}
      },
      relationships: {
        morven: { trust: 2, label: 'Настороженное доверие' },
        liora: { trust: 0, label: 'Не знакомы' }
      },
      soul: { corruption: 0, scars: [] },
      companions: {
        owned: ['morven'],
        activeParty: ['morven', null],
        states: { morven: { level: 2, trust: 2, rank: 0 } }
      },
      inventory: { items: { mother_medallion: 1, shadow_page: 1 } },
      recipes: { known: [], mastery: {} },
      house: {
        rooms: {
          living_room: { unlocked: true, level: 1 },
          study: { unlocked: true, level: 1 },
          laboratory: { unlocked: false, level: 0 },
          greenhouse: { unlocked: false, level: 0 },
          ritual_hall: { unlocked: false, level: 0 },
          artifact_room: { unlocked: false, level: 0 }
        }
      },
      codex: { creatures: { shadow_spirit: { knowledge: 1, max: 3 } }, discoveries: ['shadow_spirit'] },
      tests: {
        saveMarks: 0,
        foundationQuest: { status: 'available', step: 0, rewardClaimed: false },
        morwenLine: 0
      },
      meta: createPart3Meta(),
      incidents: { bus_stop_flowers: createIncidentState('locked') },
      reputations: { order: { value: 0, label: 'Неизвестны Ордену' }, independence: 0 },
      chapter2: createChapter2State(),
      chapter3: createChapter3State(),
      settings: { sound: true, reducedMotion: false }
    };
  }

  function migrateSave(data) {
    if (!data || typeof data !== 'object') throw new Error('Сохранение не является объектом');
    data.profile ||= { heroId:'warlock', heroName:'Александр', heroLevel:2, heroXp:0, heroXpToNext:100, accountLevel:2 };
    data.currencies ||= { coins:120, magicShards:0 };
    data.progression ||= { currentScreen:'home', activeQuestId:'chapter_02_roots_of_memory', chapters:{} };
    data.progression.chapters ||= {};
    data.progression.chapters.chapter_01_awakening ||= { status:'completed', progress:100 };
    data.progression.chapters.chapter_02_roots_of_memory ||= { status:'available', progress:0 };
    data.progression.chapters.chapter_03_first_light ||= { status:'locked', progress:0 };
    data.story ||= { flags:{}, decisions:{} }; data.story.flags ||= {}; data.story.decisions ||= {};
    data.relationships ||= {}; data.relationships.morven ||= { trust:2, label:'Настороженное доверие' }; data.relationships.liora ||= { trust:0, label:'Не знакомы' };
    data.soul ||= { corruption:0, scars:[] }; data.soul.scars ||= [];
    data.companions ||= { owned:['morven'], activeParty:['morven',null], states:{} };
    data.companions.owned ||= ['morven']; data.companions.activeParty ||= ['morven',null]; data.companions.states ||= {};
    data.companions.states.morven ||= { level:2, trust:data.relationships.morven.trust, rank:0 };
    data.inventory ||= { items:{} }; data.inventory.items ||= {};
    data.recipes ||= { known:[], mastery:{} }; data.recipes.known ||= []; data.recipes.mastery ||= {};
    data.house ||= { rooms:{} }; data.house.rooms ||= {};
    for (const [id, unlocked] of Object.entries({living_room:true,study:true,laboratory:false,greenhouse:false,ritual_hall:false,artifact_room:false})) data.house.rooms[id] ||= { unlocked, level:unlocked?1:0 };
    data.codex ||= { creatures:{}, discoveries:[] }; data.codex.creatures ||= {}; data.codex.discoveries ||= [];
    data.tests ||= { saveMarks:0, foundationQuest:{status:'available',step:0,rewardClaimed:false}, morwenLine:0 };
    data.tests.foundationQuest ||= { status:'available', step:0, rewardClaimed:false };
    data.chapter2 ||= createChapter2State();
    const fresh=createChapter2State();
    for (const key of Object.keys(fresh)) if (data.chapter2[key] === undefined) data.chapter2[key]=fresh[key];
    data.chapter2.homeSeen={...fresh.homeSeen,...(data.chapter2.homeSeen||{})};
    data.chapter2.clues={...fresh.clues,...(data.chapter2.clues||{})};
    data.chapter2.alchemy={...fresh.alchemy,...(data.chapter2.alchemy||{})};
    data.chapter2.summon={...fresh.summon,...(data.chapter2.summon||{})};
    if (data.chapter2.battle) data.chapter2.battle=normalizeC2Battle(data.chapter2.battle);
    data.meta ||= createPart3Meta();
    const freshMeta=createPart3Meta();
    data.meta.heroMastery={...freshMeta.heroMastery,...(data.meta.heroMastery||{})};
    data.meta.incidentHistory=Array.isArray(data.meta.incidentHistory)?data.meta.incidentHistory:[];
    data.incidents ||= {};
    data.incidents.bus_stop_flowers=normalizeIncidentState(data.incidents.bus_stop_flowers || createIncidentState('locked'));
    ensurePart3Unlocks(data);
    data.reputations ||= { order:{value:0,label:'Неизвестны Ордену'}, independence:0 };
    data.reputations.order ||= {value:0,label:'Неизвестны Ордену'};
    if (typeof data.reputations.order.value!=='number') data.reputations.order.value=0;
    if (typeof data.reputations.independence!=='number') data.reputations.independence=0;
    data.chapter3=normalizeChapter3State(data.chapter3 || createChapter3State());
    ensurePart4Unlocks(data);
    data.settings ||= { sound:true, reducedMotion:false };
    data.contentVersion=CONTENT_VERSION; data.saveVersion=SAVE_VERSION;
    return data;
  }

  function readSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const migrated=migrateSave(JSON.parse(raw));
      localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));
      return migrated;
    } catch (error) {
      console.warn('Основное сохранение повреждено, пробуем резервное.', error);
      const backup = localStorage.getItem(BACKUP_KEY);
      if (!backup) return null;
      try {
        const restored = migrateSave(JSON.parse(backup));
        localStorage.setItem(SAVE_KEY, JSON.stringify(restored));
        toast('Основное сохранение восстановлено из резервной копии.');
        return restored;
      } catch (backupError) {
        console.error('Резервная копия тоже повреждена.', backupError);
        return null;
      }
    }
  }

  function saveGame(message, rerender = true) {
    if (!save) return;
    const existing = localStorage.getItem(SAVE_KEY);
    if (existing) localStorage.setItem(BACKUP_KEY, existing);
    save.revision = (save.revision || 0) + 1;
    save.updatedAt = nowIso();
    save.progression.currentScreen = currentScreen;
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    flashSaveIndicator();
    if (message) toast(message);
    if (rerender) renderGame();
  }

  function formatDate(iso) {
    if (!iso) return 'нет данных';
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function toast(message) {
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    // В бою сообщения приходят часто. Оставляем только последнее, чтобы уведомления
    // не складывались стеной поверх кнопок и ритуальной цели.
    toastRoot.replaceChildren(node);
    setTimeout(() => { if (node.isConnected) node.remove(); }, 2300);
  }

  let saveIndicatorTimer;
  function flashSaveIndicator() {
    clearTimeout(saveIndicatorTimer);
    saveIndicator.textContent = 'Прогресс сохранён';
    saveIndicator.classList.add('visible');
    saveIndicatorTimer = setTimeout(() => saveIndicator.classList.remove('visible'), 1500);
  }

  function renderStart() {
    const existing = readSave();
    const preview = existing ? `
      <div class="save-preview">
        <strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong>
        <span>Последнее сохранение: ${formatDate(existing.updatedAt)} · ревизия ${existing.revision}</span>
      </div>` : '';

    app.innerHTML = `
      <section class="start-screen">
        <div class="brand-kicker">Magic RPG · vertical slice</div>
        <div class="start-copy">
          <h1 class="start-title">Дом между<br>мирами</h1>
          <p class="start-subtitle">Связанная сборка с домом, главой «Корни памяти» и жизнью между делами: Книга Теней, лаборатория, отряд, развитие героя и повторяемое происшествие.</p>
          <div class="start-actions">
            ${preview}
            ${existing ? '<button class="primary-button" data-action="continue-game">Продолжить</button>' : ''}
            <button class="${existing ? 'secondary-button' : 'primary-button'}" data-action="new-game">${existing ? 'Начать заново' : 'Создать сохранение'}</button>
          </div>
          <div class="version-line">Часть 3 · «Жизнь между делами» · ${CONTENT_VERSION}</div>
        </div>
      </section>`;
  }

  function showNewGameModal() {
    selectedHeroType = 'warlock';
    openModal(`
      <div class="modal-header">
        <div><div class="eyebrow">Новое сохранение</div><h2>Выберите героя</h2></div>
        <button class="modal-close" data-action="close-modal" aria-label="Закрыть">${icons.close}</button>
      </div>
      <div class="modal-body">
        <p>Механика одинакова. Сейчас выбор влияет на обращение и знак героя; внешность добавим позднее.</p>
        <div class="choice-grid">
          <button class="hero-choice active" data-action="choose-hero" data-hero="warlock"><strong>Колдун</strong><span>Мужской готовый образ</span></button>
          <button class="hero-choice" data-action="choose-hero" data-hero="witch"><strong>Ведьма</strong><span>Женский готовый образ</span></button>
        </div>
        <label class="eyebrow" style="display:block;margin-top:16px">Имя героя</label>
        <input id="hero-name-input" class="text-input" maxlength="24" value="Александр" autocomplete="off">
        <div class="modal-actions"><button class="primary-button" data-action="create-save">Начать после «Пробуждения»</button></div>
      </div>`);
  }

  function renderGame() {
    if (!save) { renderStart(); return; }
    currentScreen = currentScreen || save.progression.currentScreen || 'home';
    if (currentScreen === 'chapter2') { renderChapter2(); return; }
    app.innerHTML = `
      <div class="game-shell">
        ${renderTopbar()}
        <main id="screen-content">${renderScreen()}</main>
        ${renderBottomNav()}
      </div>`;
  }

  function renderTopbar() {
    const initial = escapeHtml(save.profile.heroName.trim().charAt(0).toUpperCase() || 'Г');
    return `
      <header class="topbar">
        <div class="hero-summary">
          <div class="hero-sigil">${initial}</div>
          <div class="hero-meta"><strong>${escapeHtml(save.profile.heroName)}</strong><small>Герой · уровень ${save.profile.heroLevel}</small></div>
        </div>
        <div class="topbar-right">
          <div class="currency-pill" title="Монеты"><i class="currency-dot"></i>${save.currencies.coins}</div>
          <button class="icon-button" data-action="open-debug" aria-label="Техническая панель">${icons.gear}</button>
        </div>
      </header>`;
  }

  function renderBottomNav() {
    const items = [
      ['home', 'Дом', icons.home], ['cases', 'Дела', icons.cases], ['inventory', 'Сумка', icons.bag],
      ['companions', 'Спутники', icons.companions], ['journal', 'Журнал', icons.journal]
    ];
    return `<nav class="bottom-nav" aria-label="Основная навигация">${items.map(([id,label,icon]) => `
      <button class="nav-button ${currentScreen === id ? 'active' : ''}" data-action="navigate" data-screen="${id}">${icon}<span>${label}</span></button>`).join('')}</nav>`;
  }

  function renderScreen() {
    switch (currentScreen) {
      case 'cases': return renderCases();
      case 'inventory': return renderInventory();
      case 'companions': return renderCompanions();
      case 'journal': return renderJournal();
      default: return renderHome();
    }
  }

  function morwenText() {
    const completed=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';
    const lines=completed ? [
      'Лиора Вейн стоит за защитным контуром уже третью минуту. Это либо вежливость, либо угроза.',
      'Плющ записан в Книгу. Семя тоже записано — хотя некоторые решения я бы предпочёл не документировать.',
      'Следующая гостья знала твоих родителей. Постарайся не доверять ей раньше, чем она закончит представляться.'
    ] : [
      'Похоронные цветы обычно не пытаются открыть дверь. Обычно.',
      'В соседнем доме людям снится одна и та же женщина. Совпадение, конечно. Очень зелёное совпадение.',
      'Дело уже ждёт на доске. И да — теперь оно сохранится, даже если ты закроешь игру.'
    ];
    return lines[save.tests.morwenLine % lines.length];
  }

  function renderHome() {
    const c2=save.chapter2; const chapterStatus=save.progression.chapters.chapter_02_roots_of_memory.status;
    const complete=chapterStatus==='completed'; const inProgress=chapterStatus==='in_progress'||c2.status==='in_progress'||c2.status==='resolved';
    const progress=complete?100:chapter2Progress();
    const unlockedRooms=Object.values(save.house.rooms).filter(r=>r.unlocked).length;
    const greenhouseProject=!!save.house.rooms.greenhouse.projectUnlocked;
    return `<section class="screen">
      <div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>${complete?'После Очищения':'Гостиная под защитным контуром'}</h1><p>${complete?'Книга Теней обновлена. У порога появилась новая гостья.':'Из закрытой комнаты тянется запах сырой земли.'}</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div>
      <div class="section-title"><h2>Текущая задача</h2><span>Сюжет</span></div>
      <article class="card quest-card"><div class="quest-head"><div><span class="tag violet">${complete?'Уровень 3':'Уровень 2'}</span><h3>${complete?'Первый Свет':'Корни памяти'}</h3></div><span class="tag ${complete?'amber':'green'}">${complete?'Скоро':inProgress?'В процессе':'Доступно'}</span></div>
        <p>${complete?'Лиора Вейн пришла по следу всплеска Искры. Уровень 3 подключится в следующей части.':'Похоронные цветы проросли через чужие воспоминания. Найдите Корневые Связи и подготовьте Очищение.'}</p>
        <div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div class="progress-caption"><span>${complete?'Глава 2 завершена':inProgress?'Автосохранение активно':'Не начато'}</span><span>${progress}%</span></div></div>
        <div class="card-actions">${complete?'<button class="secondary-button" data-action="chapter3-info">Кто такая Лиора?</button>':`<button class="primary-button" data-action="start-chapter2">${inProgress?'Продолжить главу':'Начать главу'}</button>`}</div></article>
      <div class="section-title"><h2>Комнаты</h2><span>${unlockedRooms} из 6 открыто</span></div>
      <div class="room-grid">${roomCard('living_room','Гостиная','Разговоры и события дома',icons.home,true)}${roomCard('study','Кабинет','Книга Теней и задачи',icons.book,true)}${roomCard('laboratory','Лаборатория','Алхимия и рецепты',icons.flask,save.house.rooms.laboratory.unlocked)}${roomCard('greenhouse','Теплица',greenhouseProject?'Проект получен; строительство позже':'Редкие растения и заказы',icons.leaf,save.house.rooms.greenhouse.unlocked)}${roomCard('ritual_hall','Ритуальный зал','Печати и сложные ритуалы',icons.circle,false)}${roomCard('artifact_room','Комната артефактов','Хранение и настройка реликвий',icons.crystal,false)}</div>
      <div class="section-title"><h2>Проверка сохранения</h2><span>Технический тест</span></div><article class="card save-test"><div><strong>Сюжет теперь сохраняется на каждом шаге</strong><p>Можно закрыть игру в расследовании, алхимии или бою и продолжить позже.</p><button class="small-button" style="margin-top:10px" data-action="add-save-mark">Добавить отметку</button></div><div class="test-number">${save.tests.saveMarks}</div></article>
    </section>`;
  }

  function roomCard(id, name, description, icon, unlocked) {
    return `<button class="card room-card ${unlocked ? '' : 'locked'}" data-action="open-room" data-room="${id}">
      <span class="room-icon">${icon}</span>${unlocked ? '' : `<span class="lock-mark">${icons.lock}</span>`}<h3>${name}</h3><p>${description}</p></button>`;
  }

  function renderCases() {
    const c2=save.chapter2; const status=save.progression.chapters.chapter_02_roots_of_memory.status;
    const complete=status==='completed'; const inProgress=status==='in_progress'||c2.status==='in_progress'||c2.status==='resolved';
    const q=save.tests.foundationQuest; const step=q.step||0;
    const statusLabel=q.status==='completed'?'Завершено':q.status==='in_progress'?'В процессе':'Тест';
    const nextLabel=q.status==='available'?'Принять проверку':q.status==='completed'?'Проверка завершена':step===1?'Осмотреть контур':'Закрыть проверку';
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Доска дел</div><h1>Доступные дела</h1><p>Сюжетные главы и повторяемые происшествия.</p></div></div>
      <article class="card case-card"><span class="tag ${complete?'green':'violet'}">Главная история · уровень 2</span><h3>Корни памяти</h3><p>Одержимое растение прорастает через чужие воспоминания. Расследование, очищающая смесь, Памятный плющ и решение судьбы семени.</p>
      <ul class="requirement-list"><li><span class="check-dot">✓</span>Глава 1 завершена</li><li><span class="check-dot">✓</span>Морвен в отряде</li><li><span class="check-dot">✓</span>Первое прохождение бесплатно</li></ul>
      <div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${complete?100:chapter2Progress()}%"></div></div><div class="progress-caption"><span>${complete?'Завершено':inProgress?'В процессе':'Доступно'}</span><span>${complete?100:chapter2Progress()}%</span></div></div>
      <div class="card-actions"><button class="${complete?'secondary-button':'primary-button'}" data-action="start-chapter2">${complete?'Посмотреть итоги':'Запустить дело'}</button></div></article>
      ${complete?`<article class="card case-card"><span class="tag amber">Главная история · уровень 3</span><h3>Первый Свет</h3><p>Лиора Вейн пришла в дом. Глава доступна в этой связанной сборке.</p><div class="card-actions"><button class="secondary-button" data-action="chapter3-info">Открыть главу</button></div></article>`:''}
      <div class="section-title"><h2>Проверка квестового прогресса</h2><span>Не является сюжетом</span></div>
      <article class="card case-card"><span class="tag ${q.status==='completed'?'green':'amber'}">${statusLabel}</span><h3>Проверка защитного контура</h3><p>Старая техническая цепочка сохранена для проверки данных.</p><div class="test-quest-steps"><div class="test-step ${step>=1?'done':''}"><span class="step-index">1</span>Принять дело</div><div class="test-step ${step>=2?'done':''}"><span class="step-index">2</span>Осмотреть контур</div><div class="test-step ${step>=3?'done':''}"><span class="step-index">3</span>Получить 10 монет</div></div><div class="card-actions"><button class="${q.status==='completed'?'secondary-button':'primary-button'}" data-action="advance-test-quest" ${q.status==='completed'?'disabled':''}>${nextLabel}</button></div></article>
    </section>`;
  }

  function renderInventory() {
    const entries = Object.entries(save.inventory.items).filter(([id, count]) => count > 0 && itemCatalog[id]).map(([id,count]) => ({ ...itemCatalog[id], count }));
    const filtered = inventoryFilter === 'all' ? entries : entries.filter(item => item.category === inventoryFilter);
    return `
      <section class="screen">
        <div class="screen-header"><div><div class="eyebrow">Инвентарь</div><h1>Сумка героя</h1><p>Предметы сохраняются между сессиями.</p></div><span class="tag violet">${entries.reduce((sum,i)=>sum+i.count,0)} предмета</span></div>
        <div class="filter-row">${[['all','Все'],['key','Ключевые'],['consumable','Расходники'],['knowledge','Знания'],['test','Технические']].map(([id,label])=>`<button class="filter-chip ${inventoryFilter===id?'active':''}" data-action="filter-inventory" data-filter="${id}">${label}</button>`).join('')}</div>
        ${filtered.length ? `<div class="inventory-grid">${filtered.map(item => `
          <button class="card item-card" data-action="item-details" data-item="${item.id}"><span class="item-count">${item.count}</span><div class="item-art">${icons[item.icon]}</div><h3>${item.name}</h3><p>${item.categoryLabel}</p></button>`).join('')}</div>` : `
          <div class="card empty-state">${icons.bag}<h3>Здесь пока пусто</h3><p>Предметы этой категории появятся после расследований или через техническую панель.</p></div>`}
      </section>`;
  }

  function renderCompanions() {
    const owned=new Set(save.companions.owned); const party=save.companions.activeParty||['morven',null];
    const second=party[1]&&companions[party[1]];
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Коллекция</div><h1>Спутники</h1><p>Герой остаётся центром отряда.</p></div><span class="tag violet">${owned.size} / ${Object.keys(companions).length}</span></div>
      <div class="section-title" style="margin-top:0"><h2>Текущий отряд</h2><span>Герой + 2 спутника</span></div><div class="party-strip"><div class="party-slot"><div class="party-avatar">${escapeHtml(save.profile.heroName.charAt(0))}</div><strong>${escapeHtml(save.profile.heroName)}</strong><small>Главный герой</small></div><div class="party-slot"><div class="party-avatar">М</div><strong>Морвен</strong><small>Активен</small></div>${second?`<div class="party-slot"><div class="party-avatar">${second.initials}</div><strong>${second.name}</strong><small>Активен</small></div>`:'<button class="party-slot empty" data-action="empty-party-slot"><div class="party-avatar">+</div><strong>Пустой слот</strong><small>Выберите спутника</small></button>'}</div>
      <div class="section-title"><h2>Сюжетные спутники</h2><span>Выдаются бесплатно</span></div><div class="companion-list">${Object.values(companions).filter(c=>c.group==='story').map(c=>companionCard(c,owned.has(c.id))).join('')}</div>
      <div class="section-title"><h2>Договорные спутники</h2><span>Коллекция</span></div><div class="companion-list">${Object.values(companions).filter(c=>c.group==='contract').map(c=>companionCard(c,owned.has(c.id))).join('')}</div>
    </section>`;
  }

  function companionCard(c,isOwned) {
    const trust=c.id==='morven'?save.relationships.morven.trust:null;
    return `<button class="card companion-card ${isOwned?'':'locked'}" data-action="companion-details" data-companion="${c.id}"><div class="companion-portrait">${c.initials}</div><div><h3>${c.name}</h3><p>${c.subtitle}<br>${c.roles}</p>${isOwned?`<div class="trust-line"><span class="faint" style="font-size:9px">${trust!==null?`Доверие ${trust}/10`:'Получен'}</span><span class="trust-meter"><i style="width:${trust!==null?trust*10:100}%"></i></span></div>`:`<div class="trust-line"><span class="faint" style="font-size:9px">${c.unlock}</span></div>`}</div><span class="chevron">${icons.chevron}</span></button>`;
  }

  function renderJournal() {
    const testQuest=save.tests.foundationQuest; const complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';
    const decision=save.story.decisions['chapter_02.seed_fate'];
    const decisionText={save:'Очищенное семя сохранено дома.',destroy:'Семя уничтожено Искрой.',morven:'Семя передано Морвену.'}[decision]||'Решение ещё не принято.';
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Журнал</div><h1>История героя</h1><p>Главы, решения и состояние мира.</p></div></div><div class="timeline">
      <article class="card chapter-row completed"><span class="chapter-dot"></span><span class="tag green">Завершено</span><h3>Уровень 1 · Пробуждение</h3><p>Телекинез пробудился. Морвен заговорил. Кабинет и Книга Теней открыты.</p></article>
      <article class="card chapter-row ${complete?'completed':'active'}"><span class="chapter-dot"></span><span class="tag ${complete?'green':'violet'}">${complete?'Завершено':'Текущая глава'}</span><h3>Уровень 2 · Корни памяти</h3><p>${complete?decisionText:'Расследование Памятного плюща ещё не завершено.'}</p></article>
      <article class="card chapter-row ${complete?'active':''}"><span class="chapter-dot"></span><span class="tag ${complete?'violet':''}">${complete?'Следующая глава':'Закрыто'}</span><h3>Уровень 3 · Первый Свет</h3><p>${complete?'Лиора Вейн пришла в дом.':'Откроется после завершения уровня 2.'}</p></article></div>
      ${complete?`<div class="section-title"><h2>Результаты главы 2</h2><span>Сюжетные флаги</span></div><div class="card status-list"><div class="status-row"><span>Судьба семени</span><span>${decisionText}</span></div><div class="status-row"><span>Качество смеси</span><span>${qualityLabel(save.story.flags['chapter_02.potion_quality'])}</span></div><div class="status-row"><span>Лунная роса</span><span>${save.story.flags['chapter_02.rare_dew']?'найдена':'не найдена'}</span></div><div class="status-row"><span>Свидетель</span><span>${save.story.flags['chapter_02.witness_saved']?'спасён':'нет данных'}</span></div></div>`:''}
      <div class="section-title"><h2>Состояние героя</h2><span>Сохраняется</span></div><div class="stats-grid"><div class="card stat-card"><strong>${save.soul.corruption}</strong><span>Скверна</span></div><div class="card stat-card"><strong>${save.soul.scars.length}</strong><span>Шрамы души</span></div><div class="card stat-card"><strong>${save.companions.owned.length}</strong><span>Спутников</span></div><div class="card stat-card"><strong>${Object.values(save.house.rooms).filter(r=>r.unlocked).length}</strong><span>Комнат</span></div></div>
      <div class="section-title"><h2>Техническое состояние</h2><span>Для проверки</span></div><div class="card status-list"><div class="status-row"><span>Автосохранение</span><span>после каждого действия</span></div><div class="status-row"><span>Последняя запись</span><span>${formatDate(save.updatedAt)}</span></div><div class="status-row"><span>Ревизия</span><span>${save.revision}</span></div><div class="status-row"><span>Тестовое дело</span><span>${testQuest.status==='completed'?'завершено':testQuest.status==='in_progress'?`этап ${testQuest.step} из 3`:'не начато'}</span></div><div class="status-row"><span>Версия данных</span><span>save v${save.saveVersion}</span></div></div>
    </section>`;
  }

  function qualityLabel(q) { return ({excellent:'Безупречная',basic:'Стабильная',unstable:'Нестабильная'})[q]||'не готова'; }

  function chapter2Progress() {
    const c=save.chapter2;
    const map={intro:0,home:8,investigation:25,alchemy:45,alchemy_result:55,battle:65,choice:82,return:90,summon:95,summary:100};
    if (save.progression.chapters.chapter_02_roots_of_memory.status==='completed') return 100;
    return map[c.stage]||0;
  }

  function chapter2Save(message) {
    save.chapter2.status=save.chapter2.status==='available'?'in_progress':save.chapter2.status;
    save.progression.chapters.chapter_02_roots_of_memory.status='in_progress';
    save.progression.chapters.chapter_02_roots_of_memory.progress=chapter2Progress();
    currentScreen='chapter2'; saveGame(message);
  }

  function chapter2Top(title, subtitle, hud='') {
    return `<header class="c2-top"><button class="c2-back" data-action="chapter2-pause" aria-label="Вернуться в дом">‹</button><div><div class="eyebrow">Глава 2 · Корни памяти</div><h1>${title}</h1><small>${subtitle}</small></div><div class="c2-hud">${hud}</div></header>`;
  }

  function chapter2Shell(title, subtitle, body, footer='', hud='') {
    app.innerHTML=`<div class="c2-shell">${chapter2Top(title,subtitle,hud)}<main class="c2-main">${body}</main>${footer?`<footer class="c2-footer">${footer}</footer>`:''}</div>`;
  }

  function renderChapter2() {
    const c=save.chapter2;
    if (save.progression.chapters.chapter_02_roots_of_memory.status==='completed' && c.stage!=='summary') c.stage='summary';
    ({intro:renderC2Intro,home:renderC2Home,investigation:renderC2Investigation,alchemy:renderC2Alchemy,alchemy_result:renderC2AlchemyResult,battle:renderC2Battle,choice:renderC2Choice,return:renderC2Return,summon:renderC2Summon,summary:renderC2Summary}[c.stage]||renderC2Intro)();
  }

  function renderC2Intro() {
    chapter2Shell('Корни памяти','Утро после первого Изгнания',`<section class="c2-intro"><div class="c2-moon">☾</div><div class="eyebrow">Сюжетная глава</div><h2>Цветы помнят то, что люди пытаются забыть</h2><p>В закрытой комнате дома прорастают цветы из похоронного венка, а жильцам соседнего дома снится одна и та же женщина.</p><div class="c2-brief"><div><b>Расследование</b><span>Найдите три Корневые Связи</span></div><div><b>Подготовка</b><span>Приготовьте очищающую смесь</span></div><div><b>Ритуальная победа</b><span>Спасите свидетеля и само существо</span></div></div><div class="c2-save-note">Игра автоматически сохранится после каждого нажатия.</div></section>`,`<button class="primary-button" data-action="chapter2-begin">Начать главу</button>`);
  }

  function c2DirectSceneArt(scene){
    const key=scene==='apartment'?'apartment':scene==='shop'?'shop':scene==='yard'?'yard':'c2home';
    const src=EXTERNAL_ASSETS[key];
    return src?`<div class="direct-art-bg"><img src="${src}" alt="" loading="eager"></div>`:'';
  }

  function renderC2Home() {
    const c=save.chapter2, h=c.homeSeen; const done=Object.values(h).filter(Boolean).length; const ready=h.wreath&&h.phone&&h.door;
    const text=!h.wreath?'Из-за двери тянется запах сырой земли.':!h.phone?'Лунные цветы раскрываются без света. На телефоне мигает сообщение Ники.':!h.door?'Замок покрыт зелёными прожилками. За дверью что-то царапает дерево изнутри.':'Телекинез срывает заражённую защёлку. В комнате шевелятся побеги из похоронного венка.';
    chapter2Shell('Дом родителей','Осмотрите источник аномалии',`<div class="c2-scene-layout"><section class="c2-visual c2-room direct-art-block c2-home-hero">${c2DirectSceneArt('c2home')}<div class="c2-scene-label">Кабинет</div><div class="c2-home-copy"><div class="eyebrow">Visible Art Pass v1.4.2</div><h3>Кабинет семьи Вейн</h3><p>Новый прямой арт встроен в сам экран. Цветы из венка, телефон Ники и дверь отмечены поверх атмосферной сцены.</p></div>
      ${[['wreath','✿','12%','68%'],['photo','▧','43%','26%'],['phone','▣','72%','23%'],['door','✦','53%','64%']].map(([key,icon,left,top])=>`<button class="c2-hotspot ${h[key]?'done':''}" style="left:${left};top:${top}" data-action="chapter2-home-point" data-key="${key}">${h[key]?'✓':icon}</button>`).join('')}</section>
      <section class="card c2-story"><div class="speaker">Морвен</div><p>${text}</p><div class="c2-morwen-quote"><div class="c2-morwen-portrait"><img src="${EXTERNAL_ASSETS.morven}" alt="Морвен"></div><div><b>Морвен предупреждает</b><p>«Лунный плакун не прорастает из мёртвых цветов. Обычно. Но твоя мать редко уважала слово “обычно”.»</p></div></div><div class="c2-check ${h.wreath?'done':''}">Изучить цветы из венка</div><div class="c2-check ${h.phone?'done':''}">Прочитать сообщение Ники</div><div class="c2-check ${h.door?'done':''}">Открыть дверь телекинезом</div></section></div>`,`<button class="primary-button" data-action="chapter2-to-investigation" ${ready?'':'disabled'}>Отправиться к соседнему дому</button>`,`<span>${done}/4</span>`);
  }

  function missingRequiredClues() { const c=save.chapter2; return ['photo','soil','hairpin'].filter(k=>!c.clues[k]).length; }
  function requiredCluesFound() { return 3-missingRequiredClues(); }

  function renderC2Investigation() {
    const c=save.chapter2, loc=chapter2Locations[c.location], missing=missingRequiredClues();
    const items=loc.items.map(it=>{ const done=!!c.investSeen[it.id]; const optionalAction=!it.clue||it.optional; const wouldBlock=!done&&optionalAction&&c.time<=missing; return `<button class="c2-invest-item ${done?'done':''}" data-action="chapter2-investigate" data-id="${it.id}" ${done||c.time<it.cost||wouldBlock?'disabled':''}><span class="c2-invest-icon">${done?'✓':it.icon}</span><span><b>${it.name}</b><small>${done?it.text:it.desc}</small></span><em>${done?'':`−${it.cost} ◷`}</em></button>`; }).join('');
    const clueCards=[['photo','Фотография','Образ'],['soil','Земля','Боль'],['hairpin','Заколка','Обещание'],['dew','Лунная роса','Необязательно']].map(([k,n,d])=>`<div class="c2-clue ${c.clues[k]?'got':''}"><b>${c.clues[k]?'✓ ':''}${n}</b><span>${c.clues[k]?d:'Не найдено'}</span></div>`).join('');
    chapter2Shell('Расследование','Три Корневые Связи',`<div class="c2-invest"><div><div class="c2-location-tabs">${Object.entries(chapter2Locations).map(([id,x])=>`<button class="${c.location===id?'active':''}" data-action="chapter2-location" data-location="${id}">${x.label}</button>`).join('')}</div><div class="c2-location-scene ${loc.scene} direct-art-block c2-invest-hero">${c2DirectSceneArt(loc.scene)}<span>${loc.label}</span><div class="c2-invest-copy"><b>Осмотрите сцену</b>${loc.scene==='apartment'?'Квартира с остаточным образом и корнями в стенах.':loc.scene==='shop'?'Лавка с алхимическими следами и запахом реагентов.':'Двор, в котором память сплетается с почвой и сном.'}</div><i></i></div></div><div class="c2-scroll"><div class="c2-clues">${clueCards}</div><div class="c2-invest-list">${items}</div><button class="c2-text-button" data-action="chapter2-reset-investigation">Начать расследование заново</button></div></div>`,`<button class="primary-button" data-action="chapter2-to-alchemy" ${requiredCluesFound()===3?'':'disabled'}>Вернуться в лабораторию</button>`,`<span>◷ ${c.time}</span><span>${requiredCluesFound()}/3</span>`);
  }

  const c2Ingredients={water:['☾','Лунная вода','Основа'],salt:['◇','Пепельная соль','Отделяет Скверну'],lavender:['❧','Сумеречная лаванда','Успокаивает память'],dew:['◌','Лунная роса','Сохраняет семя']};

  function renderC2Alchemy() {
    const c=save.chapter2, a=c.alchemy; const available=['water','salt','lavender'].concat(c.clues.dew?['dew']:[]); const need=available.length;
    const ingredients=available.map(id=>{const x=c2Ingredients[id],used=a.order.includes(id);return `<button class="c2-ingredient ${used?'used':''}" data-action="chapter2-add-ingredient" data-ingredient="${id}" ${used?'disabled':''}><strong>${x[0]} ${x[1]}</strong><span>${x[2]}</span></button>`}).join('');
    const charge=a.charge===null?50:a.charge;
    chapter2Shell('Очищающая смесь','Алхимическая подготовка',`<div class="c2-alchemy"><section class="c2-alchemy-hero c2-alchemy-hero-strong direct-art-block">${EXTERNAL_ASSETS.c2alchemy?`<div class="direct-art-bg"><img src="${EXTERNAL_ASSETS.c2alchemy}" alt="Алхимическая лаборатория" loading="eager"></div>`:''}<div class="c2-alchemy-hero-copy"><div class="eyebrow">PWA Asset Build</div><h2>Соберите очищающую смесь</h2><p>Экран алхимии теперь имеет крупную отдельную иллюстрацию прямо в разметке. Шкала ниже остаётся чистой и свободной для точного нажатия.</p><div class="c2-alchemy-meter-note">✦ Подсказка больше не должна перекрывать шкалу фиксации</div></div></section><section class="card c2-recipe"><div class="eyebrow">Рецепт</div><h2>Слабое Очищение</h2><p>Порядок, температура и наполнение определят безопасность ритуала.</p></section><section class="card c2-alchemy-body"><h3>1. Добавьте ингредиенты по порядку</h3><div class="c2-ingredient-grid">${ingredients}</div><div class="c2-order">${a.order.length?a.order.map((id,i)=>`<span>${i+1}. ${c2Ingredients[id][1]}</span>`).join(''):'<em>Чаша пуста</em>'}</div><button class="c2-text-button" data-action="chapter2-reset-order">Очистить чашу</button><h3>2. Выберите температуру</h3><div class="c2-temp">${[['low','Холодная'],['mid','Умеренная'],['high','Высокая']].map(([id,n])=>`<button class="${a.temp===id?'active':''}" data-action="chapter2-temperature" data-temp="${id}">${n}</button>`).join('')}</div><h3>3. Зафиксируйте магическое наполнение</h3><div class="c2-charge ${a.stopped?'stopped':''}" id="c2-charge"><div class="sweet"></div><div class="c2-charge-marker" id="c2-charge-marker" style="${a.stopped?`left:${charge}%`:''}"></div></div><button class="secondary-button" data-action="chapter2-stop-charge">${a.stopped?`Зафиксировано: ${charge}%`:'Зафиксировать Искру'}</button></section></div>`,`<button class="primary-button" data-action="chapter2-brew" ${a.order.length===need&&a.temp&&a.stopped?'':'disabled'}>Завершить смесь</button>`);
  }

  function calculateC2Potion() {
    const c=save.chapter2,a=c.alchemy; const correct=['water','salt','lavender'].concat(c.clues.dew?['dew']:[]); let score=0;
    if (a.order.join('|')===correct.join('|')) score+=2; else if (a.order[0]==='water') score+=1;
    if (a.temp==='mid') score+=2;
    if (a.charge>=55&&a.charge<=74) score+=2; else if (a.charge>=42&&a.charge<=86) score+=1;
    if (c.clues.dew) score+=1;
    a.score=score; a.quality=score>=6?'excellent':score>=4?'basic':'unstable';
    save.inventory.items.cleansing_mixture=1;
    if (!save.recipes.known.includes('cleansing_mixture')) save.recipes.known.push('cleansing_mixture');
  }

  function potionEffectText(q) { return ({excellent:'Снимает 2 Покрова, защищает свидетеля и блокирует следующее восстановление Покрова.',basic:'Снимает 1 Покров и защищает свидетеля.',unstable:'Снимает 1 Покров, но повышает Скверну территории.'})[q]; }

  function renderC2AlchemyResult() {
    const c=save.chapter2,a=c.alchemy;
    chapter2Shell('Смесь готова','Качество подготовки',`<div class="c2-scroll"><section class="card c2-potion-result ${a.quality}"><div>⚗</div><span>${qualityLabel(a.quality)}</span><p>${potionEffectText(a.quality)}</p></section><section class="card c2-story"><div class="speaker">Морвен</div><blockquote>«Ты либо спасёшь растение, либо очень убедительно его оскорбишь».</blockquote><div class="c2-check done">Найдены три Корневые Связи</div><div class="c2-check ${c.clues.dew?'done':''}">${c.clues.dew?'Лунная роса добавлена':'Лунная роса не найдена'}</div><div class="c2-check done">Смесь помещена в быстрый слот</div></section></div>`,`<button class="secondary-button" data-action="chapter2-retry-alchemy">Повторить алхимию</button><button class="primary-button" data-action="chapter2-start-battle">Выйти во двор</button>`);
  }

  function createC2BattleState() {
    return {round:1,heroActs:2,teamActs:1,resonance:0,shroud:3,roots:{photo:true,soil:true,hairpin:true},active:null,revealed:false,grate:false,corruption:0,hero:{hp:4,max:4,shield:0},morven:{hp:3,max:3,shield:0},witness:{hp:2,max:2,shield:0},tab:'hero',more:false,targetMode:null,rootMode:false,potion:true,suppress:0,witnessGuard:0,freeSearch:true,log:['Памятный плющ сомкнул корни вокруг двора.'],intent:0,lost:false,lossReason:''};
  }

  function normalizeC2Battle(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const fresh=createC2BattleState();
    const b={...fresh,...raw};
    b.roots={...fresh.roots,...(raw.roots||{})};
    b.hero={...fresh.hero,...(raw.hero||{})};
    b.morven={...fresh.morven,...(raw.morven||{})};
    b.witness={...fresh.witness,...(raw.witness||{})};
    b.log=Array.isArray(raw.log)?raw.log.slice(-12):fresh.log;
    b.round=Math.max(1,Number(b.round)||1);
    b.heroActs=Math.max(0,Math.min(2,Number(b.heroActs)||0));
    b.teamActs=Math.max(0,Math.min(1,Number(b.teamActs)||0));
    b.resonance=Math.max(0,Math.min(6,Number(b.resonance)||0));
    b.shroud=Math.max(0,Math.min(3,Number(b.shroud)||0));
    b.corruption=Math.max(0,Math.min(3,Number(b.corruption)||0));
    b.suppress=Math.max(0,Number(b.suppress)||0);
    b.freeSearch=raw.freeSearch===undefined ? true : !!raw.freeSearch;
    if (!b.active || !b.roots[b.active]) pickC2Active(b);
    return b;
  }

  function initC2Battle() {
    save.chapter2.battle=createC2BattleState();
    pickC2Active(save.chapter2.battle);
  }
  const c2Intents=[
    {name:'Сжать корни',text:'снимет 1 Стойкость свидетеля',type:'attack',target:'witness'},
    {name:'Шипастая петля',text:'снимет 1 Стойкость Морвена',type:'attack',target:'morven'},
    {name:'Отрастить листву',text:'восстановит 1 Покров, если живы две Связи',type:'regen'},
    {name:'Чужое воспоминание',text:'повысит Скверну, если активная Связь не раскрыта',type:'corrupt'}
  ];
  function c2Broken(b){return Object.values(b.roots).filter(v=>!v).length} function c2Intact(b){return 3-c2Broken(b)}
  function pickC2Active(b){const list=['hairpin','photo','soil'].filter(k=>b.roots[k]);b.active=list[(b.round-1)%Math.max(1,list.length)]||null;b.revealed=false;}
  function canC2Purify(b){return b.shroud===0&&c2Broken(b)>=2&&c2Intact(b)>=1&&b.witness.hp>0&&!b.lost;}
  function c2PurifyReason(b){if(b.lost)return b.lossReason;if(b.shroud>0)return `Сначала снимите Покров: осталось ${b.shroud}.`;if(c2Broken(b)<2)return `Разрушьте ещё ${2-c2Broken(b)} Корневую Связь.`;if(c2Intact(b)<1)return 'Все Связи уничтожены: очищать уже нечего.';if(b.witness.hp<=0)return 'Свидетель потерян.';return 'Очищение готово.';}
  function c2FinalActionReason(b){if(b.heroActs<=0&&canC2Purify(b))return 'Нужно 1 действие героя. Завершите раунд.';return c2PurifyReason(b);}
  function c2NextStep(b){if(b.shroud>0)return 'Снимите Покров зельем или рассечением.';if(c2Broken(b)<2)return 'Раскройте активную Связь и разрушьте её.';if(canC2Purify(b)&&b.heroActs<=0)return 'Завершите раунд, затем примените Очищение I.';return canC2Purify(b)?'Примените Очищение I.':c2PurifyReason(b);}
  function c2Segments(u){return Array.from({length:u.max},(_,i)=>`<i class="${i<u.hp?'on':''} ${u.shield&&i===u.hp-1?'shield':''}"></i>`).join('');}

  function c2RootHtml(b) { const names={photo:'Фото',soil:'Земля',hairpin:'Заколка'}; return Object.keys(b.roots).map(k=>`<button class="c2-root ${!b.roots[k]?'broken':''} ${b.revealed&&b.active===k?'active':''} ${k==='hairpin'&&!b.grate&&b.roots[k]?'blocked':''} ${b.rootMode&&b.roots[k]?'selectable':''}" data-action="chapter2-root" data-root="${k}" ${!b.roots[k]?'disabled':''}><b>${!b.roots[k]?'×':b.revealed&&b.active===k?'✦':'?'}</b><span>${names[k]}</span></button>`).join(''); }

  function c2ActionButton(id,name,desc,cost,disabled,reason='',finish=false){return `<button class="c2-action ${finish?'finish':''}" data-action="chapter2-battle-action" data-battle-action="${id}" ${disabled?'disabled':''}><b>${name}</b><span>${desc}</span>${cost?`<em>${cost}</em>`:''}${disabled&&reason?`<small>${reason}</small>`:''}</button>`;}

  function c2BattleActions(b) {
    if (b.tab==='morven') return [
      c2ActionButton('attention','Хищное внимание','Раскрыть активную Связь.','1 команда',b.teamActs<=0||b.morven.hp<=0||b.revealed,b.revealed?'Активная Связь уже раскрыта':b.morven.hp<=0?'Морвен выбыл':'Командное действие потрачено'),
      c2ActionButton('distract','Кошачья провокация','Защитить свидетеля от следующей атаки.','1 команда',b.teamActs<=0||b.morven.hp<=0,b.morven.hp<=0?'Морвен выбыл':'Командное действие потрачено'),
      c2ActionButton('formula','Утерянная формула','Блокировать следующие 2 восстановления Покрова.','3 Резонанса',b.teamActs<=0||b.resonance<3||b.morven.hp<=0,b.resonance<3?`Нужно ещё ${3-b.resonance} Резонанса`:'Недоступно'),
      c2ActionButton('tip','Совет наставника','Показать следующий ритуальный шаг.','',false)
    ].join('');
    if (b.more) return [
      c2ActionButton('potion','Очищающая смесь',b.potion?'Использовать результат подготовки.':'Уже использована','1 действие',b.heroActs<=0||!b.potion,!b.potion?'Смесь уже использована':'Действия закончились'),
      c2ActionButton('shield','Щит','Защитить Морвена или свидетеля.','1 действие',b.heroActs<=0,'Действия закончились'),
      c2ActionButton('purify','Очищение I','Завершить ритуал, сохранив живую Связь.','1 действие',b.heroActs<=0||!canC2Purify(b),c2FinalActionReason(b),true),
      c2ActionButton('back','Назад','Основные заклинания.','',false)
    ].join('');
    const searchCost=b.freeSearch?'бесплатно':'1 действие';
    const searchBlocked=b.revealed||(!b.freeSearch&&b.heroActs<=0);
    const searchReason=b.revealed?'Активная Связь уже раскрыта':'Действия закончились';
    return [
      c2ActionButton('search','Поиск',b.freeSearch?'Первый Поиск бесплатен благодаря Морвену.':'Раскрыть активную Связь этого раунда.',searchCost,searchBlocked,searchReason),
      c2ActionButton('tele','Телекинез',b.grate?'Выбрать и разрушить корень.':'Сдвинуть решётку, закрывающую заколку.','1 действие',b.heroActs<=0,'Действия закончились'),
      c2ActionButton('cut','Рассечь Покров','Снять 1 сегмент лиственного Покрова.','1 действие',b.heroActs<=0||b.shroud<=0,b.shroud<=0?'Покров уже снят':'Действия закончились'),
      c2ActionButton('more','Ещё','Зелье, Щит и Очищение.','',false)
    ].join('');
  }


  function renderC2Battle() {
    let b=normalizeC2Battle(save.chapter2.battle);if(!b){initC2Battle();b=save.chapter2.battle;}save.chapter2.battle=b; const intent=c2Intents[b.intent%c2Intents.length];
    const ritual=`<section class="c2-ritual"><div class="c2-ritual-head"><div><span>Ритуальная цель</span><b>Очищение существа</b></div><em>${canC2Purify(b)?'ГОТОВО':'В ПРОЦЕССЕ'}</em></div><div class="c2-ritual-grid"><div class="${b.shroud===0?'done':''}">Покров снят: ${3-b.shroud}/3</div><div class="${c2Broken(b)>=2?'done':''}">Связи разрушены: ${c2Broken(b)}/2</div><div class="${c2Intact(b)>=1?'done':'fail'}">Живая Связь: ${c2Intact(b)>=1?'есть':'нет'}</div><div class="${b.witness.hp>0?'done':'fail'}">Свидетель: ${b.witness.hp}/${b.witness.max}</div></div><p><b>Дальше:</b> ${c2NextStep(b)}</p><small>Провал: свидетель погибает, Скверна достигает 3 или уничтожены все Связи. Первый Поиск бесплатен благодаря Морвену.</small></section>`;
    const loss=b.lost?`<div class="c2-loss"><h2>Ритуал сорван</h2><p>${b.lossReason}</p><button class="primary-button" data-action="chapter2-retry-battle">Повторить бой</button></div>`:'';
    chapter2Shell('Памятный плющ',`Раунд ${b.round}`,`<div class="c2-battle">${ritual}<section class="c2-enemy"><div class="c2-ivy">♣</div><div><h2>Памятный плющ</h2><div class="c2-intent"><span>Намерение</span><b>${intent.name}</b><small>${intent.text}</small></div><div class="c2-statuses"><span><b>${b.shroud}/3</b>Покров</span><span><b>${c2Broken(b)}/3</b>Связи</span><span><b>${b.corruption}/3</b>Скверна</span></div><div class="c2-roots">${c2RootHtml(b)}</div></div></section><section class="c2-team"><div><strong>Герой</strong><span class="c2-segments">${c2Segments(b.hero)}</span></div><button data-action="chapter2-target" data-target="morven" class="${b.targetMode==='shield'?'target':''}"><strong>Морвен</strong><span class="c2-segments">${c2Segments(b.morven)}</span></button><button data-action="chapter2-target" data-target="witness" class="${b.targetMode==='shield'?'target':''}"><strong>Свидетель</strong><span class="c2-segments">${c2Segments(b.witness)}</span></button></section><section class="c2-action-panel"><div class="c2-action-head"><b>${b.tab==='hero'?'Заклинания героя':'Морвен'}</b><span>${b.rootMode?'Выберите Корневую Связь':b.targetMode?'Выберите цель':`Герой ${b.heroActs}/2 · Команда ${b.teamActs}/1 · Резонанс ${b.resonance}/6`}</span></div><div class="c2-actions">${c2BattleActions(b)}</div></section>${loss}</div>`,`<div class="c2-battle-tabs"><button class="${b.tab==='hero'?'active':''}" data-action="chapter2-battle-tab" data-tab="hero">Герой</button><button class="${b.tab==='morven'?'active':''}" data-action="chapter2-battle-tab" data-tab="morven">Морвен</button></div><button class="secondary-button" data-action="chapter2-end-turn" ${b.lost?'disabled':''}>Завершить раунд</button>`,`<span>✦ ${b.heroActs}</span><span>◆ ${b.teamActs}</span>`);
  }

  function spendC2Hero(b){if(b.heroActs<=0){toast('Действия героя закончились. Завершите раунд.');return false}b.heroActs--;return true}
  function spendC2Team(b){if(b.teamActs<=0){toast('Командное действие уже потрачено.');return false}b.teamActs--;return true}
  function c2Gain(b,n=1){b.resonance=Math.min(6,b.resonance+n)}
  function c2Log(b,text){b.log.push(text);toast(text)}
  function loseC2(b,text){b.lost=true;b.lossReason=text;c2Log(b,text)}

  function useC2BattleAction(id) {
    const b=save.chapter2.battle;if(!b||b.lost)return;
    if(id==='more'){b.more=true;b.rootMode=false;b.targetMode=null;return chapter2Save(null)}
    if(id==='back'){b.more=false;b.rootMode=false;b.targetMode=null;return chapter2Save(null)}
    if(id==='tip'){toast(c2NextStep(b));return}
    if(id==='search'){if(b.revealed)return toast('Активная Связь уже раскрыта.');const free=b.freeSearch;if(!free&&!spendC2Hero(b))return;if(free)b.freeSearch=false;b.revealed=true;c2Gain(b);c2Log(b,free?'Циничный совет Морвена: первый Поиск не тратит действие. Связь раскрыта. +1 Резонанс.':'Поиск раскрыл активную Корневую Связь. +1 Резонанс.');}
    if(id==='tele'){
      if(!b.grate){if(!spendC2Hero(b))return;b.grate=true;c2Gain(b);c2Log(b,'Телекинез сдвинул металлическую решётку. Корень заколки доступен.');}
      else {b.rootMode=true;b.targetMode=null;toast('Выберите Корневую Связь. Действие потратится после выбора.');}
    }
    if(id==='cut'){if(b.shroud<=0||!spendC2Hero(b))return;b.shroud--;c2Gain(b);c2Log(b,'Лиственный Покров рассечён. +1 Резонанс.');}
    if(id==='potion'){
      if(!b.potion||!spendC2Hero(b))return; b.potion=false; const q=save.chapter2.alchemy.quality;
      if(q==='excellent'){b.shroud=Math.max(0,b.shroud-2);b.witness.shield=1;b.suppress=Math.max(b.suppress,1);c2Log(b,'Безупречная смесь снимает 2 Покрова, защищает свидетеля и блокирует следующее восстановление.');}
      else if(q==='basic'){b.shroud=Math.max(0,b.shroud-1);b.witness.shield=1;c2Log(b,'Стабильная смесь снимает 1 Покров и защищает свидетеля.');}
      else {b.shroud=Math.max(0,b.shroud-1);b.corruption++;c2Log(b,'Нестабильная смесь снимает Покров, но повышает Скверну территории.');}
      save.inventory.items.cleansing_mixture=0;
      if(b.corruption>=3)loseC2(b,'Скверна территории достигла критического уровня.');
    }
    if(id==='shield'){if(b.heroActs<=0)return toast('Действия героя закончились.');b.targetMode='shield';b.rootMode=false;toast('Выберите Морвена или свидетеля.');}
    if(id==='purify'){
      if(!canC2Purify(b))return toast(c2PurifyReason(b));if(!spendC2Hero(b))return;
      save.chapter2.stage='choice';save.chapter2.battle=null;return chapter2Save('Очищение удалось. Решите судьбу семени.');
    }
    if(id==='attention'){if(b.revealed)return toast('Активная Связь уже раскрыта.');if(b.morven.hp<=0||!spendC2Team(b))return;b.revealed=true;c2Gain(b);c2Log(b,'Морвен отмечает активную Связь. +1 Резонанс.');}
    if(id==='distract'){if(b.morven.hp<=0||!spendC2Team(b))return;b.witnessGuard=1;c2Log(b,'Морвен отвлекает плющ. Следующая атака по свидетелю сорвётся.');}
    if(id==='formula'){if(b.morven.hp<=0||b.resonance<3||!spendC2Team(b))return;b.resonance-=3;b.suppress=Math.max(b.suppress,2);c2Log(b,'Утерянная формула блокирует следующие 2 восстановления Покрова.');}
    chapter2Save(null);
  }

  function chooseC2Root(key) {
    const b=save.chapter2.battle;if(!b||!b.rootMode||!b.roots[key]||b.lost)return;
    if(key==='hairpin'&&!b.grate)return toast('Корень закрыт металлической решёткой. Сначала примените Телекинез.');
    if(!spendC2Hero(b))return;b.rootMode=false;b.roots[key]=false;
    if(b.active===key){c2Gain(b);c2Log(b,'Активная Связь разрушена безопасно. +1 Резонанс.');}else{b.corruption++;c2Log(b,'Разрушена неактивная Связь. Скверна территории растёт.');}
    if(c2Intact(b)===0)loseC2(b,'Все Корневые Связи уничтожены. Очищать больше нечего.');
    else if(b.corruption>=3)loseC2(b,'Скверна территории достигла критического уровня.');
    chapter2Save(null);
  }

  function chooseC2Target(target) {
    const b=save.chapter2.battle;if(!b||b.targetMode!=='shield'||b.lost)return;if(!spendC2Hero(b))return;
    b[target].shield=1;b.targetMode=null;c2Log(b,target==='witness'?'Свидетель защищён Щитом.':'Морвен защищён Щитом.');chapter2Save(null);
  }

  function endC2Turn() {
    const b=normalizeC2Battle(save.chapter2.battle);if(!b||b.lost)return;save.chapter2.battle=b;const intent=c2Intents[b.intent%c2Intents.length];
    if(intent.type==='attack'){
      const u=b[intent.target];if(intent.target==='witness'&&b.witnessGuard){b.witnessGuard=0;c2Log(b,'Кошачья провокация срывает атаку по свидетелю.');}
      else if(u.shield){u.shield=0;c2Gain(b);c2Log(b,'Щит блокирует намерение. +1 Резонанс.');}
      else {u.hp=Math.max(0,u.hp-1);c2Log(b,`${intent.target==='witness'?'Свидетель':'Морвен'} теряет 1 Стойкость.`);}
    } else if(intent.type==='regen'){
      if(b.suppress>0){b.suppress--;c2Log(b,'Восстановление Покрова заблокировано.');}
      else if(c2Intact(b)>=2){b.shroud=Math.min(3,b.shroud+1);c2Log(b,'Плющ восстанавливает 1 Покров.');}
      else c2Log(b,'Разрушенные Связи не дают восстановить Покров.');
    } else if(intent.type==='corrupt'){
      if(!b.revealed){b.corruption++;c2Log(b,'Нераскрытая Связь искажает память. Скверна +1.');}else c2Log(b,'Раскрытая Связь не позволяет исказить память.');
    }
    if(b.witness.hp<=0)loseC2(b,'Свидетель поглощён корнями.');
    else if(b.corruption>=3)loseC2(b,'Скверна территории достигла критического уровня.');
    if(b.lost){chapter2Save(null);return;}
    b.round++;b.heroActs=2;b.teamActs=b.morven.hp>0?1:0;b.intent=(b.intent+1)%c2Intents.length;b.more=false;b.rootMode=false;b.targetMode=null;pickC2Active(b);chapter2Save(null);
  }


  function renderC2Choice() {
    chapter2Shell('Судьба семени','Ритуал завершён',`<div class="c2-scroll"><section class="card c2-story"><div class="speaker">После Очищения</div><p>В центре клумбы остаётся одно живое семя. Внутри звучит обрывок голоса матери.</p><blockquote>«Память не просила стать оружием. Но теперь её судьбу выбираешь ты».</blockquote></section><div class="c2-choice-list"><button data-action="chapter2-ending" data-ending="save"><b>Сохранить очищенное семя</b><span>Фрагмент воспоминания матери и проект теплицы. Позднее возможны домашние аномалии.</span><em>Флаг: семейная память</em></button><button data-action="chapter2-ending" data-ending="destroy"><b>Уничтожить семя</b><span>Дом станет безопаснее, но часть личной сцены матери будет недоступна до другого источника.</span><em>Флаг: будущее одобрение Ордена</em></button><button data-action="chapter2-ending" data-ending="morven"><b>Передать семя Морвену</b><span>Он спрячет его и явно солжёт о причине. Герой потеряет контроль над уликой.</span><em>Флаг: доверие Морвена</em></button></div></div>`);
  }

  function applyC2Resolution(ending) {
    const c=save.chapter2;if(c.resolutionApplied)return;c.resolutionApplied=true;c.ending=ending;c.status='resolved';
    save.story.decisions['chapter_02.seed_fate']=ending;
    save.story.flags['chapter_02.potion_quality']=c.alchemy.quality;save.story.flags['chapter_02.rare_dew']=!!c.clues.dew;save.story.flags['chapter_02.witness_saved']=true;
    save.inventory.items.memorial_ivy_page=1;save.codex.creatures.memorial_ivy={knowledge:1,max:3};if(!save.codex.discoveries.includes('memorial_ivy'))save.codex.discoveries.push('memorial_ivy');
    if(ending==='save'){save.story.flags['chapter_02.family_memory']=true;save.inventory.items.memorial_seed=1;save.inventory.items.greenhouse_plan=1;save.house.rooms.greenhouse.projectUnlocked=true;}
    if(ending==='destroy'){save.story.flags['chapter_02.home_safer']=true;save.story.flags['chapter_02.future_order_approval']=true;}
    if(ending==='morven'){save.story.flags['chapter_02.morven_holds_seed']=true;save.story.flags['chapter_02.clue_control_lost']=true;save.relationships.morven.trust=Math.min(10,save.relationships.morven.trust+1);save.companions.states.morven.trust=save.relationships.morven.trust;}
  }

  function c2EndingData() {return {
    save:{title:'Семя сохранено',text:'Внутри вспыхивает образ матери у домашней теплицы. Морвен отворачивается раньше, чем герой замечает его реакцию.',flag:'Семейная память · проект теплицы'},
    destroy:{title:'Семя уничтожено',text:'Искра превращает семя в белый пепел. Двор становится тихим — слишком тихим.',flag:'Безопасный дом · будущее одобрение Ордена'},
    morven:{title:'Семя передано Морвену',text:'Кот проглатывает семя вместе с серебряным светом. «Не смотри так. Я положу его в безопасное место». Он лжёт.',flag:'Доверие Морвена · потеря контроля над уликой'}
  }[save.chapter2.ending];}

  function renderC2Return() {
    const e=c2EndingData();chapter2Shell('Возвращение домой','Глава почти завершена',`<div class="c2-scroll"><section class="card c2-story"><div class="speaker">${e.title}</div><p>${e.text}</p><blockquote>Морвен раскрывает Книгу Теней. Новая страница сама впитывает серебряные чернила.</blockquote></section><section class="card c2-rewards"><h2>Получено и открыто</h2><div><span>▤</span><b>Памятный плющ</b><small>Новая запись Книги Теней</small></div><div><span>⚗</span><b>Очищение I</b><small>Рецепт сохранён</small></div><div><span>✦</span><b>${e.flag}</b><small>Сюжетное решение записано</small></div></section><section class="card c2-story"><div class="speaker">Морвен</div><p>«Связи бывают не только у демонов. Иногда душа отвечает на зов другой души. Мы называем это договором — звучит приличнее, чем “магическая вербовка”.»</p></section></div>`,`<button class="primary-button" data-action="chapter2-to-summon">Открыть бесплатный договор ×10</button>`);
  }

  function renderC2Summon() {
    const c=save.chapter2, claimed=c.summon.claimed;
    const cards=claimed?c.summon.results.map((r,i)=>{const unit=companions[r.id];return `<div class="c2-pull-card ${r.stars===5?'legendary':''}" style="--delay:${i*45}ms"><span>${'★'.repeat(r.stars)}</span><div>${unit.initials}</div><b>${unit.name}</b><small>${r.isNew?'НОВОЕ':'+3 Отголоска'}</small></div>`}).join(''):'';
    chapter2Shell('Договор новичка','Бесплатный ×10',claimed?`<div class="c2-scroll"><section class="c2-pull-grid">${cards}</section><section class="card c2-rewards"><h2>Итог</h2><div><span>✦</span><b>${c.summon.results.filter(x=>x.isNew).length} новых спутника</b><small>Добавлены в коллекцию</small></div><div><span>◇</span><b>${c.summon.echoes} Отголосков судьбы</b><small>Дубликаты сохранены как ресурс прототипа</small></div></section></div>`:`<section class="c2-summon-stage"><div class="c2-summon-circle">✦</div><h2>Первый договор</h2><p>Это сюжетная бесплатная выдача. Она не тратит валюту и не прерывает эмоциональную развязку главы.</p></section>`,claimed?'<button class="primary-button" data-action="chapter2-finish">Вернуться домой</button>':'<button class="primary-button" data-action="chapter2-pull">Получить ×10 бесплатно</button>');
  }

  function claimC2Pull() {
    const c=save.chapter2;if(c.summon.claimed)return;const seen=new Set(save.companions.owned);let echoes=0;
    c.summon.results=novicePull.map(r=>{const isNew=!seen.has(r.id);if(isNew){seen.add(r.id);save.companions.owned.push(r.id);save.companions.states[r.id]={level:1,trust:0,rank:0};}else echoes+=3;return {...r,isNew};});
    c.summon.echoes=echoes;c.summon.claimed=true;chapter2Save('Спутники добавлены в коллекцию.');
  }

  function finishC2() {
    const c=save.chapter2;c.stage='summary';c.status='completed';
    save.progression.chapters.chapter_02_roots_of_memory={status:'completed',progress:100};
    save.progression.chapters.chapter_03_first_light={status:'available',progress:0};
    save.progression.activeQuestId='chapter_03_first_light';save.profile.heroLevel=Math.max(3,save.profile.heroLevel);save.profile.accountLevel=Math.max(3,save.profile.accountLevel);
    save.story.flags['chapter_02.complete']=true;ensurePart3Unlocks(save);currentScreen='home';saveGame('Глава 2 завершена. Между сюжетными главами открылись дела района и развитие дома.');
  }

  function renderC2Summary() {
    const e=c2EndingData();chapter2Shell('Корни памяти','Глава завершена',`<div class="c2-scroll"><section class="card c2-potion-result excellent"><div>✓</div><span>Глава завершена</span><p>${e?e.text:'Решение сохранено в журнале.'}</p></section><section class="card c2-rewards"><h2>Постоянный прогресс</h2><div><span>▤</span><b>Книга Теней обновлена</b><small>Памятный плющ</small></div><div><span>⚗</span><b>Рецепт сохранён</b><small>${qualityLabel(save.story.flags['chapter_02.potion_quality'])} смесь</small></div><div><span>◈</span><b>Уровень 3 открыт</b><small>«Первый Свет»</small></div></section></div>`,`<button class="primary-button" data-action="chapter2-pause">Вернуться домой</button>`);
  }

  function resetC2Progress() {
    const oldEnding=save.story.decisions['chapter_02.seed_fate'];
    if(oldEnding==='morven') save.relationships.morven.trust=Math.max(0,save.relationships.morven.trust-1);
    save.companions.states.morven.trust=save.relationships.morven.trust;
    save.chapter2=createChapter2State();save.progression.chapters.chapter_02_roots_of_memory={status:'available',progress:0};save.progression.chapters.chapter_03_first_light={status:'locked',progress:0};save.progression.activeQuestId='chapter_02_roots_of_memory';
    for(const id of ['cleansing_mixture','memorial_ivy_page','memorial_seed','greenhouse_plan'])delete save.inventory.items[id];
    save.recipes.known=save.recipes.known.filter(x=>x!=='cleansing_mixture');
    for(const id of ['asha','quiet_echo','archive_scribe','trail_hound']){save.companions.owned=save.companions.owned.filter(x=>x!==id);delete save.companions.states[id];}
    for(const key of Object.keys(save.story.flags))if(key.startsWith('chapter_02.'))delete save.story.flags[key];delete save.story.decisions['chapter_02.seed_fate'];
    delete save.codex.creatures.memorial_ivy;save.codex.discoveries=save.codex.discoveries.filter(x=>x!=='memorial_ivy');save.house.rooms.greenhouse.projectUnlocked=false;save.profile.heroLevel=2;save.profile.accountLevel=2;currentScreen='home';saveGame('Глава 2 сброшена для повторного теста.');
  }

  function openModal(content) {
    modalOpen = true;
    modalRoot.innerHTML = `<div class="modal-layer" data-action="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-handle"></div>${content}</section></div>`;
  }

  function closeModal() {
    modalOpen = false;
    modalRoot.innerHTML = '';
  }

  function showChapter2Info() { currentScreen='chapter2'; saveGame(null); }

  function showChapter3Info() {
    openModal(`<div class="modal-header"><div><div class="eyebrow">Следующая интеграция</div><h2>«Первый Свет»</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Лиора Вейн приходит в дом, после чего герой расследует заражённый маяк и учится защищать союзника и объект. Эту главу подключим в следующей части, уже с решениями «Корней памяти».</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);
  }

  function showRoom(id) {
    const room = save.house.rooms[id];
    const data = {
      living_room: ['Гостиная', 'Домашние разговоры, сообщения и сюжетные события между делами.', 'Открыта'],
      study: ['Кабинет', 'Книга Теней, журнал расследований и скрытые знания родителей.', 'Открыт'],
      laboratory: ['Лаборатория', 'Приготовление зелий, качество рецептов и будущая автоматизация.', room.unlocked ? 'Открыта' : 'Доступна внутри главы 2'],
      greenhouse: ['Теплица', 'Выращивание редких растений и долгосрочные заказы.', room.projectUnlocked ? 'Проект получен; строительство позже' : 'Закрыта'],
      ritual_hall: ['Ритуальный зал', 'Настройка Печатей и сложные командные ритуалы.', 'Закрыт'],
      artifact_room: ['Комната артефактов', 'Хранение, настройка и восстановление реликвий.', 'Закрыта']
    }[id];
    openModal(`<div class="modal-header"><div><div class="eyebrow">Комната дома</div><h2>${data[0]}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${data[1]}</p><div class="detail-row"><strong>Статус</strong><span>${data[2]}</span></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Вернуться</button></div></div>`);
  }

  function showItem(id) {
    const item = itemCatalog[id];
    const count = save.inventory.items[id] || 0;
    if (!item) return;
    openModal(`<div class="modal-header"><div><div class="eyebrow">${item.categoryLabel}</div><h2>${item.name}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><div class="item-art" style="height:110px">${icons[item.icon]}</div><p>${item.description}</p><div class="detail-row"><strong>Количество</strong><span>${count}</span></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Убрать в сумку</button></div></div>`);
  }

  function showCompanion(id) {
    const c = companions[id];
    const owned = save.companions.owned.includes(id);
    const details = owned && c.active ? `<div class="detail-list"><div class="detail-row"><strong>Активная способность</strong><span>${c.active}</span></div><div class="detail-row"><strong>Реакция</strong><span>${c.reaction}</span></div><div class="detail-row"><strong>Пассивная способность</strong><span>${c.passive}</span></div><div class="detail-row"><strong>Резонанс</strong><span>${c.resonance}</span></div></div>` : owned ? `<div class="detail-row"><strong>Статус</strong><span>${c.note||'Боевая версия получена; подробный комплект будет подключён позже.'}</span></div>` : `<div class="detail-row"><strong>Получение</strong><span>${c.unlock}.</span></div>`;
    openModal(`<div class="modal-header"><div><div class="eyebrow">${owned ? 'Получен' : 'Пока закрыт'}</div><h2>${c.name}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${c.subtitle} · ${c.rarity} · ${c.direction}<br>${c.roles}</p>${details}<div class="modal-actions"><button class="primary-button" data-action="close-modal">Закрыть</button></div></div>`);
  }

  function openDebug() {
    const lab = save.house.rooms.laboratory.unlocked;
    const crystalCount = save.inventory.items.test_crystal || 0;
    openModal(`
      <div class="modal-header"><div><div class="eyebrow">Техническая панель</div><h2>Проверка связанной сборки</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div>
      <div class="modal-body"><p>Эти кнопки нужны только для тестирования сохранения. Они не являются игровым контентом и позже будут скрыты.</p>
        <div class="debug-section"><h3>Изменить данные</h3><div class="debug-grid">
          <button class="debug-button" data-action="debug-coins"><strong>+10 монет</strong><span>Проверить валюту</span></button>
          <button class="debug-button" data-action="debug-crystal"><strong>${crystalCount ? 'Убрать' : 'Добавить'} кристалл</strong><span>Проверить инвентарь</span></button>
          <button class="debug-button" data-action="debug-corruption"><strong>+1 Скверна</strong><span>Текущее: ${save.soul.corruption}</span></button>
          <button class="debug-button" data-action="debug-cleanse"><strong>Очистить Скверну</strong><span>Сбросить до 0</span></button>
          <button class="debug-button" data-action="debug-scar"><strong>${save.soul.scars.length ? 'Убрать' : 'Добавить'} Шрам</strong><span>Временный тест</span></button>
          <button class="debug-button" data-action="debug-lab"><strong>${lab ? 'Закрыть' : 'Открыть'} лабораторию</strong><span>Проверить комнаты</span></button>
          <button class="debug-button" data-action="debug-trust-up"><strong>+1 доверие Морвена</strong><span>${save.relationships.morven.trust}/10</span></button>
          <button class="debug-button" data-action="debug-trust-down"><strong>−1 доверие Морвена</strong><span>${save.relationships.morven.trust}/10</span></button>
        </div></div>
        <div class="debug-section"><h3>Глава 2</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter2"><strong>Сбросить «Корни памяти»</strong><span>Повторить главу с начала</span></button></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid">
          <button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать JSON-файл</span></button>
          <button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить JSON-файл</span></button>
        </div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div>
        <div class="debug-section"><h3>Текущее состояние</h3><pre class="json-preview">${escapeHtml(JSON.stringify(save, null, 2))}</pre></div>
        <div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Полностью удалить сохранение</button></div>
      </div>`);
  }

  function advanceTestQuest() {
    const q = save.tests.foundationQuest;
    if (q.status === 'available') { q.status = 'in_progress'; q.step = 1; saveGame('Техническое дело принято.'); return; }
    if (q.status === 'in_progress' && q.step === 1) { q.step = 2; saveGame('Защитный контур осмотрен.'); return; }
    if (q.status === 'in_progress' && q.step === 2) {
      q.step = 3; q.status = 'completed';
      if (!q.rewardClaimed) { save.currencies.coins += 10; q.rewardClaimed = true; }
      saveGame('Проверка завершена. Получено 10 монет.');
    }
  }

  function exportSave() {
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magic_rpg_save_revision_${save.revision}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Файл сохранения подготовлен.');
  }

  function importSaveFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = migrateSave(JSON.parse(reader.result));
        save = imported;
        currentScreen = imported.progression.currentScreen || 'home';
        saveGame('Сохранение импортировано.');
        closeModal();
      } catch (error) {
        toast('Не удалось прочитать файл сохранения.');
      }
    };
    reader.readAsText(file);
  }


  /* =========================
     PART 3 — META LOOP MODULE
     ========================= */

  const part3Items = {
    lunar_water: { id:'lunar_water', name:'Лунная вода', category:'material', categoryLabel:'Алхимический материал', description:'Чистая вода, собранная при холодном лунном свете. Смягчает Очищение и удерживает память от распада.', icon:'flask' },
    silver_salt: { id:'silver_salt', name:'Серебряная соль', category:'material', categoryLabel:'Алхимический материал', description:'Мелкие кристаллы, которые проводят Печать и отделяют Скверну от живой ткани.', icon:'crystal' },
    root_ash: { id:'root_ash', name:'Пепел корней', category:'material', categoryLabel:'Алхимический материал', description:'Остаток безопасно сожжённых магических корней. Помогает смеси найти источник одержимости.', icon:'leaf' },
    bus_ticket_echo: { id:'bus_ticket_echo', name:'Билет с последними словами', category:'knowledge', categoryLabel:'Улика', description:'На выцветшем билете проступает фраза, которую цветы повторяли на остановке.', icon:'page' }
  };
  const fullItemCatalog = { ...itemCatalog, ...part3Items };

  const companionBonuses = {
    asha: { title:'Покров духа', short:'Один раз защищает свидетеля от намерения.', battle:'shield' },
    quiet_echo: { title:'Тихий резерв', short:'Восстанавливает 2 энергии героя.', battle:'energy' },
    archive_scribe: { title:'Сверка записей', short:'Раскрывает все скрытые Связи.', battle:'reveal' },
    trail_hound: { title:'По следу корней', short:'Снижает Покров на 1, не разрушая Связь.', battle:'weaken' }
  };

  function createPart3Meta() {
    return {
      starterKitClaimed:false,
      heroMastery:{ telekinesis:1, search:1, shield:1, purification:0 },
      incidentHistory:[],
      firstMetaVisit:false
    };
  }

  function createIncidentState(status='available') {
    return {
      id:'bus_stop_flowers', status, stage:'brief', runs:0, time:4,
      clues:{ roots:false, recording:false, witness:false, cache:false },
      seen:{}, approach:null, battle:null, result:null, resultApplied:false
    };
  }

  function normalizeIncidentState(value) {
    const fresh=createIncidentState(value?.status || 'available');
    const inc={...fresh,...(value||{})};
    inc.clues={...fresh.clues,...(value?.clues||{})};
    inc.seen={...(value?.seen||{})};
    inc.runs=Number.isFinite(Number(inc.runs))?Number(inc.runs):0;
    if (inc.battle) inc.battle=normalizeIncidentBattle(inc.battle);
    return inc;
  }

  function ensurePart3Unlocks(state) {
    const complete=state.progression?.chapters?.chapter_02_roots_of_memory?.status==='completed' || state.story?.flags?.['chapter_02.complete'];
    if (!complete) {
      state.incidents ||= {};
      state.incidents.bus_stop_flowers=normalizeIncidentState(state.incidents.bus_stop_flowers || createIncidentState('locked'));
      state.incidents.bus_stop_flowers.status='locked';
      return state;
    }
    state.meta ||= createPart3Meta();
    state.incidents ||= {};
    state.incidents.bus_stop_flowers=normalizeIncidentState(state.incidents.bus_stop_flowers || createIncidentState('available'));
    if (state.incidents.bus_stop_flowers.status==='locked') state.incidents.bus_stop_flowers.status='available';
    state.recipes ||= {known:[],mastery:{}};
    state.recipes.known ||= [];
    state.recipes.mastery ||= {};
    if (!state.recipes.known.includes('cleansing_mixture')) state.recipes.known.push('cleansing_mixture');
    if (typeof state.recipes.mastery.cleansing_mixture!=='number') state.recipes.mastery.cleansing_mixture=1;
    state.inventory ||= {items:{}};
    state.inventory.items ||= {};
    if (!state.meta.starterKitClaimed) {
      state.inventory.items.lunar_water=(state.inventory.items.lunar_water||0)+2;
      state.inventory.items.silver_salt=(state.inventory.items.silver_salt||0)+2;
      state.inventory.items.root_ash=(state.inventory.items.root_ash||0)+2;
      state.meta.starterKitClaimed=true;
      state.story.flags['meta.part3_starter_ingredients']=true;
    }
    state.codex ||= {creatures:{},discoveries:[]};
    state.codex.creatures ||= {};
    state.codex.creatures.shadow_spirit ||= {knowledge:1,max:3};
    state.codex.creatures.memorial_ivy ||= {knowledge:1,max:3};
    if (!state.codex.discoveries.includes('shadow_spirit')) state.codex.discoveries.push('shadow_spirit');
    if (!state.codex.discoveries.includes('memorial_ivy')) state.codex.discoveries.push('memorial_ivy');
    state.meta.heroMastery.purification=Math.max(1,state.meta.heroMastery.purification||0);
    return state;
  }

  function renderStart() {
    const existing = readSave();
    const preview = existing ? `<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>Последнее сохранение: ${formatDate(existing.updatedAt)} · ревизия ${existing.revision}</span></div>` : '';
    app.innerHTML = `<section class="start-screen"><div class="brand-kicker">Magic RPG · vertical slice</div><div class="start-copy"><h1 class="start-title">Дом между<br>мирами</h1><p class="start-subtitle">Единая сборка: глава «Корни памяти», дом-хаб, Книга Теней, алхимия, формирование отряда и первое повторяемое дело района.</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать сохранение'}</button></div><div class="version-line">Часть 3 · «Жизнь между делами» · ${CONTENT_VERSION}</div></div></section>`;
  }

  function renderGame() {
    if (!save) { renderStart(); return; }
    currentScreen=currentScreen || save.progression.currentScreen || 'home';
    if (currentScreen==='chapter2') { renderChapter2(); return; }
    if (currentScreen==='incident') { renderIncident(); return; }
    app.innerHTML=`<div class="game-shell">${renderTopbar()}<main id="screen-content">${renderScreen()}</main>${renderBottomNav()}</div>`;
  }

  function renderScreen() {
    switch(currentScreen) {
      case 'cases': return renderCases();
      case 'inventory': return renderInventory();
      case 'companions': return renderCompanions();
      case 'journal': return renderJournal();
      case 'codex': return renderCodex();
      case 'laboratory': return renderLaboratory();
      case 'hero': return renderHeroGrowth();
      default: return renderHome();
    }
  }

  function morwenText() {
    const complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';
    const lines=complete?[
      'Лиора всё ещё у порога. Но район не обязан ждать, пока вы закончите мериться подозрениями.',
      'Книга Теней — не украшение. Чем больше ты понимаешь существо, тем меньше оно понимает, почему проигрывает.',
      'Выбери второго спутника до дела. Я, разумеется, останусь — кто-то должен следить за качеством решений.'
    ]:[
      'Похоронные цветы обычно не пытаются открыть дверь. Обычно.',
      'В соседнем доме людям снится одна и та же женщина. Совпадение, конечно. Очень зелёное совпадение.',
      'Дело уже ждёт на доске. И да — оно сохранится, даже если ты закроешь игру.'
    ];
    return lines[save.tests.morwenLine%lines.length];
  }

  function renderHome() {
    const complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';
    if (!complete) {
      const c2=save.chapter2; const status=save.progression.chapters.chapter_02_roots_of_memory.status;
      const inProgress=status==='in_progress'||c2.status==='in_progress'||c2.status==='resolved';
      return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Гостиная под защитным контуром</h1><p>Из закрытой комнаты тянется запах сырой земли.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div><div class="section-title"><h2>Текущая задача</h2><span>Сюжет</span></div><article class="card quest-card"><div class="quest-head"><div><span class="tag violet">Уровень 2</span><h3>Корни памяти</h3></div><span class="tag green">${inProgress?'В процессе':'Доступно'}</span></div><p>Найдите Корневые Связи, приготовьте смесь и завершите Очищение.</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${chapter2Progress()}%"></div></div><div class="progress-caption"><span>${inProgress?'Автосохранение активно':'Не начато'}</span><span>${chapter2Progress()}%</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-chapter2">${inProgress?'Продолжить главу':'Начать главу'}</button></div></article><div class="section-title"><h2>Комнаты</h2><span>Мета-системы откроются после главы</span></div><div class="room-grid">${roomCard('living_room','Гостиная','Разговоры и события дома',icons.home,true)}${roomCard('study','Кабинет','Книга Теней и задачи',icons.book,true)}${roomCard('laboratory','Лаборатория','Алхимия и рецепты',icons.flask,save.house.rooms.laboratory.unlocked)}${roomCard('greenhouse','Теплица','Редкие растения и заказы',icons.leaf,false)}</div></section>`;
    }
    const inc=save.incidents.bus_stop_flowers;
    const second=save.companions.activeParty?.[1]&&companions[save.companions.activeParty[1]];
    const unlockedRooms=Object.values(save.house.rooms).filter(r=>r.unlocked).length;
    return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Жизнь между делами</h1><p>Книга обновлена, лаборатория работает, а у защитного контура ждёт Лиора Вейн.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div>
      <div class="section-title"><h2>Следующий шаг</h2><span>Выбор игрока</span></div>
      <article class="card quest-card"><div class="quest-head"><div><span class="tag amber">Главная история · уровень 3</span><h3>Первый Свет</h3></div><span class="tag violet">Открыто</span></div><p>Лиора Вейн пришла по следу Искры. Пока глава 3 готовится к интеграции, можно заняться домом, отрядом и делами района.</p><div class="card-actions"><button class="secondary-button" data-action="chapter3-info">Поговорить о Лиоре</button><button class="primary-button" data-action="start-incident">Дело района</button></div></article>
      <div class="section-title"><h2>Между делами</h2><span>${second?`В отряде: ${second.name}`:'Второй спутник не выбран'}</span></div>
      <div class="quick-grid"><button class="quick-card" data-action="open-codex">${icons.book}<strong>Книга Теней</strong><small>2 записи и рост знания</small></button><button class="quick-card" data-action="open-lab">${icons.flask}<strong>Лаборатория</strong><small>${save.inventory.items.cleansing_mixture||0} смеси готово</small></button><button class="quick-card" data-action="open-hero">${icons.circle}<strong>Дар героя</strong><small>Уровень ${save.profile.heroLevel}</small></button></div>
      <div class="section-title"><h2>Дело района</h2><span>Повторено: ${inc.runs}</span></div><article class="card meta-banner"><span>${icons.leaf}</span><div><h3>Цветы на остановке</h3><p>Астры повторяют чужие последние слова. Найдите источник и выберите: очистить одержимую флору или уничтожить её.</p><div class="inline-actions"><button class="small-button" data-action="start-incident">${inc.stage!=='brief'&&inc.stage!=='result'?'Продолжить':'Открыть дело'}</button><button class="small-button" data-action="open-party-picker">Собрать отряд</button></div></div></article>
      <div class="section-title"><h2>Комнаты</h2><span>${unlockedRooms} из 6 открыто</span></div><div class="room-grid">${roomCard('living_room','Гостиная','Разговоры и события дома',icons.home,true)}${roomCard('study','Кабинет','Книга Теней и развитие',icons.book,true)}${roomCard('laboratory','Лаборатория','Рецепты и расходники',icons.flask,true)}${roomCard('greenhouse','Теплица',save.house.rooms.greenhouse.projectUnlocked?'Проект получен':'Редкие растения и заказы',icons.leaf,save.house.rooms.greenhouse.unlocked)}${roomCard('ritual_hall','Ритуальный зал','Печати и сложные ритуалы',icons.circle,false)}${roomCard('artifact_room','Комната артефактов','Хранение и настройка реликвий',icons.crystal,false)}</div>
      <div class="section-title"><h2>Сохранение</h2><span>Работает автоматически</span></div><article class="card meta-banner"><span>${icons.gear}</span><div><h3>Прогресс между сессиями</h3><p>Отряд, инвентарь, знания, рецепт, практика Дара и незавершённое дело сохраняются после каждого действия.</p></div></article></section>`;
  }

  function renderCases() {
    const complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';
    const inc=save.incidents.bus_stop_flowers;
    const resultText=inc.result==='cleanse'?'Последний исход: Очищение':inc.result==='destroy'?'Последний исход: уничтожение':'Дело ещё не завершалось';
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Доска дел</div><h1>Доступные дела</h1><p>Сюжет и повторяемые происшествия используют одно сохранение.</p></div></div>
      <article class="card case-card"><span class="tag green">Главная история · уровень 2</span><h3>Корни памяти</h3><p>${complete?'Глава завершена. Решение, качество смеси и судьба семени записаны в журнале.':'Одержимое растение прорастает через чужие воспоминания.'}</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${complete?100:chapter2Progress()}%"></div></div><div class="progress-caption"><span>${complete?'Завершено':'В процессе'}</span><span>${complete?100:chapter2Progress()}%</span></div></div><div class="card-actions"><button class="secondary-button" data-action="start-chapter2">${complete?'Посмотреть итоги':'Продолжить'}</button></div></article>
      <article class="card case-card ${complete?'':'locked'}"><span class="tag ${complete?'violet':'red'}">Происшествие района</span><h3>Цветы на остановке</h3><p>Короткое повторяемое дело: расследование, подготовка, отряд и ритуальный бой с двумя способами решения.</p><ul class="requirement-list"><li><span class="check-dot">${complete?'✓':'×'}</span>Завершить уровень 2</li><li><span class="check-dot">${complete?'✓':'×'}</span>Рецепт Очищающей смеси</li><li><span class="check-dot">${complete?'✓':'×'}</span>Можно повторять без энергии расследования</li></ul>${complete?`<div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${incidentProgress()}%"></div></div><div class="progress-caption"><span>${resultText}</span><span>${inc.runs} прох.</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-incident">${inc.stage!=='brief'&&inc.stage!=='result'?'Продолжить дело':'Начать дело'}</button><button class="secondary-button" data-action="open-party-picker">Отряд</button></div>`:''}</article>
      ${complete?`<article class="card case-card"><span class="tag amber">Главная история · уровень 3</span><h3>Первый Свет</h3><p>Лиора Вейн пришла в дом. Глава доступна в этой связанной сборке.</p><div class="card-actions"><button class="secondary-button" data-action="chapter3-info">Описание главы</button></div></article>`:''}
    </section>`;
  }

  function renderInventory() {
    const entries=Object.entries(save.inventory.items).filter(([id,count])=>count>0&&fullItemCatalog[id]).map(([id,count])=>({...fullItemCatalog[id],count}));
    const filtered=inventoryFilter==='all'?entries:entries.filter(i=>i.category===inventoryFilter);
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Инвентарь</div><h1>Сумка героя</h1><p>Материалы, знания и приготовленные расходники.</p></div><span class="tag violet">${entries.reduce((s,i)=>s+i.count,0)} предметов</span></div>
      <div class="filter-row">${[['all','Все'],['key','Ключевые'],['consumable','Расходники'],['material','Материалы'],['knowledge','Знания'],['test','Технические']].map(([id,label])=>`<button class="filter-chip ${inventoryFilter===id?'active':''}" data-action="filter-inventory" data-filter="${id}">${label}</button>`).join('')}</div>
      ${filtered.length?`<div class="inventory-grid">${filtered.map(item=>`<button class="card item-card" data-action="item-details" data-item="${item.id}"><span class="item-count">${item.count}</span><div class="item-art">${icons[item.icon]}</div><h3>${item.name}</h3><p>${item.categoryLabel}</p></button>`).join('')}</div>`:`<div class="card empty-state">${icons.bag}<h3>В этой категории пусто</h3><p>Материалы можно получить в происшествии района.</p></div>`}
      ${save.progression.chapters.chapter_02_roots_of_memory.status==='completed'?`<div class="section-title"><h2>Быстрое действие</h2><span>Дом</span></div><article class="card meta-banner"><span>${icons.flask}</span><div><h3>Приготовить расходник</h3><p>Откройте лабораторию, чтобы превратить материалы в стабильную Очищающую смесь.</p><div class="inline-actions"><button class="small-button" data-action="open-lab">В лабораторию</button></div></div></article>`:''}</section>`;
  }

  function renderCompanions() {
    const owned=new Set(save.companions.owned); const selected=save.companions.activeParty?.[1]||null; const second=selected&&companions[selected];
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Коллекция</div><h1>Спутники</h1><p>Главный герой обязателен; Морвен занимает первый слот, второй можно менять.</p></div><span class="tag violet">${owned.size} / ${Object.keys(companions).length}</span></div>
      <div class="section-title" style="margin-top:0"><h2>Текущий отряд</h2><span>Герой + 2 спутника</span></div><div class="party-strip"><div class="party-slot"><div class="party-avatar">${escapeHtml(save.profile.heroName.charAt(0))}</div><strong>${escapeHtml(save.profile.heroName)}</strong><small>Главный герой</small></div><div class="party-slot"><div class="party-avatar">М</div><strong>Морвен</strong><small>Наставник</small></div><button class="party-slot ${second?'':'empty'}" data-action="open-party-picker"><div class="party-avatar">${second?second.initials:'+'}</div><strong>${second?second.name:'Пустой слот'}</strong><small>${second?'Нажмите для замены':'Выбрать спутника'}</small></button></div>
      <div class="section-title"><h2>Полученные спутники</h2><span>Выберите боевой бонус</span></div><div class="companion-list">${Object.values(companions).filter(c=>owned.has(c.id)).map(c=>companionCardPart3(c,selected===c.id)).join('')}</div>
      <div class="section-title"><h2>Будущие сюжетные спутники</h2><span>Откроются в главах</span></div><div class="companion-list">${Object.values(companions).filter(c=>c.group==='story'&&!owned.has(c.id)).map(c=>companionCardPart3(c,false)).join('')}</div></section>`;
  }

  function companionCardPart3(c,isSelected) {
    const owned=save.companions.owned.includes(c.id); const trust=save.companions.states?.[c.id]?.trust ?? (c.id==='morven'?save.relationships.morven.trust:0); const bonus=companionBonuses[c.id];
    return `<button class="card companion-card ${owned?'':'locked'}" data-action="companion-details" data-companion="${c.id}"><div class="companion-portrait">${c.initials}</div><div><h3>${c.name} ${isSelected?'<span class="tag green" style="margin-left:5px">В отряде</span>':''}</h3><p>${c.subtitle}<br>${c.roles}</p>${owned?`<div class="trust-line"><span class="faint" style="font-size:9px">${c.id==='morven'?`Доверие ${trust}/10`:bonus?bonus.short:'Получен'}</span></div>`:`<div class="trust-line"><span class="faint" style="font-size:9px">${c.unlock}</span></div>`}</div><span class="chevron">${icons.chevron}</span></button>`;
  }

  function renderJournal() {
    const complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed'; const decision=save.story.decisions['chapter_02.seed_fate'];
    const decisionText={save:'Очищенное семя сохранено дома.',destroy:'Семя уничтожено Искрой.',morven:'Семя передано Морвену.'}[decision]||'Решение ещё не принято.';
    const inc=save.incidents.bus_stop_flowers;
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Журнал</div><h1>История героя</h1><p>Сюжет, повторяемые дела и постоянный прогресс.</p></div></div><div class="timeline"><article class="card chapter-row completed"><span class="chapter-dot"></span><span class="tag green">Завершено</span><h3>Уровень 1 · Пробуждение</h3><p>Телекинез пробудился. Морвен заговорил.</p></article><article class="card chapter-row ${complete?'completed':'active'}"><span class="chapter-dot"></span><span class="tag ${complete?'green':'violet'}">${complete?'Завершено':'Текущая глава'}</span><h3>Уровень 2 · Корни памяти</h3><p>${complete?decisionText:'Расследование ещё не завершено.'}</p></article><article class="card chapter-row ${complete?'active':''}"><span class="chapter-dot"></span><span class="tag ${complete?'violet':''}">${complete?'Открыто':'Закрыто'}</span><h3>Уровень 3 · Первый Свет</h3><p>${complete?'Лиора Вейн ждёт у защитного контура.':'Откроется после уровня 2.'}</p></article></div>
      ${complete?`<div class="section-title"><h2>Дела района</h2><span>${inc.runs} завершено</span></div><article class="card status-list"><div class="status-row"><span>Цветы на остановке</span><span>${inc.runs?`${inc.runs} прохождений`:'не завершено'}</span></div><div class="status-row"><span>Последний исход</span><span>${inc.result==='cleanse'?'Очищение':inc.result==='destroy'?'Уничтожение':'—'}</span></div><div class="status-row"><span>Знание Памятного плюща</span><span>${save.codex.creatures.memorial_ivy?.knowledge||1}/3</span></div></article>`:''}
      <div class="section-title"><h2>Постоянный прогресс</h2><span>Сохраняется</span></div><div class="stats-grid"><div class="card stat-card"><strong>${save.profile.heroXp}/${save.profile.heroXpToNext}</strong><span>Опыт героя</span></div><div class="card stat-card"><strong>${save.soul.corruption}</strong><span>Скверна</span></div><div class="card stat-card"><strong>${save.companions.owned.length}</strong><span>Спутников</span></div><div class="card stat-card"><strong>${save.codex.discoveries.length}</strong><span>Записей Книги</span></div></div>
      ${complete?`<div class="inline-actions"><button class="secondary-button" data-action="open-codex">Книга Теней</button><button class="secondary-button" data-action="open-hero">Развитие героя</button></div>`:''}
      <div class="section-title"><h2>Техническое состояние</h2><span>Для тестирования</span></div><div class="card status-list"><div class="status-row"><span>Последняя запись</span><span>${formatDate(save.updatedAt)}</span></div><div class="status-row"><span>Ревизия</span><span>${save.revision}</span></div><div class="status-row"><span>Версия данных</span><span>save v${save.saveVersion}</span></div></div></section>`;
  }

  function knowledgeDots(level) { return `<div class="knowledge-dots">${[1,2,3].map(n=>`<i class="${level>=n?'on':''}"></i>`).join('')}</div>`; }

  function renderCodex() {
    const shadow=save.codex.creatures.shadow_spirit?.knowledge||1; const ivy=save.codex.creatures.memorial_ivy?.knowledge||0;
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Кабинет</div><h1>Книга Теней</h1><p>Знание растёт через сюжет и повторные встречи.</p></div><button class="small-button" data-action="navigate" data-screen="home">Домой</button></div><div class="codex-list">
      <article class="card codex-card"><div class="codex-head"><div class="codex-glyph">◌</div><div><span class="tag violet">Дух</span><h3>Теневой дух</h3><p>Существо, удерживаемое ритуальным камнем и незавершённой Связью.</p>${knowledgeDots(shadow)}</div></div><div class="codex-facts"><div class="codex-fact"><strong>Известно:</strong> намерения становятся читаемыми после Поиска.</div><div class="codex-fact"><strong>Решение:</strong> открыть Связь, снять Покров, удержать Печать и завершить Изгнанием.</div></div></article>
      <article class="card codex-card ${ivy?'':'locked'}"><div class="codex-head"><div class="codex-glyph">✿</div><div><span class="tag green">Одержимая флора</span><h3>${ivy?'Памятный плющ':'Неизвестная запись'}</h3><p>${ivy?'Растение питается незавершёнными воспоминаниями и сохраняет несколько Корневых Связей.':'Завершите «Корни памяти», чтобы открыть запись.'}</p>${knowledgeDots(ivy)}</div></div>${ivy?`<div class="codex-facts"><div class="codex-fact"><strong>Уровень 1:</strong> Очищение возможно, если сохранить хотя бы одну Связь.</div><div class="codex-fact"><strong>Уровень 2:</strong> дела с одержимой флорой дают +5 монет.</div><div class="codex-fact"><strong>Уровень 3:</strong> после дела выдаётся дополнительный алхимический материал.</div></div>`:''}</article></div></section>`;
  }

  function renderLaboratory() {
    const known=save.recipes.known.includes('cleansing_mixture'); const mastery=Number(save.recipes.mastery.cleansing_mixture||0); const can=canCraftMixture(); const inc=save.incidents.bus_stop_flowers;
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Комната дома</div><h1>Лаборатория</h1><p>Знакомые рецепты можно повторять без полной сюжетной мини-игры.</p></div><button class="small-button" data-action="navigate" data-screen="home">Домой</button></div>
      <article class="card recipe-card ${known?'':'locked'}"><div class="recipe-head"><div><span class="tag ${known?'green':'red'}">${known?'Рецепт изучен':'Рецепт закрыт'}</span><h3>Очищающая смесь</h3><p>Стабильная версия для одержимой флоры и слабых проклятий. В бою переносится как настоящий расходник.</p></div><div class="recipe-ring">${save.inventory.items.cleansing_mixture||0} шт.</div></div><div class="mastery-track">${[1,2,3].map(n=>`<i class="${mastery>=n?'on':''}"></i>`).join('')}</div><div class="section-title" style="margin-top:14px"><h2>Состав</h2><span>5 монет</span></div><div class="material-line"><span class="material-icon">${icons.flask}</span><div><strong>Лунная вода</strong><small>1 единица</small></div><b>${save.inventory.items.lunar_water||0}</b></div><div class="material-line"><span class="material-icon">${icons.crystal}</span><div><strong>Серебряная соль</strong><small>1 единица</small></div><b>${save.inventory.items.silver_salt||0}</b></div><div class="material-line"><span class="material-icon">${icons.leaf}</span><div><strong>Пепел корней</strong><small>1 единица</small></div><b>${save.inventory.items.root_ash||0}</b></div><div class="card-actions"><button class="primary-button" data-action="craft-mixture" ${known&&can?'':'disabled'}>${can?'Приготовить стабильную смесь':craftMissingText()}</button></div></article>
      <div class="section-title"><h2>Состояние рецепта</h2><span>Мастерство ${Math.min(3,mastery)}/3</span></div><article class="card status-list"><div class="status-row"><span>Сюжетная формула</span><span>${known?'сохранена':'не изучена'}</span></div><div class="status-row"><span>Качество повторного изготовления</span><span>стабильное</span></div><div class="status-row"><span>Готовые смеси</span><span>${save.inventory.items.cleansing_mixture||0}</span></div></article>
      ${currentScreen==='laboratory'&&inc.stage==='preparation'?`<div class="card-actions"><button class="secondary-button" data-action="resume-incident">Вернуться к подготовке дела</button></div>`:''}</section>`;
  }

  function renderHeroGrowth() {
    const m=save.meta.heroMastery; const spells=[
      ['telekinesis','Телекинез I','✦','Двигать объекты, разрушать Связи и взаимодействовать с окружением.',true],
      ['search','Поиск I','◉','Раскрывать скрытые свойства, намерения и ритуальные элементы.',true],
      ['shield','Щит I','◇','Защищать героя или свидетеля от следующего опасного действия.',true],
      ['purification','Очищение I','✧','Удалять одержимость без уничтожения носителя или существа.',save.progression.chapters.chapter_02_roots_of_memory.status==='completed']
    ];
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Главный герой</div><h1>Развитие Дара</h1><p>Практика растёт за правильное применение механик.</p></div><button class="small-button" data-action="navigate" data-screen="home">Домой</button></div><article class="card hero-panel"><div class="hero-orb">${escapeHtml(save.profile.heroName.charAt(0))}</div><div><span class="tag violet">Уровень ${save.profile.heroLevel}</span><h2>${escapeHtml(save.profile.heroName)}</h2><p>Опыт ${save.profile.heroXp} / ${save.profile.heroXpToNext}. Следующие применения Дара открываются сюжетными уровнями, а не покупкой.</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,save.profile.heroXp/save.profile.heroXpToNext*100)}%"></div></div></div></div></article><div class="section-title"><h2>Доступные техники</h2><span>Практика 1–3</span></div><div class="spell-grid">${spells.map(([id,name,glyph,desc,unlocked])=>`<article class="card spell-card ${unlocked?'':'locked'}"><div class="spell-symbol">${glyph}</div><h3>${name}</h3><p>${unlocked?desc:'Откроется после сюжетного изучения.'}</p><div class="mastery-track">${[1,2,3].map(n=>`<i class="${(m[id]||0)>=n?'on':''}"></i>`).join('')}</div></article>`).join('')}</div><div class="section-title"><h2>Принцип развития</h2><span>Зафиксировано</span></div><article class="card meta-banner"><span>${icons.circle}</span><div><h3>Новые применения вместо голых процентов</h3><p>Повторяемые дела пока повышают практику и опыт. Телекинез II и другие новые применения останутся привязаны к соответствующим сюжетным уровням.</p></div></article></section>`;
  }

  function canCraftMixture() {
    return save.currencies.coins>=5 && (save.inventory.items.lunar_water||0)>=1 && (save.inventory.items.silver_salt||0)>=1 && (save.inventory.items.root_ash||0)>=1;
  }
  function craftMissingText() {
    if (save.currencies.coins<5) return 'Не хватает монет';
    return 'Не хватает материалов';
  }
  function craftMixture() {
    if (!save.recipes.known.includes('cleansing_mixture') || !canCraftMixture()) { toast(craftMissingText()); return; }
    save.currencies.coins-=5;
    for (const id of ['lunar_water','silver_salt','root_ash']) save.inventory.items[id]-=1;
    save.inventory.items.cleansing_mixture=(save.inventory.items.cleansing_mixture||0)+1;
    save.recipes.mastery.cleansing_mixture=Math.min(3,Number(save.recipes.mastery.cleansing_mixture||0)+1);
    saveGame('Стабильная Очищающая смесь добавлена в сумку.');
  }

  function showRoom(id) {
    const room=save.house.rooms[id]||{unlocked:false};
    if (id==='study'&&room.unlocked) {
      openModal(`<div class="modal-header"><div><div class="eyebrow">Кабинет</div><h2>Книга и развитие</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Здесь хранятся записи о существах, результаты расследований и практика Дара.</p><div class="modal-actions"><button class="secondary-button" data-action="open-codex">Книга Теней</button><button class="primary-button" data-action="open-hero">Развитие героя</button></div></div>`); return;
    }
    if (id==='laboratory'&&room.unlocked) {
      openModal(`<div class="modal-header"><div><div class="eyebrow">Лаборатория</div><h2>Алхимия</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Повторяйте изученный рецепт, храните материалы и готовьте расходники перед делом.</p><div class="detail-row"><strong>Готовые смеси</strong><span>${save.inventory.items.cleansing_mixture||0}</span></div><div class="modal-actions"><button class="primary-button" data-action="open-lab">Открыть лабораторию</button></div></div>`); return;
    }
    const data={living_room:['Гостиная','Домашние разговоры, сообщения и сюжетные события между делами.','Открыта'],greenhouse:['Теплица','Выращивание редких растений и долгосрочные заказы.',room.projectUnlocked?'Проект получен; строительство позже':'Закрыта'],ritual_hall:['Ритуальный зал','Настройка Печатей и сложные командные ритуалы.','Закрыт'],artifact_room:['Комната артефактов','Хранение и настройка реликвий.','Закрыта']}[id]||['Комната','Содержимое появится позже.',room.unlocked?'Открыта':'Закрыта'];
    openModal(`<div class="modal-header"><div><div class="eyebrow">Комната дома</div><h2>${data[0]}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${data[1]}</p><div class="detail-row"><strong>Статус</strong><span>${data[2]}</span></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Вернуться</button></div></div>`);
  }

  function showItem(id) {
    const item=fullItemCatalog[id]; const count=save.inventory.items[id]||0; if(!item)return;
    openModal(`<div class="modal-header"><div><div class="eyebrow">${item.categoryLabel}</div><h2>${item.name}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><div class="item-art" style="height:110px">${icons[item.icon]}</div><p>${item.description}</p><div class="detail-row"><strong>Количество</strong><span>${count}</span></div>${id==='cleansing_mixture'?'<div class="detail-row"><strong>Перенос в бой</strong><span>автоматически при выборе Очищения</span></div>':''}<div class="modal-actions"><button class="primary-button" data-action="close-modal">Убрать в сумку</button></div></div>`);
  }

  function showCompanion(id) {
    const c=companions[id]; const owned=save.companions.owned.includes(id); const selected=save.companions.activeParty?.[1]===id; const bonus=companionBonuses[id];
    const base=c.active?`<div class="detail-list"><div class="detail-row"><strong>Активная способность</strong><span>${c.active}</span></div><div class="detail-row"><strong>Реакция</strong><span>${c.reaction}</span></div><div class="detail-row"><strong>Пассивная способность</strong><span>${c.passive}</span></div><div class="detail-row"><strong>Резонанс</strong><span>${c.resonance}</span></div></div>`:owned?`<div class="detail-row"><strong>Бонус в текущем происшествии</strong><span>${bonus?`${bonus.title}: ${bonus.short}`:(c.note||'Получен')}</span></div>`:`<div class="detail-row"><strong>Получение</strong><span>${c.unlock}</span></div>`;
    const partyAction=owned&&id!=='morven'?`<button class="${selected?'secondary-button':'primary-button'}" data-action="set-party-member" data-companion="${selected?'':id}">${selected?'Убрать из отряда':'Взять в отряд'}</button>`:'';
    openModal(`<div class="modal-header"><div><div class="eyebrow">${owned?'Получен':'Пока закрыт'}</div><h2>${c.name}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${c.subtitle} · ${c.rarity} · ${c.direction}<br>${c.roles}</p>${base}<div class="modal-actions">${partyAction}<button class="secondary-button" data-action="close-modal">Закрыть</button></div></div>`);
  }

  function showPartyPicker() {
    const selected=save.companions.activeParty?.[1]||null; const choices=save.companions.owned.filter(id=>id!=='morven'&&companions[id]);
    openModal(`<div class="modal-header"><div><div class="eyebrow">Формирование отряда</div><h2>Второй спутник</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Морвен остаётся первым спутником. Выбранный персонаж даёт одно командное действие в происшествии.</p><div class="party-select-list">${choices.length?choices.map(id=>{const c=companions[id],b=companionBonuses[id];return `<button class="party-select ${selected===id?'active':''}" data-action="set-party-member" data-companion="${id}"><div class="party-avatar">${c.initials}</div><div><strong>${c.name}</strong><small>${c.roles}</small><small class="party-bonus">${b?`${b.title}: ${b.short}`:'Бонус появится позже'}</small></div><span>${selected===id?'✓':'›'}</span></button>`}).join(''):'<div class="card empty-state"><h3>Нет доступных спутников</h3><p>Завершите договор новичка после главы 2.</p></div>'}</div>${selected?'<div class="modal-actions"><button class="secondary-button" data-action="set-party-member" data-companion="">Оставить слот пустым</button></div>':''}</div>`);
  }

  function showChapter3Info() {
    openModal(`<div class="modal-header"><div><div class="eyebrow">Следующая часть</div><h2>«Первый Свет»</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Лиора Вейн приходит в дом, герой выбирает отношение к Ордену, расследует заражённый маяк и учится защищать союзника и объект. Глава 3 подключена к дому, отряду, Книге Теней и общему сохранению.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);
  }

  function openDebug() {
    const lab=save.house.rooms.laboratory.unlocked; const crystalCount=save.inventory.items.test_crystal||0; const inc=save.incidents.bus_stop_flowers;
    openModal(`<div class="modal-header"><div><div class="eyebrow">Техническая панель</div><h2>Проверка связанной сборки</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Технические кнопки не являются игровым контентом.</p><div class="debug-section"><h3>Изменить данные</h3><div class="debug-grid"><button class="debug-button" data-action="debug-coins"><strong>+10 монет</strong><span>Проверить валюту</span></button><button class="debug-button" data-action="debug-crystal"><strong>${crystalCount?'Убрать':'Добавить'} кристалл</strong><span>Проверить инвентарь</span></button><button class="debug-button" data-action="debug-materials"><strong>+1 комплект материалов</strong><span>Лаборатория</span></button><button class="debug-button" data-action="debug-corruption"><strong>+1 Скверна</strong><span>Текущее: ${save.soul.corruption}</span></button><button class="debug-button" data-action="debug-cleanse"><strong>Очистить Скверну</strong><span>Сбросить до 0</span></button><button class="debug-button" data-action="debug-scar"><strong>${save.soul.scars.length?'Убрать':'Добавить'} Шрам</strong><span>Временный тест</span></button><button class="debug-button" data-action="debug-lab"><strong>${lab?'Закрыть':'Открыть'} лабораторию</strong><span>Проверить комнаты</span></button><button class="debug-button" data-action="debug-trust-up"><strong>+1 доверие Морвена</strong><span>${save.relationships.morven.trust}/10</span></button></div></div><div class="debug-section"><h3>Контент</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-incident"><strong>Сбросить происшествие</strong><span>Прохождения: ${inc.runs}</span></button><button class="debug-button" data-action="debug-reset-chapter2"><strong>Сбросить «Корни памяти»</strong><span>Также сбросит мета-прогресс</span></button></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid"><button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать JSON</span></button><button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить JSON</span></button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div class="debug-section"><h3>Текущее состояние</h3><pre class="json-preview">${escapeHtml(JSON.stringify(save,null,2))}</pre></div><div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Полностью удалить сохранение</button></div></div>`);
  }

  function resetC2Progress() {
    const oldEnding=save.story.decisions['chapter_02.seed_fate'];
    if(oldEnding==='morven') save.relationships.morven.trust=Math.max(0,save.relationships.morven.trust-1);
    save.companions.states.morven.trust=save.relationships.morven.trust;
    save.chapter2=createChapter2State(); save.progression.chapters.chapter_02_roots_of_memory={status:'available',progress:0}; save.progression.chapters.chapter_03_first_light={status:'locked',progress:0}; save.progression.activeQuestId='chapter_02_roots_of_memory';
    for(const id of ['cleansing_mixture','memorial_ivy_page','memorial_seed','greenhouse_plan','lunar_water','silver_salt','root_ash','bus_ticket_echo']) delete save.inventory.items[id];
    save.recipes.known=save.recipes.known.filter(x=>x!=='cleansing_mixture'); delete save.recipes.mastery.cleansing_mixture;
    for(const id of ['asha','quiet_echo','archive_scribe','trail_hound']){save.companions.owned=save.companions.owned.filter(x=>x!==id);delete save.companions.states[id];}
    save.companions.activeParty=['morven',null];
    for(const key of Object.keys(save.story.flags)) if(key.startsWith('chapter_02.')||key.startsWith('meta.')) delete save.story.flags[key];
    delete save.story.decisions['chapter_02.seed_fate']; delete save.story.decisions['incident.bus_stop.last_resolution'];
    delete save.codex.creatures.memorial_ivy; save.codex.discoveries=save.codex.discoveries.filter(x=>x!=='memorial_ivy');
    save.house.rooms.greenhouse.projectUnlocked=false; save.profile.heroLevel=2; save.profile.accountLevel=2; save.profile.heroXp=0;
    save.meta=createPart3Meta(); save.incidents={bus_stop_flowers:createIncidentState('locked')}; currentScreen='home'; saveGame('Глава 2 и мета-прогресс части 3 сброшены.');
  }

  function incidentProgress() {
    const inc=save.incidents.bus_stop_flowers; const map={brief:0,investigation:25,preparation:50,battle:70,result:100}; return map[inc.stage]||0;
  }

  function incidentSave(message) {
    const inc=save.incidents.bus_stop_flowers; if(inc.status==='available')inc.status='in_progress'; currentScreen='incident'; saveGame(message);
  }

  function incidentShell(title,subtitle,body,footer='',hud='') {
    app.innerHTML=`<div class="inc-shell"><header class="inc-top"><button data-action="incident-pause" aria-label="Вернуться домой">‹</button><div><div class="eyebrow">Происшествие района</div><h1>${title}</h1><small>${subtitle}</small></div><div class="inc-hud">${hud}</div></header><main class="inc-main">${body}</main>${footer?`<footer class="inc-footer">${footer}</footer>`:'<footer class="inc-footer"></footer>'}</div>`;
  }

  function renderIncident() {
    const inc=save.incidents.bus_stop_flowers;
    if (inc.status==='locked') { currentScreen='cases'; saveGame('Происшествие откроется после уровня 2.'); return; }
    ({brief:renderIncidentBrief,investigation:renderIncidentInvestigation,preparation:renderIncidentPreparation,battle:renderIncidentBattle,result:renderIncidentResult}[inc.stage]||renderIncidentBrief)();
  }

  function selectedCompanion() { const id=save.companions.activeParty?.[1]; return id&&companions[id]?companions[id]:null; }

  function renderIncidentBrief() {
    const inc=save.incidents.bus_stop_flowers, c=selectedCompanion();
    incidentShell('Цветы на остановке','Короткое дело · 10–15 минут',`<section class="inc-hero"><div class="eyebrow">Одержимая флора</div><h2>Астры повторяют последние слова пассажиров</h2><p>Люди собираются вокруг остановки, пытаясь услышать умерших близких. Один мужчина уже тянется к корням, которые проросли под скамейкой.</p><div class="inc-brief-grid"><div><b>Расследование</b><span>Найдите минимум две улики</span></div><div><b>Подготовка</b><span>Очищение или уничтожение</span></div><div><b>Отряд</b><span>${c?c.name:'Только Морвен'}</span></div></div></section><div class="section-title"><h2>Командный бонус</h2><span>Можно изменить до начала</span></div><article class="card meta-banner"><span>${c?c.initials:'М'}</span><div><h3>${c?c.name:'Морвен'}</h3><p>${c&&companionBonuses[c.id]?`${companionBonuses[c.id].title}: ${companionBonuses[c.id].short}`:'Хищное внимание: раскрывает одну скрытую Связь.'}</p><div class="inline-actions"><button class="small-button" data-action="open-party-picker">Изменить отряд</button></div></div></article>${inc.runs?`<div class="section-title"><h2>История дела</h2><span>${inc.runs} прохождений</span></div><article class="card status-list"><div class="status-row"><span>Последний исход</span><span>${inc.result==='cleanse'?'Очищение':'Уничтожение'}</span></div><div class="status-row"><span>Знание флоры</span><span>${save.codex.creatures.memorial_ivy?.knowledge||1}/3</span></div></article>`:''}`,`<button class="primary-button" data-action="incident-begin">Начать расследование</button>`);
  }

  const incidentClueDefs={
    roots:{icon:'✿',name:'Корни под скамейкой',desc:'Под асфальтом тянется один живой узел.',text:'Корни образуют Связь с засохшим букетом. Её можно разрушить телекинезом.'},
    recording:{icon:'▤',name:'Запись с телефона',desc:'На видео слышна фраза до появления цветов.',text:'Запись раскрывает вторую Связь: последние слова удерживают форму существа.'},
    witness:{icon:'人',name:'Мужчина у клумбы',desc:'Он уверен, что слышит голос жены.',text:'Свидетель ослаблен, но ещё способен отойти от корней. В бою его Стойкость будет выше.'},
    cache:{icon:'◇',name:'Щель под расписанием',desc:'Морвен чувствует металлический запах.',text:'Найдена серебряная соль — материал для следующей смеси.'}
  };

  function renderIncidentInvestigation() {
    const inc=save.incidents.bus_stop_flowers; const found=['roots','recording','witness'].filter(k=>inc.clues[k]).length;
    incidentShell('Остановка № 17','Найдите минимум две улики',`<div class="c2-location-scene c2-scene-yard"><div class="c2-scene-label">Вечер · жилой район</div><div class="inc-flower" style="position:absolute;right:13%;bottom:10%;font-size:72px">✿</div></div><div class="section-title"><h2>Точки интереса</h2><span>Время: ${inc.time}</span></div><div class="inc-clues">${Object.entries(incidentClueDefs).map(([id,d])=>{const done=inc.clues[id],seen=inc.seen[id],cost=1;return `<button class="inc-clue ${done?'done':''}" data-action="incident-clue" data-clue="${id}" ${done||inc.time<cost?'disabled':''}><span class="inc-clue-icon">${done?'✓':d.icon}</span><div><strong>${d.name}</strong><small>${done?(seen==='companion'?'Найдена спутником':d.text):d.desc}</small></div><em>${done?'Готово':'−1'}</em></button>`}).join('')}</div><div class="section-title"><h2>Прогресс</h2><span>${found}/2 обязательных наблюдения</span></div><article class="card status-list"><div class="status-row"><span>Связь букета</span><span>${inc.clues.roots?'раскрыта':'не найдена'}</span></div><div class="status-row"><span>Связь последних слов</span><span>${inc.clues.recording?'раскрыта':'не найдена'}</span></div><div class="status-row"><span>Состояние свидетеля</span><span>${inc.clues.witness?'изучено':'неизвестно'}</span></div></article>`,`<div style="display:grid;grid-template-columns:1fr auto;gap:7px"><button class="primary-button" data-action="incident-to-preparation" ${found>=2?'':'disabled'}>Завершить расследование</button><button class="secondary-button" data-action="incident-reset-investigation">Сброс</button></div>`,`<span>◷ ${inc.time}</span>`);
  }

  function renderIncidentPreparation() {
    const inc=save.incidents.bus_stop_flowers,c=selectedCompanion(),potions=save.inventory.items.cleansing_mixture||0;
    incidentShell('Подготовка','Выберите ритуальный исход',`<div class="section-title" style="margin-top:2px"><h2>Способ решения</h2><span>В бою можно выполнить только выбранный путь</span></div><div class="inc-route-grid"><button class="inc-route ${inc.approach==='cleanse'?'active':''}" data-action="incident-approach" data-approach="cleanse" ${potions?'':'disabled'}><div class="spell-symbol">✧</div><h3>Очищение</h3><p>Использовать смесь, снять Покров и сохранить хотя бы одну Связь.</p><span class="tag ${potions?'green':'red'}" style="margin-top:9px">Смесей: ${potions}</span></button><button class="inc-route ${inc.approach==='destroy'?'active':''}" data-action="incident-approach" data-approach="destroy"><div class="spell-symbol">✦</div><h3>Уничтожение</h3><p>Разорвать обе Связи и разрушить источник телекинезом. Смесь не нужна.</p><span class="tag amber" style="margin-top:9px">Быстрее, меньше знания</span></button></div>${!potions?`<article class="card meta-banner" style="margin-top:10px"><span>${icons.flask}</span><div><h3>Нет готовой смеси</h3><p>${canCraftMixture()?'Материалов достаточно: приготовьте смесь прямо сейчас.':'Нужны лунная вода, серебряная соль, пепел корней и 5 монет.'}</p><div class="inline-actions"><button class="small-button" data-action="craft-mixture" ${canCraftMixture()?'':'disabled'}>Приготовить</button><button class="small-button" data-action="incident-to-lab">Лаборатория</button></div></div></article>`:''}<div class="section-title"><h2>Отряд</h2><span>Общее командное действие</span></div><article class="card meta-banner"><span>${c?c.initials:'М'}</span><div><h3>${c?c.name:'Морвен'}</h3><p>${c&&companionBonuses[c.id]?`${companionBonuses[c.id].title}: ${companionBonuses[c.id].short}`:'Хищное внимание: раскрывает одну скрытую Связь.'}</p><div class="inline-actions"><button class="small-button" data-action="open-party-picker">Изменить</button></div></div></article><div class="section-title"><h2>Что известно</h2><span>Из расследования</span></div><article class="card status-list"><div class="status-row"><span>Связь букета</span><span>${inc.clues.roots?'известна':'скрыта'}</span></div><div class="status-row"><span>Связь последних слов</span><span>${inc.clues.recording?'известна':'скрыта'}</span></div><div class="status-row"><span>Стойкость свидетеля</span><span>${inc.clues.witness?'повышена':'обычная'}</span></div></article>`,`<button class="primary-button" data-action="incident-start-battle" ${inc.approach?'':'disabled'}>Начать ритуал</button>`);
  }

  function createIncidentBattle() {
    const inc=save.incidents.bus_stop_flowers,c=selectedCompanion();
    return {round:1,actions:2,energy:c?.id==='quiet_echo'?5:4,maxEnergy:6,teamUsed:false,freeSearch:true,witness:inc.clues.witness?4:3,shield:c?.id==='asha'?1:0,pokrov:2,resonance:0,links:{bouquet:{name:'Засохший букет',revealed:!!inc.clues.roots,broken:false},phrase:{name:'Последние слова',revealed:!!inc.clues.recording,broken:false}},potionUsed:false,targetMode:null,status:'active',log:['Ритуал начат.'],result:null};
  }

  function normalizeIncidentBattle(value) {
    const fresh=createIncidentBattleSafe(); const b={...fresh,...(value||{})}; b.links={bouquet:{...fresh.links.bouquet,...(value?.links?.bouquet||{})},phrase:{...fresh.links.phrase,...(value?.links?.phrase||{})}}; return b;
  }
  function createIncidentBattleSafe() { return {round:1,actions:2,energy:4,maxEnergy:6,teamUsed:false,freeSearch:true,witness:3,shield:0,pokrov:2,resonance:0,links:{bouquet:{name:'Засохший букет',revealed:false,broken:false},phrase:{name:'Последние слова',revealed:false,broken:false}},potionUsed:false,targetMode:null,status:'active',log:[],result:null}; }
  function incidentLinks(b){return Object.values(b.links)}
  function incidentAllRevealed(b){return incidentLinks(b).every(l=>l.revealed)}
  function incidentBrokenCount(b){return incidentLinks(b).filter(l=>l.broken).length}
  function incidentIntactCount(b){return incidentLinks(b).filter(l=>!l.broken).length}
  function incidentFinalReason(b,route) {
    if (b.status!=='active') return 'Ритуал завершён.';
    if (b.actions<1) return 'Нет действия героя.';
    if (route==='cleanse') {
      if (!b.potionUsed) return 'Сначала примените Очищающую смесь.';
      if (!incidentAllRevealed(b)) return 'Раскройте обе Связи.';
      if (b.pokrov>0) return `Снимите Покров: осталось ${b.pokrov}.`;
      if (incidentIntactCount(b)<1) return 'Нужно сохранить хотя бы одну Связь.';
      if (b.energy<2) return 'Нужно 2 энергии.';
      return '';
    }
    if (!incidentAllRevealed(b)) return 'Раскройте обе Связи.';
    if (incidentBrokenCount(b)<2) return 'Разорвите обе Связи.';
    if (b.pokrov>0) return `Снимите Покров: осталось ${b.pokrov}.`;
    if (b.energy<1) return 'Нужна 1 энергия.';
    return '';
  }

  function renderIncidentBattle() {
    const inc=save.incidents.bus_stop_flowers,b=normalizeIncidentBattle(inc.battle||createIncidentBattleSafe()); inc.battle=b; const route=inc.approach; const finalReason=incidentFinalReason(b,route); const c=selectedCompanion();
    const ritualItems=route==='cleanse'?[
      ['Обе Связи раскрыты',incidentAllRevealed(b)],['Покров снят',b.pokrov===0],['Смесь применена',b.potionUsed],['Хотя бы 1 Связь сохранена',incidentIntactCount(b)>=1],['Свидетель в сознании',b.witness>0]
    ]:[['Обе Связи раскрыты',incidentAllRevealed(b)],['Обе Связи разорваны',incidentBrokenCount(b)===2],['Покров снят',b.pokrov===0],['Свидетель в сознании',b.witness>0]];
    const linkHtml=Object.entries(b.links).map(([id,l])=>`<button class="inc-link ${!l.revealed?'hidden-link':''} ${l.broken?'broken':''} ${b.targetMode==='telekinesis'&&l.revealed&&!l.broken?'selectable':''}" data-action="incident-link" data-link="${id}" ${b.targetMode==='telekinesis'&&l.revealed&&!l.broken?'':'disabled'}><b>${l.revealed?l.name:'Скрытая Связь'}</b>${l.broken?'разорвана':l.revealed?'активна':'нужен Поиск'}</button>`).join('');
    const teamName=c?(companionBonuses[c.id]?.title||'Командное действие'):'Хищное внимание'; const teamDesc=c?(companionBonuses[c.id]?.short||'Бонус появится позже'):'Раскрывает одну скрытую Связь.';
    incidentShell('Ритуал на остановке',`${route==='cleanse'?'Очищение':'Уничтожение'} · раунд ${b.round}`,`<div class="inc-battle"><section class="inc-ritual"><div class="inc-ritual-head"><div><span>Ритуальная цель</span><b>${route==='cleanse'?'Очистить флору':'Уничтожить источник'}</b></div><span class="tag ${route==='cleanse'?'green':'red'}">${route==='cleanse'?'Спасение':'Разрушение'}</span></div><div class="inc-ritual-list">${ritualItems.map(([t,d])=>`<div class="${d?'done':''}">${t}</div>`).join('')}</div><small>Провал: свидетель теряет всю Стойкость или заканчивается 4-й раунд. ${finalReason?`Финал недоступен: ${finalReason}`:'Финальное действие доступно.'}</small></section><section class="inc-intent"><span>Намерение</span><b>Шёпот корней</b><small>В конце хода снимает 1 Стойкость свидетеля. Щит блокирует потерю.</small></section><section class="inc-enemy"><div class="inc-flower">✿</div><div><h2>Говорящие астры</h2><div class="inc-stats"><span>Покров<b>${b.pokrov}</b></span><span>Свидетель<b>${b.witness}</b></span><span>Резонанс<b>${b.resonance}</b></span></div><div class="inc-links">${linkHtml}</div></div></section><section class="inc-party"><div><strong>${escapeHtml(save.profile.heroName)}</strong><small>действия ${b.actions}/2 · энергия ${b.energy}/${b.maxEnergy}</small></div><div><strong>Морвен</strong><small>${b.freeSearch?'первый Поиск бесплатен':'пассив использован'}</small></div><div><strong>${c?c.name:'Свободный слот'}</strong><small>${b.teamUsed?'действие использовано':teamName}</small></div></section><section class="inc-actions-wrap"><div class="inc-actions-head"><b>Действия героя</b><span>${b.targetMode==='telekinesis'?'Выберите раскрытую Связь':''}</span></div><div class="inc-actions"><button class="inc-action" data-action="incident-battle-action" data-incident-action="search" ${b.status!=='active'||incidentAllRevealed(b)||b.energy<1||(b.actions<1&&!b.freeSearch)?'disabled':''}><em>${b.freeSearch?'0 действий':'1 действие'}</em><b>Поиск</b><span>Раскрыть скрытую Связь · 1 энергия</span></button><button class="inc-action" data-action="incident-battle-action" data-incident-action="telekinesis" ${b.status!=='active'||b.actions<1||b.energy<1||!incidentLinks(b).some(l=>l.revealed&&!l.broken)?'disabled':''}><em>1 действие</em><b>Телекинез</b><span>Разорвать раскрытую Связь и снять 1 Покров</span></button><button class="inc-action" data-action="incident-battle-action" data-incident-action="shield" ${b.status!=='active'||b.actions<1||b.energy<1?'disabled':''}><em>1 действие</em><b>Щит</b><span>Защитить свидетеля от намерения</span></button>${route==='cleanse'?`<button class="inc-action" data-action="incident-battle-action" data-incident-action="mixture" ${b.status!=='active'||b.actions<1||b.potionUsed||(save.inventory.items.cleansing_mixture||0)<1?'disabled':''}><em>1 действие</em><b>Применить смесь</b><span>Снять 1 Покров и подготовить Очищение</span></button>`:`<button class="inc-action" data-action="incident-team-action" ${b.status!=='active'||b.teamUsed?'disabled':''}><em>команда</em><b>${teamName}</b><span>${teamDesc}</span></button>`}<button class="inc-action" data-action="incident-team-action" ${route==='destroy'?'style="display:none"':''} ${b.status!=='active'||b.teamUsed?'disabled':''}><em>команда</em><b>${teamName}</b><span>${teamDesc}</span></button><button class="inc-action ${route==='cleanse'?'finish':'danger'}" data-action="incident-final" ${finalReason?'disabled':''}><em>финал</em><b>${route==='cleanse'?'Очищение':'Разрушить источник'}</b><span>${finalReason||'Завершить ритуал выбранным способом'}</span></button></div></section>${b.status==='lost'?`<div class="inc-loss"><h2>Ритуал сорван</h2><p>${b.witness<=0?'Свидетель подчинился голосам и коснулся корней.':'Эхо последних слов вырвалось на площадь.'}</p><button class="primary-button" data-action="incident-retry-battle">Повторить бой</button></div>`:''}</div>`,`<button class="secondary-button" data-action="incident-end-turn" ${b.status!=='active'?'disabled':''}>Завершить ход</button>`,`<span>⚡ ${b.energy}</span><span>◷ ${b.round}/4</span>`);
  }

  function incidentUseAction(action) {
    const inc=save.incidents.bus_stop_flowers,b=normalizeIncidentBattle(inc.battle); if(!b||b.status!=='active')return; inc.battle=b;
    if(action==='search'){
      if(b.energy<1||incidentAllRevealed(b)||(b.actions<1&&!b.freeSearch))return;
      b.energy-=1; if(b.freeSearch)b.freeSearch=false;else b.actions-=1;
      const hidden=Object.entries(b.links).find(([,l])=>!l.revealed); if(hidden){hidden[1].revealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push(`Поиск раскрыл: ${hidden[1].name}.`);} b.targetMode=null;
    }
    if(action==='telekinesis'){ if(b.actions<1||b.energy<1)return;b.targetMode='telekinesis';incidentSave(null);return; }
    if(action==='shield'){ if(b.actions<1||b.energy<1)return;b.actions-=1;b.energy-=1;b.shield+=1;b.log.push('Щит защищает свидетеля.'); }
    if(action==='mixture'){ if(b.actions<1||b.potionUsed||(save.inventory.items.cleansing_mixture||0)<1)return;b.actions-=1;b.potionUsed=true;b.pokrov=Math.max(0,b.pokrov-1);save.inventory.items.cleansing_mixture-=1;b.resonance=Math.min(6,b.resonance+1);b.log.push('Очищающая смесь впиталась в корни.'); }
    incidentSave(null);
  }

  function incidentBreakLink(id) {
    const b=normalizeIncidentBattle(save.incidents.bus_stop_flowers.battle),l=b?.links?.[id]; if(!b||b.status!=='active'||b.targetMode!=='telekinesis'||!l?.revealed||l.broken||b.actions<1||b.energy<1)return;
    b.actions-=1;b.energy-=1;l.broken=true;b.pokrov=Math.max(0,b.pokrov-1);b.resonance=Math.min(6,b.resonance+1);b.targetMode=null;b.log.push(`Связь «${l.name}» разорвана.`);save.incidents.bus_stop_flowers.battle=b;incidentSave(null);
  }

  function incidentTeamAction() {
    const b=normalizeIncidentBattle(save.incidents.bus_stop_flowers.battle); if(!b||b.status!=='active'||b.teamUsed)return; const c=selectedCompanion(); b.teamUsed=true;
    const type=c&&companionBonuses[c.id]?.battle;
    if(type==='shield'){b.shield+=1;b.log.push('Аша создаёт Покров духа.');}
    else if(type==='energy'){b.energy=Math.min(b.maxEnergy,b.energy+2);b.log.push('Тихий отголосок возвращает энергию.');}
    else if(type==='reveal'){for(const l of incidentLinks(b))l.revealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push('Писец сверяет записи и раскрывает Связи.');}
    else if(type==='weaken'){b.pokrov=Math.max(0,b.pokrov-1);b.resonance=Math.min(6,b.resonance+1);b.log.push('Фамильяр находит слабый корень.');}
    else {const hidden=Object.values(b.links).find(l=>!l.revealed);if(hidden){hidden.revealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push('Морвен раскрывает скрытую Связь.');}else b.log.push('Морвен подтверждает намерение существа.');}
    save.incidents.bus_stop_flowers.battle=b;incidentSave(null);
  }

  function incidentEndTurn() {
    const b=normalizeIncidentBattle(save.incidents.bus_stop_flowers.battle); if(!b||b.status!=='active')return;
    if(b.shield>0){b.shield-=1;b.log.push('Щит блокировал Шёпот корней.');}else{b.witness=Math.max(0,b.witness-1);b.log.push('Свидетель потерял 1 Стойкость.');}
    if(b.witness<=0||b.round>=4){b.status='lost';}
    else{b.round+=1;b.actions=2;b.teamUsed=false;b.energy=Math.min(b.maxEnergy,b.energy+1);b.targetMode=null;}
    save.incidents.bus_stop_flowers.battle=b;incidentSave(b.status==='lost'?'Ритуал сорван.':'Начался новый раунд.');
  }

  function incidentFinal() {
    const inc=save.incidents.bus_stop_flowers,b=normalizeIncidentBattle(inc.battle); const reason=incidentFinalReason(b,inc.approach); if(reason){toast(reason);return;}
    b.actions-=1;b.energy-=inc.approach==='cleanse'?2:1;b.status='won';b.result=inc.approach;inc.battle=b;inc.result=inc.approach;inc.stage='result';applyIncidentRewards();incidentSave(inc.approach==='cleanse'?'Флора очищена.':'Источник уничтожен.');
  }

  function applyIncidentRewards() {
    const inc=save.incidents.bus_stop_flowers;if(inc.resultApplied)return;inc.resultApplied=true;inc.runs=(inc.runs||0)+1;inc.status='completed';
    const knowledge=save.codex.creatures.memorial_ivy?.knowledge||1;let coins=inc.result==='cleanse'?25:18;if(knowledge>=2)coins+=5;
    const xp=inc.result==='cleanse'?20:15;save.currencies.coins+=coins;save.profile.heroXp=Math.min(save.profile.heroXpToNext-1,(save.profile.heroXp||0)+xp);
    save.inventory.items.lunar_water=(save.inventory.items.lunar_water||0)+1;save.inventory.items.silver_salt=(save.inventory.items.silver_salt||0)+1;save.inventory.items.root_ash=(save.inventory.items.root_ash||0)+1;
    if(knowledge>=3){const ids=['lunar_water','silver_salt','root_ash'];const extra=ids[inc.runs%ids.length];save.inventory.items[extra]=(save.inventory.items[extra]||0)+1;}
    const c=selectedCompanion();if(c){save.companions.states[c.id] ||= {level:1,trust:0,rank:0};save.companions.states[c.id].trust=(save.companions.states[c.id].trust||0)+1;}
    save.meta.heroMastery.search=Math.min(3,(save.meta.heroMastery.search||1)+1);
    if(inc.result==='cleanse'){save.meta.heroMastery.purification=Math.min(3,(save.meta.heroMastery.purification||1)+1);save.codex.creatures.memorial_ivy.knowledge=Math.min(3,(save.codex.creatures.memorial_ivy.knowledge||1)+1);}else save.meta.heroMastery.telekinesis=Math.min(3,(save.meta.heroMastery.telekinesis||1)+1);
    save.story.decisions['incident.bus_stop.last_resolution']=inc.result;save.story.flags['incident.bus_stop.completed']=true;save.inventory.items.bus_ticket_echo=1;
    save.meta.incidentHistory.unshift({id:'bus_stop_flowers',result:inc.result,at:nowIso(),coins,xp});save.meta.incidentHistory=save.meta.incidentHistory.slice(0,10);
  }

  function renderIncidentResult() {
    const inc=save.incidents.bus_stop_flowers,clean=inc.result==='cleanse',hist=save.meta.incidentHistory[0]||{coins:clean?25:18,xp:clean?20:15};
    incidentShell('Дело завершено',clean?'Флора очищена':'Источник уничтожен',`<section class="card inc-result"><div class="inc-result-glyph">${clean?'✧':'✦'}</div><h2>${clean?'Голоса стихли':'Корни рассыпались в пепел'}</h2><p>${clean?'Астры вернулись к обычному цвету. Мужчина не услышал голос жены снова, но смог отойти от клумбы сам.':'Телекинез вырвал обе Связи. Угроза исчезла быстро, но часть памяти существа потеряна навсегда.'}</p><div class="reward-grid"><div><b>+${hist.coins} монет</b><span>Награда за дело</span></div><div><b>+${hist.xp} опыта</b><span>Практика героя</span></div><div><b>+3 материала</b><span>Лаборатория</span></div><div><b>${clean?`Знание ${save.codex.creatures.memorial_ivy.knowledge}/3`:'Телекинез: практика'}</b><span>${clean?'Книга Теней':'Развитие Дара'}</span></div></div></section><div class="section-title"><h2>Постоянные последствия</h2><span>Сохранено</span></div><article class="card status-list"><div class="status-row"><span>Исход</span><span>${clean?'Очищение':'Уничтожение'}</span></div><div class="status-row"><span>Всего прохождений</span><span>${inc.runs}</span></div><div class="status-row"><span>Спутник</span><span>${selectedCompanion()?.name||'Морвен'}</span></div><div class="status-row"><span>Запись Книги</span><span>обновлена</span></div></article>`,`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="secondary-button" data-action="incident-replay">Повторить дело</button><button class="primary-button" data-action="incident-finish">Вернуться домой</button></div>`);
  }

  function resetIncidentForReplay(preserveRuns=true) {
    const old=save.incidents.bus_stop_flowers; const fresh=createIncidentState('available'); if(preserveRuns){fresh.runs=old.runs||0;fresh.result=old.result||null;} save.incidents.bus_stop_flowers=fresh;
  }


  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;

    if (action === 'modal-backdrop' && event.target === button) { closeModal(); return; }
    if (action === 'close-modal') { closeModal(); return; }

    switch (action) {
      case 'new-game': showNewGameModal(); break;
      case 'continue-game':
        save = readSave();
        if (!save) { toast('Сохранение не найдено.'); renderStart(); break; }
        currentScreen = save.progression.currentScreen || 'home'; renderGame(); break;
      case 'choose-hero':
        selectedHeroType = button.dataset.hero;
        document.querySelectorAll('.hero-choice').forEach(el => el.classList.toggle('active', el.dataset.hero === selectedHeroType));
        const nameInput = document.getElementById('hero-name-input');
        if (nameInput && (nameInput.value === 'Александр' || nameInput.value === 'Александра')) nameInput.value = selectedHeroType === 'witch' ? 'Александра' : 'Александр';
        break;
      case 'create-save': {
        const nameInput = document.getElementById('hero-name-input');
        const name = (nameInput ? nameInput.value.trim() : '') || (selectedHeroType === 'witch' ? 'Александра' : 'Александр');
        const existing = localStorage.getItem(SAVE_KEY);
        if (existing && !confirm('Старое сохранение будет заменено. Продолжить?')) break;
        save = createDefaultSave(selectedHeroType, name); currentScreen = 'home';
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        closeModal(); renderGame(); toast('Новое сохранение создано.'); break;
      }
      case 'navigate': currentScreen = button.dataset.screen; saveGame(null); break;
      case 'go-cases': currentScreen = 'cases'; saveGame(null); break;
      case 'chapter2-info': showChapter2Info(); break;
      case 'start-chapter2': currentScreen='chapter2'; if(save.progression.chapters.chapter_02_roots_of_memory.status==='completed') save.chapter2.stage='summary'; saveGame(null); break;
      case 'chapter3-info': showChapter3Info(); break;
      case 'chapter2-pause': currentScreen='home'; saveGame('Глава приостановлена. Прогресс сохранён.'); break;
      case 'chapter2-begin': save.chapter2.stage='home'; chapter2Save('Глава начата.'); break;
      case 'chapter2-home-point': { const k=button.dataset.key;if(!save.chapter2.homeSeen[k]){save.chapter2.homeSeen[k]=true;toast(({wreath:'Цветы питаются памятью.',photo:'На фотографии мать держит серебряную заколку.',phone:'Ника: «Люди во дворе видят одну женщину во сне».',door:'Телекинез срывает заражённую защёлку.'})[k]);chapter2Save(null);} break; }
      case 'chapter2-to-investigation': save.chapter2.stage='investigation'; chapter2Save('Расследование начато.'); break;
      case 'chapter2-location': save.chapter2.location=button.dataset.location; chapter2Save(null); break;
      case 'chapter2-investigate': { const id=button.dataset.id;let item;for(const loc of Object.values(chapter2Locations))item=loc.items.find(x=>x.id===id)||item;if(!item||save.chapter2.investSeen[id]||save.chapter2.time<item.cost)break;const optional=!item.clue||item.optional;if(optional&&save.chapter2.time<=missingRequiredClues()){toast('Сначала оставьте время на обязательные Корневые Связи.');break;}save.chapter2.time-=item.cost;save.chapter2.investSeen[id]=true;if(item.clue)save.chapter2.clues[item.clue]=true;toast(item.text);chapter2Save(null);break;}
      case 'chapter2-reset-investigation': save.chapter2.time=6;save.chapter2.location='apartment';save.chapter2.clues={photo:false,soil:false,hairpin:false,dew:false};save.chapter2.investSeen={};chapter2Save('Расследование начато заново.');break;
      case 'chapter2-to-alchemy': save.chapter2.stage='alchemy';save.house.rooms.laboratory.unlocked=true;save.house.rooms.laboratory.level=Math.max(1,save.house.rooms.laboratory.level||0);chapter2Save('Лаборатория открыта для подготовки.');break;
      case 'chapter2-add-ingredient': if(!save.chapter2.alchemy.order.includes(button.dataset.ingredient)){save.chapter2.alchemy.order.push(button.dataset.ingredient);chapter2Save(null);}break;
      case 'chapter2-reset-order': save.chapter2.alchemy.order=[];save.chapter2.alchemy.quality=null;chapter2Save(null);break;
      case 'chapter2-temperature': save.chapter2.alchemy.temp=button.dataset.temp;chapter2Save(null);break;
      case 'chapter2-stop-charge': { const marker=document.getElementById('c2-charge-marker'),track=document.getElementById('c2-charge');let value=50;if(marker&&track){const m=marker.getBoundingClientRect(),t=track.getBoundingClientRect();value=Math.max(0,Math.min(100,Math.round(((m.left-t.left)/(Math.max(1,t.width-m.width)))*100)));}save.chapter2.alchemy.charge=value;save.chapter2.alchemy.stopped=true;chapter2Save(`Искра зафиксирована: ${value}%.`);break;}
      case 'chapter2-brew': calculateC2Potion();save.chapter2.stage='alchemy_result';chapter2Save(`Смесь готова: ${qualityLabel(save.chapter2.alchemy.quality)}.`);break;
      case 'chapter2-retry-alchemy': save.chapter2.alchemy={order:[],temp:null,stopped:false,charge:null,quality:null,score:0};delete save.inventory.items.cleansing_mixture;save.chapter2.stage='alchemy';chapter2Save('Алхимия начата заново.');break;
      case 'chapter2-start-battle': initC2Battle();save.chapter2.stage='battle';chapter2Save('Бой начат.');break;
      case 'chapter2-battle-tab': {const b=normalizeC2Battle(save.chapter2.battle);if(!b){initC2Battle();}else save.chapter2.battle=b;save.chapter2.battle.tab=button.dataset.tab;save.chapter2.battle.more=false;save.chapter2.battle.rootMode=false;save.chapter2.battle.targetMode=null;chapter2Save(null);break;}
      case 'chapter2-battle-action': useC2BattleAction(button.dataset.battleAction);break;
      case 'chapter2-root': chooseC2Root(button.dataset.root);break;
      case 'chapter2-target': chooseC2Target(button.dataset.target);break;
      case 'chapter2-end-turn': endC2Turn();break;
      case 'chapter2-retry-battle': initC2Battle();chapter2Save('Бой начат заново.');break;
      case 'chapter2-ending': applyC2Resolution(button.dataset.ending);save.chapter2.stage='return';chapter2Save('Решение сохранено.');break;
      case 'chapter2-to-summon': save.chapter2.stage='summon';chapter2Save(null);break;
      case 'chapter2-pull': claimC2Pull();break;
      case 'chapter2-finish': finishC2();break;
      case 'next-morwen-line': save.tests.morwenLine = (save.tests.morwenLine + 1) % 3; saveGame(null); break;
      case 'open-room': showRoom(button.dataset.room); break;
      case 'add-save-mark': save.tests.saveMarks += 1; saveGame('Отметка записана. Теперь закройте и снова откройте игру.'); break;
      case 'advance-test-quest': advanceTestQuest(); break;
      case 'filter-inventory': inventoryFilter = button.dataset.filter; renderGame(); break;
      case 'item-details': showItem(button.dataset.item); break;
      case 'companion-details': showCompanion(button.dataset.companion); break;
      case 'empty-party-slot': toast('Полученные спутники сохранены. Выбор отряда подключим в части 3.'); break;
      case 'open-debug': openDebug(); break;
      case 'debug-reset-chapter2': if(confirm('Сбросить только главу 2 и её награды?')){closeModal();resetC2Progress();}break;
      case 'debug-coins': save.currencies.coins += 10; saveGame('Добавлено 10 тестовых монет.', false); openDebug(); break;
      case 'debug-crystal':
        if (save.inventory.items.test_crystal) delete save.inventory.items.test_crystal; else save.inventory.items.test_crystal = 1;
        saveGame('Инвентарь изменён.', false); openDebug(); break;
      case 'debug-corruption': save.soul.corruption = Math.min(10, save.soul.corruption + 1); saveGame('Скверна увеличена.', false); openDebug(); break;
      case 'debug-cleanse': save.soul.corruption = 0; saveGame('Скверна очищена.', false); openDebug(); break;
      case 'debug-scar':
        if (save.soul.scars.length) save.soul.scars = []; else save.soul.scars = [{ id: 'test_overstrain', name: 'Отголосок перенапряжения', temporary: true, remainingBattles: 2 }];
        saveGame('Шрамы души изменены.', false); openDebug(); break;
      case 'debug-lab': save.house.rooms.laboratory.unlocked = !save.house.rooms.laboratory.unlocked; save.house.rooms.laboratory.level = save.house.rooms.laboratory.unlocked ? 1 : 0; saveGame('Статус лаборатории изменён.', false); openDebug(); break;
      case 'debug-trust-up':
        save.relationships.morven.trust = Math.min(10, save.relationships.morven.trust + 1); save.companions.states.morven.trust = save.relationships.morven.trust; saveGame('Доверие Морвена повышено.', false); openDebug(); break;
      case 'debug-trust-down':
        save.relationships.morven.trust = Math.max(0, save.relationships.morven.trust - 1); save.companions.states.morven.trust = save.relationships.morven.trust; saveGame('Доверие Морвена снижено.', false); openDebug(); break;
      case 'export-save': exportSave(); break;
      case 'import-save': document.getElementById('import-file')?.click(); break;
      case 'reset-save':
        if (confirm('Удалить весь прогресс этой сборки? Это действие нельзя отменить без экспортированного файла.')) {
          localStorage.removeItem(SAVE_KEY); localStorage.removeItem(BACKUP_KEY); save = null; closeModal(); renderStart(); toast('Сохранение удалено.');
        }
        break;
    }
  });


  document.addEventListener('click', (event) => {
    const button=event.target.closest('[data-action]'); if(!button)return; const action=button.dataset.action;
    switch(action){
      case 'open-codex': closeModal(); currentScreen='codex'; saveGame(null); break;
      case 'open-lab': closeModal(); currentScreen='laboratory'; saveGame(null); break;
      case 'open-hero': closeModal(); currentScreen='hero'; saveGame(null); break;
      case 'open-party-picker': showPartyPicker(); break;
      case 'set-party-member': {
        const id=button.dataset.companion||null;
        if(id&&!save.companions.owned.includes(id))break;
        save.companions.activeParty=['morven',id];
        closeModal(); saveGame(id?`${companions[id].name} добавлен в отряд.`:'Второй слот отряда освобождён.');
        break;
      }
      case 'craft-mixture': craftMixture(); break;
      case 'start-incident': {
        if(save.progression.chapters.chapter_02_roots_of_memory.status!=='completed'){toast('Сначала завершите «Корни памяти».');break;}
        if(save.incidents.bus_stop_flowers.stage==='result') resetIncidentForReplay(true);
        currentScreen='incident'; saveGame(null); break;
      }
      case 'resume-incident': currentScreen='incident'; saveGame(null); break;
      case 'incident-pause': currentScreen='home'; saveGame('Дело приостановлено. Прогресс сохранён.'); break;
      case 'incident-begin': {
        const inc=save.incidents.bus_stop_flowers; inc.stage='investigation';inc.status='in_progress';
        const c=selectedCompanion();
        if(c?.id==='archive_scribe'){inc.clues.recording=true;inc.seen.recording='companion';}
        if(c?.id==='trail_hound'){inc.clues.roots=true;inc.seen.roots='companion';}
        incidentSave('Расследование начато.');break;
      }
      case 'incident-clue': {
        const inc=save.incidents.bus_stop_flowers,id=button.dataset.clue,d=incidentClueDefs[id];if(!d||inc.clues[id]||inc.time<1)break;
        inc.time-=1;inc.clues[id]=true;inc.seen[id]='hero';if(id==='cache')save.inventory.items.silver_salt=(save.inventory.items.silver_salt||0)+1;toast(d.text);incidentSave(null);break;
      }
      case 'incident-reset-investigation': {
        const oldIncident=save.incidents.bus_stop_flowers;
        if(oldIncident.clues.cache&&oldIncident.seen.cache==='hero') save.inventory.items.silver_salt=Math.max(0,(save.inventory.items.silver_salt||0)-1);
        const runs=oldIncident.runs,result=oldIncident.result;const fresh=createIncidentState('in_progress');fresh.stage='investigation';fresh.runs=runs;fresh.result=result;save.incidents.bus_stop_flowers=fresh;
        const c=selectedCompanion();if(c?.id==='archive_scribe'){fresh.clues.recording=true;fresh.seen.recording='companion';}if(c?.id==='trail_hound'){fresh.clues.roots=true;fresh.seen.roots='companion';}
        incidentSave('Расследование начато заново.');break;
      }
      case 'incident-to-preparation': save.incidents.bus_stop_flowers.stage='preparation';incidentSave('Подготовка открыта.');break;
      case 'incident-approach': {
        const approach=button.dataset.approach;if(approach==='cleanse'&&(save.inventory.items.cleansing_mixture||0)<1){toast('Нужна Очищающая смесь.');break;}save.incidents.bus_stop_flowers.approach=approach;incidentSave(approach==='cleanse'?'Выбрано Очищение.':'Выбрано уничтожение источника.');break;
      }
      case 'incident-to-lab': currentScreen='laboratory';saveGame(null);break;
      case 'incident-start-battle': {
        const inc=save.incidents.bus_stop_flowers;if(!inc.approach)break;if(inc.approach==='cleanse'&&(save.inventory.items.cleansing_mixture||0)<1){toast('Сначала приготовьте смесь.');break;}inc.battle=createIncidentBattle();inc.stage='battle';incidentSave('Ритуал начат.');break;
      }
      case 'incident-battle-action': incidentUseAction(button.dataset.incidentAction);break;
      case 'incident-link': incidentBreakLink(button.dataset.link);break;
      case 'incident-team-action': incidentTeamAction();break;
      case 'incident-end-turn': incidentEndTurn();break;
      case 'incident-final': incidentFinal();break;
      case 'incident-retry-battle': save.incidents.bus_stop_flowers.battle=createIncidentBattle();incidentSave('Бой начат заново.');break;
      case 'incident-replay': resetIncidentForReplay(true);currentScreen='incident';saveGame('Дело подготовлено к повторному прохождению.');break;
      case 'incident-finish': currentScreen='home';saveGame('Награды сохранены.');break;
      case 'debug-materials': for(const id of ['lunar_water','silver_salt','root_ash'])save.inventory.items[id]=(save.inventory.items[id]||0)+1;saveGame('Добавлен комплект материалов.',false);openDebug();break;
      case 'debug-reset-incident': resetIncidentForReplay(false);ensurePart3Unlocks(save);saveGame('Происшествие и его история сброшены.',false);openDebug();break;
    }
  });


  /* =========================
     PART 4 — LEVEL 3 «FIRST LIGHT»
     ========================= */

  Object.assign(companions.liora, {
    active:'Эгида Света — создаёт Щит выбранной цели или восстанавливает сегмент Стойкости.',
    reaction:'Приказ держаться — один раз предотвращает выбытие спутника.',
    passive:'Дисциплина Ордена — продлевает Печати против слабых существ.',
    resonance:'Контур Первого Света — блокирует побег и восстановление Покрова.'
  });
  companionBonuses.liora={title:'Эгида Света',short:'Один раз создаёт дополнительный Щит защищаемой цели.',battle:'shield'};
  fullItemCatalog.threshold_breaker_page={id:'threshold_breaker_page',name:'Запись о Ломателе порогов',category:'knowledge',categoryLabel:'Знание',description:'Существо питается страхом тех, кому обещали безопасность. Незащищенная цель укрепляет его Покров.',icon:'page'};
  fullItemCatalog.sister_memory_amulet={id:'sister_memory_amulet',name:'Амулет сохранённой памяти',category:'key',categoryLabel:'Ключевой предмет',description:'Внутри остались воспоминания техника о погибшей сестре. Орден требовал уничтожить амулет после операции.',icon:'medallion'};
  fullItemCatalog.order_field_clearance={id:'order_field_clearance',name:'Временный допуск Первого Света',category:'key',categoryLabel:'Документ Ордена',description:'Ограниченный доступ к полевым архивам и официальным контрактам Ордена.',icon:'page'};

  const c3Locations={
    square:{name:'Площадь',className:'square',items:[
      {id:'sigil',icon:'✦',name:'Обгоревшая печать',desc:'Поиск показывает след демона.',cost:1,clue:'sigil',text:'Печать Ордена вывернута наизнанку. Нападение подготовили заранее.'},
      {id:'witness',icon:'人',name:'Напуганный курьер',desc:'Немагический свидетель видел чёрный свёрток.',cost:1,clue:'witness',text:'Курьер видел человека в форме Ордена, оставившего у маяка чёрный свёрток.'}
    ]},
    archive:{name:'Полевой архив',className:'archive',items:[
      {id:'archive',icon:'▤',name:'Протокол маяка',desc:'Доступ Лиоры к защитной схеме района.',cost:1,clue:'archive',text:'Маяк удерживает защиту целого квартала. Его потеря обрушит контур.'},
      {id:'anchor',icon:'◇',name:'Запись об Источнике страха',desc:'Закрытая запись о слабости существа.',cost:2,clue:'anchor',text:'Существо питается паникой защищаемого человека. Щит на технике ослабит Покров.'}
    ]},
    roof:{name:'Крыша',className:'roof',items:[
      {id:'route',icon:'⌁',name:'След отхода',desc:'На крыше подготовлен разрыв для побега.',cost:1,clue:'route',text:'Ломатель попытается уйти через разрыв после нескольких раундов.'},
      {id:'stash',icon:'▣',name:'Тайник оперативника',desc:'Аварийный световой заряд.',cost:2,clue:null,text:'Найден световой заряд. Операция начнётся с +1 Резонансом.'}
    ]}
  };

  function createChapter3State(){
    return {status:'available',stage:'intro',approach:null,location:'square',time:6,seen:{},clues:{sigil:false,witness:false,archive:false,route:false,anchor:false},tutorialDone:false,plan:null,battle:null,amulet:null,registration:null,resultApplied:false};
  }
  function createChapter3BattleSafe(){
    return {round:1,heroActions:2,teamUsed:false,resonance:0,tab:'hero',freeSearch:true,enemy:{ward:4,source:false,seal:0},technician:{hp:3,shield:0},beacon:{hp:3,max:3},liora:{stamina:3,overshield:0,reaction:false},intent:'terror',intentKnown:false,escapeAt:4,guard:false,cancelIntent:false,status:'active',failureReason:null,log:['Операция началась.']};
  }
  function normalizeChapter3Battle(value){
    const fresh=createChapter3BattleSafe();const b={...fresh,...(value||{})};
    b.enemy={...fresh.enemy,...(value?.enemy||{})};b.technician={...fresh.technician,...(value?.technician||{})};b.beacon={...fresh.beacon,...(value?.beacon||{})};b.liora={...fresh.liora,...(value?.liora||{})};b.log=Array.isArray(value?.log)?value.log.slice(-12):fresh.log;
    return b;
  }
  function normalizeChapter3State(value){
    const fresh=createChapter3State();const c={...fresh,...(value||{})};c.seen={...(value?.seen||{})};c.clues={...fresh.clues,...(value?.clues||{})};c.time=Number.isFinite(Number(c.time))?Number(c.time):6;if(c.battle)c.battle=normalizeChapter3Battle(c.battle);return c;
  }
  function orderLabel(value){if(value>=4)return 'Высокое доверие Ордена';if(value>=2)return 'Рабочее сотрудничество';if(value>=0)return 'Осторожный нейтралитет';return 'Наблюдение Ордена';}
  function ensurePart4Unlocks(state){
    state.progression.chapters.chapter_04_bitter_recipe ||= {status:'locked',progress:0};
    const c2Complete=state.progression.chapters.chapter_02_roots_of_memory?.status==='completed'||state.story.flags['chapter_02.complete'];
    state.chapter3=normalizeChapter3State(state.chapter3||createChapter3State());
    if(c2Complete&&state.progression.chapters.chapter_03_first_light?.status==='locked')state.progression.chapters.chapter_03_first_light.status='available';
    if(!c2Complete){state.chapter3.status='locked';return state;}
    if(state.chapter3.status==='locked')state.chapter3.status='available';
    const c3Complete=state.progression.chapters.chapter_03_first_light?.status==='completed'||state.story.flags['chapter_03.complete'];
    if(c3Complete){
      state.chapter3.status='completed';
      if(!state.companions.owned.includes('liora'))state.companions.owned.push('liora');
      state.companions.states.liora ||= {level:3,trust:state.relationships.liora?.trust||1,rank:0};
      state.relationships.liora ||= {trust:state.companions.states.liora.trust,label:'Союзница'};
      state.meta.heroMastery.shield=Math.max(2,state.meta.heroMastery.shield||1);
      state.codex.creatures.threshold_breaker ||= {knowledge:1,max:3};
      if(!state.codex.discoveries.includes('threshold_breaker'))state.codex.discoveries.push('threshold_breaker');
      state.progression.chapters.chapter_04_bitter_recipe.status='available';
    }
    state.reputations.order.label=orderLabel(state.reputations.order.value);
    return state;
  }
  function chapter3Progress(){
    const c=save.chapter3;const map={intro:4,meeting:12,investigation:35,tutorial:48,brief:58,battle:76,amulet:85,registration:92,final:100};return map[c.stage]||0;
  }
  function chapter3Save(message){save.chapter3=normalizeChapter3State(save.chapter3);save.progression.chapters.chapter_03_first_light.progress=chapter3Progress();saveGame(message);}
  function c3ClueCount(){return Object.values(save.chapter3.clues).filter(Boolean).length;}
  function c3CanBrief(){return c3ClueCount()>=3;}

  const renderGamePart3=renderGame;
  renderGame=function(){if(!save){renderStart();return;}if(currentScreen==='chapter3'){renderChapter3();return;}renderGamePart3();};

  const renderStartPart3=renderStart;
  renderStart=function(){
    const existing=readSave();const preview=existing?`<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>Последнее сохранение: ${formatDate(existing.updatedAt)} · ревизия ${existing.revision}</span></div>`:'';
    app.innerHTML=`<section class="start-screen"><div class="brand-kicker">Magic RPG · vertical slice</div><div class="start-copy"><h1 class="start-title">Первый<br>Свет</h1><p class="start-subtitle">Единая сборка: дом, уровень 2, мета-петля и связанный уровень 3 с Лиорой, расследованием, подготовкой и боем за две защищаемые цели.</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать сохранение'}</button></div><div class="version-line">Часть 4 · «Первый Свет» · ${CONTENT_VERSION}</div></div></section>`;
  };

  const morwenTextPart3=morwenText;
  morwenText=function(){
    const c3done=save?.progression?.chapters?.chapter_03_first_light?.status==='completed';
    if(c3done){const lines=['Лиора теперь официально союзница. Не волнуйся, я уже спрятал всё, что Ордену видеть не следует. Почти всё.','Защитить человека и маяк одновременно — неплохой урок. Особенно если никто не умер.','Следующая остановка — Селеста. Она улыбается так, будто в лаборатории ничего никогда не взрывалось.'];return lines[save.tests.morwenLine%lines.length];}
    return morwenTextPart3();
  };

  const renderHomePart3=renderHome;
  renderHome=function(){
    const c2complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';if(!c2complete)return renderHomePart3();
    const c3=save.chapter3,c3complete=save.progression.chapters.chapter_03_first_light.status==='completed';const inc=save.incidents.bus_stop_flowers;const second=save.companions.activeParty?.[1]&&companions[save.companions.activeParty[1]];const unlockedRooms=Object.values(save.house.rooms).filter(r=>r.unlocked).length;
    if(!c3complete){const inProgress=c3.status==='in_progress'||!['intro','final'].includes(c3.stage);return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Оперативница у порога</h1><p>Лиора Вейн прошла через защитный контур и требует разговора об Искре.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div><div class="section-title"><h2>Главная история</h2><span>Уровень 3</span></div><article class="card quest-card"><div class="quest-head"><div><span class="tag amber">Первый Свет</span><h3>Защита маяка</h3></div><span class="tag ${inProgress?'green':'violet'}">${inProgress?'В процессе':'Доступно'}</span></div><p>Познакомьтесь с Лиорой, расследуйте заражение и защитите техника вместе с маяком.</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${chapter3Progress()}%"></div></div><div class="progress-caption"><span>${inProgress?'Автосохранение активно':'Не начато'}</span><span>${chapter3Progress()}%</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-chapter3">${inProgress?'Продолжить главу':'Начать главу'}</button><button class="secondary-button" data-action="start-incident">Дело района</button></div></article><div class="section-title"><h2>Между делами</h2><span>${second?`В отряде: ${second.name}`:'Второй спутник не выбран'}</span></div><div class="quick-grid"><button class="quick-card" data-action="open-codex">${icons.book}<strong>Книга Теней</strong><small>${save.codex.discoveries.length} записи</small></button><button class="quick-card" data-action="open-lab">${icons.flask}<strong>Лаборатория</strong><small>${save.inventory.items.cleansing_mixture||0} смеси</small></button><button class="quick-card" data-action="open-party-picker">${icons.companions}<strong>Отряд</strong><small>Герой + Морвен + спутник</small></button></div><div class="section-title"><h2>Дело района</h2><span>${inc.runs} прохождений</span></div><article class="card meta-banner"><span>${icons.leaf}</span><div><h3>Цветы на остановке</h3><p>Повторяемое расследование остаётся доступным до и после сюжетной главы.</p><div class="inline-actions"><button class="small-button" data-action="start-incident">Открыть дело</button></div></div></article></section>`;}
    const reg={yes:'Временная регистрация',conditional:'Поручительство Лиоры',no:'Отказ от регистрации'}[c3.registration]||'Решение сохранено';return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Новый союзник</h1><p>Лиора присоединилась к отряду. Орден запомнил выбранные вами условия сотрудничества.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div><div class="section-title"><h2>Следующая глава</h2><span>Уровень 4</span></div><article class="card quest-card"><div class="quest-head"><div><span class="tag amber">Главная история</span><h3>Горький рецепт</h3></div><span class="tag violet">Открыто</span></div><p>Лиора направляет героя к Селесте. Расширенная алхимия будет подключена в следующей части.</p><div class="card-actions"><button class="secondary-button" data-action="chapter4-info">Описание</button><button class="primary-button" data-action="open-party-picker">Добавить Лиору в отряд</button></div></article><div class="section-title"><h2>Последствия «Первого Света»</h2><span>Сохранено</span></div><article class="card status-list"><div class="status-row"><span>Отношение с Орденом</span><span>${save.reputations.order.label}</span></div><div class="status-row"><span>Условия</span><span>${reg}</span></div><div class="status-row"><span>Доверие Лиоры</span><span>${save.relationships.liora.trust}/10</span></div><div class="status-row"><span>Спутник</span><span>Лиора Вейн получена</span></div></article><div class="section-title"><h2>Между делами</h2><span>${second?`В отряде: ${second.name}`:'Выберите спутника'}</span></div><div class="quick-grid"><button class="quick-card" data-action="open-codex">${icons.book}<strong>Книга Теней</strong><small>${save.codex.discoveries.length} записи</small></button><button class="quick-card" data-action="open-lab">${icons.flask}<strong>Лаборатория</strong><small>${save.inventory.items.cleansing_mixture||0} смеси</small></button><button class="quick-card" data-action="open-party-picker">${icons.companions}<strong>Отряд</strong><small>Лиора доступна</small></button></div><div class="section-title"><h2>Комнаты</h2><span>${unlockedRooms} из 6 открыто</span></div><div class="room-grid">${roomCard('living_room','Гостиная','Разговоры и события дома',icons.home,true)}${roomCard('study','Кабинет','Книга Теней и развитие',icons.book,true)}${roomCard('laboratory','Лаборатория','Рецепты и расходники',icons.flask,true)}${roomCard('greenhouse','Теплица',save.house.rooms.greenhouse.projectUnlocked?'Проект получен':'Редкие растения и заказы',icons.leaf,save.house.rooms.greenhouse.unlocked)}${roomCard('ritual_hall','Ритуальный зал','Печати и сложные ритуалы',icons.circle,false)}${roomCard('artifact_room','Комната артефактов','Хранение и настройка реликвий',icons.crystal,false)}</div></section>`;
  };

  const renderCasesPart3=renderCases;
  renderCases=function(){
    const c2complete=save.progression.chapters.chapter_02_roots_of_memory.status==='completed';if(!c2complete)return renderCasesPart3();
    const c3complete=save.progression.chapters.chapter_03_first_light.status==='completed';const c3=save.chapter3;const inc=save.incidents.bus_stop_flowers;const resultText=inc.result==='cleanse'?'Последний исход: Очищение':inc.result==='destroy'?'Последний исход: уничтожение':'Дело ещё не завершалось';
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Доска дел</div><h1>Доступные дела</h1><p>Сюжет и повторяемые происшествия используют одно сохранение.</p></div></div><article class="card case-card"><span class="tag green">Главная история · уровень 2</span><h3>Корни памяти</h3><p>Глава завершена. Решение и судьба семени записаны.</p><div class="card-actions"><button class="secondary-button" data-action="start-chapter2">Посмотреть итоги</button></div></article><article class="card case-card"><span class="tag ${c3complete?'green':'amber'}">Главная история · уровень 3</span><h3>Первый Свет</h3><p>${c3complete?'Ломатель порогов изгнан. Лиора стала постоянным спутником.':'Защитите техника и маяк, раскрыв Источник страха и удержав Печать.'}</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${c3complete?100:chapter3Progress()}%"></div></div><div class="progress-caption"><span>${c3complete?'Завершено':c3.status==='in_progress'?'В процессе':'Доступно'}</span><span>${c3complete?100:chapter3Progress()}%</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-chapter3">${c3complete?'Посмотреть итоги':c3.status==='in_progress'?'Продолжить':'Начать главу'}</button></div></article><article class="card case-card"><span class="tag violet">Происшествие района</span><h3>Цветы на остановке</h3><p>Короткое повторяемое дело с расследованием, отрядом и двумя способами решения.</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${incidentProgress()}%"></div></div><div class="progress-caption"><span>${resultText}</span><span>${inc.runs} прох.</span></div></div><div class="card-actions"><button class="secondary-button" data-action="start-incident">${inc.stage!=='brief'&&inc.stage!=='result'?'Продолжить дело':'Начать дело'}</button><button class="secondary-button" data-action="open-party-picker">Отряд</button></div></article>${c3complete?`<article class="card case-card"><span class="tag amber">Главная история · уровень 4</span><h3>Горький рецепт</h3><p>Селеста и расширенная алхимия будут интегрированы следующими.</p><div class="card-actions"><button class="secondary-button" data-action="chapter4-info">Описание</button></div></article>`:''}</section>`;
  };

  const renderJournalPart3=renderJournal;
  renderJournal=function(){
    const c3complete=save.progression.chapters.chapter_03_first_light.status==='completed';if(!c3complete&&save.chapter3.stage==='intro')return renderJournalPart3();
    const c2decision=save.story.decisions['chapter_02.seed_fate'];const c2text={save:'Очищенное семя сохранено дома.',destroy:'Семя уничтожено Искрой.',morven:'Семя передано Морвену.'}[c2decision]||'Решение сохранено.';const amulet={obey:'Амулет уничтожен по приказу Ордена.',save:'Воспоминания в амулете сохранены.',lie:'Амулет подменён, отчёт Ордена изменён.'}[save.chapter3.amulet]||'Операция продолжается.';const reg={yes:'Принята временная регистрация.',conditional:'Лиора стала поручителем героя.',no:'Герой отказался от регистрации.'}[save.chapter3.registration]||'Решение о регистрации ещё не принято.';const inc=save.incidents.bus_stop_flowers;
    return `<section class="screen"><div class="screen-header"><div><div class="eyebrow">Журнал</div><h1>История героя</h1><p>Решения автоматически переходят между главами.</p></div></div><div class="timeline"><article class="card chapter-row completed"><span class="chapter-dot"></span><span class="tag green">Завершено</span><h3>Уровень 1 · Пробуждение</h3><p>Телекинез пробудился. Морвен заговорил.</p></article><article class="card chapter-row completed"><span class="chapter-dot"></span><span class="tag green">Завершено</span><h3>Уровень 2 · Корни памяти</h3><p>${c2text}</p></article><article class="card chapter-row ${c3complete?'completed':'active'}"><span class="chapter-dot"></span><span class="tag ${c3complete?'green':'violet'}">${c3complete?'Завершено':'Текущая глава'}</span><h3>Уровень 3 · Первый Свет</h3><p>${c3complete?`${amulet} ${reg}`:`Прогресс главы: ${chapter3Progress()}%.`}</p></article><article class="card chapter-row ${c3complete?'active':''}"><span class="chapter-dot"></span><span class="tag ${c3complete?'violet':''}">${c3complete?'Открыто':'Закрыто'}</span><h3>Уровень 4 · Горький рецепт</h3><p>${c3complete?'Лиора направляет героя к Селесте.':'Откроется после уровня 3.'}</p></article></div><div class="section-title"><h2>Отношения и репутация</h2><span>Постоянно</span></div><article class="card status-list"><div class="status-row"><span>Лиора Вейн</span><span>${save.relationships.liora.label} · ${save.relationships.liora.trust}/10</span></div><div class="status-row"><span>Орден Первого Света</span><span>${save.reputations.order.label}</span></div><div class="status-row"><span>Независимость</span><span>${save.reputations.independence}</span></div></article><div class="section-title"><h2>Дела района</h2><span>${inc.runs} завершено</span></div><article class="card status-list"><div class="status-row"><span>Цветы на остановке</span><span>${inc.runs?`${inc.runs} прохождений`:'не завершено'}</span></div><div class="status-row"><span>Последний исход</span><span>${inc.result==='cleanse'?'Очищение':inc.result==='destroy'?'Уничтожение':'—'}</span></div></article><div class="section-title"><h2>Постоянный прогресс</h2><span>Сохраняется</span></div><div class="stats-grid"><div class="card stat-card"><strong>${save.profile.heroXp}/${save.profile.heroXpToNext}</strong><span>Опыт героя</span></div><div class="card stat-card"><strong>${save.soul.corruption}</strong><span>Скверна</span></div><div class="card stat-card"><strong>${save.companions.owned.length}</strong><span>Спутников</span></div><div class="card stat-card"><strong>${save.codex.discoveries.length}</strong><span>Записей Книги</span></div></div><div class="section-title"><h2>Техническое состояние</h2><span>Для тестирования</span></div><div class="card status-list"><div class="status-row"><span>Последняя запись</span><span>${formatDate(save.updatedAt)}</span></div><div class="status-row"><span>Ревизия</span><span>${save.revision}</span></div><div class="status-row"><span>Версия данных</span><span>save v${save.saveVersion}</span></div></div></section>`;
  };

  const renderCodexPart3=renderCodex;
  renderCodex=function(){
    let html=renderCodexPart3();const level=save.codex.creatures.threshold_breaker?.knowledge||0;if(!level)return html;const card=`<article class="card codex-card"><div class="codex-head"><div class="codex-glyph">⌂</div><div><span class="tag amber">Ломатель защиты</span><h3>Ломатель порогов</h3><p>Существо обращает обещания безопасности в страх и атакует одновременно человека и защитный объект.</p>${knowledgeDots(level)}</div></div><div class="codex-facts"><div class="codex-fact"><strong>Источник:</strong> паника защищаемого техника.</div><div class="codex-fact"><strong>Покров:</strong> усиливается, если незащищённая цель получает урон.</div><div class="codex-fact"><strong>Решение:</strong> раскрыть Источник, снять Покров, удержать Печать и завершить Изгнанием до побега.</div></div></article>`;return html.replace('</div></section>',`${card}</div></section>`);
  };

  const renderHeroGrowthPart3=renderHeroGrowth;
  renderHeroGrowth=function(){let html=renderHeroGrowthPart3();if(save.progression.chapters.chapter_03_first_light.status==='completed'){html=html.replace('Щит I','Щит союзника').replace('Защищать героя или свидетеля от следующего опасного действия.','Защищать героя, союзника или важную цель; Щит на испуганной цели может ослабить вражеский Покров.');}return html;};

  const openDebugPart3=openDebug;
  openDebug=function(){
    const c3=save.chapter3;openModal(`<div class="modal-header"><div><div class="eyebrow">Техническая панель</div><h2>Проверка связанной сборки</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Технические кнопки не являются игровым контентом.</p><div class="debug-section"><h3>Глава 3</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter3"><strong>Сбросить «Первый Свет»</strong><span>Этап: ${c3.stage}</span></button><button class="debug-button" data-action="debug-complete-chapter3"><strong>Быстро завершить главу</strong><span>Для проверки мета-последствий</span></button></div></div><div class="debug-section"><h3>Ресурсы</h3><div class="debug-grid"><button class="debug-button" data-action="debug-coins"><strong>+10 монет</strong><span>Проверить валюту</span></button><button class="debug-button" data-action="debug-materials"><strong>+1 комплект материалов</strong><span>Лаборатория</span></button><button class="debug-button" data-action="debug-corruption"><strong>+1 Скверна</strong><span>Текущее: ${save.soul.corruption}</span></button><button class="debug-button" data-action="debug-cleanse"><strong>Очистить Скверну</strong><span>Сбросить до 0</span></button></div></div><div class="debug-section"><h3>Контент</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-incident"><strong>Сбросить происшествие</strong><span>Цветы на остановке</span></button><button class="debug-button" data-action="debug-reset-chapter2"><strong>Сбросить «Корни памяти»</strong><span>Также сбросит дальнейшие главы</span></button></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid"><button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать JSON</span></button><button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить JSON</span></button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div class="debug-section"><h3>Текущее состояние</h3><pre class="json-preview">${escapeHtml(JSON.stringify(save,null,2))}</pre></div><div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Полностью удалить сохранение</button></div></div>`);
  };

  function c3Shell(title,subtitle,body,footer='',hud=''){
    app.innerHTML=`<section class="c3-shell"><header class="c3-top"><button data-action="chapter3-pause" aria-label="Вернуться домой">←</button><div><small>Уровень 3 · Первый Свет</small><h1>${title}</h1></div><div class="c3-hud">${hud||`<span>${subtitle}</span>`}</div></header><main class="c3-main">${body}</main><footer class="c3-footer">${footer}</footer></section>`;
  }
  function renderChapter3(){
    save.chapter3=normalizeChapter3State(save.chapter3);const c=save.chapter3;({intro:renderC3Intro,meeting:renderC3Meeting,investigation:renderC3Investigation,tutorial:renderC3Tutorial,brief:renderC3Brief,battle:renderC3Battle,amulet:renderC3Amulet,registration:renderC3Registration,final:renderC3Final}[c.stage]||renderC3Intro)();
  }
  function renderC3Intro(){c3Shell('Первый Свет','Глава 3',`<div class="c3-scene"><div class="c3-scene-label">Дом героя · утро</div><div class="c3-liora">🧝‍♀️</div><div class="c3-cat">🐈‍⬛</div><div class="c3-sigil">✦</div></div><section class="card c3-story"><div class="c3-speaker">Неизвестная оперативница</div><h2>Она прошла через защитный контур</h2><p>Женщина в сером плаще входит так, словно сама помогала создавать защиту дома.</p><div class="c3-quote">«Лиора Вейн. Орден Первого Света. Я знала твоих родителей — и сейчас у нас нет времени спорить, насколько именно».</div></section>`,`<button class="primary-button" style="width:100%" data-action="c3-open-door">Впустить Лиору</button>`);}
  function renderC3Meeting(){const c=save.chapter3;c3Shell('Предложение Ордена','Диалог',`<section class="card c3-story"><div class="c3-speaker">Лиора Вейн</div><h2>Заражён защитный маяк</h2><p>На городской площади остался техник Ордена. Существо уже учится использовать его страх, а разрушение маяка оставит квартал без защиты.</p><div class="c3-quote">«Мне нужен твой Дар. Тебе — человек, который знает, почему твоих родителей объявили нарушителями протокола».</div></section><div class="c3-choice-grid"><button class="c3-choice ${c.approach==='trust'?'selected':''}" data-action="c3-approach" data-approach="trust"><b>«Я помогу. Но без секретов»</b><small>Лиора начнёт операцию с временным сверхщитом.</small></button><button class="c3-choice ${c.approach==='defiant'?'selected':''}" data-action="c3-approach" data-approach="defiant"><b>«Я не служу Ордену»</b><small>Команда начнёт бой с +1 Резонансом.</small></button><button class="c3-choice ${c.approach==='pragmatic'?'selected':''}" data-action="c3-approach" data-approach="pragmatic"><b>«Сначала расскажи о родителях»</b><small>Закрытая архивная улика потребует меньше времени.</small></button></div>`,`<button class="primary-button" style="width:100%" data-action="c3-to-investigation" ${c.approach?'':'disabled'}>Отправиться на площадь</button>`);}
  function c3InvestCost(item){return item.id==='anchor'&&save.chapter3.approach==='pragmatic'?1:item.cost;}
  function renderC3Investigation(){const c=save.chapter3,d=c3Locations[c.location],count=c3ClueCount();c3Shell('Расследование заражения','Очки времени',`<div class="c3-tabs">${Object.entries(c3Locations).map(([id,x])=>`<button class="c3-tab ${c.location===id?'active':''}" data-action="c3-location" data-location="${id}">${x.name}</button>`).join('')}</div><div class="c3-location ${d.className}"><div class="c3-scene-label">${d.name}</div></div><div class="c3-invest-list">${d.items.map(item=>{const done=!!c.seen[item.id],cost=c3InvestCost(item);return `<button class="c3-invest ${done?'done':''}" data-action="c3-investigate" data-point="${item.id}" ${done||c.time<cost?'disabled':''}><span class="c3-invest-icon">${done?'✓':item.icon}</span><div><b>${item.name}</b><small>${done?item.text:item.desc}</small></div><em>${done?'Готово':`−${cost}`}</em></button>`}).join('')}</div><article class="card c3-progress-card"><h3>Собрано улик: ${count}/5</h3><p>Для операции достаточно трёх улик. Полное расследование даёт раннее предупреждение, слабость и дополнительный ресурс.</p><div class="c3-clue-grid">${[['sigil','След нападения'],['witness','Свидетель'],['archive','Роль маяка'],['anchor','Источник страха'],['route','Путь побега']].map(([id,label])=>`<div class="${c.clues[id]?'done':''}"><b>${c.clues[id]?'✓':'○'} ${label}</b>${c.clues[id]?'известно':'не найдено'}</div>`).join('')}</div></article>`,`<button class="primary-button" style="width:100%" data-action="c3-to-tutorial" ${c3CanBrief()?'':'disabled'}>Завершить расследование</button>`,`<span>Время <b>${c.time}</b></span><span>Улики <b>${count}</b></span>`);}
  function renderC3Tutorial(){const c=save.chapter3;c3Shell('Эгида Света','Безопасное обучение',`<div class="c3-tutorial"><div class="c3-fall-scene"><div class="c3-scene-label">Переход к маяку</div><div class="c3-child">🧒</div>${c.tutorialDone?'<div class="c3-aegis"></div>':''}</div><section class="card c3-story"><div class="c3-speaker">Лиора</div><h2>${c.tutorialDone?'Щит удержал обломки':'Вывеска срывается над ребёнком'}</h2><p>${c.tutorialDone?'Эгида принимает удар. Лиора объясняет: командное действие можно потратить на защиту человека или объекта — иногда это важнее ускорения ритуала.':'Используйте командное действие Лиоры. Эта сцена безопасна: здесь можно понять механику до кульминационного боя.'}</p></section></div>`,c.tutorialDone?'<button class="primary-button" style="width:100%" data-action="c3-to-brief">Составить план операции</button>':'<button class="primary-button" style="width:100%" data-action="c3-tutorial-aegis">Эгида Света</button>');}
  function renderC3Brief(){const c=save.chapter3;c3Shell('План защиты маяка','Подготовка',`<section class="card c3-story"><div class="c3-speaker">Лиора</div><h2>Две защищаемые цели</h2><p>Ломатель будет давить на техника и маяк одновременно. У героя два действия, у команды — одно действие Лиоры или Морвена.</p><div class="c3-quote">Приоритет меняет старт боя, но не закрывает остальные способы победы.</div></section><div class="section-title"><h2>Приоритет операции</h2><span>Выберите один</span></div><div class="c3-plan-grid"><button class="c3-plan ${c.plan==='technician'?'selected':''}" data-action="c3-plan" data-plan="technician"><b>Защитить техника</b><span>Стартовый Щит 2, Покров врага меньше на 1.</span></button><button class="c3-plan ${c.plan==='beacon'?'selected':''}" data-action="c3-plan" data-plan="beacon"><b>Укрепить маяк</b><span>Маяк выдержит дополнительный удар.</span></button><button class="c3-plan ${c.plan==='hunt'?'selected':''}" data-action="c3-plan" data-plan="hunt"><b>Перекрыть отход</b><span>Попытка побега начнётся на раунд позже.</span></button><button class="c3-plan ${c.plan==='order'?'selected':''}" data-action="c3-plan" data-plan="order"><b>Следовать протоколу</b><span>Реакция Лиоры готова с начала боя.</span></button></div><div class="c3-rule"><strong>Ритуальная цель:</strong> раскрыть Источник страха → снять Покров → наложить Печать → завершить Изгнанием. Техник и маяк должны выстоять.</div>`,`<button class="primary-button" style="width:100%" data-action="c3-start-battle" ${c.plan?'':'disabled'}>Начать операцию</button>`);}
  function createChapter3Battle(){const c=save.chapter3;const b=createChapter3BattleSafe();b.resonance=(c.approach==='defiant'?1:0)+(c.seen.stash?1:0);b.enemy.ward=c.plan==='technician'?3:4;b.technician.shield=c.plan==='technician'?2:0;b.beacon.max=c.plan==='beacon'?4:3;b.beacon.hp=b.beacon.max;b.liora.overshield=c.approach==='trust'?1:0;b.liora.reaction=c.plan==='order';b.escapeAt=c.plan==='hunt'?5:4;return b;}
  function c3IntentInfo(b){if(b.round>=b.escapeAt&&!b.enemy.seal)return ['Разрыв отхода','Ломатель попытается сбежать. Нужна Печать, Контур или отмена намерения.'];if(b.intent==='terror')return ['Впитать страх','Атака техника. Без Щита враг усилит Покров.'];if(b.intent==='beacon')return ['Осквернить маяк','Маяк потеряет 1 устойчивость.'];return ['Сломать строй','Лиора потеряет сегмент Стойкости.'];}
  function c3BanishReason(b){if(b.status!=='active')return 'Бой уже завершён.';if(b.heroActions<1)return 'Нет действия героя.';if(!b.enemy.source)return 'Сначала раскройте Источник страха.';if(b.enemy.ward>0)return `Снимите Покров: осталось ${b.enemy.ward}.`;if(b.enemy.seal<1)return 'Наложите Печать, чтобы удержать существо.';if(b.technician.hp<1||b.beacon.hp<1)return 'Защищаемая цель потеряна.';return '';}
  function c3ActionReason(b,id){const hero=['search','shield','tele','seal','banish'].includes(id);if(b.status!=='active')return 'Бой завершён.';if(hero&&b.heroActions<1)return 'Нет действий героя.';if(!hero&&b.teamUsed)return 'Командное действие уже использовано.';if(id==='search'&&b.enemy.source)return 'Источник уже раскрыт.';if((id==='tele'||id==='seal')&&!b.enemy.source)return 'Сначала нужен Поиск.';if(id==='banish')return c3BanishReason(b);if((id==='contour'||id==='formula')&&b.resonance<3)return `Нужно 3 Резонанса: сейчас ${b.resonance}.`;return '';}
  function c3ObjectiveHtml(b){const reason=c3BanishReason(b);const steps=[[b.enemy.source,'Раскрыть Источник страха'],[b.enemy.ward<=0,`Снять Покров${b.enemy.ward>0?` · осталось ${b.enemy.ward}`:''}`],[b.enemy.seal>0,`Удержать Печать${b.enemy.seal>0?` · ${b.enemy.seal} раунд.`:''}`],[b.technician.hp>0&&b.beacon.hp>0,'Сохранить техника и маяк'],[b.status==='won','Завершить Изгнанием']];return `<section class="c3-objective"><div class="c3-objective-head"><div><h3>Ритуальная цель · Изгнание</h3><p>Победа достигается подготовленным финалом, а не обычным уроном.</p></div><span class="tag ${b.status==='won'?'green':'amber'}">${b.status==='won'?'Выполнено':`Раунд ${b.round}`}</span></div><div class="c3-objective-list">${steps.map(([done,label])=>`<div class="c3-objective-step ${done?'done':''}"><span>${done?'✓':'○'}</span><span>${label}</span></div>`).join('')}<div class="c3-objective-step ${b.technician.hp<=0||b.beacon.hp<=0||b.liora.stamina<=0?'fail':''}"><span>!</span><span>Провал: потеря техника, маяка или Лиоры; побег через разрыв.</span></div></div>${reason&&b.status==='active'?`<div class="c3-blocked"><strong>Изгнание недоступно:</strong> ${reason}</div>`:''}</section>`;}
  function c3ActionDefs(b){if(b.tab==='hero')return [['search','Поиск','Раскрыть Источник страха'],['shield','Щит техника','Защита и ослабление Покрова'],['tele','Телекинез','Снять 2 Покрова после Поиска'],['seal','Печать','Запретить побег на 2 раунда'],['banish','Изгнание','Финальное ритуальное действие']];if(b.tab==='liora')return [['aegis','Эгида Света','Укрепить техника и маяк'],['hold','Приказ держаться','Предотвратить следующий урон целям'],['contour','Контур Первого Света','3 Резонанса: Печать и −1 Покров']];return [['morven','Хищное внимание','Раскрыть источник и намерение'],['formula','Утерянная формула','3 Резонанса: отменить намерение']];}
  function renderC3Battle(){const c=save.chapter3,b=normalizeChapter3Battle(c.battle);c.battle=b;if(b.status==='failed'){c3Shell('Операция провалена','Повтор боя',`${c3ObjectiveHtml(b)}<section class="card c3-story"><div class="c3-speaker">Причина провала</div><h2>Защита не удержалась</h2><p>${escapeHtml(b.failureReason||'Ломатель завершил ритуал.')}</p></section>`,`<button class="primary-button" style="width:100%" data-action="c3-retry-battle">Повторить бой</button>`);return;}const [intent,desc]=c3IntentInfo(b);const actions=c3ActionDefs(b);c3Shell('Защита маяка',`Раунд ${b.round}`,`${c3ObjectiveHtml(b)}<div class="c3-intent"><small>Намерение врага ${b.intentKnown?'· раскрыто':''}</small><b>${intent}</b><span>${desc}</span></div><div class="c3-arena"><div class="c3-enemy">👹</div><div class="c3-tech">🧑‍🔧</div><div class="c3-beacon">🗼</div><div class="c3-statuses"><span class="c3-chip bad">Покров ${b.enemy.ward}</span><span class="c3-chip ${b.enemy.source?'good':'bad'}">Источник ${b.enemy.source?'найден':'скрыт'}</span><span class="c3-chip ${b.enemy.seal?'good':'bad'}">Печать ${b.enemy.seal}</span></div></div><div class="c3-units"><div class="c3-unit ${b.tab==='hero'?'active':''}"><b>${escapeHtml(save.profile.heroName)}</b><span>Действия ${b.heroActions}/2 · Резонанс ${b.resonance}/6</span></div><div class="c3-unit ${b.tab==='liora'?'active':''}"><b>Лиора</b><span>Стойкость</span><div class="c3-dots">${[1,2,3].map(n=>`<i class="c3-dot ${n<=b.liora.stamina?'on':''}"></i>`).join('')}${b.liora.overshield?'<i class="c3-dot over"></i>':''}</div></div><div class="c3-unit ${b.tab==='morven'?'active':''}"><b>Морвен</b><span>Техник ${b.technician.hp}/3 · Щит ${b.technician.shield}<br>Маяк ${b.beacon.hp}/${b.beacon.max}</span></div></div><div class="c3-battle-tabs"><button class="c3-battle-tab ${b.tab==='hero'?'active':''}" data-action="c3-battle-tab" data-tab="hero">Герой</button><button class="c3-battle-tab ${b.tab==='liora'?'active':''}" data-action="c3-battle-tab" data-tab="liora">Лиора</button><button class="c3-battle-tab ${b.tab==='morven'?'active':''}" data-action="c3-battle-tab" data-tab="morven">Морвен</button></div><div class="c3-actions">${actions.map(([id,name,desc2])=>{const reason=c3ActionReason(b,id);return `<button class="c3-action ${(id==='contour'||id==='formula'||id==='banish')?'res':''}" data-action="c3-battle-action" data-battle-action="${id}" ${reason?'disabled':''}><b>${name}</b><span class="${reason?'why':''}">${reason||desc2}</span></button>`}).join('')}</div><div class="c3-log">${escapeHtml(b.log.slice(-3).join(' · '))}</div>`,`<button class="secondary-button" style="width:100%" data-action="c3-end-turn">Завершить раунд</button>`,`<span>Г <b>${b.heroActions}</b></span><span>К <b>${b.teamUsed?0:1}</b></span>`);}
  function c3UseAction(id){const c=save.chapter3,b=normalizeChapter3Battle(c.battle),reason=c3ActionReason(b,id);if(reason){toast(reason);return;}const hero=['search','shield','tele','seal','banish'].includes(id);if(hero&&!(id==='search'&&b.freeSearch)){b.heroActions-=1;}else if(!hero)b.teamUsed=true;
    if(id==='search'){b.enemy.source=true;b.resonance=Math.min(6,b.resonance+1);b.freeSearch=false;b.log.push('Поиск раскрыл Источник страха. +1 Резонанс.');}
    if(id==='shield'){b.technician.shield=Math.min(3,b.technician.shield+2);if(b.enemy.source)b.enemy.ward=Math.max(0,b.enemy.ward-1);b.log.push('Щит защитил техника.');}
    if(id==='tele'){b.enemy.ward=Math.max(0,b.enemy.ward-2);b.resonance=Math.min(6,b.resonance+1);b.log.push('Телекинез разрушил часть Покрова. +1 Резонанс.');}
    if(id==='seal'){b.enemy.seal=2;b.resonance=Math.min(6,b.resonance+1);b.log.push('Печать удерживает путь отхода. +1 Резонанс.');}
    if(id==='aegis'){b.technician.shield=Math.min(3,b.technician.shield+2);b.beacon.hp=Math.min(b.beacon.max,b.beacon.hp+1);b.resonance=Math.min(6,b.resonance+1);b.log.push('Эгида укрепила техника и маяк. +1 Резонанс.');}
    if(id==='hold'){b.guard=true;b.log.push('Приказ держаться защитит обе цели от следующего урона.');}
    if(id==='contour'){b.resonance-=3;b.enemy.seal=3;b.enemy.ward=Math.max(0,b.enemy.ward-1);b.log.push('Контур Первого Света замкнут.');}
    if(id==='morven'){b.enemy.source=true;b.intentKnown=true;b.resonance=Math.min(6,b.resonance+1);b.log.push('Морвен раскрыл механизм существа. +1 Резонанс.');}
    if(id==='formula'){b.resonance-=3;b.cancelIntent=true;b.log.push('Утерянная формула отменила намерение врага.');}
    if(id==='banish'){b.status='won';b.log.push('Ломатель порогов изгнан.');c.battle=b;c.stage='amulet';chapter3Save('Изгнание завершено.');return;}
    c.battle=b;chapter3Save(null);
  }
  function c3Fail(b,reason){b.status='failed';b.failureReason=reason;save.chapter3.battle=b;chapter3Save('Операция провалена.');}
  function c3EndTurn(){const c=save.chapter3,b=normalizeChapter3Battle(c.battle);if(b.status!=='active')return;if(b.cancelIntent){b.cancelIntent=false;b.log.push('Намерение врага сорвано.');}else if(b.round>=b.escapeAt&&!b.enemy.seal){c3Fail(b,'Ломатель ушёл через заранее подготовленный разрыв.');return;}else if(b.intent==='terror'){let damage=1;if(b.guard){b.guard=false;damage=0;}else if(b.technician.shield>0){b.technician.shield-=1;damage=0;b.enemy.ward=Math.max(0,b.enemy.ward-1);b.resonance=Math.min(6,b.resonance+1);b.log.push('Щит принял удар техника. Покров врага ослаб.');}else if(damage){b.technician.hp-=1;b.enemy.ward=Math.min(5,b.enemy.ward+1);b.log.push('Техник ранен, страх усилил Покров.');}else b.log.push('Приказ Лиоры удержал техника.');}else if(b.intent==='beacon'){const damage=b.guard?0:1;b.guard=false;if(damage){b.beacon.hp-=1;b.log.push('Маяк потерял устойчивость.');}else b.log.push('Маяк удержан приказом Лиоры.');}else{if(b.liora.reaction){b.liora.reaction=false;b.log.push('Реакция Лиоры предотвратила потерю Стойкости.');}else if(b.liora.overshield){b.liora.overshield=0;b.log.push('Временный сверхщит Лиоры разбит.');}else{b.liora.stamina-=1;b.log.push('Лиора потеряла сегмент Стойкости.');}}
    if(b.technician.hp<=0){c3Fail(b,'Техник потерян. Существо завершило ритуал страха.');return;}if(b.beacon.hp<=0){c3Fail(b,'Маяк разрушен. Защитный контур квартала рухнул.');return;}if(b.liora.stamina<=0){c3Fail(b,'Лиора выбыла, и удержать две цели стало невозможно.');return;}if(b.enemy.seal>0)b.enemy.seal-=1;b.round+=1;b.heroActions=2;b.teamUsed=false;b.intent=b.intent==='terror'?'beacon':b.intent==='beacon'?'liora':'terror';c.battle=b;chapter3Save('Начался новый раунд.');}
  function renderC3Amulet(){const c=save.chapter3;c3Shell('Приказ после боя','Сюжетный выбор',`<section class="card c3-story"><div class="c3-speaker">Канал Ордена</div><h2>Уничтожить человеческий амулет</h2><p>Ломатель удержан в Печати. Командование требует уничтожить связанный с ним амулет, хотя внутри сохранились воспоминания техника о погибшей сестре.</p><div class="c3-quote">Лиора обязана выполнить приказ — но молчит и ждёт вашего решения.</div></section><div class="c3-choice-grid"><button class="c3-choice ${c.amulet==='obey'?'selected':''}" data-action="c3-amulet" data-amulet="obey"><b>Исполнить приказ Ордена</b><small>Амулет уничтожен. Репутация Ордена вырастет.</small></button><button class="c3-choice ${c.amulet==='save'?'selected':''}" data-action="c3-amulet" data-amulet="save"><b>Сохранить воспоминания</b><small>Доверие Лиоры вырастет, но останется риск заражения.</small></button><button class="c3-choice ${c.amulet==='lie'?'selected':''}" data-action="c3-amulet" data-amulet="lie"><b>Подменить амулет и солгать</b><small>Независимость усилится. Лиора поймёт обман.</small></button></div>`,`<button class="primary-button" style="width:100%" data-action="c3-to-registration" ${c.amulet?'':'disabled'}>Вернуться домой</button>`);}
  function renderC3Registration(){const c=save.chapter3,summary={obey:['Протокол соблюдён','Орден принимает отчёт без вопросов. Лиора выглядит спокойной — слишком спокойной.'],save:['Память сохранена','Лиора запечатывает амулет и обещает лично следить за его состоянием.'],lie:['Отчёт подменён','Лиора понимает обман, но решает не разоблачать героя.']}[c.amulet];c3Shell('После операции','Дом',`<section class="card c3-story"><div class="c3-speaker">${summary[0]}</div><h2>Лиора предлагает регистрацию</h2><p>${summary[1]}</p><div class="c3-quote">Регистрация даст архивы и задания Ордена, но позволит организации отслеживать всплески вашей силы.</div></section><div class="c3-choice-grid"><button class="c3-choice ${c.registration==='yes'?'selected':''}" data-action="c3-registration" data-registration="yes"><b>Пройти временную регистрацию</b><small>Открываются официальные контракты и часть архивов.</small></button><button class="c3-choice ${c.registration==='conditional'?'selected':''}" data-action="c3-registration" data-registration="conditional"><b>Сотрудничать без полной регистрации</b><small>Лиора становится поручителем; доступ выдаётся по заданиям.</small></button><button class="c3-choice ${c.registration==='no'?'selected':''}" data-action="c3-registration" data-registration="no"><b>Отказаться и скрыть Искру</b><small>Орден установит наблюдение; независимые пути усилятся.</small></button></div>`,`<button class="primary-button" style="width:100%" data-action="c3-finish" ${c.registration?'':'disabled'}>Завершить главу</button>`);}
  function applyChapter3Resolution(){const c=save.chapter3;if(c.resultApplied)return;c.resultApplied=true;let trust=1,order=0,ind=0;if(c.approach==='trust'){trust+=1;order+=1;}if(c.approach==='defiant'){ind+=1;order-=1;}if(c.approach==='pragmatic')trust+=1;if(c.amulet==='obey')order+=2;if(c.amulet==='save'){trust+=2;save.inventory.items.sister_memory_amulet=1;save.story.flags['chapter_03.amulet_risk']=true;}if(c.amulet==='lie'){trust+=1;ind+=2;save.inventory.items.sister_memory_amulet=1;save.story.flags['chapter_03.hidden_report_method']=true;}if(c.registration==='yes'){order+=2;save.inventory.items.order_field_clearance=1;save.story.flags['order.contracts_unlocked']=true;save.story.flags['order.archives_partial']=true;}if(c.registration==='conditional'){order+=1;trust+=1;save.story.flags['order.liora_guarantor']=true;save.story.flags['order.archives_limited']=true;}if(c.registration==='no'){order-=1;ind+=1;save.story.flags['order.observation_active']=true;}
    save.relationships.liora.trust=Math.min(10,Math.max(0,(save.relationships.liora.trust||0)+trust));save.relationships.liora.label=save.relationships.liora.trust>=5?'Прочное доверие':save.relationships.liora.trust>=3?'Союзница':'Осторожный союз';save.reputations.order.value=Math.max(-3,Math.min(6,(save.reputations.order.value||0)+order));save.reputations.order.label=orderLabel(save.reputations.order.value);save.reputations.independence=(save.reputations.independence||0)+ind;
    if(!save.companions.owned.includes('liora'))save.companions.owned.push('liora');save.companions.states.liora={level:3,trust:save.relationships.liora.trust,rank:0};if(!save.companions.activeParty[1])save.companions.activeParty[1]='liora';save.meta.heroMastery.shield=Math.max(2,save.meta.heroMastery.shield||1);save.profile.heroLevel=Math.max(3,save.profile.heroLevel);save.profile.accountLevel=Math.max(3,save.profile.accountLevel);save.profile.heroXp=Math.min(save.profile.heroXpToNext-1,(save.profile.heroXp||0)+35);save.currencies.coins+=40;save.inventory.items.threshold_breaker_page=1;save.codex.creatures.threshold_breaker={knowledge:1,max:3};if(!save.codex.discoveries.includes('threshold_breaker'))save.codex.discoveries.push('threshold_breaker');save.story.decisions['chapter_03.first_response']=c.approach;save.story.decisions['chapter_03.operation_priority']=c.plan;save.story.decisions['chapter_03.amulet_fate']=c.amulet;save.story.decisions['chapter_03.order_registration']=c.registration;save.story.flags['chapter_03.complete']=true;save.progression.chapters.chapter_03_first_light={status:'completed',progress:100};save.progression.chapters.chapter_04_bitter_recipe={status:'available',progress:0};save.progression.activeQuestId='chapter_04_bitter_recipe';c.status='completed';c.stage='final';}
  function renderC3Final(){const c=save.chapter3,reg={yes:'Временная регистрация',conditional:'Поручительство Лиоры',no:'Отказ от регистрации'}[c.registration],end={obey:'Приказ исполнен',save:'Воспоминания сохранены',lie:'Отчёт подменён'}[c.amulet];c3Shell('Глава завершена','Уровень 3',`<section class="card c3-story c3-result"><div class="c3-result-glyph">✦</div><h2>Лиора Вейн присоединилась</h2><p>Эгида защищает цели, восстанавливает Стойкость и помогает удерживать Печати. Все решения записаны в общее сохранение.</p><div class="c3-reward-grid"><div><b>Лиора 4★</b><span>Постоянный спутник</span></div><div><b>Щит союзника</b><span>Новое применение</span></div><div><b>+40 монет</b><span>Награда главы</span></div><div><b>+35 опыта</b><span>Рост героя</span></div></div></section><div class="section-title"><h2>Последствия</h2><span>Автосохранение</span></div><article class="card status-list"><div class="status-row"><span>Амулет</span><span>${end}</span></div><div class="status-row"><span>Орден</span><span>${reg}</span></div><div class="status-row"><span>Репутация</span><span>${save.reputations.order.label}</span></div><div class="status-row"><span>Доверие Лиоры</span><span>${save.relationships.liora.trust}/10</span></div><div class="status-row"><span>Следующая глава</span><span>«Горький рецепт» открыта</span></div></article>`,`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="secondary-button" data-action="c3-view-liora">Лиора</button><button class="primary-button" data-action="c3-return-home">Вернуться домой</button></div>`);}
  function resetChapter3(){const had=save.progression.chapters.chapter_03_first_light.status==='completed';save.chapter3=createChapter3State();save.progression.chapters.chapter_03_first_light={status:'available',progress:0};save.progression.chapters.chapter_04_bitter_recipe={status:'locked',progress:0};save.progression.activeQuestId='chapter_03_first_light';for(const key of Object.keys(save.story.decisions))if(key.startsWith('chapter_03.'))delete save.story.decisions[key];for(const key of Object.keys(save.story.flags))if(key.startsWith('chapter_03.')||key.startsWith('order.'))delete save.story.flags[key];if(had){save.companions.owned=save.companions.owned.filter(id=>id!=='liora');delete save.companions.states.liora;if(save.companions.activeParty[1]==='liora')save.companions.activeParty[1]=null;save.relationships.liora={trust:0,label:'Не знакомы'};save.reputations.order={value:0,label:'Неизвестны Ордену'};save.reputations.independence=0;delete save.inventory.items.threshold_breaker_page;delete save.inventory.items.sister_memory_amulet;delete save.inventory.items.order_field_clearance;delete save.codex.creatures.threshold_breaker;save.codex.discoveries=save.codex.discoveries.filter(id=>id!=='threshold_breaker');save.meta.heroMastery.shield=1;}currentScreen='home';}
  function showChapter4Info(){openModal(`<div class="modal-header"><div><div class="eyebrow">Следующая часть</div><h2>«Горький рецепт»</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Лиора направит героя к Селесте. Глава проверит качество сырья, расширенную алхимию и влияние выбранной смеси на бой.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);}

  document.addEventListener('click',(event)=>{const button=event.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;switch(action){
    case 'start-chapter3':{if(save.progression.chapters.chapter_02_roots_of_memory.status!=='completed'){toast('Сначала завершите «Корни памяти».');break;}if(save.progression.chapters.chapter_03_first_light.status==='completed')save.chapter3.stage='final';else{save.chapter3.status='in_progress';save.progression.chapters.chapter_03_first_light.status='in_progress';save.progression.activeQuestId='chapter_03_first_light';}currentScreen='chapter3';chapter3Save(null);break;}
    case 'chapter3-pause':currentScreen='home';saveGame('Глава приостановлена. Прогресс сохранён.');break;
    case 'c3-open-door':save.chapter3.stage='meeting';chapter3Save(null);break;
    case 'c3-approach':save.chapter3.approach=button.dataset.approach;chapter3Save('Отношение к Лиоре сохранено.');break;
    case 'c3-to-investigation':save.chapter3.stage='investigation';chapter3Save('Расследование начато.');break;
    case 'c3-location':save.chapter3.location=button.dataset.location;chapter3Save(null);break;
    case 'c3-investigate':{const id=button.dataset.point;let item=null;for(const loc of Object.values(c3Locations))item=loc.items.find(x=>x.id===id)||item;if(!item||save.chapter3.seen[id])break;const cost=c3InvestCost(item);if(save.chapter3.time<cost){toast('Не хватает времени.');break;}save.chapter3.time-=cost;save.chapter3.seen[id]=true;if(item.clue)save.chapter3.clues[item.clue]=true;toast(item.text);chapter3Save(null);break;}
    case 'c3-to-tutorial':if(c3CanBrief()){save.chapter3.stage='tutorial';chapter3Save(null);}break;
    case 'c3-tutorial-aegis':save.chapter3.tutorialDone=true;chapter3Save('Эгида удержала обломки.');break;
    case 'c3-to-brief':save.chapter3.stage='brief';chapter3Save(null);break;
    case 'c3-plan':save.chapter3.plan=button.dataset.plan;chapter3Save('План операции сохранён.');break;
    case 'c3-start-battle':if(save.chapter3.plan){save.chapter3.battle=createChapter3Battle();save.chapter3.stage='battle';chapter3Save('Операция началась.');}break;
    case 'c3-battle-tab':save.chapter3.battle.tab=button.dataset.tab;chapter3Save(null);break;
    case 'c3-battle-action':c3UseAction(button.dataset.battleAction);break;
    case 'c3-end-turn':c3EndTurn();break;
    case 'c3-retry-battle':save.chapter3.battle=createChapter3Battle();chapter3Save('Бой начат заново.');break;
    case 'c3-amulet':save.chapter3.amulet=button.dataset.amulet;chapter3Save('Судьба амулета сохранена.');break;
    case 'c3-to-registration':if(save.chapter3.amulet){save.chapter3.stage='registration';chapter3Save(null);}break;
    case 'c3-registration':save.chapter3.registration=button.dataset.registration;chapter3Save('Условия сотрудничества сохранены.');break;
    case 'c3-finish':if(save.chapter3.registration){applyChapter3Resolution();chapter3Save('Уровень 3 завершён. Лиора присоединилась.');}break;
    case 'c3-view-liora':showCompanion('liora');break;
    case 'c3-return-home':currentScreen='home';saveGame('Все последствия главы сохранены.');break;
    case 'chapter4-info':showChapter4Info();break;
    case 'debug-reset-chapter3':if(confirm('Сбросить главу 3 и все её награды и решения?')){closeModal();resetChapter3();saveGame('Глава 3 сброшена.');}break;
    case 'debug-complete-chapter3':save.chapter3.approach='trust';save.chapter3.plan='technician';save.chapter3.amulet='save';save.chapter3.registration='conditional';applyChapter3Resolution();closeModal();currentScreen='home';saveGame('Глава 3 завершена технической кнопкой.');break;
  }});

  document.addEventListener('change', (event) => {
    if (event.target && event.target.id === 'import-file') importSaveFile(event.target.files[0]);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOpen) closeModal();
  });

  window.addEventListener('beforeunload', () => {
    if (save) {
      save.updatedAt = nowIso();
      save.progression.currentScreen = currentScreen;
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    }
  });



  /* =========================================================
     PART 5 — UX & INVESTIGATION REWORK
     ========================================================= */
  const UX5_VERSION='ux-investigation-rework-1.0.0';
  const UX5_EVIDENCE={
    human_witness:{title:'Слова свидетельницы',type:'human',label:'Человеческая',text:'Общий сон повторяет просьбу посадить растение там, где его забыли.'},
    memory_phrase:{title:'Отпечаток чужой памяти',type:'story',label:'Сюжетная',text:'Воспоминание принадлежит не свидетельнице — оно проходит через неё.'},
    photo_link:{title:'Связь фотографии',type:'ritual',label:'Ритуальная',text:'Корень удерживает образ матери героя.'},
    hidden_note:{title:'Записка за рамой',type:'tactical',label:'Тактическая',text:'Мать предупреждала: растение нельзя лишать всех опор одновременно.'},
    ledger_warning:{title:'Журнал поставок',type:'tactical',label:'Тактическая',text:'Плющ восстанавливает оболочку, пока у него остаются две опоры.'},
    soil_link:{title:'Погребальная земля',type:'ritual',label:'Ритуальная',text:'Земля питает незавершённое прощание.'},
    moon_dew:{title:'Лунная роса',type:'resource',label:'Ресурсная',text:'Позволит приготовить мягкое Очищение и сохранить семя.'},
    pure_lavender:{title:'Чистая лаванда',type:'resource',label:'Ресурсная',text:'Стабилизирует смесь, но не сохраняет редкие воспоминания.'},
    resident_testimony:{title:'Слова жильца',type:'human',label:'Человеческая',text:'Жилец узнаёт серебряную заколку матери под решёткой.'},
    hairpin_link:{title:'Связь заколки',type:'ritual',label:'Ритуальная',text:'Заколка удерживает невыполненное обещание.'},
    root_pattern:{title:'Ритм корней',type:'tactical',label:'Тактическая',text:'Рост можно подавить до боя, если перерезать боковой побег.'}
  };
  const UX5_LOCATIONS={
    apartment:{name:'Квартира',scene:'apartment',points:[
      {id:'witness',icon:'人',name:'Спящая свидетельница',desc:'Она повторяет чужие слова и сжимает ладонь до крови.',x:22,y:66,methods:[
        {id:'calm',label:'Успокоить и расспросить',desc:'Мирской подход снизит панику перед опасной сценой.',cost:1,evidence:'human_witness',effect:'witnessCalmed'},
        {id:'search_memory',label:'Применить Поиск',desc:'Вытащить магический отпечаток из сна. Это напугает её.',cost:1,search:true,evidence:'memory_phrase',effect:'stress'}]},
      {id:'photo',icon:'▧',name:'Семейная фотография',desc:'Тонкий корень проходит под рамой и уходит в стену.',x:68,y:29,methods:[
        {id:'inspect_photo',label:'Проследить Корневую Связь',desc:'Безопасно определить, какой образ удерживает растение.',cost:1,search:true,evidence:'photo_link',legacy:'photo'},
        {id:'tele_photo',label:'Снять раму телекинезом',desc:'Быстро добраться до скрытой записки, но создать шум.',cost:1,evidence:'hidden_note',effect:'noise'}]}
    ]},
    shop:{name:'Цветочная лавка',scene:'shop',points:[
      {id:'ledger',icon:'▤',name:'Журнал поставок',desc:'Последний заказ оформляла мать героя.',x:24,y:67,methods:[
        {id:'read_ledger',label:'Сопоставить записи',desc:'Узнать, при каких условиях плющ восстанавливает Покров.',cost:1,evidence:'ledger_warning'},
        {id:'morven_ledger',label:'Попросить Морвена проверить чернила',desc:'Он найдёт старую формулу, но потратит время на ворчание.',cost:1,evidence:'soil_link',legacy:'soil'}]},
      {id:'ingredients',icon:'⚗',name:'Редкая полка',desc:'Остался один комплект качественного сырья — всё забрать нельзя.',x:70,y:34,methods:[
        {id:'take_dew',label:'Взять лунную росу',desc:'Сохранит семя и усилит мягкое Очищение.',cost:1,evidence:'moon_dew',legacy:'dew',exclusive:'ingredient'},
        {id:'take_lavender',label:'Взять чистую лаванду',desc:'Сделает смесь стабильнее, но не сохранит редкую память.',cost:1,evidence:'pure_lavender',effect:'lavender',exclusive:'ingredient'}]}
    ]},
    yard:{name:'Двор',scene:'yard',points:[
      {id:'resident',icon:'人',name:'Жилец у клумбы',desc:'Его тянет коснуться корней, хотя он понимает опасность.',x:72,y:36,methods:[
        {id:'pull_resident',label:'Отвести жильца и расспросить',desc:'Узнать происхождение заколки и снизить риск для людей.',cost:1,evidence:'resident_testimony',effect:'residentMoved'},
        {id:'search_resident',label:'Поиск по зелёному следу',desc:'Быстро увидеть путь корня, но усилить панику.',cost:1,search:true,evidence:'hairpin_link',legacy:'hairpin',effect:'stress'}]},
      {id:'grate',icon:'◇',name:'Металлическая решётка',desc:'Под ней пульсирует серебряная заколка.',x:43,y:72,methods:[
        {id:'tele_grate',label:'Сдвинуть решётку телекинезом',desc:'Получить прямой доступ к Связи, но разбудить корни.',cost:1,evidence:'hairpin_link',legacy:'hairpin',effect:'noise'},
        {id:'morven_grate',label:'Отправить Морвена под решётку',desc:'Тише и безопаснее, но кот потребует считать это подвигом.',cost:1,evidence:'hairpin_link',legacy:'hairpin',effect:'morvenGrate'}]},
      {id:'roots',icon:'♣',name:'Боковой побег',desc:'Корни сокращаются в одном ритме — как перед рывком.',x:15,y:31,methods:[
        {id:'study_roots',label:'Изучить ритм Поиском',desc:'Найти момент, когда рост можно подавить.',cost:1,search:true,evidence:'root_pattern'},
        {id:'cut_roots',label:'Перерезать побег сейчас',desc:'Ослабить рост, но приблизить нападение.',cost:1,evidence:'root_pattern',effect:'noise'}]}
    ]}
  };
  const UX5_HYPOTHESES={
    unfinished_promise:{title:'Плющ удерживает незавершённое обещание',text:'Фотография, земля и заколка — не топливо, а три опоры одной памяти.',support:['photo_link','hairpin_link','memory_phrase','hidden_note','resident_testimony']},
    soil_parasite:{title:'Погребальная земля породила паразита',text:'Растение стало самостоятельной угрозой, а личные предметы лишь усиливают его.',support:['soil_link','root_pattern','ledger_warning']},
    witness_host:{title:'Свидетельница является носителем',text:'Общий сон идёт от неё, поэтому разрыв связи с человеком остановит заражение.',support:['human_witness','memory_phrase','resident_testimony']}
  };
  function createUX5State(){return {version:UX5_VERSION,tutorials:{},dismissed:{},homeGuide:false};}
  function createUX5Investigation(){return {time:7,location:'apartment',selectedPoint:null,resolved:{},evidence:{},freeSearch:true,witnessStress:0,noise:0,witnessCalmed:false,residentMoved:false,morvenGrate:false,lavender:false,hypothesis:null,hypothesisConfirmed:false,danger:{selected:[],resolved:false,maxActions:2},bonuses:{}};}
  function ensureUX5State(state){
    state.ux ||= createUX5State();state.ux.version=UX5_VERSION;state.ux.tutorials ||= {};state.ux.dismissed ||= {};
    state.chapter2 ||= createChapter2State();state.chapter2.rework ||= createUX5Investigation();
    const r=state.chapter2.rework;const fresh=createUX5Investigation();for(const k of Object.keys(fresh))if(r[k]===undefined)r[k]=fresh[k];r.resolved ||= {};r.evidence ||= {};r.danger={...fresh.danger,...(r.danger||{})};r.bonuses ||= {};
    if(!['intro','home','investigation','deduction','danger','alchemy','alchemy_result','battle','choice','return','summon','summary'].includes(state.chapter2.stage))state.chapter2.stage='intro';
    state.chapter2.time=r.time;
    return state;
  }
  const migrateSaveUX4=migrateSave;migrateSave=function(data){return ensureUX5State(migrateSaveUX4(data));};
  const createDefaultSaveUX4=createDefaultSave;createDefaultSave=function(heroType,heroName){return ensureUX5State(createDefaultSaveUX4(heroType,heroName));};
  const createChapter2StateUX4=createChapter2State;createChapter2State=function(){const c=createChapter2StateUX4();c.rework=createUX5Investigation();return c;};

  const renderStartUX4=renderStart;
  renderStart=function(){
    const existing=readSave();const preview=existing?`<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>${existing.progression.chapters.chapter_03_first_light?.status==='completed'?'Первая связанная версия пройдена':'Прогресс сохранён'} · ${formatDate(existing.updatedAt)}</span></div>`:'';
    app.innerHTML=`<section class="start-screen"><div class="brand-kicker">Magic RPG · vertical slice</div><div class="start-copy"><h1 class="start-title">Корни<br>говорят</h1><p class="start-subtitle">Переработанная мобильная версия: сюжетное обучение Морвена, фиксированный экран, интерактивные методы расследования, доска выводов и последствия подготовки в бою.</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать сохранение'}</button></div><div class="version-line">Часть 5 · UX & Investigation Rework · ${CONTENT_VERSION}</div></div></section>`;
  };

  const chapter2ProgressUX4=chapter2Progress;
  chapter2Progress=function(){const c=save.chapter2;const map={intro:0,home:8,investigation:25,deduction:38,danger:46,alchemy:55,alchemy_result:63,battle:72,choice:84,return:91,summon:96,summary:100};if(save.progression.chapters.chapter_02_roots_of_memory.status==='completed')return 100;return map[c.stage]||0;};
  chapter2Shell=function(title,subtitle,body,footer='',hud=''){
    app.innerHTML=`<div class="c2-shell ux5-shell"><header class="c2-top"><button class="c2-back" data-action="chapter2-pause" aria-label="Вернуться в дом">‹</button><div><div class="eyebrow">Глава 2 · Корни памяти</div><h1>${title}</h1><small>${subtitle}</small></div><div class="c2-hud">${hud}<button class="c2-help" data-action="ux-help" aria-label="Помощь">?</button></div></header><main class="c2-main">${body}</main>${footer?`<footer class="c2-footer">${footer}</footer>`:''}</div>`;
  };
  renderChapter2=function(){
    ensureUX5State(save);const c=save.chapter2;if(save.progression.chapters.chapter_02_roots_of_memory.status==='completed'&&c.stage!=='summary')c.stage='summary';
    ({intro:renderC2Intro,home:renderC2Home,investigation:renderC2Investigation,deduction:renderC2Deduction,danger:renderC2Danger,alchemy:renderC2Alchemy,alchemy_result:renderC2AlchemyResult,battle:renderC2Battle,choice:renderC2Choice,return:renderC2Return,summon:renderC2Summon,summary:renderC2Summary}[c.stage]||renderC2Intro)();
  };
  function ux5EvidenceCount(){return Object.keys(save.chapter2.rework.evidence).length;}
  function ux5TypeCount(type){return Object.values(save.chapter2.rework.evidence).filter(x=>x.type===type).length;}
  function ux5CanDeduce(){return ux5EvidenceCount()>=4&&ux5TypeCount('ritual')>=1&&(ux5TypeCount('tactical')>=1||ux5TypeCount('human')>=1);}
  function ux5PointById(loc,id){return UX5_LOCATIONS[loc]?.points.find(p=>p.id===id)||null;}
  function ux5CurrentPoint(){const r=save.chapter2.rework;return ux5PointById(r.location,r.selectedPoint);}
  function ux5EvidenceCards(limit=99){const entries=Object.entries(save.chapter2.rework.evidence).slice(0,limit);return entries.length?entries.map(([id,e])=>`<div class="ux-evidence-chip ${e.type}"><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.label)}</span></div>`).join(''):'<div class="ux-evidence-chip"><b>Улик пока нет</b><span>Выберите объект на сцене</span></div>';}
  function ux5MethodCost(method){const r=save.chapter2.rework;return method.search&&r.freeSearch?0:method.cost;}
  function renderC2Investigation(){
    const c=save.chapter2,r=c.rework,loc=UX5_LOCATIONS[r.location],point=ux5CurrentPoint();
    const points=loc.points.map(p=>{const done=!!r.resolved[p.id];return `<button class="ux-hotspot ${done?'done':''} ${r.selectedPoint===p.id?'selected':''}" style="left:${p.x}%;top:${p.y}%" data-action="ux-select-point" data-point="${p.id}" ${done?'disabled':''}>${done?'✓':p.icon}</button>`}).join('');
    let panel='';
    if(point){const done=!!r.resolved[point.id];panel=`<div class="ux-point-copy"><h2>${point.name}</h2><p>${point.desc}</p></div><div class="ux-methods">${point.methods.map(m=>{const cost=ux5MethodCost(m),blocked=r.time<cost;return `<button class="ux-method" data-action="ux-invest-method" data-method="${m.id}" ${done||blocked?'disabled':''}><strong><span>${m.label}</span><em>${cost===0?'БЕСПЛАТНО':`−${cost} ◷`}</em></strong><span>${m.desc}</span><small>${m.search&&r.freeSearch?'Пассив Морвена: первый Поиск не расходует время.':m.effect==='noise'?'Риск: шум приблизит нападение.':'Результат изменит подготовку или опасную сцену.'}</small></button>`}).join('')}</div>`}else panel=`<div class="ux-empty-point"><div><b>Выберите объект на сцене</b>У каждого объекта есть несколько методов. Один даёт знания, другой — преимущество или риск.</div></div>`;
    chapter2Shell('Расследование','Выбор метода важнее числа кликов',`<div class="ux-investigation"><section class="ux-scene-wrap"><div class="ux-location-tabs">${Object.entries(UX5_LOCATIONS).map(([id,x])=>`<button class="${r.location===id?'active':''}" data-action="ux-select-location" data-location="${id}">${x.name}</button>`).join('')}</div><div class="ux-scene ${loc.scene}"><div class="ux-scene-title">${loc.name}</div><div class="ux-risk-meter"><span>Паника ${r.witnessStress}</span><span>Шум ${r.noise}</span></div>${points}</div></section><section class="ux-invest-panel"><header class="ux-invest-head"><b>${point?point.name:'Точки интереса'}</b><span>${ux5EvidenceCount()} улик · время ${r.time}</span></header><div class="ux-point-body">${panel}</div><div class="ux-evidence-strip">${ux5EvidenceCards()}</div></section></div>`,`<button class="secondary-button" data-action="ux-reset-investigation">Сбросить</button><button class="primary-button" data-action="ux-to-deduction" ${ux5CanDeduce()?'':'disabled'}>Собрать вывод</button>`,`<span>◷ ${r.time}</span><span>${ux5EvidenceCount()} улик</span>`);
  }
  function renderC2Deduction(){
    const r=save.chapter2.rework;const evidence=Object.entries(r.evidence).map(([id,e])=>`<div class="ux-clue-card"><b>${escapeHtml(e.title)}</b><small>${escapeHtml(e.text)}</small><em>${escapeHtml(e.label)}</em></div>`).join('');
    const hypotheses=Object.entries(UX5_HYPOTHESES).map(([id,h])=>{const support=h.support.filter(x=>r.evidence[x]).length;return `<button class="ux-hypothesis ${r.hypothesis===id?'selected':''}" data-action="ux-select-hypothesis" data-hypothesis="${id}"><b>${h.title}</b><span>${h.text}</span><em>Собранных совпадений: ${support}</em></button>`}).join('');
    chapter2Shell('Доска выводов','Улики не дают ответ автоматически',`<div class="ux-deduction"><section class="ux-board-summary"><div class="eyebrow">Вопрос расследования</div><h2>Что на самом деле удерживает Памятный плющ?</h2><p>Выберите гипотезу. Ошибка не остановит сюжет, но изменит опасную сцену и начальные условия боя.</p></section><div class="ux-board-scroll"><div class="ux-clue-board">${evidence}</div><div class="ux-hypotheses">${hypotheses}</div></div></div>`,`<button class="secondary-button" data-action="ux-back-investigation">Вернуться к уликам</button><button class="primary-button" data-action="ux-confirm-hypothesis" ${r.hypothesis?'':'disabled'}>Проверить гипотезу</button>`,`<span>${ux5EvidenceCount()} улик</span>`);
  }
  function ux5DangerMax(){return save.chapter2.rework.hypothesis==='unfinished_promise'?3:2;}
  function renderC2Danger(){
    const r=save.chapter2.rework,d=r.danger;d.maxActions=ux5DangerMax();const selected=new Set(d.selected||[]);const defs={witness:['Защитить свидетельницу','Оттолкнуть корни Щитом и вывести человека из двора.',r.witnessCalmed?'Она послушает команду без паники.':'Без прошлой беседы она будет сопротивляться.'],hairpin:['Сохранить серебряную заколку','Не дать ключевой Связи уйти под решётку.',r.morvenGrate?'Морвен уже знает безопасный проход.':'Придётся действовать под ударами корней.'],growth:['Подавить разрастание','Перерезать боковой побег до основного ритуала.',r.evidence.root_pattern?'Вы знаете точный ритм сокращений.':'Действие будет приблизительным.']};
    const actions=Object.entries(defs).map(([id,x])=>`<button class="ux-danger-action ${selected.has(id)?'selected':''}" data-action="ux-danger-choice" data-choice="${id}" ${!selected.has(id)&&selected.size>=d.maxActions?'disabled':''}><b>${selected.has(id)?'✓ ':''}${x[0]}</b><span>${x[1]}</span><small>${x[2]}</small></button>`).join('');
    chapter2Shell('Корни вырываются наружу','Опасная сцена перед подготовкой',`<div class="ux-danger"><section class="ux-danger-scene"><div class="ux-danger-title"><b>У вас несколько секунд</b><span>Сохранить всё получится только при точном выводе.</span></div><div class="ux-danger-person">🧍</div></section><section class="ux-danger-panel"><header><b>Выберите приоритеты</b><span>${selected.size}/${d.maxActions} действий</span></header><div class="ux-danger-actions">${actions}</div></section></div>`,`<button class="primary-button" data-action="ux-finish-danger" ${selected.size<d.maxActions?'disabled':''}>Зафиксировать последствия</button>`,`<span>${selected.size}/${d.maxActions}</span>`);
  }
  function ux5PreparationRows(){const r=save.chapter2.rework,d=new Set(r.danger.selected||[]),rows=[];rows.push([r.hypothesis==='unfinished_promise'?'✓':'!',r.hypothesis==='unfinished_promise'?'Природа угрозы понята':'Гипотеза сомнительна',r.hypothesis==='unfinished_promise'?'Покров врага будет слабее.':'Бой начнётся без преимущества знания.']);rows.push([d.has('witness')?'✓':'!',d.has('witness')?'Свидетель защищён':'Свидетель под угрозой',d.has('witness')?'Начнёт бой со Щитом.':r.witnessCalmed?'Паника снижена, но Щита нет.':'Начнёт бой с потерянной Стойкостью.']);rows.push([d.has('hairpin')?'✓':'!',d.has('hairpin')?'Заколка доступна':'Заколка под решёткой',d.has('hairpin')?'Телекинез не придётся тратить на решётку.':'Доступ к одной Связи потребует отдельного действия.']);rows.push([d.has('growth')?'✓':'!',d.has('growth')?'Рост подавлен':'Рост не остановлен',d.has('growth')?'Первое восстановление Покрова будет заблокировано.':'Плющ сможет восстановиться обычным образом.']);return rows;}
  const renderC2AlchemyResultUX4=renderC2AlchemyResult;
  renderC2AlchemyResult=function(){const c=save.chapter2,a=c.alchemy;const rows=ux5PreparationRows().map(x=>`<div class="ux-prep-row"><span>${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div></div>`).join('');chapter2Shell('Смесь готова','Расследование превратилось в подготовку',`<div class="c2-scroll"><section class="card c2-potion-result ${a.quality}"><div>⚗</div><span>${qualityLabel(a.quality)}</span><p>${potionEffectText(a.quality)}</p></section><section class="card c2-story"><div class="speaker">План ритуала</div><p>Каждый результат ниже изменит начальное состояние боя — не только текст после него.</p><div class="ux-prep-report">${rows}</div></section></div>`,`<button class="secondary-button" data-action="chapter2-retry-alchemy">Повторить алхимию</button><button class="primary-button" data-action="chapter2-start-battle">Выйти во двор</button>`);};

  const createC2BattleStateUX4=createC2BattleState;
  createC2BattleState=function(){const b=createC2BattleStateUX4();const r=save?.chapter2?.rework||createUX5Investigation();const chosen=new Set(r.danger?.selected||[]);b.investigationBonuses=[];if(r.hypothesis==='unfinished_promise'){b.shroud=2;b.resonance=1;b.investigationBonuses.push('Верная гипотеза: Покров −1');}else if(r.hypothesis==='witness_host'){b.corruption=1;b.investigationBonuses.push('Ошибка: Скверна +1');}if(chosen.has('witness')){b.witness.shield=1;b.investigationBonuses.push('Свидетель начинает со Щитом');}else if(!r.witnessCalmed){b.witness.hp=1;b.investigationBonuses.push('Свидетель потерял Стойкость');}if(chosen.has('hairpin')){b.grate=true;b.investigationBonuses.push('Заколка доступна');}if(chosen.has('growth')){b.suppress=1;b.investigationBonuses.push('Рост подавлен');}if(r.evidence.ledger_warning)b.investigationBonuses.push('Известно восстановление Покрова');return b;};
  function renderC2Battle(){
    let b=normalizeC2Battle(save.chapter2.battle);if(!b){initC2Battle();b=save.chapter2.battle;}save.chapter2.battle=b;const intent=c2Intents[b.intent%c2Intents.length];const bonuses=(b.investigationBonuses||[]).map(x=>`<span>${escapeHtml(x)}</span>`).join('');
    const ritual=`<section class="c2-ritual"><div class="c2-ritual-head"><div><span>Ритуальная цель</span><b>Очищение существа</b></div><em>${canC2Purify(b)?'ГОТОВО':'В ПРОЦЕССЕ'}</em></div><div class="c2-ritual-grid"><div class="${b.shroud===0?'done':''}">Покров: ${3-b.shroud}/3</div><div class="${c2Broken(b)>=2?'done':''}">Связи: ${c2Broken(b)}/2</div><div class="${c2Intact(b)>=1?'done':'fail'}">Живая: ${c2Intact(b)>=1?'есть':'нет'}</div><div class="${b.witness.hp>0?'done':'fail'}">Свидетель: ${b.witness.hp}/${b.witness.max}</div></div><p><b>Дальше:</b> ${c2NextStep(b)}</p><small>Провал: свидетель погибает, Скверна достигает 3 или уничтожены все Связи.</small>${bonuses?`<div class="ux-invest-bonuses">${bonuses}</div>`:''}</section>`;
    const loss=b.lost?`<div class="c2-loss"><h2>Ритуал сорван</h2><p>${b.lossReason}</p><button class="primary-button" data-action="chapter2-retry-battle">Повторить бой</button></div>`:'';
    chapter2Shell('Памятный плющ',`Раунд ${b.round}`,`<div class="c2-battle ux-battle">${ritual}<section class="c2-enemy"><div class="c2-ivy">♣</div><div><h2>Памятный плющ</h2><div class="c2-intent"><span>Намерение</span><b>${intent.name}</b><small>${intent.text}</small></div><div class="c2-statuses"><span><b>${b.shroud}/3</b>Покров</span><span><b>${c2Broken(b)}/3</b>Связи</span><span><b>${b.corruption}/3</b>Скверна</span></div><div class="c2-roots">${c2RootHtml(b)}</div></div></section><section class="c2-team"><div><strong>Герой</strong><span class="c2-segments">${c2Segments(b.hero)}</span></div><button data-action="chapter2-target" data-target="morven" class="${b.targetMode==='shield'?'target':''}"><strong>Морвен</strong><span class="c2-segments">${c2Segments(b.morven)}</span></button><button data-action="chapter2-target" data-target="witness" class="${b.targetMode==='shield'?'target':''}"><strong>Свидетель</strong><span class="c2-segments">${c2Segments(b.witness)}</span></button></section><section class="c2-action-panel"><div class="c2-action-head"><b>${b.tab==='hero'?'Заклинания героя':'Морвен'}</b><span>${b.rootMode?'Выберите Корневую Связь':b.targetMode?'Выберите цель':`Герой ${b.heroActs}/2 · Команда ${b.teamActs}/1 · Резонанс ${b.resonance}/6`}</span></div><div class="c2-actions">${c2BattleActions(b)}</div></section>${loss}</div>`,`<div class="c2-battle-tabs"><button class="${b.tab==='hero'?'active':''}" data-action="chapter2-battle-tab" data-tab="hero">Герой</button><button class="${b.tab==='morven'?'active':''}" data-action="chapter2-battle-tab" data-tab="morven">Морвен</button></div><button class="secondary-button" data-action="chapter2-end-turn" ${b.lost?'disabled':''}>Завершить раунд</button>`,`<span>✦ ${b.heroActs}</span><span>◆ ${b.teamActs}</span>`);
  }

  function ux5ApplyMethod(methodId){const c=save.chapter2,r=c.rework,point=ux5CurrentPoint();if(!point||r.resolved[point.id])return;const m=point.methods.find(x=>x.id===methodId);if(!m)return;const cost=ux5MethodCost(m);if(r.time<cost){toast('Не хватает времени.');return;}r.time-=cost;c.time=r.time;if(m.search&&r.freeSearch){r.freeSearch=false;toast('Циничный совет Морвена: первый Поиск не расходует время.');}if(m.exclusive==='ingredient'){for(const id of ['moon_dew','pure_lavender'])delete r.evidence[id];}const e=UX5_EVIDENCE[m.evidence];r.evidence[m.evidence]={...e,id:m.evidence};r.resolved[point.id]=m.id;r.selectedPoint=null;if(m.legacy)c.clues[m.legacy]=true;if(m.effect==='witnessCalmed')r.witnessCalmed=true;if(m.effect==='stress')r.witnessStress++;if(m.effect==='noise')r.noise++;if(m.effect==='residentMoved')r.residentMoved=true;if(m.effect==='morvenGrate')r.morvenGrate=true;if(m.effect==='lavender')r.lavender=true;c.investSeen[point.id]=true;chapter2Save(`${e.title}: ${e.text}`);}
  function ux5ConfirmHypothesis(){const c=save.chapter2,r=c.rework;if(!r.hypothesis)return;r.hypothesisConfirmed=true;c.clues.photo=true;c.clues.soil=true;c.clues.hairpin=true;c.clues.dew=!!r.evidence.moon_dew;c.stage='danger';r.danger.maxActions=ux5DangerMax();chapter2Save(r.hypothesis==='unfinished_promise'?'Вывод подтверждён уликами. В опасной сцене будет дополнительное действие.':'Гипотеза принята, но часть улик ей противоречит. Бой станет сложнее.');}
  function ux5FinishDanger(){const c=save.chapter2,r=c.rework;if((r.danger.selected||[]).length<ux5DangerMax())return;r.danger.resolved=true;c.stage='alchemy';c.alchemy={order:[],temp:null,stopped:false,charge:null,quality:null,score:0};chapter2Save('Последствия опасной сцены сохранены в подготовке.');}
  function resetUX5Investigation(){const c=save.chapter2;c.rework=createUX5Investigation();c.time=7;c.clues={photo:false,soil:false,hairpin:false,dew:false};c.investSeen={};c.stage='investigation';chapter2Save('Расследование начато заново.');}

  function ux5ContextHelp(){let title='Что делать сейчас?',text='Откройте текущее дело и следуйте подсвеченной задаче.';if(currentScreen==='chapter2'){const s=save.chapter2.stage;if(s==='home'){title='Осмотр сцены';text='Нажимайте на светящиеся точки. Обязательные действия отмечены чек-листом.';}if(s==='investigation'){title='Расследование';text='Выберите объект, затем метод. Методы дают разные типы улик, риски и преимущества. Времени на всё не хватит.';}if(s==='deduction'){title='Доска выводов';text='Сопоставьте улики и выберите объяснение угрозы. Ошибка не остановит главу, но усложнит бой.';}if(s==='danger'){title='Опасная сцена';text='Приоритеты определят, кто и что будет защищено к началу ритуала.';}if(s==='alchemy'){title='Алхимия';text='Добавьте ингредиенты, выберите умеренную температуру и зафиксируйте Искру в отмеченной зоне.';}if(s==='battle'){title='Ритуальный бой';text='Победа — не обнуление здоровья. Выполните чек-лист ритуальной цели; недоступные действия объясняют причину блокировки.';}}openModal(`<div class="modal-header"><div><div class="eyebrow">Морвен объясняет</div><h2>${title}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${text}</p><div class="debug-section"><h3>Управление</h3><div class="status-list"><div class="status-row"><span>Подсказки</span><span>появляются один раз</span></div><div class="status-row"><span>Повторить объяснение</span><span>кнопка ? вверху</span></div><div class="status-row"><span>Сохранение</span><span>после каждого решения</span></div></div></div><div class="modal-actions"><button class="secondary-button" data-action="ux-reset-tutorial">Повторить обучение</button><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);}
  function ux5CoachConfig(){if(!save||save.settings?.reducedMotion)return null;if(currentScreen==='home'&&save.progression.chapters.chapter_02_roots_of_memory.status!=='completed')return {key:'home_case',selector:'[data-action="start-chapter2"]',title:'Начнём с текущего дела',text:'Главная кнопка всегда находится в карточке текущей задачи. Остальные комнаты можно изучить позже.'};if(currentScreen!=='chapter2')return null;const c=save.chapter2,r=c.rework;if(c.stage==='home'){const next=Object.keys(c.homeSeen).find(k=>!c.homeSeen[k]);if(next)return {key:`home_${next}`,selector:`[data-key="${next}"]`,title:'Осмотрите сцену',text:'Светящиеся точки — объекты взаимодействия. Сейчас нажмите на подсвеченный объект.'};}if(c.stage==='investigation'){if(!r.selectedPoint&&ux5EvidenceCount()===0)return {key:'invest_point',selector:'[data-action="ux-select-point"]:not([disabled])',title:'Объект — ещё не решение',text:'Сначала выберите объект на сцене. Затем решите, каким методом его исследовать.'};if(r.selectedPoint)return {key:'invest_method',selector:'[data-action="ux-invest-method"]:not([disabled])',title:'Выберите метод',text:'Разные методы дают разные улики и последствия. Первый Поиск бесплатен благодаря Морвену.'};if(ux5CanDeduce())return {key:'invest_ready',selector:'[data-action="ux-to-deduction"]',title:'Улик достаточно',text:'Не обязательно собирать всё. Переходите к доске выводов и сделайте собственную гипотезу.'};}if(c.stage==='deduction'&&!r.hypothesis)return {key:'deduction',selector:'[data-action="ux-select-hypothesis"]',title:'Игра не выберет ответ за вас',text:'Посмотрите, какие улики поддерживают каждую версию, и выберите наиболее убедительную.'};if(c.stage==='danger')return {key:'danger',selector:'[data-action="ux-danger-choice"]:not([disabled])',title:'Приоритеты вместо лишнего боя',text:'Выберите, что успеете спасти. Этот выбор прямо изменит старт основного боя.'};if(c.stage==='alchemy'){const a=c.alchemy;if(a.order.length===0)return {key:'alchemy_ingredient',selector:'[data-action="chapter2-add-ingredient"]:not([disabled])',title:'Алхимия — часть подготовки',text:'Начните с основы. Порядок, температура и Искра определят боевой эффект смеси.'};if(!a.temp)return {key:'alchemy_temp',selector:'[data-action="chapter2-temperature"]',title:'Температура',text:'Для мягкого Очищения нужна умеренная температура.'};if(!a.stopped)return {key:'alchemy_charge',selector:'[data-action="chapter2-stop-charge"]',title:'Зафиксируйте Искру',text:'Остановите маркер в светлой зоне. Это последнее решение перед приготовлением.'};}if(c.stage==='battle'){const b=c.battle;if(b&&b.round===1&&b.heroActs===2&&b.teamActs===1&&!b.revealed)return {key:'battle_search',selector:'[data-battle-action="search"]',title:'Сначала поймите намерение',text:'Поиск раскрывает активную Связь. Первый раз он бесплатен благодаря Морвену.'};}return null;}
  function removeUX5Coach(){document.querySelector('.ux-coach-layer')?.remove();}
  function showUX5Coach(config){removeUX5Coach();if(!config||save.ux.dismissed[config.key])return;const target=document.querySelector(config.selector);if(!target)return;const rect=target.getBoundingClientRect();const layer=document.createElement('div');layer.className='ux-coach-layer';layer.dataset.coachKey=config.key;layer.innerHTML=`<div class="ux-coach-spot" style="left:${Math.max(4,rect.left-5)}px;top:${Math.max(4,rect.top-5)}px;width:${Math.min(innerWidth-8,rect.width+10)}px;height:${rect.height+10}px"></div><div class="ux-coach-card"><b>${config.title}</b><p>${config.text}</p><div class="ux-coach-actions"><button data-action="ux-skip-all">Отключить подсказки</button><button data-action="ux-dismiss-coach">Понятно</button></div></div>`;document.body.appendChild(layer);}
  function applyUX5Decorations(){
    if(!save)return;ensureUX5State(save);const screen=app.querySelector('.game-shell>.screen');if(screen&&currentScreen==='home'&&save.progression.chapters.chapter_02_roots_of_memory.status!=='completed'&&!screen.querySelector('.ux-guide-banner')){screen.insertAdjacentHTML('afterbegin',`<div class="ux-guide-banner"><span>М</span><div><b>Морвен ведёт первое дело</b><small>Подсказки покажут только новые действия и не будут играть вместо вас.</small></div><button data-action="ux-help">Как играть</button></div>`);}const top=app.querySelector('.topbar-right');if(top&&!top.querySelector('[data-action="ux-help"]'))top.insertAdjacentHTML('afterbegin','<button class="icon-button" data-action="ux-help" aria-label="Помощь">?</button>');requestAnimationFrame(()=>showUX5Coach(ux5CoachConfig()));
  }
  const renderGameUX4=renderGame;renderGame=function(){if(save)ensureUX5State(save);renderGameUX4();applyUX5Decorations();};

  document.addEventListener('click',(event)=>{const button=event.target.closest('[data-action]');if(!button)return;const a=button.dataset.action;const handled=['ux-select-location','ux-select-point','ux-invest-method','ux-reset-investigation','ux-to-deduction','ux-back-investigation','ux-select-hypothesis','ux-confirm-hypothesis','ux-danger-choice','ux-finish-danger','ux-help','ux-dismiss-coach','ux-skip-all','ux-reset-tutorial'];if(!handled.includes(a))return;event.preventDefault();event.stopImmediatePropagation();removeUX5Coach();
    if(a==='ux-select-location'){save.chapter2.rework.location=button.dataset.location;save.chapter2.rework.selectedPoint=null;chapter2Save(null);}
    if(a==='ux-select-point'){save.chapter2.rework.selectedPoint=button.dataset.point;chapter2Save(null);}
    if(a==='ux-invest-method')ux5ApplyMethod(button.dataset.method);
    if(a==='ux-reset-investigation'&&confirm('Начать переработанное расследование заново?'))resetUX5Investigation();
    if(a==='ux-to-deduction'&&ux5CanDeduce()){save.chapter2.stage='deduction';chapter2Save('Открыта доска выводов.');}
    if(a==='ux-back-investigation'){save.chapter2.stage='investigation';chapter2Save(null);}
    if(a==='ux-select-hypothesis'){save.chapter2.rework.hypothesis=button.dataset.hypothesis;chapter2Save('Гипотеза отмечена.');}
    if(a==='ux-confirm-hypothesis')ux5ConfirmHypothesis();
    if(a==='ux-danger-choice'){const d=save.chapter2.rework.danger;d.selected ||= [];const id=button.dataset.choice;const i=d.selected.indexOf(id);if(i>=0)d.selected.splice(i,1);else if(d.selected.length<ux5DangerMax())d.selected.push(id);chapter2Save(null);}
    if(a==='ux-finish-danger')ux5FinishDanger();
    if(a==='ux-help')ux5ContextHelp();
    if(a==='ux-dismiss-coach'){const layer=document.querySelector('.ux-coach-layer');if(layer)save.ux.dismissed[layer.dataset.coachKey]=true;saveGame(null,false);removeUX5Coach();}
    if(a==='ux-skip-all'){save.settings.reducedMotion=true;saveGame('Контекстные подсказки отключены.',false);removeUX5Coach();}
    if(a==='ux-reset-tutorial'){save.settings.reducedMotion=false;save.ux.dismissed={};closeModal();saveGame('Обучение будет показано заново.');}
  },true);

  const openDebugUX4=openDebug;openDebug=function(){const c=save.chapter2,r=c.rework;openModal(`<div class="modal-header"><div><div class="eyebrow">Техническая панель</div><h2>UX & Investigation Rework</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Технические кнопки нужны только для проверки. Сохранение совместимо с предыдущими частями.</p><div class="debug-section"><h3>Переработка главы 2</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter2"><strong>Начать главу 2 заново</strong><span>Новая модель расследования</span></button><button class="debug-button" data-action="ux-reset-tutorial"><strong>Повторить обучение</strong><span>Вернуть подсказки Морвена</span></button></div></div><div class="debug-section"><h3>Текущее расследование</h3><div class="status-list"><div class="status-row"><span>Этап</span><span>${c.stage}</span></div><div class="status-row"><span>Улик</span><span>${Object.keys(r.evidence||{}).length}</span></div><div class="status-row"><span>Гипотеза</span><span>${r.hypothesis||'—'}</span></div><div class="status-row"><span>Шум / паника</span><span>${r.noise} / ${r.witnessStress}</span></div></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid"><button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать JSON</span></button><button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить JSON</span></button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Полностью удалить сохранение</button></div></div>`);};


  /* =========================================================
     PART 5 HOTFIX 1.0.1 — VIEWPORT + TOUCH RELIABILITY
     ========================================================= */
  function ux5UpdateAppHeight(){
    const h=Math.max(420,window.visualViewport?.height||window.innerHeight||document.documentElement.clientHeight||720);
    document.documentElement.style.setProperty('--app-height',`${Math.round(h)}px`);
  }
  ux5UpdateAppHeight();
  window.addEventListener('resize',ux5UpdateAppHeight,{passive:true});
  window.visualViewport?.addEventListener('resize',ux5UpdateAppHeight,{passive:true});

  const renderStartUX5Hotfix=renderStart;
  renderStart=function(){
    removeUX5Coach();
    ux5UpdateAppHeight();
    document.body.classList.remove('ux5-game-mode');
    document.body.classList.add('ux5-start-mode');
    renderStartUX5Hotfix();
  };

  const renderGameUX5Hotfix=renderGame;
  renderGame=function(){
    ux5UpdateAppHeight();
    document.body.classList.remove('ux5-start-mode');
    document.body.classList.add('ux5-game-mode');
    renderGameUX5Hotfix();
  };

  removeUX5Coach=function(){
    document.querySelectorAll('.ux-coach-layer,.ux-coach-spot,.ux-coach-card').forEach(node=>node.remove());
    document.querySelectorAll('.ux-coach-target').forEach(node=>node.classList.remove('ux-coach-target'));
  };
  showUX5Coach=function(config){
    removeUX5Coach();
    if(!config||!save||save.ux.dismissed[config.key])return;
    const target=document.querySelector(config.selector);
    if(!target)return;

    /* The hint must stay in the scroll flow, but never be inserted inside strict
       gameplay grids such as scene-layout, alchemy, or battle panels, otherwise it
       can overlap content or block precise interactions like the alchemy charge bar. */
    const layoutAnchorSelectors=[
      '.c2-scene-layout',
      '.c2-invest',
      '.c2-alchemy',
      '.c2-battle',
      '.c2-intro',
      '.c3-tutorial',
      '.c3-invest-list',
      '.c3-progress-card',
      '.home-scene',
      '.quest-card',
      '.case-card',
      '.card'
    ];
    const layoutAnchor=layoutAnchorSelectors.map(sel=>target.closest(sel)).find(Boolean)||target.closest('.screen,.c2-scroll,.c3-scroll')||target;
    const host=target.closest('.c2-scroll,.c3-scroll,.screen,.modal-body,.game-shell')||layoutAnchor.parentElement;
    if(!host)return;
    target.classList.add('ux-coach-target');

    const card=document.createElement('div');
    card.className='ux-coach-card ux-coach-card-inline';
    card.dataset.coachKey=config.key;
    card.innerHTML=`<b>${config.title}</b><p>${config.text}</p><div class="ux-coach-actions"><button data-action="ux-skip-all">Отключить подсказки</button><button data-action="ux-dismiss-coach">Понятно</button></div>`;

    /* Prefer placing the coach immediately before the relevant gameplay block.
       This keeps the explanation visible without covering the block itself. */
    if(layoutAnchor!==host && layoutAnchor.parentElement===host){
      host.insertBefore(card,layoutAnchor);
    }else if(layoutAnchor.parentElement){
      layoutAnchor.parentElement.insertBefore(card,layoutAnchor);
    }else{
      host.prepend(card);
    }

    requestAnimationFrame(()=>{
      card.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
      target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
    });

    /* Mark as shown immediately so a rerender cannot trap the player in the same hint. */
    save.ux.dismissed[config.key]=true;
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(_){/* local file preview may deny storage */}
  };

  /* Some Android file viewers swallow the synthetic click after touchend.
     Retry only the four launch/modal actions, and only if the original button
     is still on screen 180 ms later. */
  const ux5NativeClickTime=new WeakMap();
  document.addEventListener('click',(event)=>{
    const button=event.target.closest?.('button[data-action]');
    if(button)ux5NativeClickTime.set(button,performance.now());
  },true);
  document.addEventListener('touchend',(event)=>{
    const button=event.target.closest?.('button[data-action]');
    if(!button||button.disabled)return;
    if(!['new-game','continue-game','create-save','close-modal'].includes(button.dataset.action))return;
    const releasedAt=performance.now();
    setTimeout(()=>{
      const nativeClickAt=ux5NativeClickTime.get(button)||0;
      if(button.isConnected&&nativeClickAt<releasedAt)button.click();
    },240);
  },{capture:true,passive:true});



  /* =========================================================
     PART 6 — LEVEL 3 «FIRST LIGHT» UX & INVESTIGATION REWORK
     ========================================================= */
  const UX6_VERSION='level3-ux-investigation-rework-1.0.1';
  const UX6_EVIDENCE={
    fear_trace:{title:'След чужого страха',type:'ritual',label:'Ритуальная',text:'Ломатель цепляется не за тело техника, а за его обещание защитить район.'},
    technician_statement:{title:'Показания техника',type:'human',label:'Человеческая',text:'Перед нападением он услышал голос погибшей сестры из старого амулета.'},
    inverted_sigil:{title:'Вывернутая печать',type:'tactical',label:'Тактическая',text:'Печать намеренно перевёрнута: существо готовили к прорыву, а не к убийству.'},
    black_parcel:{title:'Чёрный свёрток',type:'story',label:'Сюжетная',text:'Курьер видел человека в форме Ордена, оставившего свёрток у маяка.'},
    beacon_amplifier:{title:'Схема усилителя маяка',type:'ritual',label:'Ритуальная',text:'Маяк усиливает любую привязанную к нему эмоцию — в том числе страх.'},
    shield_protocol:{title:'Протокол двойной защиты',type:'tactical',label:'Тактическая',text:'Щит на человеке ослабляет Покров, а Эгида на маяке не даёт контуру рухнуть.'},
    old_case:{title:'Дело №17',type:'story',label:'Сюжетная',text:'Похожее существо уже использовало горе семьи как Источник страха.'},
    weak_segment:{title:'Слабый сегмент контура',type:'resource',label:'Ресурсная',text:'Его можно заранее укрепить и дать маяку дополнительную устойчивость.'},
    escape_tear:{title:'Разрыв отхода',type:'tactical',label:'Тактическая',text:'На крыше подготовлен путь побега; Печать потребуется не позднее четвёртого раунда.'},
    attack_cycle:{title:'Цикл намерений',type:'tactical',label:'Тактическая',text:'Ломатель чередует давление на техника, маяк и Лиору.'},
    light_charge:{title:'Аварийный световой заряд',type:'resource',label:'Ресурсная',text:'Заряд можно превратить в начальный Резонанс команды.'}
  };
  const UX6_LOCATIONS={
    square:{name:'Городская площадь',scene:'square',points:[
      {id:'technician',icon:'人',name:'Техник Ордена',desc:'Он держится рядом с маяком, но реагирует на голос из амулета.',x:22,y:69,methods:[
        {id:'calm_technician',label:'Успокоить и расспросить',desc:'Снизить панику и узнать, чей голос он слышит.',cost:1,evidence:'technician_statement',effect:'calmed'},
        {id:'search_fear',label:'Применить Поиск',desc:'Увидеть Источник страха напрямую, но усилить давление на техника.',cost:1,search:true,evidence:'fear_trace',effect:'pressure'}]},
      {id:'sigil',icon:'✦',name:'Обгоревшая печать',desc:'Знак Ордена вывернут наизнанку и направлен к маяку.',x:55,y:36,methods:[
        {id:'liora_sigil',label:'Разобрать знак вместе с Лиорой',desc:'Безопасно понять назначение ритуала.',cost:1,evidence:'inverted_sigil'},
        {id:'tele_sigil',label:'Поднять плиту телекинезом',desc:'Найти остатки чёрного свёртка, но поднять тревогу существа.',cost:1,evidence:'black_parcel',effect:'alarm'}]},
      {id:'courier',icon:'▣',name:'Напуганный курьер',desc:'Он видел человека в форме Ордена до начала заражения.',x:79,y:64,methods:[
        {id:'question_courier',label:'Попросить описать незнакомца',desc:'Получить сюжетную улику без магии.',cost:1,evidence:'black_parcel'},
        {id:'track_parcel',label:'Проследить остаточный след',desc:'Найти ритуальную цепочку от свёртка к маяку.',cost:2,search:true,evidence:'beacon_amplifier',effect:'pressure'}]}
    ]},
    archive:{name:'Полевой архив',scene:'archive',points:[
      {id:'protocol',icon:'▤',name:'Протокол маяка',desc:'Лиора имеет доступ к защитной схеме квартала.',x:25,y:55,methods:[
        {id:'read_protocol',label:'Изучить двойной контур',desc:'Понять, как одновременно защищать человека и объект.',cost:1,evidence:'shield_protocol'},
        {id:'compare_beacon',label:'Сопоставить всплески маяка',desc:'Доказать, что маяк усиливает страх техника.',cost:1,evidence:'beacon_amplifier'}]},
      {id:'closed_case',icon:'◇',name:'Закрытое дело №17',desc:'Старая запись о существе похожего типа.',x:62,y:32,methods:[
        {id:'open_case',label:'Попросить Лиору открыть дело',desc:'Узнать прошлый Источник страха. При прагматичном разговоре быстрее.',cost:2,evidence:'old_case',pragmaticCost:1},
        {id:'morven_case',label:'Дать Морвену прочитать печать',desc:'Он найдёт ритуальный шаблон, но испортит отношения с архивом.',cost:1,evidence:'fear_trace',effect:'alarm'}]},
      {id:'maintenance',icon:'⌁',name:'Карта обслуживания',desc:'На схеме отмечен сегмент, который давно не проверяли.',x:79,y:70,methods:[
        {id:'mark_weak',label:'Отметить слабый сегмент',desc:'Перед боем укрепить маяк.',cost:1,evidence:'weak_segment',effect:'beaconBonus'},
        {id:'take_charge',label:'Забрать аварийный заряд',desc:'Получить начальный Резонанс, но оставить архив без резерва.',cost:1,evidence:'light_charge',effect:'charge'}]}
    ]},
    roof:{name:'Крыша над площадью',scene:'roof',points:[
      {id:'tear',icon:'◌',name:'Нестабильный разрыв',desc:'Воздух складывается в узкий путь из района.',x:26,y:38,methods:[
        {id:'study_tear',label:'Изучить путь Поиском',desc:'Заранее узнать момент побега.',cost:1,search:true,evidence:'escape_tear'},
        {id:'mark_tear',label:'Поставить метку Печати',desc:'Отсрочить побег, но предупредить Ломателя.',cost:1,evidence:'escape_tear',effect:'routeMarked'}]},
      {id:'vantage',icon:'◉',name:'Точка наблюдения',desc:'Отсюда видны колебания Покрова и маяка.',x:57,y:65,methods:[
        {id:'watch_cycle',label:'Наблюдать полный цикл',desc:'Раскрыть последовательность намерений врага.',cost:2,evidence:'attack_cycle',effect:'intentKnown'},
        {id:'morven_watch',label:'Оставить Морвена наблюдать',desc:'Быстрее, но кот не сможет помочь с другим следом.',cost:1,evidence:'attack_cycle',effect:'morvenWatch'}]},
      {id:'cache',icon:'▣',name:'Тайник оперативника',desc:'Внутри остался аварийный световой заряд.',x:82,y:35,methods:[
        {id:'take_roof_charge',label:'Забрать заряд',desc:'Начать бой с дополнительным Резонансом.',cost:1,evidence:'light_charge',effect:'charge'},
        {id:'leave_cache',label:'Перенастроить заряд на маяк',desc:'Укрепить объект вместо команды.',cost:1,evidence:'weak_segment',effect:'beaconBonus'}]}
    ]}
  };
  const UX6_HYPOTHESES={
    fear_amplifier:{title:'Страх техника — Источник, маяк — усилитель',text:'Амулет вызывает страх, маяк умножает его, а разрыв готовит побег существа.',support:['fear_trace','technician_statement','beacon_amplifier','shield_protocol','escape_tear']},
    beacon_core:{title:'Сам маяк стал сердцем заражения',text:'Если разрушить или очистить объект, существо лишится опоры независимо от техника.',support:['beacon_amplifier','weak_segment','inverted_sigil']},
    order_controller:{title:'Диверсант Ордена управляет существом удалённо',text:'Чёрный свёрток и форма указывают на внутреннего врага; человек остаётся главным источником.',support:['black_parcel','inverted_sigil','old_case']}
  };
  function createUX6Investigation(){return {version:UX6_VERSION,time:8,location:'square',selectedPoint:null,resolved:{},evidence:{},freeSearch:true,pressure:0,alarm:0,calmed:false,beaconBonus:false,charge:false,routeMarked:false,intentKnown:false,morvenWatch:false,hypothesis:null,hypothesisConfirmed:false,hypothesisCorrect:false,incompleteDeduction:false,emergencyDeduction:false,training:{step:0,heroShield:false,lioraAegis:false,complete:false},danger:{selected:[],resolved:false,maxActions:2},bonuses:{}};}
  function ensureUX6State(state){
    state.chapter3 ||= createChapter3State();state.chapter3.rework6 ||= createUX6Investigation();
    const r=state.chapter3.rework6,f=createUX6Investigation();for(const k of Object.keys(f))if(r[k]===undefined)r[k]=f[k];r.resolved ||= {};r.evidence ||= {};r.training={...f.training,...(r.training||{})};r.danger={...f.danger,...(r.danger||{})};r.danger.selected=Array.isArray(r.danger.selected)?r.danger.selected:[];r.bonuses ||= {};
    const stageMap={tutorial:'training'};if(stageMap[state.chapter3.stage])state.chapter3.stage=stageMap[state.chapter3.stage];
    const allowed=['intro','meeting','investigation','deduction','training','danger','brief','battle','amulet','registration','final'];if(!allowed.includes(state.chapter3.stage))state.chapter3.stage='intro';
    if(state.progression?.chapters?.chapter_03_first_light?.status==='completed'||state.story?.flags?.['chapter_03.complete'])state.chapter3.stage='final';
    return state;
  }
  const migrateSaveUX5=migrateSave;migrateSave=function(data){const state=migrateSaveUX5(data);state.contentVersion=CONTENT_VERSION;state.saveVersion=SAVE_VERSION;return ensureUX6State(state);};
  const createDefaultSaveUX5=createDefaultSave;createDefaultSave=function(heroType,heroName){return ensureUX6State(createDefaultSaveUX5(heroType,heroName));};
  const createChapter3StateUX5=createChapter3State;createChapter3State=function(){const c=createChapter3StateUX5();c.rework6=createUX6Investigation();return c;};
  const normalizeChapter3StateUX5=normalizeChapter3State;normalizeChapter3State=function(value){const c=normalizeChapter3StateUX5(value);c.rework6 ||= createUX6Investigation();const holder={chapter3:c,progression:save?.progression||{chapters:{}},story:save?.story||{flags:{}}};ensureUX6State(holder);return holder.chapter3;};

  chapter3Progress=function(){const c=save.chapter3;const map={intro:3,meeting:10,investigation:28,deduction:40,training:51,danger:60,brief:68,battle:82,amulet:89,registration:95,final:100};return map[c.stage]||0;};
  c3Shell=function(title,subtitle,body,footer='',hud=''){
    app.innerHTML=`<div class="c3-shell ux6-c3"><header class="c3-top"><button data-action="chapter3-pause" aria-label="Вернуться домой">‹</button><div><div class="eyebrow">Глава 3 · Первый Свет</div><h1>${title}</h1><small>${subtitle}</small></div><div class="c3-hud">${hud}<button class="ux6-help" data-action="ux6-help" aria-label="Помощь">?</button></div></header><main class="c3-main">${body}</main>${footer?`<footer class="c3-footer">${footer}</footer>`:''}</div>`;
  };
  renderChapter3=function(){ensureUX6State(save);const c=save.chapter3;if(save.progression.chapters.chapter_03_first_light.status==='completed'&&c.stage!=='final')c.stage='final';({intro:renderC3Intro,meeting:renderC3Meeting,investigation:renderUX6Investigation,deduction:renderUX6Deduction,training:renderUX6Training,danger:renderUX6Danger,brief:renderUX6Brief,battle:renderUX6Battle,amulet:renderC3Amulet,registration:renderC3Registration,final:renderC3Final}[c.stage]||renderC3Intro)();};

  function ux6FindMethod(id){for(const loc of Object.values(UX6_LOCATIONS))for(const point of loc.points)for(const method of point.methods)if(method.id===id)return {loc,point,method};return null;}
  function ux6MethodCost(method){if(method.pragmaticCost&&save.chapter3.approach==='pragmatic')return method.pragmaticCost;if(method.search&&save.chapter3.rework6.freeSearch)return 0;return method.cost;}
  function ux6EvidenceCount(){return Object.keys(save.chapter3.rework6.evidence||{}).length;}
  function ux6EvidenceTypes(){return new Set(Object.values(save.chapter3.rework6.evidence||{}).map(e=>e.type)).size;}
  function ux6HasCoreEvidence(){const values=Object.values(save.chapter3.rework6.evidence||{});return values.some(e=>e.type==='ritual')&&values.some(e=>e.type==='tactical');}
  function ux6CanDeduce(){return ux6EvidenceCount()>=4&&ux6EvidenceTypes()>=3;}
  function ux6CanEmergencyDeduce(){const r=save.chapter3.rework6;return r.time<=0&&ux6EvidenceCount()>=2;}
  function ux6CanProceedToDeduction(){return ux6CanDeduce()||ux6CanEmergencyDeduce();}
  function ux6EvidenceHtml(){
    const list=Object.entries(save.chapter3.rework6.evidence);
    const chips=list.length?list.map(([id,e])=>`<div class="ux6-evidence-chip ${e.type}"><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.label)}</span></div>`).join(''):`<div class="ux6-evidence-chip"><b>Улик пока нет</b><span>Выберите объект на сцене</span></div>`;
    return `<details class="ux6-evidence-box" open><summary>Найденные улики <span>${list.length} · типов ${ux6EvidenceTypes()}</span></summary><div class="ux6-evidence-row">${chips}</div></details>`;
  }
  function ux6ResetInvestigation(){
    const c=save.chapter3;
    c.rework6=createUX6Investigation();
    c.stage='investigation';
    c.plan=null;
    c.battle=null;
    chapter3Save('Расследование начато заново.');
  }
  function renderUX6Investigation(){
    const c=save.chapter3,r=c.rework6,loc=UX6_LOCATIONS[r.location],point=loc.points.find(p=>p.id===r.selectedPoint);
    const ritualCount=Object.values(r.evidence).filter(e=>e.type==='ritual').length;
    const tacticalCount=Object.values(r.evidence).filter(e=>e.type==='tactical').length;
    const canNormal=ux6CanDeduce(),canEmergency=ux6CanEmergencyDeduce(),canProceed=ux6CanProceedToDeduction(),hasCore=ux6HasCoreEvidence();
    let conditionText='';
    if(canNormal&&hasCore)conditionText='<span class="ux6-condition-good">Данных достаточно: улики разнообразны, ритуальный и тактический следы найдены.</span>';
    else if(canNormal)conditionText='<span class="ux6-condition-warn">Улик достаточно для вывода, но без полной ритуальной картины подготовка будет слабее.</span>';
    else if(canEmergency)conditionText='<span class="ux6-condition-warn">Время вышло. Можно сделать рискованный вывод по неполным данным или начать расследование заново.</span>';
    else conditionText=`Нужно минимум 4 улики хотя бы трёх типов. Сейчас: ${ux6EvidenceCount()} улик, типов ${ux6EvidenceTypes()}, ритуальных ${ritualCount}, тактических ${tacticalCount}.`;
    const recovery=r.time<=0&&!canNormal?`<section class="ux6-recovery"><b>Вы не заперты в расследовании</b><p>Продолжите с неполными данными — бой станет сложнее — либо нажмите «Начать заново» внизу. Сюжетный прогресс до этой сцены сохранится.</p></section>`:'';
    const proceedLabel=canEmergency&&!canNormal?'Сделать рискованный вывод':(!hasCore&&canNormal?'Собрать неполный вывод':'Собрать выводы');
    c3Shell('Расследование площади','Выберите объект и метод',`<div class="ux6-status-strip"><div><b>${r.time}</b><span>время</span></div><div><b>${ux6EvidenceCount()}</b><span>улики</span></div><div><b>${r.pressure}</b><span>паника</span></div><div><b>${r.alarm}</b><span>тревога</span></div></div><div class="ux6-tabs">${Object.entries(UX6_LOCATIONS).map(([id,x])=>`<button class="ux6-tab ${r.location===id?'active':''}" data-action="ux6-location" data-location="${id}">${x.name}</button>`).join('')}</div><div class="ux6-scene ${loc.scene}"><div class="ux6-scene-label">${loc.name}</div>${loc.points.map(p=>`<button class="ux6-hotspot ${r.resolved[p.id]?'done':''} ${r.selectedPoint===p.id?'selected':''}" style="left:${p.x}%;top:${p.y}%" data-action="ux6-point" data-point="${p.id}" aria-label="${escapeHtml(p.name)}">${r.resolved[p.id]?'✓':p.icon}</button>`).join('')}</div>${point?`<section class="ux6-point-panel"><h3>${point.name}</h3><p>${r.resolved[point.id]?`Выбран метод: ${escapeHtml(r.resolved[point.id].label)}`:point.desc}</p><div class="ux6-methods">${point.methods.map(m=>{const cost=ux6MethodCost(m),disabled=!!r.resolved[point.id]||r.time<cost;return `<button class="ux6-method" data-action="ux6-method" data-method="${m.id}" ${disabled?'disabled':''}><b>${m.label}</b><span>${m.desc}</span><em>${r.resolved[point.id]?'Завершено':cost===0?'Первый Поиск бесплатно':`−${cost} времени`}</em></button>`}).join('')}</div></section>`:`<section class="ux6-stage-card"><h3>Осмотрите сцену</h3><p>Нажмите на светящуюся точку. На одном объекте можно применить только один метод — собрать всё за один выход не получится.</p></section>`}${ux6EvidenceHtml()}<section class="ux6-stage-card"><h3>Условие вывода</h3><p>${conditionText}</p></section>${recovery}`,`<div class="ux6-invest-footer"><button class="secondary-button" data-action="ux6-reset-investigation">Начать заново</button><button class="primary-button" data-action="ux6-to-deduction" ${canProceed?'':'disabled'}>${proceedLabel}</button></div>`,`<span>Время <b>${r.time}</b></span><span>Улики <b>${ux6EvidenceCount()}</b></span>`);
  }
  function ux6ApplyMethod(id){const found=ux6FindMethod(id);if(!found)return;const {point,method}=found,r=save.chapter3.rework6;if(r.resolved[point.id])return;const cost=ux6MethodCost(method);if(r.time<cost){toast('Не хватает времени.');return;}r.time-=cost;r.resolved[point.id]={method:id,label:method.label};if(method.search)r.freeSearch=false;const ev=UX6_EVIDENCE[method.evidence];if(ev)r.evidence[method.evidence]={...ev};if(method.effect==='pressure')r.pressure+=1;if(method.effect==='alarm')r.alarm+=1;if(method.effect==='calmed')r.calmed=true;if(method.effect==='beaconBonus')r.beaconBonus=true;if(method.effect==='charge')r.charge=true;if(method.effect==='routeMarked'){r.routeMarked=true;r.alarm+=1;}if(method.effect==='intentKnown')r.intentKnown=true;if(method.effect==='morvenWatch'){r.intentKnown=true;r.morvenWatch=true;}r.selectedPoint=null;chapter3Save(`${method.label}: улика добавлена.`);}
  function renderUX6Deduction(){
    const r=save.chapter3.rework6;
    const warning=r.incompleteDeduction?'<section class="ux6-recovery"><b>Неполная картина</b><p>Вы перешли к выводу без ключевых типов улик. Главу можно продолжить, но часть преимуществ расследования будет недоступна.</p></section>':'';
    const evidence=ux6EvidenceHtml().replace('<details class="ux6-evidence-box" open>','<details class="ux6-evidence-box ux6-evidence-deduction">');
    const hypotheses=Object.entries(UX6_HYPOTHESES).map(([id,h])=>`<button type="button" class="ux6-hypothesis ${r.hypothesis===id?'selected':''}" data-action="ux6-hypothesis" data-hypothesis="${id}"><b>${h.title}</b><span>${h.text}</span><div class="ux6-support">${h.support.map(e=>`<i class="${r.evidence[e]?'on':''}">${r.evidence[e]?'✓':'○'} ${UX6_EVIDENCE[e]?.title||e}</i>`).join('')}</div></button>`).join('');
    c3Shell('Доска выводов','Сначала выберите гипотезу',`<section class="ux6-stage-card ux6-deduction-head"><h2>Что удерживает Ломателя?</h2><p>Выберите одну из трёх версий. Ошибка не блокирует главу — она только меняет начало операции.</p></section>${warning}<p class="ux6-deduction-note">Зелёные метки показывают улики, которые поддерживают каждую версию.</p><div class="ux6-deduction">${hypotheses}</div>${evidence}`,
      `<div style="display:grid;grid-template-columns:.8fr 1.2fr;gap:7px"><button class="secondary-button" data-action="ux6-back-investigation">Вернуться</button><button class="primary-button" data-action="ux6-confirm-hypothesis" ${r.hypothesis?'':'disabled'}>${r.hypothesis?'Подтвердить вывод':'Сначала выберите'}</button></div>`);
  }
  function ux6ConfirmHypothesis(){const r=save.chapter3.rework6;if(!r.hypothesis)return;r.hypothesisConfirmed=true;r.hypothesisCorrect=r.hypothesis==='fear_amplifier';r.bonuses.incompleteInvestigation=!!r.incompleteDeduction;if(r.hypothesisCorrect){r.bonuses.sourceKnown=!!(r.evidence.fear_trace&&r.evidence.beacon_amplifier);r.bonuses.wardReduction=r.evidence.shield_protocol?1:0;r.bonuses.intentKnown=!!(r.evidence.attack_cycle||r.intentKnown);toast(r.incompleteDeduction?'Вывод принят, но часть подготовки недоступна из-за неполных данных.':'Вывод подтверждён уликами: подготовка усилена.');}else{r.bonuses.wrongHypothesis=true;toast('Гипотеза сохранена. Ошибка усложнит начало боя, но не заблокирует главу.');}save.chapter3.stage='training';chapter3Save(null);}
  function renderUX6Training(){const r=save.chapter3.rework6,t=r.training;const complete=t.heroShield&&t.lioraAegis;c3Shell('Щит на союзника','Безопасное обучение',`<div class="ux6-training-scene"><div class="c3-scene-label">Переход к площади</div><div class="ux6-training-sign">🪧</div><div class="ux6-training-child">🧒</div><div class="ux6-training-beacon">🗼</div>${t.heroShield?'<div class="ux6-shield-ring child"></div>':''}${t.lioraAegis?'<div class="ux6-shield-ring beacon"></div>':''}</div><section class="ux6-stage-card"><h2>${complete?'Две цели удержаны':'Сначала человек, затем объект'}</h2><p>${complete?'Герой защитил ребёнка, а Лиора укрепила уличный контур. В основном бою у героя остаются два действия, но командное действие спутника общее на весь ход.':'Выберите правильную защиту. Эта сцена не может закончиться поражением.'}</p></section><div class="ux6-training-actions"><button class="ux6-training-action" data-action="ux6-training-shield" ${t.heroShield?'disabled':''}><b>${t.heroShield?'✓ ':''}Щит героя → ребёнок</b><span>Потратить действие героя и защитить живую цель.</span></button><button class="ux6-training-action" data-action="ux6-training-aegis" ${!t.heroShield||t.lioraAegis?'disabled':''}><b>${t.lioraAegis?'✓ ':''}Эгида Лиоры → контур</b><span>Потратить общее командное действие на объект.</span></button></div>`,complete?'<button class="primary-button" style="width:100%" data-action="ux6-to-danger">Продолжить к маяку</button>':'<button class="secondary-button" style="width:100%" data-action="ux6-help">Зачем две защиты?</button>');}
  function ux6DangerMax(){const r=save.chapter3.rework6;return r.alarm>=2?1:2;}
  const UX6_DANGER={technician:{title:'Закрыть техника Щитом',text:'Начать бой с дополнительной защитой человека.'},beacon:{title:'Стабилизировать маяк',text:'Увеличить его максимальную устойчивость.'},route:{title:'Пометить разрыв',text:'Отсрочить попытку побега на один раунд.'},courier:{title:'Вывести курьера',text:'Снизить панику и получить начальный Резонанс.'}};
  function renderUX6Danger(){const r=save.chapter3.rework6,d=r.danger,max=ux6DangerMax();d.maxActions=max;c3Shell('Выброс перед операцией','Выберите приоритеты',`<div class="ux6-danger-scene"><div class="c3-scene-label">Площадь · ритуальный выброс</div></div><section class="ux6-stage-card" style="margin-bottom:8px"><h2>Нельзя удержать всё сразу</h2><p>До появления Ломателя остаются секунды. Выберите ${max===1?'одно действие':'два действия'}. Высокая тревога во время расследования сократила окно подготовки.</p></section><div class="ux6-danger-grid">${Object.entries(UX6_DANGER).map(([id,x])=>{const selected=d.selected.includes(id),full=d.selected.length>=max&&!selected;return `<button class="ux6-danger-choice ${selected?'selected':''}" data-action="ux6-danger-choice" data-choice="${id}" ${full?'disabled':''}><b>${selected?'✓ ':''}${x.title}</b><span>${x.text}</span></button>`}).join('')}</div>`,`<button class="primary-button" style="width:100%" data-action="ux6-finish-danger" ${d.selected.length===max?'':'disabled'}>Зафиксировать подготовку</button>`,`<span>Выбрано <b>${d.selected.length}/${max}</b></span>`);}
  function ux6FinishDanger(){const r=save.chapter3.rework6,d=r.danger;if(d.selected.length!==ux6DangerMax())return;d.resolved=true;r.bonuses.technicianShield=(r.calmed?1:0)+(d.selected.includes('technician')?1:0);r.bonuses.beaconMax=(r.beaconBonus?1:0)+(d.selected.includes('beacon')?1:0);r.bonuses.escapeDelay=(r.routeMarked?1:0)+(d.selected.includes('route')?1:0);r.bonuses.resonance=(r.charge?1:0)+(d.selected.includes('courier')?1:0);r.bonuses.intentKnown=!!(r.bonuses.intentKnown||r.intentKnown);r.bonuses.pressure=r.pressure;r.bonuses.alarm=r.alarm;save.chapter3.stage='brief';chapter3Save('Подготовка перед боем сохранена.');}
  function ux6ReportRows(){const r=save.chapter3.rework6,b=r.bonuses,rows=[];if(b.sourceKnown)rows.push(['◎','Источник страха раскрыт','Поиск в бою не потребуется.']);if(b.wardReduction)rows.push(['✦','Слабость Покрова известна','Стартовый Покров снижен.']);if(b.technicianShield)rows.push(['盾','Техник подготовлен',`Стартовый Щит: +${b.technicianShield}.`]);if(b.beaconMax)rows.push(['⌁','Маяк укреплён',`Устойчивость: +${b.beaconMax}.`]);if(b.escapeDelay)rows.push(['◇','Путь отхода отмечен',`Побег отсрочен на ${b.escapeDelay} раунд.`]);if(b.resonance)rows.push(['✧','Световой резерв',`Начальный Резонанс: +${b.resonance}.`]);if(b.intentKnown)rows.push(['◉','Цикл атаки известен','Первое намерение раскрыто.']);if(b.wrongHypothesis)rows.push(['!','Сомнительная гипотеза','Покров врага будет сильнее на старте.']);if(b.incompleteInvestigation)rows.push(['…','Неполное расследование','Ключевые механики придётся раскрывать уже в бою.']);return rows.length?rows:[['○','Минимальная подготовка','Операция проходима, но все механики придётся раскрывать в бою.']];}
  function renderUX6Brief(){const c=save.chapter3;c3Shell('План защиты маяка','Расследование изменило старт боя',`<section class="ux6-stage-card"><h2>Отчёт подготовки</h2><p>Эти эффекты получены из ваших методов расследования, вывода и решений во время выброса.</p></section><div class="ux6-report">${ux6ReportRows().map(([i,t,d])=>`<div class="ux6-report-row"><div class="ux6-report-icon">${i}</div><div><strong>${t}</strong><span>${d}</span></div></div>`).join('')}</div><div class="section-title"><h2>Приоритет операции</h2><span>Один выбор</span></div><div class="c3-plan-grid"><button class="c3-plan ${c.plan==='technician'?'selected':''}" data-action="ux6-plan" data-plan="technician"><b>Защитить техника</b><span>Щит 2 и −1 Покрова.</span></button><button class="c3-plan ${c.plan==='beacon'?'selected':''}" data-action="ux6-plan" data-plan="beacon"><b>Укрепить маяк</b><span>Дополнительная устойчивость.</span></button><button class="c3-plan ${c.plan==='hunt'?'selected':''}" data-action="ux6-plan" data-plan="hunt"><b>Перекрыть отход</b><span>Побег начнётся позже.</span></button><button class="c3-plan ${c.plan==='order'?'selected':''}" data-action="ux6-plan" data-plan="order"><b>Следовать протоколу</b><span>Реакция Лиоры готова.</span></button></div><div class="c3-rule"><strong>Ритуальная цель:</strong> раскрыть Источник страха → снять Покров → наложить Печать → завершить Изгнанием. Техник, маяк и Лиора должны выстоять.</div>`,`<button class="primary-button" style="width:100%" data-action="ux6-start-battle" ${c.plan?'':'disabled'}>Начать операцию</button>`);}

  const createChapter3BattleUX5=createChapter3Battle;createChapter3Battle=function(){const b=createChapter3BattleUX5(),r=save.chapter3.rework6||createUX6Investigation(),x=r.bonuses||{};b.enemy.ward=Math.max(1,b.enemy.ward-(x.wardReduction||0)+(x.wrongHypothesis?1:0)+(x.incompleteInvestigation?1:0));if(x.sourceKnown){b.enemy.source=true;b.freeSearch=false;}b.technician.shield=Math.min(4,b.technician.shield+(x.technicianShield||0));b.beacon.max+=x.beaconMax||0;b.beacon.hp=b.beacon.max;b.escapeAt+=x.escapeDelay||0;b.resonance=Math.min(6,b.resonance+(x.resonance||0));b.intentKnown=!!x.intentKnown;b.preparation={...x};b.log.push('Эффекты расследования применены.');return b;};
  function renderUX6Battle(){const c=save.chapter3,b=normalizeChapter3Battle(c.battle);c.battle=b;if(b.status==='failed'){c3Shell('Операция провалена','Прогресс до боя сохранён',`${c3ObjectiveHtml(b)}<section class="ux6-stage-card"><h2>Защита не удержалась</h2><p>${escapeHtml(b.failureReason||'Ломатель завершил ритуал.')}</p></section>`,`<button class="primary-button" style="width:100%" data-action="c3-retry-battle">Повторить бой</button>`);return;}const [intent,desc]=c3IntentInfo(b),actions=c3ActionDefs(b),prep=b.preparation||{};c3Shell('Защита маяка',`Раунд ${b.round}`,`<div class="ux6-battle-layout"><div class="ux6-prep-mini">${prep.sourceKnown?'<span>Источник известен</span>':''}${prep.technicianShield?'<span>Техник защищён</span>':''}${prep.beaconMax?'<span>Маяк укреплён</span>':''}${prep.escapeDelay?'<span>Побег отсрочен</span>':''}${prep.wrongHypothesis?'<span class="bad">Ошибочная гипотеза</span>':''}${prep.incompleteInvestigation?'<span class="bad">Неполное расследование</span>':''}</div>${c3ObjectiveHtml(b)}<div class="c3-intent"><small>Намерение врага ${b.intentKnown?'· раскрыто':'· известно только направление угрозы'}</small><b>${intent}</b><span>${desc}</span></div><div class="c3-arena"><div class="c3-enemy">👹</div><div class="c3-tech">🧑‍🔧</div><div class="c3-beacon">🗼</div><div class="c3-statuses"><span class="c3-chip bad">Покров ${b.enemy.ward}</span><span class="c3-chip ${b.enemy.source?'good':'bad'}">Источник ${b.enemy.source?'найден':'скрыт'}</span><span class="c3-chip ${b.enemy.seal?'good':'bad'}">Печать ${b.enemy.seal}</span></div></div><div class="c3-units"><div class="c3-unit ${b.tab==='hero'?'active':''}"><b>${escapeHtml(save.profile.heroName)}</b><span>Действия ${b.heroActions}/2 · Резонанс ${b.resonance}/6</span></div><div class="c3-unit ${b.tab==='liora'?'active':''}"><b>Лиора</b><span>Стойкость</span><div class="c3-dots">${[1,2,3].map(n=>`<i class="c3-dot ${n<=b.liora.stamina?'on':''}"></i>`).join('')}${b.liora.overshield?'<i class="c3-dot over"></i>':''}</div></div><div class="c3-unit ${b.tab==='morven'?'active':''}"><b>Цели</b><span>Техник ${b.technician.hp}/3 · Щит ${b.technician.shield}<br>Маяк ${b.beacon.hp}/${b.beacon.max}</span></div></div><div class="c3-battle-tabs"><button class="c3-battle-tab ${b.tab==='hero'?'active':''}" data-action="c3-battle-tab" data-tab="hero">Герой</button><button class="c3-battle-tab ${b.tab==='liora'?'active':''}" data-action="c3-battle-tab" data-tab="liora">Лиора</button><button class="c3-battle-tab ${b.tab==='morven'?'active':''}" data-action="c3-battle-tab" data-tab="morven">Морвен</button></div><div class="c3-actions">${actions.map(([id,name,d])=>{const reason=c3ActionReason(b,id);return `<button class="c3-action ${(id==='contour'||id==='formula'||id==='banish')?'res':''}" data-action="c3-battle-action" data-battle-action="${id}" ${reason?'disabled':''}><b>${name}</b><span class="${reason?'why':''}">${reason||d}</span></button>`}).join('')}</div><div class="c3-log">${escapeHtml(b.log.slice(-3).join(' · '))}</div></div>`,`<button class="secondary-button" style="width:100%" data-action="c3-end-turn">Завершить раунд</button>`,`<span>Г <b>${b.heroActions}</b></span><span>К <b>${b.teamUsed?0:1}</b></span>`);}

  function ux6Help(){const stage=save.chapter3.stage;const text={investigation:['Расследование','Нажмите на светящуюся точку и выберите один метод. Внизу всегда доступны «Начать заново» и переход к выводу, когда данных достаточно. Если время закончится, игра не заблокирует вас.'],deduction:['Доска выводов','Зелёные метки показывают, какие улики поддерживают гипотезу. Ошибка не остановит сюжет, но усилит врага.'],training:['Обучение Щиту','Сначала потратьте действие героя на живую цель, затем общее командное действие Лиоры на объект.'],danger:['Опасная сцена','Выберите ограниченное число приоритетов. Они прямо изменят стартовые параметры боя.'],brief:['Подготовка','Отчёт показывает, что именно дало расследование. Затем выберите общий приоритет операции.'],battle:['Бой','Следуйте чек-листу Ритуальной цели. Два действия принадлежат герою, одно командное действие делят Лиора и Морвен.']}[stage]||['Первый Свет','Глава обучает защите союзника и объекта. Все решения и незаконченный этап сохраняются автоматически.'];openModal(`<div class="modal-header"><div><div class="eyebrow">Контекстная помощь</div><h2>${text[0]}</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>${text[1]}</p><div class="ux6-help-list"><div><b>Ритуальные улики</b><span>Раскрывают Источник и способ финала.</span></div><div><b>Тактические улики</b><span>Ослабляют Покров, раскрывают намерения и путь побега.</span></div><div><b>Человеческие улики</b><span>Помогают защитить свидетелей и влияют на последствия.</span></div><div><b>Ресурсные улики</b><span>Дают устойчивость, Резонанс или другие стартовые преимущества.</span></div></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);}

  const renderStartUX6Prev=renderStart;renderStart=function(){removeUX5Coach();ux5UpdateAppHeight();document.body.classList.remove('ux5-game-mode');document.body.classList.add('ux5-start-mode');const existing=readSave();const preview=existing?`<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>${existing.progression.chapters.chapter_03_first_light?.status==='completed'?'«Первый Свет» завершён':'Прогресс сохранён'} · ${formatDate(existing.updatedAt)}</span></div>`:'';app.innerHTML=`<section class="start-screen"><div class="brand-kicker">Magic RPG · vertical slice</div><div class="start-copy"><h1 class="start-title">Первый<br>Свет</h1><p class="start-subtitle">Часть 6.2: исправлена доска выводов — гипотезы сразу видны, весь экран прокручивается внутри игры, а нижние кнопки больше не перекрывают содержимое.</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать сохранение'}</button></div><div class="version-line">Часть 6.2 · Deduction Board Fix · ${CONTENT_VERSION}</div></div></section>`;};
  const renderGameUX6Prev=renderGame;renderGame=function(){if(save)ensureUX6State(save);renderGameUX6Prev();};
  const openDebugUX6Prev=openDebug;openDebug=function(){const c=save.chapter3,r=c.rework6||createUX6Investigation();openModal(`<div class="modal-header"><div><div class="eyebrow">Техническая панель</div><h2>Часть 6.2 · Deduction Board Fix</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Здесь можно повторить переработанные главы без удаления всего сохранения.</p><div class="debug-section"><h3>Главы</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter2"><strong>Повторить главу 2</strong><span>Расследование Памятного плюща</span></button><button class="debug-button" data-action="ux6-reset-c3"><strong>Повторить главу 3</strong><span>Новый путь «Первого Света»</span></button></div></div><div class="debug-section"><h3>Текущая глава 3</h3><div class="status-list"><div class="status-row"><span>Этап</span><span>${c.stage}</span></div><div class="status-row"><span>Улик</span><span>${Object.keys(r.evidence||{}).length}</span></div><div class="status-row"><span>Гипотеза</span><span>${r.hypothesis||'—'}</span></div><div class="status-row"><span>Паника / тревога</span><span>${r.pressure} / ${r.alarm}</span></div></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid"><button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать JSON</span></button><button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить JSON</span></button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Полностью удалить сохранение</button></div></div>`);};

  document.addEventListener('click',(event)=>{const button=event.target.closest?.('[data-action]');if(!button)return;const a=button.dataset.action;const handled=['ux6-location','ux6-point','ux6-method','ux6-reset-investigation','ux6-to-deduction','ux6-back-investigation','ux6-hypothesis','ux6-confirm-hypothesis','ux6-training-shield','ux6-training-aegis','ux6-to-danger','ux6-danger-choice','ux6-finish-danger','ux6-plan','ux6-start-battle','ux6-help','ux6-reset-c3'];if(!handled.includes(a))return;event.preventDefault();event.stopImmediatePropagation();
    const c=save.chapter3,r=c.rework6;
    if(a==='ux6-location'){r.location=button.dataset.location;r.selectedPoint=null;chapter3Save(null);}
    if(a==='ux6-point'){r.selectedPoint=button.dataset.point;chapter3Save(null);}
    if(a==='ux6-method')ux6ApplyMethod(button.dataset.method);
    if(a==='ux6-reset-investigation'&&confirm('Начать расследование главы 3 заново? Выбор отношения к Лиоре сохранится.'))ux6ResetInvestigation();
    if(a==='ux6-to-deduction'&&ux6CanProceedToDeduction()){r.incompleteDeduction=!ux6CanDeduce()||!ux6HasCoreEvidence();r.emergencyDeduction=!ux6CanDeduce();c.stage='deduction';chapter3Save(r.incompleteDeduction?'Открыт вывод по неполным данным.':'Доска выводов открыта.');}
    if(a==='ux6-back-investigation'){c.stage='investigation';chapter3Save(null);}
    if(a==='ux6-hypothesis'){r.hypothesis=button.dataset.hypothesis;chapter3Save('Гипотеза отмечена.');}
    if(a==='ux6-confirm-hypothesis')ux6ConfirmHypothesis();
    if(a==='ux6-training-shield'){r.training.heroShield=true;r.training.step=1;chapter3Save('Щит защитил ребёнка.');}
    if(a==='ux6-training-aegis'&&r.training.heroShield){r.training.lioraAegis=true;r.training.complete=true;chapter3Save('Эгида укрепила контур.');}
    if(a==='ux6-to-danger'&&r.training.complete){c.stage='danger';chapter3Save('Команда вышла к маяку.');}
    if(a==='ux6-danger-choice'){const id=button.dataset.choice,d=r.danger,max=ux6DangerMax(),i=d.selected.indexOf(id);if(i>=0)d.selected.splice(i,1);else if(d.selected.length<max)d.selected.push(id);chapter3Save(null);}
    if(a==='ux6-finish-danger')ux6FinishDanger();
    if(a==='ux6-plan'){c.plan=button.dataset.plan;chapter3Save('Приоритет операции сохранён.');}
    if(a==='ux6-start-battle'&&c.plan){c.battle=createChapter3Battle();c.stage='battle';chapter3Save('Операция началась.');}
    if(a==='ux6-help')ux6Help();
    if(a==='ux6-reset-c3'&&confirm('Сбросить главу 3 и начать переработанный вариант заново?')){closeModal();resetChapter3();ensureUX6State(save);saveGame('Глава 3 сброшена.');}
  },true);



  /* UNIFIED RELEASE CANDIDATE */
  function releaseCleanupUI(){
    document.querySelectorAll('.section-title').forEach((node)=>{
      const text=(node.textContent||'').trim();
      if(text.includes('Техническое состояние')||text.includes('Проверка сохранения')){
        node.classList.add('release-hidden');
        const next=node.nextElementSibling;
        if(next) next.classList.add('release-hidden');
      }
    });
    document.querySelectorAll('.case-card').forEach((node)=>{
      if((node.textContent||'').includes('Проверка защитного контура')) node.classList.add('release-hidden');
    });
    document.querySelectorAll('.filter-chip').forEach((node)=>{
      if((node.textContent||'').trim()==='Технические') node.classList.add('release-hidden');
    });
    document.querySelectorAll('.card').forEach((node)=>{
      if((node.textContent||'').includes('Тестовый кристалл')) node.classList.add('release-hidden');
    });
    const gear=document.querySelector('[data-action="open-debug"]');
    if(gear) gear.setAttribute('aria-label','Настройки и сохранение');
  }

  const renderStartReleasePrev=renderStart;
  renderStart=function(){
    removeUX5Coach(); ux5UpdateAppHeight();
    document.body.classList.remove('ux5-game-mode');
    document.body.classList.add('ux5-start-mode');
    const existing=readSave();
    const preview=existing?`<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>${existing.progression.chapters.chapter_04_bitter_recipe?.status==='completed'?'Уровни 2–4 завершены':existing.progression.chapters.chapter_03_first_light?.status==='completed'?'Уровни 2–3 завершены':'Прогресс сохранён'} · ${formatDate(existing.updatedAt)}</span></div>`:'';
    app.innerHTML=`<section class="start-screen"><div class="brand-kicker">Magic RPG · urban dark fantasy</div><div class="mobile-hardfix-banner">📱 <strong>PWA Asset Build</strong> v1.4.2</div><div class="start-copy"><span class="release-badge">Vertical Slice v1.0 · RC1</span><h1 class="start-title">Пробуждение<br>продолжается</h1><p class="start-subtitle">Единая связанная сборка: дом, «Корни памяти», повторяемое дело, алхимия, спутники и переработанный «Первый Свет».</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать героя'}</button></div><p class="release-notes">Автосохранение работает после каждого решения. Экспорт, импорт и повтор глав находятся в настройках по значку шестерёнки.</p><div class="version-line">Vertical Slice v1.0 RC1 · ${CONTENT_VERSION}</div></div></section>`;
  };

  const renderGameReleasePrev=renderGame;
  renderGame=function(){
    renderGameReleasePrev();
    requestAnimationFrame(releaseCleanupUI);
  };

  openDebug=function(){
    const c=save.chapter3, r=c.rework6||createUX6Investigation();
    openModal(`<div class="modal-header"><div><div class="eyebrow">Игра</div><h2>Настройки и сохранение</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><div class="release-settings-note">Прогресс сохраняется автоматически. Здесь можно сделать резервную копию или повторить главу без удаления всего прохождения.</div><div class="debug-section"><h3>Повтор глав</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter2"><strong>Повторить «Корни памяти»</strong><span>Переработанное расследование уровня 2</span></button><button class="debug-button" data-action="ux6-reset-c3"><strong>Повторить «Первый Свет»</strong><span>Переработанное расследование уровня 3</span></button><button class="debug-button" data-action="ux-reset-tutorial"><strong>Повторить обучение</strong><span>Вернуть подсказки Морвена</span></button></div></div><div class="debug-section"><h3>Сохранение</h3><div class="debug-grid"><button class="debug-button" data-action="export-save"><strong>Экспортировать</strong><span>Скачать резервную копию JSON</span></button><button class="debug-button" data-action="import-save"><strong>Импортировать</strong><span>Загрузить резервную копию</span></button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div class="debug-section"><h3>Текущий прогресс</h3><div class="status-list"><div class="status-row"><span>Глава 2</span><span>${save.progression.chapters.chapter_02_roots_of_memory.status==='completed'?'завершена':'в процессе'}</span></div><div class="status-row"><span>Глава 3</span><span>${save.progression.chapters.chapter_03_first_light.status==='completed'?'завершена':`этап: ${c.stage}`}</span></div><div class="status-row"><span>Автосохранение</span><span>включено</span></div><div class="status-row"><span>Версия</span><span>v1.0 RC1 · save v${save.saveVersion}</span></div></div></div><div class="debug-section"><button class="danger-button" style="width:100%" data-action="reset-save">Удалить всё сохранение</button></div></div>`);
  };



  /* =========================================================
     PART 7 — CHAPTER 4: BITTER RECIPE
     ========================================================= */
  fullItemCatalog.memory_antidote={id:'memory_antidote',name:'Противоядие памяти',category:'consumable',categoryLabel:'Расходник',description:'Стабилизирует воспоминания и ослабляет существ, питающихся положительными магическими эффектами.',icon:'flask'};
  fullItemCatalog.mirror_sediment_page={id:'mirror_sediment_page',name:'Запись о Зеркальном осадке',category:'knowledge',categoryLabel:'Знание',description:'Алхимический паразит поглощает первый положительный эффект раунда. Горькая приманка заставляет его потратить голод впустую.',icon:'page'};

  const C4_LOCATIONS={
    warehouse:{name:'Склад поставщика',scene:'warehouse',points:[
      {id:'crate',icon:'▣',name:'Ящик с лунной водой',desc:'Пломба цела, но запах слишком резкий.',methods:[
        {id:'crate_search',name:'Поиск',desc:'Сравнить магический след с рецептом.',cost:1,search:true,evidence:{id:'supplier_trace',title:'След поставщика',label:'Печать Триады под этикеткой',type:'logistics'},text:'Под этикеткой проступает вывернутая печать поставщика — знакомый почерк Триады.'},
        {id:'crate_tele',name:'Телекинез',desc:'Не касаясь тары, отделить внутреннюю колбу.',cost:1,evidence:{id:'double_vial',title:'Двойная колба',label:'Компонент подменили после упаковки',type:'chemical'},text:'Внутри внешней колбы спрятана вторая. Подмена произошла уже после опечатывания.'}
      ]},
      {id:'invoice',icon:'≡',name:'Накладная',desc:'Номер партии исправлен вручную.',methods:[
        {id:'invoice_compare',name:'Сверить записи',desc:'Сопоставить подписи и время доставки.',cost:1,evidence:{id:'false_route',title:'Ложный маршрут',label:'Курьер сделал незапланированную остановку',type:'logistics'},text:'Маршрут подменён: партия на двадцать минут исчезала из поля наблюдения Ордена.'},
        {id:'invoice_liora',name:'Доступ Лиоры',desc:'Проверить закрытый журнал Ордена.',cost:1,evidence:{id:'order_gap',title:'Провал наблюдения',label:'Кто-то отключил маяк сопровождения',type:'ritual'},text:'Маяк сопровождения был выключен служебным ключом. Это не случайная ошибка.'}
      ]}
    ]},
    lab:{name:'Лаборатория',scene:'lab',points:[
      {id:'journal',icon:'▤',name:'Журнал варки',desc:'Селеста записывает каждый градус и секунду.',methods:[
        {id:'journal_read',name:'Разобрать формулу',desc:'Проверить порядок и температуру.',cost:1,evidence:{id:'correct_brew',title:'Правильная варка',label:'Рецепт соблюдён без отклонений',type:'chemical'},text:'Температура, порядок и наполнение совпадают с эталоном. Ошибка варки маловероятна.'},
        {id:'journal_search',name:'Поиск',desc:'Найти магический разрыв между записями.',cost:1,search:true,evidence:{id:'memory_gap',title:'Разрыв памяти',label:'Одна строка переписана чужой рукой',type:'ritual'},text:'Одна строка журнала не принадлежит памяти Селесты — её вписали поверх настоящей.'}
      ]},
      {id:'residue',icon:'⚗',name:'Осадок в котле',desc:'Сгусток реагирует на добрые заклинания.',methods:[
        {id:'residue_celeste',name:'Анализ Селесты',desc:'Отделить чистую основу от паразита.',cost:1,evidence:{id:'living_residue',title:'Живой осадок',label:'Сгусток питается усилениями',type:'chemical'},text:'Осадок живой: он втягивает лечение, Щиты и любые положительные эффекты.'},
        {id:'residue_light',name:'Свет Лиоры',desc:'Проявить скрытый ритуальный контур.',cost:1,evidence:{id:'triad_seed',title:'Семя Триады',label:'Паразита добавили намеренно',type:'ritual'},text:'Свет проявляет миниатюрный знак Триады в ядре осадка.'}
      ]}
    ]},
    greenhouse:{name:'Лечебная теплица',scene:'greenhouse',points:[
      {id:'mint',icon:'❧',name:'Горькая мята',desc:'Единственное растение, которое осадок избегает.',methods:[
        {id:'mint_celeste',name:'Проба Селесты',desc:'Проверить чистоту стабилизатора.',cost:1,evidence:{id:'clean_mint',title:'Чистая мята',label:'Стабилизатор не виноват',type:'chemical'},text:'Мята чиста. Её горечь можно использовать как приманку для Алхимического голода.'},
        {id:'mint_search',name:'Поиск',desc:'Проследить реакцию осадка на запах.',cost:1,search:true,evidence:{id:'hunger_rule',title:'Правило голода',label:'Первое усиление будет поглощено',type:'ritual'},text:'Поиск показывает правило: существо пожирает первый положительный эффект каждого раунда.'}
      ]},
      {id:'patient',icon:'人',name:'Спящая пациентка',desc:'Воспоминания стираются слоями.',methods:[
        {id:'patient_anchor',name:'Закрепить память',desc:'Проверить, что именно исчезает первым.',cost:1,evidence:{id:'targeted_loss',title:'Выборочная потеря',label:'Исчезают воспоминания о семье героя',type:'ritual'},text:'Стираются не случайные годы, а воспоминания, связанные с родителями героя.'},
        {id:'patient_sample',name:'Взять образец',desc:'Сравнить токсин с лекарством.',cost:1,evidence:{id:'foreign_catalyst',title:'Чужой катализатор',label:'В крови есть компонент не из рецепта',type:'chemical'},text:'В крови обнаружен чужой катализатор. Его не было в исходной формуле.'}
      ]}
    ]}
  };

  const C4_HYPOTHESES={
    tampering:{name:'Преднамеренная подмена',desc:'Компонент заменили после варки, а журнал попытались исправить.',supports:['supplier_trace','double_vial','false_route','order_gap','memory_gap','triad_seed','foreign_catalyst']},
    bad_batch:{name:'Ошибка приготовления',desc:'Сырьё оказалось нестабильным, а Селеста не заметила отклонение.',supports:['correct_brew','living_residue','clean_mint','foreign_catalyst']},
    rare_reaction:{name:'Редкая реакция пациента',desc:'Лекарство столкнулось с неизвестной особенностью памяти.',supports:['targeted_loss','living_residue','hunger_rule']}
  };

  const C4_RECIPES={
    revealing:{icon:'◉',name:'Проявляющее противоядие',desc:'Сразу раскрывает ядро и помогает быстрее снять Покров.'},
    bitter:{icon:'❧',name:'Горькая приманка',desc:'Защищает первый положительный эффект и даёт дополнительную дозу.'},
    stabilizing:{icon:'◇',name:'Стабилизирующая смесь',desc:'Укрепляет пациентов и лабораторный контур перед боем.'}
  };

  const C4_INGREDIENTS={
    moonwater:{name:'Лунная вода',desc:'Основа и проводник памяти'},
    ash:{name:'Пепел корней',desc:'Выводит чужой катализатор'},
    mint:{name:'Горькая мята',desc:'Отвлекает Алхимический голод'}
  };

  function createChapter4State(){
    return {status:'available',stage:'intro',approach:null,investigation:{location:'warehouse',time:7,selectedPoint:null,used:{},evidence:{},freeSearch:true},diagnosis:null,recipeChoice:null,alchemy:{order:[],temp:null,charge:null,quality:null,score:0},battle:null,finalChoice:null,rewarded:false};
  }
  function normalizeChapter4State(value){
    const fresh=createChapter4State(),c={...fresh,...(value||{})};
    c.investigation={...fresh.investigation,...(value?.investigation||{})};c.investigation.used={...(value?.investigation?.used||{})};c.investigation.evidence={...(value?.investigation?.evidence||{})};
    c.alchemy={...fresh.alchemy,...(value?.alchemy||{})};if(c.battle)c.battle=normalizeChapter4Battle(c.battle);return c;
  }
  function ensureChapter4State(state){
    state.progression ||= {chapters:{}};state.progression.chapters ||= {};
    const unlocked=state.progression.chapters.chapter_03_first_light?.status==='completed'||state.story?.flags?.['chapter_03.complete'];
    state.progression.chapters.chapter_04_bitter_recipe ||= {status:unlocked?'available':'locked',progress:0};
    state.progression.chapters.chapter_05_city_under_skin ||= {status:'locked',progress:0};
    state.chapter4=normalizeChapter4State(state.chapter4||createChapter4State());
    state.relationships ||= {};state.relationships.celeste ||= {trust:0,label:'Не знакомы'};
    if(unlocked&&state.progression.chapters.chapter_04_bitter_recipe.status==='locked')state.progression.chapters.chapter_04_bitter_recipe.status='available';
    const completed=state.progression.chapters.chapter_04_bitter_recipe.status==='completed'||state.story?.flags?.['chapter_04.complete'];
    if(completed){state.chapter4.status='completed';if(!state.companions.owned.includes('celeste'))state.companions.owned.push('celeste');state.companions.states.celeste ||= {level:4,trust:state.relationships.celeste.trust||2,rank:0};}
    return state;
  }
  const createDefaultSaveC4=createDefaultSave;
  createDefaultSave=function(heroType,heroName){return ensureChapter4State(createDefaultSaveC4(heroType,heroName));};
  const migrateSaveC4=migrateSave;
  migrateSave=function(data){return ensureChapter4State(migrateSaveC4(data));};

  function c4Progress(){const c=save.chapter4;return({intro:4,meeting:12,investigation:34,deduction:45,formula:55,alchemy:66,brief:72,battle:84,choice:94,final:100}[c.stage]||0);}
  function c4Save(message){save.chapter4=normalizeChapter4State(save.chapter4);save.progression.currentScreen='chapter4';save.progression.chapters.chapter_04_bitter_recipe={status:save.chapter4.status==='completed'?'completed':'in_progress',progress:c4Progress()};save.progression.activeQuestId='chapter_04_bitter_recipe';saveGame(message);}
  function c4Shell(title,subtitle,body,footer=''){
    app.innerHTML=`<section class="c4-shell"><header class="c4-top"><button class="c4-back" data-action="c4-pause" aria-label="Выйти">‹</button><div><h1>${title}</h1><small>${subtitle}</small></div><div class="c4-hud"><span>${c4Progress()}%</span><span>⚗ ${save.currencies.coins}</span></div></header><main class="c4-main"><div class="c4-scroll">${body}</div></main><footer class="c4-footer">${footer||'<button class="secondary-button" data-action="c4-pause">Сохранить и выйти</button>'}</footer></section>`;
  }

  function renderChapter4(){
    ensureChapter4State(save);const c=save.chapter4;if(save.progression.chapters.chapter_04_bitter_recipe.status==='completed'&&c.stage!=='final')c.stage='final';
    ({intro:renderC4Intro,meeting:renderC4Meeting,investigation:renderC4Investigation,deduction:renderC4Deduction,formula:renderC4Formula,alchemy:renderC4Alchemy,brief:renderC4Brief,battle:renderC4Battle,choice:renderC4Choice,final:renderC4Final}[c.stage]||renderC4Intro)();
  }
  function renderC4Intro(){
    c4Shell('Горький рецепт','Уровень 4 · Лаборатория Селесты',`<section class="c4-hero"><div class="c4-hero-copy"><div class="eyebrow">Нижний город · после полуночи</div><h2>Лекарство стало ядом</h2><p>Лиора приводит вас в подпольную лабораторию. Трое жителей приняли одинаковое средство от магической бессонницы — и теперь их воспоминания стираются.</p></div><div class="c4-celeste"></div></section><article class="card c4-panel" style="margin-top:8px"><h3>Задача главы</h3><p>Определить источник отравления, собрать безопасную формулу и остановить Алхимический голод. Расследование и качество смеси напрямую изменят бой.</p></article>`,`<button class="secondary-button" data-action="c4-pause">Вернуться домой</button><button class="primary-button" data-action="c4-enter">Войти в лабораторию</button>`);
  }
  function renderC4Meeting(){const c=save.chapter4;
    c4Shell('Селеста Роу','Знакомство',`<section class="c4-hero"><div class="c4-hero-copy"><div class="eyebrow">Городская алхимик</div><h2>«Рецепт был правильным»</h2><p>Селеста говорит спокойно, но на столе уже собрана сумка для бегства. Она уверена: кто-то подменил компонент после варки.</p></div><div class="c4-celeste"></div></section><article class="card c4-panel" style="margin-top:8px"><h3>Как ответить?</h3><div class="c4-grid">${[['trust','Сначала спасём людей','Не обвинять Селесту до проверки.','+ доверие'],['doubt','Покажи журнал варки','Сразу потребовать доказательства.','+ точность'],['independent','Я проверю всё сам','Не принимать ничью версию заранее.','+ независимость']].map(x=>`<button class="c4-choice ${c.approach===x[0]?'active':''}" data-action="c4-approach" data-value="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span><em>${x[3]}</em></button>`).join('')}</div></article>`,`<button class="secondary-button" data-action="c4-pause">Отложить</button><button class="primary-button" data-action="c4-to-investigation" ${c.approach?'':'disabled'}>Начать проверку</button>`);
  }
  function c4EvidenceCount(){return Object.keys(save.chapter4.investigation.evidence||{}).length;}
  function c4EvidenceTypes(){return new Set(Object.values(save.chapter4.investigation.evidence||{}).map(e=>e.type)).size;}
  function c4CanDeduce(){const r=save.chapter4.investigation;return(c4EvidenceCount()>=4&&c4EvidenceTypes()>=2)||(r.time<=0&&c4EvidenceCount()>=2);}
  function c4FindPoint(id){for(const loc of Object.values(C4_LOCATIONS)){const point=loc.points.find(p=>p.id===id);if(point)return point;}return null;}
  function c4FindMethod(id){for(const loc of Object.values(C4_LOCATIONS))for(const point of loc.points){const method=point.methods.find(m=>m.id===id);if(method)return {point,method};}return null;}
  function c4MethodCost(method){const r=save.chapter4.investigation;if(method.search&&r.freeSearch)return 0;if(save.chapter4.approach==='doubt'&&method.id==='journal_read')return 0;return method.cost;}
  function c4EvidenceHtml(){const list=Object.values(save.chapter4.investigation.evidence||{});return `<div class="c4-evidence">${list.length?list.map(e=>`<div class="c4-evidence-chip ${e.type}"><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.label)}</span></div>`).join(''):'<div class="c4-evidence-chip"><b>Улик пока нет</b><span>Выберите объект и метод</span></div>'}</div>`;}
  function renderC4Investigation(){const c=save.chapter4,r=c.investigation,loc=C4_LOCATIONS[r.location],point=loc.points.find(p=>p.id===r.selectedPoint);
    const points=loc.points.map(p=>{const done=p.methods.every(m=>r.used[m.id]);const any=p.methods.some(m=>r.used[m.id]);return `<button class="c4-point ${r.selectedPoint===p.id?'selected':''} ${done?'done':''}" data-action="c4-select-point" data-point="${p.id}"><i>${done?'✓':p.icon}</i><div><b>${p.name}</b><small>${done?'Все способы проверены':any?'Есть результат; можно проверить иначе':p.desc}</small></div><em>${done?'Готово':'Выбрать'}</em></button>`}).join('');
    const methods=point?`<div class="c4-methods">${point.methods.map(m=>{const used=r.used[m.id],cost=c4MethodCost(m);return `<button class="c4-method" data-action="c4-method" data-method="${m.id}" ${used||r.time<cost?'disabled':''}><b>${used?'✓ ':''}${m.name}</b><span>${used?'Улика уже получена':m.desc}</span><em>${used?'Готово':cost?`−${cost} времени`:'Бесплатно'}</em></button>`}).join('')}</div>`:'';
    c4Shell('Проверка партии',`${loc.name} · время ${r.time}`,`<div class="c4-invest"><div><div class="c4-locations">${Object.entries(C4_LOCATIONS).map(([id,l])=>`<button class="${r.location===id?'active':''}" data-action="c4-location" data-location="${id}">${l.name}</button>`).join('')}</div><div class="c4-invest-scene ${loc.scene}"><span>${loc.name}</span></div></div>${c4EvidenceHtml()}<div class="c4-scroll"><div class="c4-point-list">${points}</div>${methods}<button class="c2-text-button" data-action="c4-reset-investigation">Начать расследование заново</button></div></div>`,`<button class="secondary-button" data-action="c4-pause">Сохранить и выйти</button><button class="primary-button" data-action="c4-to-deduction" ${c4CanDeduce()?'':'disabled'}>Сделать вывод · ${c4EvidenceCount()} улик</button>`);
  }
  function renderC4Deduction(){const c=save.chapter4,found=c.investigation.evidence;
    c4Shell('Диагноз','Сопоставьте найденные улики',`<div class="c4-deduction">${c4EvidenceHtml()}${Object.entries(C4_HYPOTHESES).map(([id,h])=>`<button class="c4-choice ${c.diagnosis===id?'active':''}" data-action="c4-diagnosis" data-value="${id}"><b>${h.name}</b><span>${h.desc}</span><div class="c4-support">${h.supports.map(e=>`<span class="${found[e]?'on':''}">${found[e]?'✓':'○'} ${found[e]?.title||e.replaceAll('_',' ')}</span>`).join('')}</div></button>`).join('')}</div>`,`<button class="secondary-button" data-action="c4-back-investigation">Вернуться к уликам</button><button class="primary-button" data-action="c4-to-formula" ${c.diagnosis?'':'disabled'}>Собрать формулу</button>`);
  }
  function renderC4Formula(){const c=save.chapter4;
    c4Shell('Формула противоядия','Выберите боевой эффект',`<article class="card c4-panel"><div class="eyebrow">Диагноз</div><h2>${C4_HYPOTHESES[c.diagnosis]?.name||'Не выбран'}</h2><p>Основа противоядия одинакова, но дополнительный компонент определит, какое правило боя изменится.</p><div class="c4-recipe-grid">${Object.entries(C4_RECIPES).map(([id,r])=>`<button class="c4-recipe ${c.recipeChoice===id?'active':''}" data-action="c4-recipe" data-value="${id}"><div>${r.icon}</div><b>${r.name}</b><span>${r.desc}</span></button>`).join('')}</div></article><article class="card c4-panel" style="margin-top:8px"><h3>Важно</h3><p>Выбранная формула не заменяет ритуальную цель. В бою всё равно нужно раскрыть ядро, снять Покров, наложить Печать и применить Очищение.</p></article>`,`<button class="secondary-button" data-action="c4-back-deduction">Назад</button><button class="primary-button" data-action="c4-to-alchemy" ${c.recipeChoice?'':'disabled'}>Приготовить смесь</button>`);
  }
  function c4AlchemyScore(){const a=save.chapter4.alchemy;let score=0;if(a.order.join(',')==='moonwater,ash,mint')score+=2;if(a.temp==='mid')score++;if(a.charge>=55&&a.charge<=75)score++;if(save.chapter4.diagnosis==='tampering')score++;if(c4EvidenceCount()>=5)score++;return score;}
  function c4QualityFromScore(score){return score>=5?'excellent':score>=3?'stable':'unstable';}
  function renderC4Alchemy(){const c=save.chapter4,a=c.alchemy;
    if(a.quality){const labels={excellent:'Отличная смесь',stable:'Стабильная смесь',unstable:'Нестабильная смесь'},texts={excellent:'Две полноценные дозы, чистый старт и усиленный эффект выбранной формулы.',stable:'Одна надёжная доза. Ошибки подготовки не мешают завершить ритуал.',unstable:'Смесь работает, но бой начнётся с токсином. Тупика не будет — придётся защищать цели внимательнее.'};c4Shell('Смесь готова',C4_RECIPES[c.recipeChoice].name,`<section class="card c4-quality ${a.quality}"><div>⚗</div><h2>${labels[a.quality]}</h2><p>${texts[a.quality]}</p></section><article class="card status-list" style="margin-top:8px"><div class="status-row"><span>Порядок</span><span>${a.order.map(id=>C4_INGREDIENTS[id].name).join(' → ')}</span></div><div class="status-row"><span>Температура</span><span>${{low:'низкая',mid:'умеренная',high:'высокая'}[a.temp]}</span></div><div class="status-row"><span>Наполнение</span><span>${a.charge}%</span></div><div class="status-row"><span>Формула</span><span>${C4_RECIPES[c.recipeChoice].name}</span></div></article>`,`<button class="secondary-button" data-action="c4-retry-alchemy">Переделать</button><button class="primary-button" data-action="c4-to-brief">Готовиться к бою</button>`);return;}
    const ingredients=Object.entries(C4_INGREDIENTS).map(([id,d])=>`<button class="c4-ingredient ${a.order.includes(id)?'used':''}" data-action="c4-ingredient" data-value="${id}" ${a.order.includes(id)?'disabled':''}><b>${d.name}</b><span>${d.desc}</span></button>`).join('');
    c4Shell('Варка противоядия',C4_RECIPES[c.recipeChoice].name,`<div class="c4-alchemy"><section class="card c4-panel"><div class="eyebrow">Расширенная алхимия</div><h2>Порядок имеет значение</h2><p>Сначала основа, затем очищающий компонент и только потом горький стабилизатор.</p></section><section class="card c4-alchemy-body"><h3>1. Добавьте компоненты</h3><div class="c4-ingredient-grid">${ingredients}</div><div class="c4-order">${a.order.length?a.order.map((id,i)=>`<span>${i+1}. ${C4_INGREDIENTS[id].name}</span>`).join(''):'<em>Колба пуста</em>'}</div><button class="c2-text-button" data-action="c4-reset-order">Очистить колбу</button><h3>2. Температура</h3><div class="c4-temp">${[['low','Низкая'],['mid','Умеренная'],['high','Высокая']].map(([id,n])=>`<button class="${a.temp===id?'active':''}" data-action="c4-temp" data-value="${id}">${n}</button>`).join('')}</div><h3>3. Магическое наполнение</h3><div class="c4-charge ${a.charge!==null?'stopped':''}"><div class="sweet"></div><div class="c4-charge-marker" style="${a.charge!==null?`left:${a.charge}%`:''}"></div></div><button class="secondary-button" data-action="c4-charge">${a.charge!==null?`Зафиксировано: ${a.charge}%`:'Зафиксировать Искру'}</button></section></div>`,`<button class="primary-button" data-action="c4-brew" ${a.order.length===3&&a.temp&&a.charge!==null?'':'disabled'}>Завершить смесь</button>`);
  }
  function renderC4Brief(){const c=save.chapter4,a=c.alchemy,quality={excellent:'отличная',stable:'стабильная',unstable:'нестабильная'}[a.quality];
    c4Shell('Перед ритуалом','Правило Алхимического голода',`<article class="card c4-panel"><div class="eyebrow">Главное правило</div><h2>Первое усиление может быть съедено</h2><p>Если применить Щит, лечение или поддерживающую смесь без горькой приманки, существо поглотит эффект. Это не поражение: Селеста может подготовить приманку в любой раунд.</p></article><div class="section-title"><h2>Подготовка</h2><span>${quality}</span></div><article class="card status-list"><div class="status-row"><span>Диагноз</span><span>${C4_HYPOTHESES[c.diagnosis].name}</span></div><div class="status-row"><span>Формула</span><span>${C4_RECIPES[c.recipeChoice].name}</span></div><div class="status-row"><span>Качество</span><span>${quality}</span></div><div class="status-row"><span>Ритуальная цель</span><span>Ядро → Покров → Печать → Очищение</span></div></article>`,`<button class="secondary-button" data-action="c4-pause">Сохранить и выйти</button><button class="primary-button" data-action="c4-start-battle">Начать ритуал</button>`);
  }

  function createChapter4Battle(){const c=save.chapter4,a=c.alchemy;let pokrov=c.diagnosis==='tampering'?3:4;const excellent=a.quality==='excellent',unstable=a.quality==='unstable';return {round:1,tab:'hero',heroActions:2,teamUsed:false,resonance:0,enemy:{pokrov,coreRevealed:c.recipeChoice==='revealing',seal:0,hunger:3},patients:{hp:3,max:3,shield:c.recipeChoice==='stabilizing'?1:0},lab:{hp:3,max:3,shield:c.recipeChoice==='stabilizing'?1:0},bait:c.recipeChoice==='bitter'?1:0,potionCharges:excellent?2:1,toxin:unstable?1:0,intent:'memory',status:'active',failureReason:null,log:['Алхимический голод вырвался из котла.']};}
  function normalizeChapter4Battle(value){const fresh=createChapter4Battle(),b={...fresh,...(value||{})};b.enemy={...fresh.enemy,...(value?.enemy||{})};b.patients={...fresh.patients,...(value?.patients||{})};b.lab={...fresh.lab,...(value?.lab||{})};b.log=Array.isArray(value?.log)?value.log.slice(-12):fresh.log;return b;}
  function c4IntentText(b){if(b.intent==='memory')return ['Стереть воспоминание','Ударит по пациентам. Щит уменьшит урон.'];if(b.intent==='lab')return ['Разорвать контур','Повредит лабораторию и усилит Покров.'];return ['Поглотить поддержку','Снимет Щит или восстановит голод.'];}
  function c4PurifyReason(b){if(b.status!=='active')return 'Ритуал завершён.';if(b.heroActions<1)return 'Нет действия героя.';if(!b.enemy.coreRevealed)return 'Сначала раскройте ядро Поиском или смесью.';if(b.enemy.pokrov>0)return `Снимите Покров: осталось ${b.enemy.pokrov}.`;if(b.enemy.seal<2)return `Наложите Печать: ${b.enemy.seal}/2.`;if(b.potionCharges<1)return 'Нет дозы противоядия.';return '';}
  function c4PositiveEffect(b,apply,label){if(b.enemy.hunger>0){if(b.bait>0){b.bait--;b.enemy.hunger--;b.log.push(`Горькая приманка поглощена вместо эффекта «${label}».`);apply();return true;}b.enemy.hunger--;b.log.push(`Алхимический голод съел эффект «${label}».`);return false;}apply();return true;}
  function c4SpendHero(b){if(b.heroActions<1){toast('Нет действий героя.');return false;}b.heroActions--;return true;}
  function c4SpendTeam(b){if(b.teamUsed){toast('Командное действие уже использовано.');return false;}b.teamUsed=true;return true;}
  function c4BattleAction(id){const c=save.chapter4,b=normalizeChapter4Battle(c.battle);if(b.status!=='active')return;
    if(id==='search'){if(!c4SpendHero(b))return;if(!b.enemy.coreRevealed){b.enemy.coreRevealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push('Поиск раскрыл ядро Зеркального осадка.');}else{b.resonance=Math.min(6,b.resonance+1);b.log.push('Поиск уточнил намерение. +1 Резонанс.');}}
    else if(id==='telekinesis'){if(!c4SpendHero(b))return;if(b.enemy.pokrov>0){b.enemy.pokrov--;if(b.enemy.pokrov===0)b.resonance=Math.min(6,b.resonance+1);b.log.push('Телекинез сорвал слой Покрова.');}else{b.resonance=Math.min(6,b.resonance+1);b.log.push('Телекинез удержал ядро открытым.');}}
    else if(id==='seal'){if(!b.enemy.coreRevealed||b.enemy.pokrov>0){toast(!b.enemy.coreRevealed?'Сначала раскройте ядро.':'Сначала снимите Покров.');return;}if(!c4SpendHero(b))return;b.enemy.seal=Math.min(2,b.enemy.seal+1);b.log.push(`Печать закреплена: ${b.enemy.seal}/2.`);}
    else if(id==='purify'){const reason=c4PurifyReason(b);if(reason){toast(reason);return;}b.heroActions--;b.potionCharges--;b.status='won';b.log.push('Противоядие прошло через Печать. Алхимический голод очищен.');c.stage='choice';c.battle=b;c4Save('Ритуал завершён.');return;}
    else if(id==='bait'){if(!c4SpendTeam(b))return;b.bait++;b.log.push('Селеста выставила горькую приманку перед следующим усилением.');}
    else if(id==='dose'){if(!c4SpendTeam(b))return;if(b.potionCharges<1){toast('Нет свободной дозы.');b.teamUsed=false;return;}const recipe=c.recipeChoice;if(recipe==='revealing'){b.enemy.coreRevealed=true;b.enemy.pokrov=Math.max(0,b.enemy.pokrov-1);b.log.push('Проявляющая доза раскрыла ядро и ослабила Покров.');}else if(recipe==='bitter'){b.bait++;b.enemy.pokrov=Math.max(0,b.enemy.pokrov-1);b.log.push('Горькая доза подготовила приманку и ослабила Покров.');}else{c4PositiveEffect(b,()=>{b.patients.shield++;b.lab.shield++;},'стабилизирующая доза');}if(c.alchemy.quality==='excellent'&&recipe!=='stabilizing')b.resonance=Math.min(6,b.resonance+1);}
    else if(id==='cleanse_toxin'){if(!c4SpendTeam(b))return;if(b.toxin>0){b.toxin--;b.log.push('Селеста сняла токсин с противоядия.');}else{b.bait++;b.log.push('Селеста превратила свободный реагент в горькую приманку.');}}
    else if(id==='aegis'){if(!c4SpendTeam(b))return;c4PositiveEffect(b,()=>{b.patients.shield++;b.lab.shield++;},'Эгида Лиоры');}
    else if(id==='light'){if(!c4SpendTeam(b))return;b.enemy.pokrov=Math.max(0,b.enemy.pokrov-1);b.log.push('Свет Лиоры прожёг слой Покрова.');}
    c.battle=b;c4Save(null);
  }
  function c4DamageTarget(target,amount){for(let i=0;i<amount;i++){if(target.shield>0)target.shield--;else target.hp--;}}
  function c4EndTurn(){const c=save.chapter4,b=normalizeChapter4Battle(c.battle);if(b.status!=='active')return;
    if(b.toxin>0){c4DamageTarget(b.patients,1);b.log.push('Нестабильная смесь обожгла память пациентки.');}
    if(b.intent==='memory'){c4DamageTarget(b.patients,1);b.log.push('Осадок попытался стереть ещё одно воспоминание.');}
    else if(b.intent==='lab'){c4DamageTarget(b.lab,1);b.enemy.pokrov=Math.min(4,b.enemy.pokrov+1);b.log.push('Контур лаборатории повреждён; Покров восстановлен на 1.');}
    else{if(b.patients.shield>0)b.patients.shield--;else if(b.lab.shield>0)b.lab.shield--;else b.enemy.hunger=Math.min(3,b.enemy.hunger+1);b.log.push('Существо ищет положительный эффект для поглощения.');}
    if(b.patients.hp<=0||b.lab.hp<=0){b.status='lost';b.failureReason=b.patients.hp<=0?'Воспоминания пациентки рассыпались.':'Защитный контур лаборатории разрушен.';c.battle=b;c4Save('Ритуал сорван. Можно начать бой заново.');return;}
    b.round++;b.heroActions=2;b.teamUsed=false;b.intent=['memory','lab','devour'][(b.round-1)%3];b.tab='hero';c.battle=b;c4Save(null);
  }
  function c4Dots(target){return Array.from({length:target.max},(_,i)=>`<i class="${i<target.shield?'shield':i<target.shield+target.hp?'on':''}"></i>`).join('');}
  function renderC4Battle(){const c=save.chapter4,b=c.battle=normalizeChapter4Battle(c.battle||createChapter4Battle()),intent=c4IntentText(b),reason=c4PurifyReason(b);
    const checks=[['Ядро раскрыто',b.enemy.coreRevealed],['Покров снят',b.enemy.pokrov===0],['Печать 2/2',b.enemy.seal>=2],['Доза сохранена',b.potionCharges>0],['Обе цели целы',b.patients.hp>0&&b.lab.hp>0]];
    const heroActions=[['search','Поиск','Раскрыть ядро или получить Резонанс.','1 дей.',''],['telekinesis','Телекинез','Снять 1 слой Покрова.','1 дей.',''],['seal','Печать','Закрепить открытое ядро.','1 дей.',!b.enemy.coreRevealed?'Ядро скрыто':b.enemy.pokrov>0?`Покров ${b.enemy.pokrov}`:''],['purify','Очищение','Завершить ритуал противоядием.','Финал',reason]];
    const celesteActions=[['bait','Горькая приманка','Защитить следующий положительный эффект.','Команда',b.teamUsed?'Действие использовано':''],['dose','Формула Селесты',C4_RECIPES[c.recipeChoice].desc,`${b.potionCharges} доз.`,b.teamUsed?'Действие использовано':b.potionCharges<1?'Нет дозы':''],['cleanse_toxin','Перегнать остаток',b.toxin?'Снять токсин смеси.':'Создать ещё одну приманку.','Команда',b.teamUsed?'Действие использовано':''],['bait','Подготовить мяту','Ещё одна безопасная приманка.','Команда',b.teamUsed?'Действие использовано':'']];
    const lioraActions=[['aegis','Эгида','Дать Щит обеим защищаемым целям.','Команда',b.teamUsed?'Действие использовано':''],['light','Луч Первого Света','Снять 1 слой Покрова.','Команда',b.teamUsed?'Действие использовано':''],['aegis','Удержать контур','Повторно защитить цели.','Команда',b.teamUsed?'Действие использовано':''],['light','Метка света','Ослабить внешний слой существа.','Команда',b.teamUsed?'Действие использовано':'']];
    const actions=b.tab==='hero'?heroActions:b.tab==='celeste'?celesteActions:lioraActions;
    c4Shell('Алхимический голод',`Раунд ${b.round} · ${b.log[b.log.length-1]}`,`<div class="c4-battle"><section class="c4-objective"><div class="c4-objective-head"><b>Ритуальная цель</b><span>не нужно обнулять здоровье</span></div><div class="c4-objective-grid">${checks.map(x=>`<div class="${x[1]?'done':''}">${x[0]}</div>`).join('')}</div></section><section class="c4-enemy"><div class="c4-enemy-mark">☣</div><div class="c4-enemy-copy"><h2>Зеркальный осадок</h2><div class="c4-intent"><b>${intent[0]}</b><span>${intent[1]}</span></div><div class="c4-statuses"><span><b>${b.enemy.pokrov}</b>Покров</span><span><b>${b.enemy.coreRevealed?'да':'нет'}</b>Ядро</span><span><b>${b.enemy.seal}/2</b>Печать</span><span><b>${b.enemy.hunger}</b>Голод</span></div><div class="c4-targets"><div class="c4-target"><b>Пациентка</b><div class="c4-dots">${c4Dots(b.patients)}</div></div><div class="c4-target"><b>Лаборатория</b><div class="c4-dots">${c4Dots(b.lab)}</div></div></div></div></section><div class="c4-team"><button class="${b.tab==='hero'?'active':''}" data-action="c4-tab" data-value="hero"><b>${escapeHtml(save.profile.heroName)}</b><span>${b.heroActions} действия</span></button><button class="${b.tab==='celeste'?'active':''}" data-action="c4-tab" data-value="celeste"><b>Селеста</b><span>${b.teamUsed?'ход использован':'готова'}</span></button><button class="${b.tab==='liora'?'active':''}" data-action="c4-tab" data-value="liora"><b>Лиора</b><span>общий командный ход</span></button></div><section class="c4-action-panel"><div class="c4-action-head"><b>${b.tab==='hero'?'Действия героя':b.tab==='celeste'?'Алхимия Селесты':'Защита Лиоры'}</b><span>Приманок ${b.bait} · доз ${b.potionCharges} · токсин ${b.toxin}</span></div><div class="c4-actions">${actions.map(([id,n,d,cost,block])=>`<button class="c4-action ${id==='purify'&&!block?'finish':''}" data-action="c4-battle-action" data-value="${id}" ${block?'disabled':''}><em>${cost}</em><b>${n}</b><span>${d}</span>${block?`<small>${block}</small>`:''}</button>`).join('')}</div></section>${b.status==='lost'?`<div class="c4-loss"><h2>Ритуал сорван</h2><p>${b.failureReason}</p><button class="primary-button" data-action="c4-retry-battle">Начать бой заново</button></div>`:''}</div>`,`<button class="secondary-button" data-action="c4-help">Как победить?</button><button class="primary-button" data-action="c4-end-turn" ${b.status!=='active'?'disabled':''}>Завершить раунд</button>`);
  }
  function renderC4Choice(){const c=save.chapter4;
    c4Shell('После очищения','Кто узнает о подмене',`<article class="card c4-panel"><div class="eyebrow">Доказательства</div><h2>Триада использовала поставку как ловушку</h2><p>Данные указывают на преднамеренную подмену. Но полный отчёт Ордену закроет нелегальную лабораторию — единственное место, где бесплатно лечат магические последствия.</p><div class="c4-grid">${[['report','Передать всё Ордену','Виновника начнут искать официально, лаборатория окажется под угрозой.','+ Орден'],['hide','Скрыть лабораторию','Передать Лиоре только данные о поставщике.','+ Селеста'],['expose','Опубликовать рецепт и подмену','Лишить всех сторон контроля над формулой.','+ независимость']].map(x=>`<button class="c4-choice ${c.finalChoice===x[0]?'active':''}" data-action="c4-final-choice" data-value="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span><em>${x[3]}</em></button>`).join('')}</div></article>`,`<button class="secondary-button" data-action="c4-pause">Отложить решение</button><button class="primary-button" data-action="c4-finish" ${c.finalChoice?'':'disabled'}>Завершить главу</button>`);
  }
  function applyChapter4Resolution(){const c=save.chapter4;if(c.rewarded)return;let trust=c.approach==='trust'?2:c.approach==='independent'?1:0;trust+=c.finalChoice==='hide'?2:c.finalChoice==='expose'?1:0;trust+=c.alchemy.quality==='excellent'?1:0;save.relationships.celeste.trust=Math.min(10,trust);save.relationships.celeste.label=trust>=5?'Прочное доверие':trust>=3?'Союзница':'Осторожное сотрудничество';if(!save.companions.owned.includes('celeste'))save.companions.owned.push('celeste');save.companions.states.celeste={level:4,trust:save.relationships.celeste.trust,rank:0};if(!save.companions.activeParty[1])save.companions.activeParty[1]='celeste';if(c.finalChoice==='report'){save.reputations.order.value=(save.reputations.order.value||0)+1;save.reputations.order.label=orderLabel(save.reputations.order.value);}if(c.finalChoice==='expose')save.reputations.independence=(save.reputations.independence||0)+2;save.currencies.coins+=55;save.profile.heroXp=Math.min(save.profile.heroXpToNext-1,(save.profile.heroXp||0)+45);save.profile.heroLevel=Math.max(4,save.profile.heroLevel);save.profile.accountLevel=Math.max(4,save.profile.accountLevel);if(!save.recipes.known.includes('memory_antidote'))save.recipes.known.push('memory_antidote');save.recipes.mastery.memory_antidote=Math.max(1,save.recipes.mastery.memory_antidote||0);save.inventory.items.memory_antidote=(save.inventory.items.memory_antidote||0)+2;save.inventory.items.mirror_sediment_page=1;save.codex.creatures.mirror_sediment={knowledge:1,max:3};if(!save.codex.discoveries.includes('mirror_sediment'))save.codex.discoveries.push('mirror_sediment');save.story.decisions['chapter_04.approach']=c.approach;save.story.decisions['chapter_04.diagnosis']=c.diagnosis;save.story.decisions['chapter_04.recipe']=c.recipeChoice;save.story.decisions['chapter_04.final_choice']=c.finalChoice;save.story.flags['chapter_04.complete']=true;save.story.flags['alchemy.extended_unlocked']=true;save.house.rooms.laboratory.unlocked=true;save.house.rooms.laboratory.level=Math.max(1,save.house.rooms.laboratory.level||0);save.progression.chapters.chapter_04_bitter_recipe={status:'completed',progress:100};save.progression.chapters.chapter_05_city_under_skin={status:'available',progress:0};save.progression.activeQuestId='chapter_05_city_under_skin';c.status='completed';c.stage='final';c.rewarded=true;}
  function renderC4Final(){const c=save.chapter4;c4Shell('Глава завершена','Уровень 4 · Горький рецепт',`<section class="card c4-result"><div class="c4-result-glyph">⚗</div><h2>Селеста Роу присоединилась</h2><p>Открыта расширенная алхимия: рецепты теперь могут менять правила боя, а не только давать расходники.</p><div class="c4-rewards"><div><b>Селеста 4★</b><span>Очиститель и поддержка</span></div><div><b>Противоядие памяти ×2</b><span>Новый расходник</span></div><div><b>+55 монет</b><span>Награда главы</span></div><div><b>+45 опыта</b><span>Рост героя</span></div></div></section><article class="card status-list" style="margin-top:8px"><div class="status-row"><span>Диагноз</span><span>${C4_HYPOTHESES[c.diagnosis]?.name}</span></div><div class="status-row"><span>Формула</span><span>${C4_RECIPES[c.recipeChoice]?.name}</span></div><div class="status-row"><span>Доверие Селесты</span><span>${save.relationships.celeste.trust}/10</span></div><div class="status-row"><span>Следующая глава</span><span>«Город под кожей» открыта</span></div></article>`,`<button class="secondary-button" data-action="c4-view-celeste">Селеста</button><button class="primary-button" data-action="c4-home">Вернуться домой</button>`);}
  function resetChapter4(){const had=save.progression.chapters.chapter_04_bitter_recipe.status==='completed';save.chapter4=createChapter4State();save.progression.chapters.chapter_04_bitter_recipe={status:'available',progress:0};save.progression.chapters.chapter_05_city_under_skin={status:'locked',progress:0};save.progression.activeQuestId='chapter_04_bitter_recipe';for(const key of Object.keys(save.story.decisions))if(key.startsWith('chapter_04.'))delete save.story.decisions[key];for(const key of Object.keys(save.story.flags))if(key.startsWith('chapter_04.')||key==='alchemy.extended_unlocked')delete save.story.flags[key];if(had){save.companions.owned=save.companions.owned.filter(id=>id!=='celeste');delete save.companions.states.celeste;if(save.companions.activeParty[1]==='celeste')save.companions.activeParty[1]=null;save.relationships.celeste={trust:0,label:'Не знакомы'};delete save.inventory.items.memory_antidote;delete save.inventory.items.mirror_sediment_page;save.recipes.known=save.recipes.known.filter(id=>id!=='memory_antidote');delete save.recipes.mastery.memory_antidote;delete save.codex.creatures.mirror_sediment;save.codex.discoveries=save.codex.discoveries.filter(id=>id!=='mirror_sediment');}currentScreen='home';}

  const renderGameC4Prev=renderGame;
  renderGame=function(){if(save&&currentScreen==='chapter4'){renderChapter4();return;}renderGameC4Prev();};
  const renderHomeC4Prev=renderHome;
  renderHome=function(){ensureChapter4State(save);const c3done=save.progression.chapters.chapter_03_first_light.status==='completed';if(!c3done)return renderHomeC4Prev();const c4done=save.progression.chapters.chapter_04_bitter_recipe.status==='completed';const c=save.chapter4,second=save.companions.activeParty?.[1]&&companions[save.companions.activeParty[1]],unlockedRooms=Object.values(save.house.rooms).filter(r=>r.unlocked).length;if(!c4done){const inProgress=c.status==='in_progress'||!['intro','final'].includes(c.stage);return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Запах горькой мяты</h1><p>Лиора оставила адрес подпольной лаборатории Селесты. Там стираются чужие воспоминания.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div><div class="section-title"><h2>Главная история</h2><span>Уровень 4</span></div><article class="card quest-card"><div class="quest-head"><div><span class="tag amber">Горький рецепт</span><h3>Лаборатория Селесты</h3></div><span class="tag ${inProgress?'green':'violet'}">${inProgress?'В процессе':'Доступно'}</span></div><p>Расследуйте подмену лекарства, приготовьте противоядие и остановите Алхимический голод.</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${c4Progress()}%"></div></div><div class="progress-caption"><span>${inProgress?'Автосохранение активно':'Не начато'}</span><span>${c4Progress()}%</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-chapter4">${inProgress?'Продолжить главу':'Начать главу'}</button><button class="secondary-button" data-action="start-incident">Дело района</button></div></article><div class="section-title"><h2>Подготовка</h2><span>${second?`В отряде: ${second.name}`:'Выберите спутника'}</span></div><div class="quick-grid"><button class="quick-card" data-action="open-codex">${icons.book}<strong>Книга Теней</strong><small>${save.codex.discoveries.length} записей</small></button><button class="quick-card" data-action="open-lab">${icons.flask}<strong>Лаборатория</strong><small>Базовые рецепты</small></button><button class="quick-card" data-action="open-party-picker">${icons.companions}<strong>Отряд</strong><small>Лиора доступна</small></button></div></section>`;}return `<section class="screen"><div class="home-scene"><div class="scene-copy"><div class="eyebrow">Главный дом</div><h1>Алхимик в отряде</h1><p>Селеста перенесла часть оборудования в дом. В метро найден следующий знак Триады.</p></div><div class="cat"><div class="cat-eyes"></div></div><button class="morwen-bubble" data-action="next-morwen-line"><strong>Морвен:</strong> ${escapeHtml(morwenText())}</button></div><div class="section-title"><h2>Следующая глава</h2><span>Уровень 5</span></div><article class="card quest-card"><div class="quest-head"><div><span class="tag amber">Главная история</span><h3>Город под кожей</h3></div><span class="tag violet">Открыто</span></div><p>Знак Триады ведёт в метро. Следующий этап добавит Телекинез II, позиции и маршруты побега.</p><div class="card-actions"><button class="secondary-button" data-action="chapter5-info">Описание</button><button class="primary-button" data-action="open-party-picker">Настроить отряд</button></div></article><div class="section-title"><h2>Последствия «Горького рецепта»</h2><span>Сохранено</span></div><article class="card status-list"><div class="status-row"><span>Селеста</span><span>${save.relationships.celeste.label} · ${save.relationships.celeste.trust}/10</span></div><div class="status-row"><span>Противоядие</span><span>${save.inventory.items.memory_antidote||0} шт.</span></div><div class="status-row"><span>Алхимия</span><span>расширенная система открыта</span></div><div class="status-row"><span>Спутник</span><span>Селеста Роу получена</span></div></article><div class="section-title"><h2>Комнаты</h2><span>${unlockedRooms} из 6 открыто</span></div><div class="room-grid">${roomCard('living_room','Гостиная','Разговоры и события дома',icons.home,true)}${roomCard('study','Кабинет','Книга Теней и развитие',icons.book,true)}${roomCard('laboratory','Лаборатория','Расширенные рецепты',icons.flask,true)}${roomCard('greenhouse','Теплица',save.house.rooms.greenhouse.projectUnlocked?'Проект получен':'Редкие растения и заказы',icons.leaf,save.house.rooms.greenhouse.unlocked)}${roomCard('ritual_hall','Ритуальный зал','Печати и сложные ритуалы',icons.circle,false)}${roomCard('artifact_room','Комната артефактов','Хранение реликвий',icons.crystal,false)}</div></section>`;};

  const renderCasesC4Prev=renderCases;
  renderCases=function(){let html=renderCasesC4Prev();if(save.progression.chapters.chapter_03_first_light.status!=='completed')return html;const done=save.progression.chapters.chapter_04_bitter_recipe.status==='completed',c=save.chapter4;const card=`<article class="card case-card"><span class="tag ${done?'green':'amber'}">Главная история · уровень 4</span><h3>Горький рецепт</h3><p>${done?'Подмена раскрыта. Селеста присоединилась к отряду.':'Расследуйте отравление и приготовьте противоядие памяти.'}</p><div class="quest-progress"><div class="progress-track"><div class="progress-fill" style="width:${done?100:c4Progress()}%"></div></div><div class="progress-caption"><span>${done?'Завершено':c.status==='in_progress'?'В процессе':'Доступно'}</span><span>${done?100:c4Progress()}%</span></div></div><div class="card-actions"><button class="primary-button" data-action="start-chapter4">${done?'Посмотреть итоги':c.status==='in_progress'?'Продолжить':'Начать главу'}</button></div></article>`;const re=/<article class="card case-card"><span class="tag amber">Главная история · уровень 4<\/span>[\s\S]*?<\/article>/;return re.test(html)?html.replace(re,card):html.replace('</section>',card+'</section>');};
  const renderJournalC4Prev=renderJournal;
  renderJournal=function(){let html=renderJournalC4Prev();if(save.progression.chapters.chapter_03_first_light.status!=='completed')return html;const done=save.progression.chapters.chapter_04_bitter_recipe.status==='completed',c=save.chapter4;const row=`<article class="card chapter-row ${done?'completed':'active'}"><span class="chapter-dot"></span><span class="tag ${done?'green':'violet'}">${done?'Завершено':'Текущая глава'}</span><h3>Уровень 4 · Горький рецепт</h3><p>${done?`Селеста присоединилась. Решение: ${{report:'отчёт Ордену',hide:'лаборатория скрыта',expose:'формула опубликована'}[c.finalChoice]}.`:`Прогресс главы: ${c4Progress()}%.`}</p></article>`;html=html.replace(/<article class="card chapter-row [^"]*"><span class="chapter-dot"><\/span><span class="tag [^"]*">[^<]*<\/span><h3>Уровень 4 · Горький рецепт<\/h3>[\s\S]*?<\/article>/,row);if(done&&!html.includes('Селеста Роу</span>'))html=html.replace(`<div class="status-row"><span>Лиора Вейн</span>`,`<div class="status-row"><span>Селеста Роу</span><span>${save.relationships.celeste.label} · ${save.relationships.celeste.trust}/10</span></div><div class="status-row"><span>Лиора Вейн</span>`);return html;};

  const morwenTextC4Prev=morwenText;
  morwenText=function(){const done=save?.progression?.chapters?.chapter_04_bitter_recipe?.status==='completed';if(done){const lines=['Селеста уже заняла половину лаборатории. Вторую половину, по её словам, займёт после первого взрыва.','Алхимический голод ел полезную магию. Наконец-то существо, которое понимает принцип бесплатного обеда.','В метро пахнет тем же катализатором. Надеюсь, поезд хотя бы придёт по расписанию.'];return lines[save.tests.morwenLine%lines.length];}return morwenTextC4Prev();};


  companionBonuses.liora={title:'Эгида Первого Света',short:'Создаёт защитный Покров для свидетеля.',battle:'shield'};
  companionBonuses.celeste={title:'Алхимическая очистка',short:'Ослабляет Покров и стабилизирует ритуал.',battle:'weaken'};

  function canCraftMemoryAntidote(){return save.recipes.known.includes('memory_antidote')&&save.currencies.coins>=8&&(save.inventory.items.lunar_water||0)>=1&&(save.inventory.items.silver_salt||0)>=1&&(save.inventory.items.root_ash||0)>=1;}
  function craftMemoryAntidote(){if(!canCraftMemoryAntidote()){toast(save.currencies.coins<8?'Не хватает монет.':'Не хватает алхимических материалов.');return;}save.currencies.coins-=8;for(const id of ['lunar_water','silver_salt','root_ash'])save.inventory.items[id]-=1;save.inventory.items.memory_antidote=(save.inventory.items.memory_antidote||0)+1;save.recipes.mastery.memory_antidote=Math.min(3,Number(save.recipes.mastery.memory_antidote||0)+1);saveGame('Противоядие памяти добавлено в сумку.');}
  const renderLaboratoryC4Prev=renderLaboratory;
  renderLaboratory=function(){let html=renderLaboratoryC4Prev();if(!save.recipes.known.includes('memory_antidote'))return html;const mastery=Number(save.recipes.mastery.memory_antidote||0),can=canCraftMemoryAntidote();const card=`<div class="section-title"><h2>Расширенная алхимия</h2><span>Открыто Селестой</span></div><article class="card recipe-card"><div class="recipe-head"><div><span class="tag green">Рецепт изучен</span><h3>Противоядие памяти</h3><p>Не только расходник: в сюжетных боях формула может проявлять ядро, ставить горькую приманку или стабилизировать защищаемые цели.</p></div><div class="recipe-ring">${save.inventory.items.memory_antidote||0} шт.</div></div><div class="mastery-track">${[1,2,3].map(n=>`<i class="${mastery>=n?'on':''}"></i>`).join('')}</div><div class="section-title" style="margin-top:14px"><h2>Повторная варка</h2><span>8 монет</span></div><div class="material-line"><span class="material-icon">${icons.flask}</span><div><strong>Лунная вода</strong><small>1 единица</small></div><b>${save.inventory.items.lunar_water||0}</b></div><div class="material-line"><span class="material-icon">${icons.crystal}</span><div><strong>Серебряная соль</strong><small>1 единица</small></div><b>${save.inventory.items.silver_salt||0}</b></div><div class="material-line"><span class="material-icon">${icons.leaf}</span><div><strong>Пепел корней</strong><small>1 единица</small></div><b>${save.inventory.items.root_ash||0}</b></div><div class="card-actions"><button class="primary-button" data-action="craft-memory-antidote" ${can?'':'disabled'}>${can?'Приготовить противоядие':save.currencies.coins<8?'Не хватает монет':'Не хватает материалов'}</button></div></article>`;return html.replace('</section>',card+'</section>');};
  const renderCodexC4Prev=renderCodex;
  renderCodex=function(){let html=renderCodexC4Prev();if(!save.codex.creatures.mirror_sediment)return html;const k=save.codex.creatures.mirror_sediment.knowledge||1;const card=`<article class="card codex-card"><div class="codex-head"><div class="codex-glyph">☣</div><div><span class="tag amber">Алхимический паразит</span><h3>Зеркальный осадок</h3><p>Живой сгусток, который превращает полезную магию в пищу.</p>${knowledgeDots(k)}</div></div><div class="codex-facts"><div class="codex-fact"><strong>Правило:</strong> первый положительный эффект может быть поглощён.</div><div class="codex-fact"><strong>Решение:</strong> отвлечь горькой приманкой, раскрыть ядро, снять Покров, наложить Печать и применить Очищение.</div></div></article>`;return html.replace('</div></section>',card+'</div></section>');};
  companionCard=function(c,isOwned){const trust=isOwned&&save.relationships[c.id]?.trust!==undefined?save.relationships[c.id].trust:c.id==='morven'?save.relationships.morven.trust:null;return `<button class="card companion-card ${isOwned?'':'locked'}" data-action="companion-details" data-companion="${c.id}"><div class="companion-portrait">${c.initials}</div><div><h3>${c.name}</h3><p>${c.subtitle}<br>${c.roles}</p>${isOwned?`<div class="trust-line"><span class="faint" style="font-size:9px">${trust!==null?`Доверие ${trust}/10`:'Получен'}</span><span class="trust-meter"><i style="width:${trust!==null?trust*10:100}%"></i></span></div>`:`<div class="trust-line"><span class="faint" style="font-size:9px">${c.unlock}</span></div>`}</div><span class="chevron">${icons.chevron}</span></button>`;};
  const openDebugC4Prev=openDebug;
  openDebug=function(){openDebugC4Prev();const body=modalRoot.querySelector('.modal-body');if(!body)return;const first=body.querySelector('.debug-section');first?.insertAdjacentHTML('afterend',`<div class="debug-section"><h3>Глава 4</h3><div class="debug-grid"><button class="debug-button" data-action="debug-reset-chapter4"><strong>Повторить «Горький рецепт»</strong><span>Этап: ${save.chapter4.stage}</span></button><button class="debug-button" data-action="debug-complete-chapter4"><strong>Быстро завершить главу</strong><span>Проверка Селесты и мета-наград</span></button></div></div>`);const status=body.querySelector('.status-list');status?.insertAdjacentHTML('beforeend',`<div class="status-row"><span>Глава 4</span><span>${save.progression.chapters.chapter_04_bitter_recipe.status==='completed'?'завершена':`этап: ${save.chapter4.stage}`}</span></div>`);};

  function showC4Help(){openModal(`<div class="modal-header"><div><div class="eyebrow">Ритуальная цель</div><h2>Как победить</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>Раскройте ядро Поиском или проявляющей формулой. Снимите Покров телекинезом, светом Лиоры или смесью. Наложите Печать дважды и завершите бой Очищением.</p><div class="detail-row"><strong>Алхимический голод</strong><span>Первый положительный эффект может быть поглощён. Перед Щитом или стабилизирующей дозой используйте горькую приманку Селесты.</span></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);}
  function showChapter5Info(){openModal(`<div class="modal-header"><div><div class="eyebrow">Следующая часть</div><h2>«Город под кожей»</h2></div><button class="modal-close" data-action="close-modal">${icons.close}</button></div><div class="modal-body"><p>След Триады ведёт в метро. Глава добавит Телекинез II, позиционные объекты и несколько способов остановить Курьера.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Понятно</button></div></div>`);}

  document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;switch(action){
    case 'start-chapter4':if(save.progression.chapters.chapter_03_first_light.status!=='completed'){toast('Сначала завершите «Первый Свет».');break;}ensureChapter4State(save);if(save.progression.chapters.chapter_04_bitter_recipe.status==='completed')save.chapter4.stage='final';else{save.chapter4.status='in_progress';save.progression.chapters.chapter_04_bitter_recipe.status='in_progress';}currentScreen='chapter4';c4Save(null);break;
    case 'c4-pause':currentScreen='home';saveGame('Глава приостановлена. Прогресс сохранён.');break;
    case 'c4-enter':save.chapter4.stage='meeting';c4Save(null);break;
    case 'c4-approach':save.chapter4.approach=button.dataset.value;c4Save('Отношение к Селесте сохранено.');break;
    case 'c4-to-investigation':save.chapter4.stage='investigation';c4Save('Проверка партии начата.');break;
    case 'c4-location':save.chapter4.investigation.location=button.dataset.location;save.chapter4.investigation.selectedPoint=null;c4Save(null);break;
    case 'c4-select-point':save.chapter4.investigation.selectedPoint=button.dataset.point;c4Save(null);break;
    case 'c4-method':{const found=c4FindMethod(button.dataset.method),r=save.chapter4.investigation;if(!found||r.used[found.method.id])break;const cost=c4MethodCost(found.method);if(r.time<cost){toast('Не хватает времени.');break;}r.time-=cost;r.used[found.method.id]=true;if(found.method.search)r.freeSearch=false;r.evidence[found.method.evidence.id]=found.method.evidence;toast(found.method.text);c4Save(null);break;}
    case 'c4-reset-investigation':save.chapter4.investigation=createChapter4State().investigation;save.chapter4.diagnosis=null;c4Save('Расследование начато заново.');break;
    case 'c4-to-deduction':if(c4CanDeduce()){save.chapter4.stage='deduction';c4Save(null);}break;
    case 'c4-diagnosis':save.chapter4.diagnosis=button.dataset.value;c4Save('Диагноз сохранён.');break;
    case 'c4-back-investigation':save.chapter4.stage='investigation';c4Save(null);break;
    case 'c4-to-formula':if(save.chapter4.diagnosis){save.chapter4.stage='formula';c4Save(null);}break;
    case 'c4-recipe':save.chapter4.recipeChoice=button.dataset.value;c4Save('Формула выбрана.');break;
    case 'c4-back-deduction':save.chapter4.stage='deduction';c4Save(null);break;
    case 'c4-to-alchemy':if(save.chapter4.recipeChoice){save.chapter4.stage='alchemy';c4Save(null);}break;
    case 'c4-ingredient':if(!save.chapter4.alchemy.order.includes(button.dataset.value)){save.chapter4.alchemy.order.push(button.dataset.value);c4Save(null);}break;
    case 'c4-reset-order':save.chapter4.alchemy.order=[];save.chapter4.alchemy.quality=null;c4Save(null);break;
    case 'c4-temp':save.chapter4.alchemy.temp=button.dataset.value;c4Save(null);break;
    case 'c4-charge':{if(save.chapter4.alchemy.charge!==null){save.chapter4.alchemy.charge=null;c4Save(null);break;}const phase=(performance.now()%4400)/2200;const pct=Math.round(phase<=1?2+94*phase:96-94*(phase-1));save.chapter4.alchemy.charge=Math.max(2,Math.min(96,pct));c4Save('Искра зафиксирована.');break;}
    case 'c4-brew':{const a=save.chapter4.alchemy;if(a.order.length===3&&a.temp&&a.charge!==null){a.score=c4AlchemyScore();a.quality=c4QualityFromScore(a.score);c4Save('Противоядие готово.');}break;}
    case 'c4-retry-alchemy':save.chapter4.alchemy={order:[],temp:null,charge:null,quality:null,score:0};c4Save('Алхимия начата заново.');break;
    case 'c4-to-brief':save.chapter4.stage='brief';c4Save(null);break;
    case 'c4-start-battle':save.chapter4.battle=createChapter4Battle();save.chapter4.stage='battle';c4Save('Ритуал начался.');break;
    case 'c4-tab':save.chapter4.battle=normalizeChapter4Battle(save.chapter4.battle);save.chapter4.battle.tab=button.dataset.value;c4Save(null);break;
    case 'c4-battle-action':c4BattleAction(button.dataset.value);break;
    case 'c4-end-turn':c4EndTurn();break;
    case 'c4-retry-battle':save.chapter4.battle=createChapter4Battle();c4Save('Бой начат заново.');break;
    case 'c4-help':showC4Help();break;
    case 'craft-memory-antidote':craftMemoryAntidote();break;
    case 'c4-final-choice':save.chapter4.finalChoice=button.dataset.value;c4Save('Решение сохранено.');break;
    case 'c4-finish':if(save.chapter4.finalChoice){applyChapter4Resolution();c4Save('Уровень 4 завершён. Селеста присоединилась.');}break;
    case 'c4-view-celeste':showCompanion('celeste');break;
    case 'c4-home':currentScreen='home';saveGame('Все последствия главы сохранены.');break;
    case 'chapter5-info':showChapter5Info();break;
    case 'debug-reset-chapter4':if(confirm('Сбросить главу 4 и её награды?')){closeModal();resetChapter4();saveGame('Глава 4 сброшена.');}break;
    case 'debug-complete-chapter4':save.chapter4.approach='trust';save.chapter4.diagnosis='tampering';save.chapter4.recipeChoice='bitter';save.chapter4.alchemy={order:['moonwater','ash','mint'],temp:'mid',charge:65,quality:'excellent',score:6};save.chapter4.finalChoice='hide';applyChapter4Resolution();closeModal();currentScreen='home';saveGame('Глава 4 завершена технической кнопкой.');break;
  }});


  /* =========================================================
     VISUAL PASS v1.1 — INLINE SVG SCENE DECORATION
     ========================================================= */
  const VISUAL_PASS_VERSION='1.1.1';
  const vpSvg=(body,view='0 0 520 300')=>`<svg viewBox="${view}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const vpDust=()=>'<div class="vp-dust"><i></i><i></i><i></i><i></i><i></i></div>';
  const VP_ART={
    home:vpSvg(`
      <defs><linearGradient id="hbg" x2="0" y2="1"><stop stop-color="#30203a"/><stop offset=".55" stop-color="#15131d"/><stop offset="1" stop-color="#09080d"/></linearGradient><radialGradient id="moon"><stop stop-color="#eee8ef"/><stop offset=".22" stop-color="#b8afc1"/><stop offset=".23" stop-color="#6b5874" stop-opacity=".25"/><stop offset="1" stop-color="#2f203a" stop-opacity="0"/></radialGradient><linearGradient id="fire" x2="0" y2="1"><stop stop-color="#f4d08a"/><stop offset=".5" stop-color="#b05e45"/><stop offset="1" stop-color="#421e28"/></linearGradient></defs>
      <rect width="520" height="300" fill="url(#hbg)"/><rect y="215" width="520" height="85" fill="#0b090e"/>
      <path d="M349 20h124v184H349z" fill="#17131d" stroke="#5d4569" stroke-width="3"/><path d="M359 30h104v151H359z" fill="#181d2d"/><circle cx="412" cy="80" r="53" fill="url(#moon)"/><path d="M411 29v152M359 104h104" stroke="#493853" stroke-width="3"/>
      <path d="M340 15q35 40 6 191M476 14q-33 42-5 192" fill="#3c2744" stroke="#5c3a62" stroke-width="5" opacity=".75"/>
      <rect x="31" y="70" width="113" height="145" rx="5" fill="#100d13" stroke="#382b3e"/><path d="M42 82h91M42 120h91M42 158h91M42 196h91" stroke="#59425c" stroke-width="4"/><g fill="#84627e"><rect x="47" y="88" width="10" height="26"/><rect x="60" y="91" width="14" height="23"/><rect x="79" y="86" width="8" height="28"/><rect x="94" y="89" width="18" height="25"/><rect x="48" y="126" width="16" height="26"/><rect x="69" y="128" width="9" height="24"/><rect x="84" y="124" width="13" height="28"/><rect x="102" y="129" width="23" height="23"/></g>
      <path d="M168 155h124v68H168z" fill="#1a1318" stroke="#4a363f"/><path d="M182 166h96v44H182z" fill="#311b23"/><path d="M230 203c-21-8-20-31-2-37 2 11 14 12 18 0 14 10 8 31-16 37z" fill="url(#fire)"/><rect x="154" y="143" width="152" height="15" rx="4" fill="#34232b"/>
      <ellipse cx="252" cy="250" rx="153" ry="24" fill="#201522"/><ellipse cx="250" cy="247" rx="111" ry="13" fill="#5a355d" opacity=".25"/>
      <path d="M83 237c21-25 60-26 81 0" fill="none" stroke="#2b1c2d" stroke-width="15"/><circle cx="64" cy="219" r="13" fill="#211522"/>
      <g opacity=".5"><circle cx="292" cy="118" r="2" fill="#e4d4e9"/><circle cx="318" cy="77" r="1.5" fill="#e4d4e9"/><circle cx="161" cy="101" r="1.5" fill="#d8b8e5"/></g>`),
    apartment:vpSvg(`<defs><linearGradient id="ab" x2="0" y2="1"><stop stop-color="#493044"/><stop offset=".6" stop-color="#21151f"/><stop offset="1" stop-color="#0d0b0f"/></linearGradient><radialGradient id="ag"><stop stop-color="#b9679b" stop-opacity=".38"/><stop offset="1" stop-color="#4e2446" stop-opacity="0"/></radialGradient></defs><rect width="520" height="280" fill="url(#ab)"/><rect y="184" width="520" height="96" fill="#100c11"/><path d="M42 70h168v116H42z" fill="#261820" stroke="#5a3a4d"/><path d="M55 82h142v91H55z" fill="#34212c"/><rect x="303" y="40" width="98" height="124" fill="#171118" stroke="#634657" stroke-width="5"/><path d="M318 55h68v88h-68z" fill="#291a27"/><circle cx="352" cy="82" r="17" fill="#b8a8b8" opacity=".45"/><path d="M338 106q14-18 28 0v30h-28z" fill="#503749"/><path d="M12 278c58-105 120-73 174-154M115 280c47-74 104-69 163-155M244 280c-12-69 78-104 140-129M509 280c-31-71-77-81-131-128" fill="none" stroke="#315337" stroke-width="9" opacity=".7"/><path d="M13 278c58-105 120-73 174-154M115 280c47-74 104-69 163-155" fill="none" stroke="#75a071" stroke-width="2" opacity=".5"/><circle cx="269" cy="145" r="73" fill="url(#ag)"/><path d="M233 181q36-69 72 0q-36 35-72 0z" fill="#6a4160" opacity=".7"/>`,'0 0 520 280'),
    shop:vpSvg(`<defs><linearGradient id="sb" x2="0" y2="1"><stop stop-color="#284046"/><stop offset=".6" stop-color="#162526"/><stop offset="1" stop-color="#0b1111"/></linearGradient><radialGradient id="sg"><stop stop-color="#7bc08e" stop-opacity=".32"/><stop offset="1" stop-color="#7bc08e" stop-opacity="0"/></radialGradient></defs><rect width="520" height="280" fill="url(#sb)"/><rect y="202" width="520" height="78" fill="#0b1010"/><path d="M20 64h480v143H20z" fill="#171b1a" stroke="#4e5b4f"/><path d="M32 84h456M32 127h456M32 170h456" stroke="#605449" stroke-width="5"/><g fill="#739c7b"><circle cx="70" cy="69" r="25"/><circle cx="440" cy="72" r="30"/><circle cx="274" cy="51" r="22"/></g><g fill="#925e69"><path d="M67 91h21v32H67z"/><path d="M105 96h17v27h-17z"/><path d="M151 88h24v35h-24z"/><path d="M211 95h18v28h-18z"/></g><g fill="#6f8eb2"><path d="M314 91h19v32h-19z"/><path d="M354 86h25v37h-25z"/><path d="M404 94h18v29h-18z"/></g><circle cx="258" cy="143" r="74" fill="url(#sg)"/><path d="M252 93q23 25 0 58q-23-33 0-58zM252 151q-28-6-37 23q30 13 37-23zM252 151q28-6 37 23q-30 13-37-23z" fill="#77b47c" opacity=".75"/>`,'0 0 520 280'),
    yard:vpSvg(`<defs><linearGradient id="yb" x2="0" y2="1"><stop stop-color="#1d3147"/><stop offset=".55" stop-color="#101b27"/><stop offset=".56" stop-color="#16251b"/><stop offset="1" stop-color="#090e0b"/></linearGradient><radialGradient id="ym"><stop stop-color="#d8d7dc"/><stop offset=".25" stop-color="#9aa7bc" stop-opacity=".45"/><stop offset="1" stop-color="#9aa7bc" stop-opacity="0"/></radialGradient></defs><rect width="520" height="280" fill="url(#yb)"/><circle cx="414" cy="53" r="53" fill="url(#ym)"/><path d="M0 135h62V74h54v61h48V47h64v88h52V84h49v51h49V59h70v76h73v65H0z" fill="#11151d"/><g fill="#a79a66" opacity=".5"><rect x="77" y="91" width="7" height="12"/><rect x="94" y="91" width="7" height="12"/><rect x="184" y="69" width="8" height="13"/><rect x="207" y="68" width="8" height="13"/><rect x="396" y="82" width="8" height="13"/></g><path d="M158 245h220v-46H158z" fill="#202629" stroke="#5b6468" stroke-width="5"/><path d="M175 210h186M194 200v45M226 200v45M258 200v45M290 200v45M322 200v45" stroke="#101416" stroke-width="6"/><path d="M12 280c34-84 74-86 125-125M85 280c22-54 68-68 127-81M510 280c-38-85-89-83-148-121" fill="none" stroke="#385f3c" stroke-width="12"/><path d="M239 275q11-53 60-83" fill="none" stroke="#79a66e" stroke-width="4"/>`,'0 0 520 280'),
    square:vpSvg(`<defs><linearGradient id="qb" x2="0" y2="1"><stop stop-color="#344c70"/><stop offset=".58" stop-color="#182235"/><stop offset="1" stop-color="#090d14"/></linearGradient><radialGradient id="ql"><stop stop-color="#e5d5ae"/><stop offset=".16" stop-color="#b58f65" stop-opacity=".42"/><stop offset="1" stop-color="#8b6d55" stop-opacity="0"/></radialGradient></defs><rect width="520" height="300" fill="url(#qb)"/><circle cx="417" cy="55" r="60" fill="url(#ql)"/><path d="M0 170h91v-69h55v69h56V72h91v98h48v-53h53v53h126v130H0z" fill="#111722"/><path d="M202 170V72l45-35 46 35v98z" fill="#1c2534" stroke="#536581"/><path d="M216 86h64M216 112h64M216 138h64" stroke="#384a65" stroke-width="6"/><path d="M372 249h42V113h-42z" fill="#172030" stroke="#6881a4"/><path d="M393 94l27 36h-54z" fill="#98744b"/><circle cx="393" cy="157" r="26" fill="none" stroke="#c5a268" stroke-width="3"/><circle cx="393" cy="157" r="9" fill="#d8bd7c" opacity=".75"/><path d="M74 251h361" stroke="#526174" stroke-width="4"/><path d="M0 255h520v45H0z" fill="#0a0d13"/>`),
    archive:vpSvg(`<defs><linearGradient id="rb" x2="0" y2="1"><stop stop-color="#2b3548"/><stop offset=".55" stop-color="#171d29"/><stop offset="1" stop-color="#090b11"/></linearGradient><radialGradient id="rg"><stop stop-color="#a9c4e8" stop-opacity=".28"/><stop offset="1" stop-color="#a9c4e8" stop-opacity="0"/></radialGradient></defs><rect width="520" height="300" fill="url(#rb)"/><rect x="24" y="40" width="132" height="230" fill="#11151d" stroke="#465269"/><rect x="364" y="40" width="132" height="230" fill="#11151d" stroke="#465269"/><g stroke="#37445a" stroke-width="5"><path d="M35 82h110M35 126h110M35 170h110M35 214h110M375 82h110M375 126h110M375 170h110M375 214h110"/></g><g fill="#617291"><rect x="43" y="52" width="15" height="24"/><rect x="64" y="55" width="19" height="21"/><rect x="90" y="50" width="12" height="26"/><rect x="112" y="54" width="23" height="22"/><rect x="384" y="52" width="16" height="24"/><rect x="408" y="56" width="11" height="20"/><rect x="425" y="51" width="24" height="25"/></g><circle cx="260" cy="123" r="94" fill="url(#rg)"/><path d="M207 221h106v45H207z" fill="#2d2730" stroke="#7c6b82"/><path d="M255 221v45" stroke="#7c6b82"/><circle cx="260" cy="244" r="13" fill="#b9a574"/><g fill="#d4d8e2" opacity=".55"><path d="M207 104l55-20 11 34-55 20z"/><path d="M303 81l43 20-13 28-43-20z"/><path d="M242 45l35 10-8 27-35-10z"/></g>`),
    roof:vpSvg(`<defs><linearGradient id="tb" x2="0" y2="1"><stop stop-color="#182944"/><stop offset=".62" stop-color="#101927"/><stop offset="1" stop-color="#070a10"/></linearGradient><radialGradient id="tm"><stop stop-color="#e9e5e9"/><stop offset=".18" stop-color="#b8c4d6" stop-opacity=".5"/><stop offset="1" stop-color="#b8c4d6" stop-opacity="0"/></radialGradient><radialGradient id="tear"><stop stop-color="#af74d4" stop-opacity=".9"/><stop offset=".25" stop-color="#70519c" stop-opacity=".48"/><stop offset="1" stop-color="#70519c" stop-opacity="0"/></radialGradient></defs><rect width="520" height="300" fill="url(#tb)"/><circle cx="84" cy="57" r="59" fill="url(#tm)"/><path d="M0 210h50v-69h48v69h31v-104h58v104h47v-65h53v65h38v-116h67v116h36v-76h50v76h42v90H0z" fill="#080c13"/><g fill="#a99e6c" opacity=".45"><rect x="66" y="160" width="7" height="11"/><rect x="149" y="129" width="8" height="12"/><rect x="355" y="118" width="8" height="12"/><rect x="449" y="154" width="8" height="12"/></g><path d="M296 255h119V211H296z" fill="#181d25" stroke="#4c5969"/><path d="M348 211v-91M348 139l-38 38M348 139l41 31" stroke="#74839a" stroke-width="5"/><ellipse cx="187" cy="124" rx="84" ry="71" fill="url(#tear)"/><path d="M189 57c-24 29 14 47-11 75s14 41-8 66" fill="none" stroke="#d8a5ee" stroke-width="4" opacity=".8"/>`),
    c2danger:vpSvg(`<defs><linearGradient id="db" x2="0" y2="1"><stop stop-color="#28192a"/><stop offset=".55" stop-color="#17111b"/><stop offset="1" stop-color="#09080c"/></linearGradient><radialGradient id="dg"><stop stop-color="#9c446f" stop-opacity=".55"/><stop offset="1" stop-color="#9c446f" stop-opacity="0"/></radialGradient></defs><rect width="520" height="250" fill="url(#db)"/><circle cx="260" cy="91" r="115" fill="url(#dg)"/><path d="M0 250c75-142 133-89 203-175M78 250c74-100 136-89 206-177M520 250c-71-138-143-103-222-184" fill="none" stroke="#3f6d45" stroke-width="15"/><path d="M0 250c75-142 133-89 203-175M520 250c-71-138-143-103-222-184" fill="none" stroke="#83ad72" stroke-width="3" opacity=".52"/><path d="M252 192q22-34 45 0v55h-45z" fill="#91828c"/><circle cx="274" cy="173" r="17" fill="#bdaeb8"/>`,'0 0 520 250'),
    training:vpSvg(`<defs><linearGradient id="tr" x2="0" y2="1"><stop stop-color="#3a506e"/><stop offset=".62" stop-color="#1c283b"/><stop offset="1" stop-color="#0c1119"/></linearGradient></defs><rect width="520" height="280" fill="url(#tr)"/><path d="M0 185h111v-70h63v70h49v-103h85v103h52v-55h54v55h106v95H0z" fill="#121a25"/><path d="M96 250h42v-57H96z" fill="#3a2d2c" transform="rotate(-12 117 221)"/><circle cx="368" cy="203" r="19" fill="#ccb8a8"/><path d="M347 250q20-46 42 0" fill="#6b748b"/><path d="M159 248h42V139h-42z" fill="#182237" stroke="#7893bb"/><path d="M180 124l26 29h-52z" fill="#b38b52"/><circle cx="180" cy="184" r="25" fill="none" stroke="#b9d7ff" stroke-width="3"/><circle cx="368" cy="213" r="56" fill="none" stroke="#a9ccff" stroke-width="4" opacity=".65"/>`,'0 0 520 280'),
    c3danger:vpSvg(`<defs><linearGradient id="cd" x2="0" y2="1"><stop stop-color="#26344a"/><stop offset=".55" stop-color="#161c29"/><stop offset="1" stop-color="#080b11"/></linearGradient><radialGradient id="cg"><stop stop-color="#b35b9b" stop-opacity=".58"/><stop offset="1" stop-color="#b35b9b" stop-opacity="0"/></radialGradient></defs><rect width="520" height="250" fill="url(#cd)"/><circle cx="260" cy="91" r="115" fill="url(#cg)"/><path d="M215 174c-45-32-36-96 2-111 12 22 30 30 43 3 16 23 29 20 46-1 38 25 38 86-1 111-24 15-66 15-90-2z" fill="#19121f" stroke="#9d6bb0"/><path d="M230 115l21 13-25 8M289 115l-21 13 25 8" fill="none" stroke="#e0afd8" stroke-width="4"/><path d="M70 245q21-44 43 0" fill="#69778b"/><circle cx="91" cy="203" r="17" fill="#c0b1a9"/><path d="M407 245h39V133h-39z" fill="#172135" stroke="#8097b8"/><path d="M426 117l25 30h-50z" fill="#b58b4f"/>`,'0 0 520 250'),
    c3battle:vpSvg(`<defs><linearGradient id="bb" x2="0" y2="1"><stop stop-color="#243653"/><stop offset=".57" stop-color="#121b2c"/><stop offset="1" stop-color="#070a10"/></linearGradient><radialGradient id="ba"><stop stop-color="#b167c0" stop-opacity=".62"/><stop offset="1" stop-color="#b167c0" stop-opacity="0"/></radialGradient></defs><rect width="520" height="250" fill="url(#bb)"/><circle cx="260" cy="86" r="116" fill="url(#ba)"/><path d="M211 167c-42-43-19-109 25-117 9 24 23 29 32 2 19 29 33 27 49 3 43 26 39 93-3 116-28 16-78 14-103-4z" fill="#15101c" stroke="#8d63a5" stroke-width="2"/><path d="M229 105l23 15-28 9M292 105l-23 15 29 9" fill="none" stroke="#dba4d9" stroke-width="4"/><path d="M245 151q15 13 30 0" fill="none" stroke="#b47cae" stroke-width="3"/><path d="M56 244q23-48 47 0" fill="#6b788a"/><circle cx="79" cy="199" r="18" fill="#c2b2aa"/><path d="M413 244h42V126h-42z" fill="#18233a" stroke="#8199bd"/><path d="M434 109l27 31h-54z" fill="#bc9356"/><circle cx="434" cy="174" r="25" fill="none" stroke="#d2b270" stroke-width="3"/><path d="M21 245h478" stroke="#56677e" stroke-width="4"/>`,'0 0 520 250'),
    c2battle:vpSvg(`<defs><radialGradient id="ig"><stop stop-color="#719d70" stop-opacity=".64"/><stop offset="1" stop-color="#719d70" stop-opacity="0"/></radialGradient></defs><rect width="110" height="130" fill="transparent"/><circle cx="56" cy="60" r="55" fill="url(#ig)"/><path d="M55 115C15 93 11 43 42 23c8 17 19 18 25-2 25 15 32 58 5 88-5 5-11 8-17 6z" fill="#1d3020" stroke="#6a986c" stroke-width="3"/><path d="M53 26c-12 25 15 29-4 48 23-7 21 20 40 17" fill="none" stroke="#8ebb7e" stroke-width="4"/><circle cx="43" cy="58" r="4" fill="#d3abc7"/><circle cx="66" cy="55" r="4" fill="#d3abc7"/>`,'0 0 110 130')
  };

  VP_ART.c2home=vpSvg(`
    <defs>
      <linearGradient id="c2hb" x2="0" y2="1"><stop stop-color="#39283d"/><stop offset=".58" stop-color="#1a141f"/><stop offset="1" stop-color="#09080d"/></linearGradient>
      <radialGradient id="c2moon"><stop stop-color="#c990e2" stop-opacity=".72"/><stop offset="1" stop-color="#713d87" stop-opacity="0"/></radialGradient>
      <linearGradient id="c2door" x2="1"><stop stop-color="#2d202d"/><stop offset="1" stop-color="#17121b"/></linearGradient>
    </defs>
    <rect width="520" height="300" fill="url(#c2hb)"/>
    <rect y="230" width="520" height="70" fill="#0b090e"/>
    <path d="M24 50h160v181H24z" fill="#171119" stroke="#5a405a" stroke-width="3"/>
    <path d="M38 68h132M38 108h132M38 148h132M38 188h132" stroke="#4e384e" stroke-width="5"/>
    <g fill="#8a6689"><rect x="43" y="75" width="13" height="27"/><rect x="61" y="73" width="19" height="29"/><rect x="86" y="78" width="10" height="24"/><rect x="102" y="70" width="18" height="32"/><rect x="126" y="75" width="28" height="27"/><rect x="44" y="116" width="23" height="26"/><rect x="73" y="120" width="13" height="22"/><rect x="93" y="113" width="20" height="29"/><rect x="121" y="118" width="31" height="24"/></g>
    <path d="M348 39h135v192H348z" fill="url(#c2door)" stroke="#72516f" stroke-width="4"/>
    <path d="M366 56h99v158h-99z" fill="#201720" stroke="#4e394d" stroke-width="2"/>
    <circle cx="454" cy="137" r="5" fill="#c8a86d"/>
    <path d="M348 231q42-31 135 0" fill="#111015" opacity=".9"/>
    <rect x="205" y="154" width="105" height="77" rx="5" fill="#211722" stroke="#63465f" stroke-width="3"/>
    <rect x="217" y="166" width="81" height="50" fill="#120f15"/>
    <circle cx="257" cy="188" r="13" fill="#ad9caf"/><path d="M241 210q16-16 32 0" fill="#68516b"/>
    <rect x="286" y="202" width="34" height="22" rx="4" fill="#14151b" stroke="#767d91"/>
    <circle cx="303" cy="213" r="5" fill="#9472c0"/>
    <circle cx="92" cy="224" r="58" fill="url(#c2moon)"/>
    <g transform="translate(88 207)"><path d="M0 25C-38 13-37-25-8-34c6 19 20 20 28 0 28 14 31 51 4 63-9 4-17 3-24-4z" fill="#713985" stroke="#c98ee2" stroke-width="3"/><circle cx="-15" cy="-8" r="14" fill="#c08ade"/><circle cx="14" cy="-11" r="15" fill="#b878d3"/><circle cx="0" cy="10" r="16" fill="#cf9ae4"/><circle cx="0" cy="-4" r="7" fill="#4a2d52"/></g>
    <g transform="translate(421 208)"><ellipse cx="0" cy="28" rx="28" ry="17" fill="#0b0a0e"/><circle cx="-4" cy="2" r="18" fill="#0b0a0e"/><path d="M-17-8l5-23 14 19M9-9l13-21 2 26" fill="#0b0a0e"/><path d="M-10 1l7 2M5 1l-6 2" stroke="#e2bd71" stroke-width="3"/><path d="M25 25q28-20 35-2" fill="none" stroke="#0b0a0e" stroke-width="9" stroke-linecap="round"/></g>
    <path d="M318 225c25-34 38-69 22-102M333 225c-4-49 5-78 25-111" fill="none" stroke="#426845" stroke-width="6" opacity=".78"/>
    <g fill="#d9c9df" opacity=".6"><circle cx="191" cy="52" r="2"/><circle cx="327" cy="78" r="1.5"/><circle cx="469" cy="27" r="1.5"/><circle cx="285" cy="118" r="1.4"/></g>
  `);

  const VP_PORTRAITS={
    morven:vpSvg(`<defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="#48334f"/><stop offset="1" stop-color="#0b090e"/></linearGradient></defs><rect width="80" height="96" rx="14" fill="url(#p)"/><circle cx="40" cy="49" r="26" fill="#09090c"/><path d="M20 32L27 9l14 19M60 32L53 9 40 28" fill="#09090c"/><path d="M28 47l9 3M52 47l-9 3" stroke="#ddb46c" stroke-width="3"/><circle cx="33" cy="46" r="2" fill="#f2d894"/><circle cx="47" cy="46" r="2" fill="#f2d894"/><path d="M40 51l-3 4h6z" fill="#94717d"/><path d="M27 60q13 11 26 0" fill="none" stroke="#25232c"/><circle cx="40" cy="48" r="34" fill="none" stroke="#9c73ad" opacity=".28"/>`,'0 0 80 96'),
    liora:vpSvg(`<defs><linearGradient id="l" x2="0" y2="1"><stop stop-color="#536b91"/><stop offset="1" stop-color="#11131a"/></linearGradient></defs><rect width="80" height="96" rx="14" fill="url(#l)"/><circle cx="40" cy="35" r="18" fill="#d7b5a7"/><path d="M21 38q1-30 22-28 22 2 18 34l-8-11-27 8z" fill="#252433"/><path d="M18 96q4-39 22-39t22 39" fill="#263a5c"/><path d="M29 63l11 13 11-13" fill="none" stroke="#d5bb73" stroke-width="3"/><circle cx="40" cy="35" r="29" fill="none" stroke="#aac7ef" opacity=".2"/>`,'0 0 80 96'),
    selesta:vpSvg(`<defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="#486a59"/><stop offset="1" stop-color="#101512"/></linearGradient></defs><rect width="80" height="96" rx="14" fill="url(#s)"/><circle cx="40" cy="35" r="18" fill="#d2aa9c"/><path d="M20 39q0-31 20-31 24 0 21 35l-10-16-26 17z" fill="#342722"/><path d="M17 96q5-40 23-40t23 40" fill="#314d3e"/><path d="M40 61v24M28 73h24" stroke="#90c59f" stroke-width="3" opacity=".7"/>`,'0 0 80 96'),
    eren:vpSvg(`<defs><linearGradient id="e" x2="0" y2="1"><stop stop-color="#5a334c"/><stop offset="1" stop-color="#110b11"/></linearGradient></defs><rect width="80" height="96" rx="14" fill="url(#e)"/><circle cx="40" cy="35" r="18" fill="#c7a393"/><path d="M18 35q5-29 25-27 22 3 20 30l-13-12-27 15z" fill="#19151b"/><path d="M16 96q6-40 24-40t24 40" fill="#392234"/><path d="M39 63l-8 15 12-3-2 14 10-22-10 4z" fill="#b66b9a"/>`,'0 0 80 96'),
    nika:vpSvg(`<defs><linearGradient id="n" x2="0" y2="1"><stop stop-color="#5b526b"/><stop offset="1" stop-color="#121018"/></linearGradient></defs><rect width="80" height="96" rx="14" fill="url(#n)"/><circle cx="40" cy="35" r="18" fill="#d5ad9b"/><path d="M20 39q1-31 22-30 22 1 19 34l-9-14-28 15z" fill="#3f2d36"/><path d="M17 96q5-40 23-40t23 40" fill="#454052"/><circle cx="40" cy="73" r="8" fill="none" stroke="#b2a8c5" stroke-width="3"/>`,'0 0 80 96')
  };
  function vpInsertArt(node,kind){if(!node||node.querySelector(':scope > .vp-art')||!VP_ART[kind])return;node.insertAdjacentHTML('afterbegin',`<div class="vp-art">${VP_ART[kind]}</div>${vpDust()}`);}
  function vpMorwenMark(){return `<div class="vp-morwen-mark">${VP_PORTRAITS.morven}</div>`;}
  function visualPassDecorate(){
    document.body.classList.add('visual-pass-v11');
    document.querySelectorAll('.home-scene').forEach(n=>{vpInsertArt(n,'home');if(!n.querySelector('.vp-morwen-mark'))n.insertAdjacentHTML('beforeend',vpMorwenMark());});
    document.querySelectorAll('.c2-visual.c2-room').forEach(n=>vpInsertArt(n,'c2home'));
    document.querySelectorAll('.ux-scene.apartment,.c2-location-scene.apartment').forEach(n=>vpInsertArt(n,'apartment'));
    document.querySelectorAll('.ux-scene.shop,.c2-location-scene.shop').forEach(n=>vpInsertArt(n,'shop'));
    document.querySelectorAll('.ux-scene.yard,.c2-location-scene.yard').forEach(n=>vpInsertArt(n,'yard'));
    document.querySelectorAll('.ux6-scene.square').forEach(n=>vpInsertArt(n,'square'));
    document.querySelectorAll('.ux6-scene.archive').forEach(n=>vpInsertArt(n,'archive'));
    document.querySelectorAll('.ux6-scene.roof').forEach(n=>vpInsertArt(n,'roof'));
    document.querySelectorAll('.ux-danger-scene').forEach(n=>vpInsertArt(n,'c2danger'));
    document.querySelectorAll('.ux6-training-scene').forEach(n=>vpInsertArt(n,'training'));
    document.querySelectorAll('.ux6-danger-scene').forEach(n=>vpInsertArt(n,'c3danger'));
    document.querySelectorAll('.c3-arena').forEach(n=>vpInsertArt(n,'c3battle'));
    document.querySelectorAll('.c3-scene').forEach(n=>vpInsertArt(n,'square'));
    document.querySelectorAll('.c2-enemy').forEach(n=>{if(!n.querySelector('.vp-ivy-portrait'))n.insertAdjacentHTML('afterbegin',`<div class="vp-ivy-portrait">${VP_ART.c2battle}</div>`)});
    document.querySelectorAll('.companion-card').forEach(card=>{const p=card.querySelector('.companion-portrait');if(!p||p.dataset.vpDone)return;const t=(card.textContent||'').toLowerCase();const key=t.includes('морвен')?'morven':t.includes('лиора')?'liora':t.includes('селеста')?'selesta':t.includes('эрен')?'eren':t.includes('ника')?'nika':null;if(key){p.innerHTML=VP_PORTRAITS[key];p.dataset.vpDone='1';}});
  }
  const renderStartVisualPrev=renderStart;
  renderStart=function(){
    removeUX5Coach?.();ux5UpdateAppHeight?.();
    document.body.classList.remove('ux5-game-mode');document.body.classList.add('ux5-start-mode','visual-pass-v11');
    const existing=readSave();
    const preview=existing?`<div class="save-preview"><strong>${escapeHtml(existing.profile.heroName)} · уровень ${existing.profile.heroLevel}</strong><span>${existing.progression.chapters.chapter_04_bitter_recipe?.status==='completed'?'Уровни 2–4 завершены':existing.progression.chapters.chapter_03_first_light?.status==='completed'?'Уровни 2–3 завершены':'Прогресс сохранён'} · ${formatDate(existing.updatedAt)}</span></div>`:'';
    app.innerHTML=`<section class="start-screen"><div class="vp-start-art">${VP_ART.roof}<div class="vp-start-runes"></div></div><div class="brand-kicker">Magic RPG · urban dark fantasy</div><div class="start-copy"><span class="release-badge">Chapter 4 · v1.2.2</span><h1 class="start-title">Между светом<br>и тьмой</h1><p class="start-subtitle">Единая связанная сборка: главы 2–4, Селеста, расширенная алхимия, расследование подмены и бой с Алхимическим голодом.</p><div class="start-actions">${preview}${existing?'<button class="primary-button" data-action="continue-game">Продолжить</button>':''}<button class="${existing?'secondary-button':'primary-button'}" data-action="new-game">${existing?'Начать заново':'Создать героя'}</button></div><p class="release-notes">Глава 4 встроена в общее сохранение. Боёвка сохранена в прежнем формате; добавлены понятные цели, причины блокировки действий и защита от тупиков.</p><div class="mobile-hardfix-note">Если ты открыл именно эту версию, ты сразу увидишь крупный баннер v1.4.2, новый прямой арт в <b>Доме родителей</b>, новый фон сцен расследования и отдельный большой арт-блок на экране алхимии.</div><div class="version-line hardfix-version">Project v2.0 · PWA Asset Build · ${CONTENT_VERSION}</div></div></section>`;
  };
  const renderGameVisualPrev=renderGame;
  renderGame=function(){renderGameVisualPrev();requestAnimationFrame(visualPassDecorate);};

  if (globalThis.__MAGIC_RPG_TEST__) {
    globalThis.__magicTest={
      createDefaultSave,migrateSave,createChapter2State,createC2BattleState,normalizeC2Battle,renderGame,renderChapter2,calculateC2Potion,initC2Battle,
      useC2BattleAction,chooseC2Root,chooseC2Target,endC2Turn,applyC2Resolution,claimC2Pull,finishC2,
      createPart3Meta,createIncidentState,normalizeIncidentState,ensurePart3Unlocks,createIncidentBattle,normalizeIncidentBattle,incidentUseAction,incidentBreakLink,incidentTeamAction,incidentEndTurn,incidentFinal,applyIncidentRewards,craftMixture,
      createChapter3State,normalizeChapter3State,createChapter3Battle,normalizeChapter3Battle,ensurePart4Unlocks,c3UseAction,c3EndTurn,c3BanishReason,applyChapter3Resolution,resetChapter3,
      ensureUX5State,createUX5Investigation,ux5CanDeduce,ux5ApplyMethod,ux5ConfirmHypothesis,ux5FinishDanger,UX5_LOCATIONS,UX5_HYPOTHESES,
      ensureUX6State,createUX6Investigation,ux6CanDeduce,ux6CanEmergencyDeduce,ux6CanProceedToDeduction,ux6HasCoreEvidence,ux6ResetInvestigation,UX6_LOCATIONS,UX6_HYPOTHESES,
      setSave(value,screen='home'){save=ensureUX5State(value);currentScreen=screen;},getSave(){return save;},getHtml(){return app.innerHTML;},canC2Purify,c2PurifyReason,incidentFinalReason
    };
  }


  /* =========================================================
     ART PASS v2 — embedded illustration pack
     ========================================================= */
  const ART_V2_VERSION='2.0';
  const artV2Svg=(body,view='0 0 520 300')=>`<svg viewBox="${view}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const ART_V2={
    c4hero:artV2Svg(`<defs><linearGradient id="a" x2="0" y2="1"><stop stop-color="#30483f"/><stop offset=".62" stop-color="#17231f"/><stop offset="1" stop-color="#090d0c"/></linearGradient><radialGradient id="g"><stop stop-color="#8fdbb0" stop-opacity=".42"/><stop offset="1" stop-color="#8fdbb0" stop-opacity="0"/></radialGradient></defs><rect width="520" height="300" fill="url(#a)"/><rect y="218" width="520" height="82" fill="#090d0c"/><path d="M26 64h210v157H26z" fill="#171c19" stroke="#5c7668"/><path d="M42 84h177M42 126h177M42 168h177" stroke="#45594f" stroke-width="5"/><g fill="#7ea68c"><circle cx="66" cy="76" r="20"/><circle cx="176" cy="73" r="23"/></g><g fill="#84607f"><rect x="50" y="92" width="20" height="28"/><rect x="78" y="95" width="15" height="25"/><rect x="112" y="89" width="23" height="31"/></g><circle cx="348" cy="130" r="105" fill="url(#g)"/><path d="M290 230h140v-82H290z" fill="#1d2521" stroke="#6d8c7c"/><path d="M322 148q30-45 60 0v82h-60z" fill="#26342e"/><circle cx="352" cy="121" r="25" fill="#c6a79a"/><path d="M326 122q4-41 31-38 28 4 24 43l-14-18-34 19z" fill="#352821"/><path d="M349 153v58M327 178h44" stroke="#94cfaa" stroke-width="4" opacity=".72"/><g fill="#b391d0" opacity=".6"><circle cx="270" cy="66" r="3"/><circle cx="451" cy="84" r="2"/><circle cx="404" cy="45" r="2"/></g>`),
    warehouse:artV2Svg(`<defs><linearGradient id="w" x2="0" y2="1"><stop stop-color="#31433e"/><stop offset=".65" stop-color="#17221f"/><stop offset="1" stop-color="#090d0c"/></linearGradient><radialGradient id="wg"><stop stop-color="#d3a975" stop-opacity=".35"/><stop offset="1" stop-color="#d3a975" stop-opacity="0"/></radialGradient></defs><rect width="520" height="260" fill="url(#w)"/><rect y="201" width="520" height="59" fill="#080b0a"/><path d="M28 43h464v165H28z" fill="#151b18" stroke="#5c6a63"/><path d="M46 64h140v119H46zM208 64h125v119H208zM355 64h116v119H355z" fill="#202923" stroke="#4d5b53"/><g fill="#5f4737"><rect x="61" y="104" width="48" height="63"/><rect x="115" y="116" width="51" height="51"/><rect x="224" y="91" width="49" height="76"/><rect x="281" y="116" width="36" height="51"/></g><circle cx="410" cy="126" r="72" fill="url(#wg)"/><path d="M390 94h38v58h-38z" fill="#40352a" stroke="#cfaa72"/><path d="M399 83h20v16h-20z" fill="#6a5540"/><path d="M397 121q12-17 24 0q-12 17-24 0z" fill="#a84f67"/>`,'0 0 520 260'),
    lab:artV2Svg(`<defs><linearGradient id="l" x2="0" y2="1"><stop stop-color="#2b3e37"/><stop offset=".6" stop-color="#17241f"/><stop offset="1" stop-color="#080c0a"/></linearGradient><radialGradient id="lg"><stop stop-color="#b76ce0" stop-opacity=".6"/><stop offset="1" stop-color="#b76ce0" stop-opacity="0"/></radialGradient></defs><rect width="520" height="260" fill="url(#l)"/><rect y="205" width="520" height="55" fill="#090d0b"/><path d="M30 49h460v160H30z" fill="#161d19" stroke="#547060"/><path d="M44 72h172M44 119h172M304 72h172M304 119h172" stroke="#485b50" stroke-width="5"/><g fill="#806071"><rect x="60" y="82" width="18" height="30"/><rect x="86" y="88" width="22" height="24"/><rect x="126" y="79" width="16" height="33"/></g><circle cx="258" cy="139" r="90" fill="url(#lg)"/><path d="M216 202h84l-13-78h-58z" fill="#2a1d31" stroke="#b880dc" stroke-width="3"/><ellipse cx="258" cy="124" rx="29" ry="10" fill="#d69cf0" opacity=".72"/><path d="M241 91h34l-6 34h-22z" fill="#44304f" stroke="#b77ad7"/>`,'0 0 520 260'),
    greenhouse:artV2Svg(`<defs><linearGradient id="q" x2="0" y2="1"><stop stop-color="#29423a"/><stop offset=".58" stop-color="#172b22"/><stop offset="1" stop-color="#090f0c"/></linearGradient><radialGradient id="m"><stop stop-color="#dce8dc" stop-opacity=".5"/><stop offset="1" stop-color="#dce8dc" stop-opacity="0"/></radialGradient></defs><rect width="520" height="260" fill="url(#q)"/><circle cx="430" cy="52" r="55" fill="url(#m)"/><path d="M44 198V58h432v140" fill="none" stroke="#6a8072" stroke-width="5"/><path d="M98 198V58M175 198V58M252 198V58M329 198V58M406 198V58" stroke="#455d50" stroke-width="3"/><path d="M0 260c42-104 95-96 145-166M88 260c44-91 105-95 159-174M220 260c37-90 88-88 139-168M520 260c-49-99-112-89-165-164" fill="none" stroke="#46794c" stroke-width="14"/><g fill="#a06a99"><circle cx="122" cy="156" r="18"/><circle cx="284" cy="128" r="20"/><circle cx="397" cy="165" r="17"/></g>`,'0 0 520 260'),
    hunger:artV2Svg(`<defs><radialGradient id="h"><stop stop-color="#b16ed0" stop-opacity=".7"/><stop offset="1" stop-color="#b16ed0" stop-opacity="0"/></radialGradient></defs><rect width="150" height="150" fill="transparent"/><circle cx="75" cy="75" r="72" fill="url(#h)"/><path d="M75 132C25 117 20 65 48 34c8 18 19 20 28 1 14 18 27 18 39 0 29 29 21 82-40 97z" fill="#17111c" stroke="#9d65b5" stroke-width="3"/><path d="M47 58q28 24 56 0M52 93q23-20 46 0" fill="none" stroke="#cf94df" stroke-width="4"/><g fill="#dba9e6"><circle cx="53" cy="75" r="5"/><circle cx="97" cy="75" r="5"/></g>`,'0 0 150 150'),
    root:artV2Svg(`<defs><radialGradient id="r"><stop stop-color="#7eb07f" stop-opacity=".62"/><stop offset="1" stop-color="#7eb07f" stop-opacity="0"/></radialGradient></defs><rect width="120" height="140" fill="transparent"/><circle cx="60" cy="68" r="58" fill="url(#r)"/><path d="M61 131C15 104 19 43 44 19c6 17 17 22 25 2 25 16 34 71 8 104-6 7-11 9-16 6z" fill="#18281a" stroke="#67976a" stroke-width="3"/><path d="M57 25c-9 29 17 32-5 55 25-8 24 20 42 17M50 78c-23 9-21 31-32 43" fill="none" stroke="#8db784" stroke-width="4"/>`,'0 0 120 140'),
    ritualist:artV2Svg(`<defs><radialGradient id="z"><stop stop-color="#bc75dc" stop-opacity=".65"/><stop offset="1" stop-color="#bc75dc" stop-opacity="0"/></radialGradient></defs><rect width="150" height="150" fill="transparent"/><circle cx="75" cy="72" r="70" fill="url(#z)"/><path d="M37 137q10-82 38-101 30 20 39 101z" fill="#17101c" stroke="#9361aa" stroke-width="3"/><path d="M50 61l25-35 25 35-25 21z" fill="#26172f" stroke="#b578cf"/><circle cx="75" cy="57" r="11" fill="#1a111e"/><path d="M69 56h12" stroke="#e2a8ed" stroke-width="3"/><path d="M44 108h62M52 94h46" stroke="#805292" stroke-width="3"/>`,'0 0 150 150')
  };
  ART_V2.c2home=VP_ART.c2home;
  ART_V2.apartment=VP_ART.apartment;
  ART_V2.shop=VP_ART.shop;
  ART_V2.yard=VP_ART.yard;
  ART_V2.c2alchemy=artV2Svg(`<defs><linearGradient id="ca" x2="0" y2="1"><stop stop-color="#332444"/><stop offset=".58" stop-color="#17111f"/><stop offset="1" stop-color="#09070c"/></linearGradient><radialGradient id="cg"><stop stop-color="#bf77ed" stop-opacity=".6"/><stop offset="1" stop-color="#bf77ed" stop-opacity="0"/></radialGradient></defs><rect width="520" height="260" fill="url(#ca)"/><rect y="204" width="520" height="56" fill="#08070b"/><path d="M34 53h452v154H34z" fill="#17141b" stroke="#5f4a69"/><path d="M53 76h132M53 121h132M336 76h132M336 121h132" stroke="#4f4156" stroke-width="5"/><g fill="#8d657d"><rect x="68" y="87" width="19" height="25"/><rect x="95" y="82" width="24" height="30"/><rect x="129" y="90" width="17" height="22"/></g><circle cx="262" cy="132" r="92" fill="url(#cg)"/><path d="M218 203h90l-15-88h-60z" fill="#24162b" stroke="#cf8cf0" stroke-width="3"/><ellipse cx="263" cy="113" rx="36" ry="12" fill="#dfa7ff" opacity=".78"/><path d="M242 74c9 16-8 22 0 36 15-10 28 11 35 24 7-14 18-27 31-26-11-17 4-24-3-38" fill="none" stroke="#efc9ff" stroke-width="4" stroke-linecap="round"/><g fill="#d7b46c"><circle cx="400" cy="171" r="8"/><circle cx="423" cy="153" r="6"/><circle cx="439" cy="181" r="5"/></g>`,'0 0 520 260');

  const ART_V2_PORTRAITS={
    morven:VP_PORTRAITS.morven,
    liora:VP_PORTRAITS.liora,
    celeste:VP_PORTRAITS.selesta,
    selesta:VP_PORTRAITS.selesta,
    eren:VP_PORTRAITS.eren,
    nika:VP_PORTRAITS.nika
  };
  const artV2Data=(svg)=>`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  function artV2Insert(node,key){
    if(!node||node.querySelector(':scope > .vp-art-v2'))return;
    const artV3=ART_V3_SCENES[key];
    if(artV3){node.insertAdjacentHTML('afterbegin',`<div class="vp-art-v2 art-v3"><img src="${artV3}" alt="" loading="eager"></div>`);return;}
    const src=EXTERNAL_ASSETS[key];
    if(src){node.insertAdjacentHTML('afterbegin',`<div class="vp-art-v2"><img src="${src}" alt="" loading="lazy"></div>`);return;}
    if(ART_V2[key])node.insertAdjacentHTML('afterbegin',`<div class="vp-art-v2">${ART_V2[key]}</div>`);
  }
  function artV2Decorate(){
    document.body.classList.add('art-pass-v2');
    document.body.style.setProperty('--artv2-hunger',`url("${EXTERNAL_ASSETS.hunger}")`);
    document.body.style.setProperty('--artv2-root',`url("${EXTERNAL_ASSETS.root}")`);
    document.body.style.setProperty('--artv2-ritualist',`url("${EXTERNAL_ASSETS.ritualist}")`);
    document.body.style.setProperty('--artv2-morven',`url("${EXTERNAL_ASSETS.morven}")`);
    document.querySelectorAll('.c2-visual.c2-room').forEach(n=>artV2Insert(n,'c2home'));
    document.querySelectorAll('.c2-location-scene.apartment').forEach(n=>artV2Insert(n,'apartment'));
    document.querySelectorAll('.c2-location-scene.shop').forEach(n=>artV2Insert(n,'shop'));
    document.querySelectorAll('.c2-location-scene.yard').forEach(n=>artV2Insert(n,'yard'));
    document.querySelectorAll('.c2-alchemy-hero').forEach(n=>artV2Insert(n,'c2alchemy'));
    document.querySelectorAll('.c4-hero').forEach(n=>artV2Insert(n,'c4hero'));
    document.querySelectorAll('.c4-invest-scene.warehouse').forEach(n=>artV2Insert(n,'warehouse'));
    document.querySelectorAll('.c4-invest-scene.lab').forEach(n=>artV2Insert(n,'lab'));
    document.querySelectorAll('.c4-invest-scene.greenhouse').forEach(n=>artV2Insert(n,'greenhouse'));
    document.querySelectorAll('.companion-card').forEach(card=>{const p=card.querySelector('.companion-portrait');if(!p||p.dataset.artv2)return;const t=(card.textContent||'').toLowerCase();const key=card.dataset.companion||(t.includes('морвен')?'morven':t.includes('лиора')?'liora':t.includes('селест')?'celeste':t.includes('эрен')?'eren':t.includes('ника')?'nika':null);if(key&&ART_V3_PORTRAITS[key]){p.innerHTML=`<img class="art-v3-portrait" src="${ART_V3_PORTRAITS[key]}" alt="">`;p.dataset.artv2='1';}else if(key&&ART_V2_PORTRAITS[key]){p.innerHTML=`<div class="artv2-portrait">${ART_V2_PORTRAITS[key]}</div>`;p.dataset.artv2='1';}});
    document.querySelectorAll('.party-slot').forEach(slot=>{const p=slot.querySelector('.party-avatar');if(!p||p.dataset.artv2)return;const t=(slot.textContent||'').toLowerCase();const key=t.includes('морвен')?'morven':t.includes('лиора')?'liora':t.includes('селест')?'celeste':t.includes('эрен')?'eren':t.includes('ника')?'nika':null;if(key&&ART_V3_PORTRAITS[key]){p.innerHTML=`<img class="art-v3-portrait" src="${ART_V3_PORTRAITS[key]}" alt="">`;p.dataset.artv2='1';}else if(key&&ART_V2_PORTRAITS[key]){p.innerHTML=`<div class="artv2-portrait">${ART_V2_PORTRAITS[key]}</div>`;p.dataset.artv2='1';}});
  }
  const artV2RenderGame=renderGame;
  renderGame=function(){artV2RenderGame();requestAnimationFrame(()=>requestAnimationFrame(artV2Decorate));};
  const artV2RenderStart=renderStart;
  renderStart=function(){artV2RenderStart();document.body.classList.add('art-pass-v2');};

  renderStart();

  /* =========================================================
     VISUAL HOTFIX v1.1.2 — interaction safety
     ========================================================= */
  function v112ApplyCompanionAction(actor){
    const inc=save?.incidents?.bus_stop_flowers;
    const b=normalizeIncidentBattle(inc?.battle);
    if(!b||b.status!=='active'||b.teamUsed)return;
    b.teamUsed=true;
    if(actor==='morven'){
      const hidden=Object.values(b.links).find(l=>!l.revealed);
      if(hidden){hidden.revealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push('Морвен раскрывает скрытую Связь.');}
      else {b.resonance=Math.min(6,b.resonance+1);b.log.push('Морвен подтверждает намерение и усиливает Резонанс.');}
    } else {
      const c=selectedCompanion();
      const type=c&&companionBonuses[c.id]?.battle;
      if(type==='shield'){b.shield+=1;b.log.push(`${c.name} создаёт защитный Покров.`);}
      else if(type==='energy'){b.energy=Math.min(b.maxEnergy,b.energy+2);b.log.push(`${c.name} возвращает энергию.`);}
      else if(type==='reveal'){for(const l of incidentLinks(b))l.revealed=true;b.resonance=Math.min(6,b.resonance+1);b.log.push(`${c.name} раскрывает все Связи.`);}
      else if(type==='weaken'){b.pokrov=Math.max(0,b.pokrov-1);b.resonance=Math.min(6,b.resonance+1);b.log.push(`${c.name} ослабляет Покров.`);}
      else {b.resonance=Math.min(6,b.resonance+1);b.log.push(c?`${c.name} поддерживает ритуал.`:'Командное действие выполнено.');}
    }
    inc.battle=b;incidentSave(null);
  }

  function v112EnhanceBattleUI(){
    try{
      const party=document.querySelector('.inc-party');
      if(party&&save?.incidents?.bus_stop_flowers?.stage==='battle'){
        const b=save.incidents.bus_stop_flowers.battle=normalizeIncidentBattle(save.incidents.bus_stop_flowers.battle);
        b.uiTab=b.uiTab||'hero';
        const companion=selectedCompanion();
        [...party.children].forEach((node,index)=>{
          const tab=index===0?'hero':index===1?'morven':'companion';
          node.dataset.v112Tab=tab;node.setAttribute('role','button');node.setAttribute('tabindex',tab==='companion'&&!companion?'-1':'0');
          node.classList.toggle('v112-active',b.uiTab===tab);
          node.classList.toggle('v112-disabled',tab==='companion'&&!companion);
        });
        const wrap=document.querySelector('.inc-actions-wrap');
        const head=wrap?.querySelector('.inc-actions-head b');
        const heroButtons=[...document.querySelectorAll('.inc-action[data-action="incident-battle-action"],.inc-action[data-action="incident-final"]')];
        const teamButtons=[...document.querySelectorAll('.inc-action[data-action="incident-team-action"]')];
        const hero=b.uiTab==='hero';
        heroButtons.forEach(x=>x.style.display=hero?'':'none');
        teamButtons.forEach((x,i)=>x.style.display=(!hero&&i===0)?'':'none');
        if(head)head.textContent=hero?'Действия героя':b.uiTab==='morven'?'Действие Морвена':`Действие ${companion?.name||'спутника'}`;
        const firstTeam=teamButtons[0];
        if(firstTeam&&!hero){
          firstTeam.dataset.v112Actor=b.uiTab;
          const name=firstTeam.querySelector('b'),desc=firstTeam.querySelector('span');
          if(b.uiTab==='morven'){
            if(name)name.textContent='Хищное внимание';
            if(desc)desc.textContent='Раскрыть скрытую Связь; если всё раскрыто — получить 1 Резонанс.';
          } else if(companion){
            if(name)name.textContent=companionBonuses[companion.id]?.title||companion.name;
            if(desc)desc.textContent=companionBonuses[companion.id]?.short||'Поддержать ритуал.';
          }
        }
        if(wrap&&!wrap.querySelector('.v112-team-note')&&!hero){
          wrap.insertAdjacentHTML('afterbegin','<div class="v112-team-note">У спутников одно общее командное действие на раунд. Выберите, кто его использует.</div>');
        }
      }
      document.querySelectorAll('.c3-units .c3-unit').forEach((node,index)=>{
        node.dataset.v112C3Tab=['hero','liora','morven'][index]||'hero';node.setAttribute('role','button');node.setAttribute('tabindex','0');
      });
    }catch(err){console.warn('v1.1.2 UI enhancer',err)}
  }

  document.addEventListener('click',function(event){
    const incidentTab=event.target.closest?.('[data-v112-tab]');
    if(incidentTab){
      event.preventDefault();event.stopImmediatePropagation();
      const tab=incidentTab.dataset.v112Tab;
      if(tab==='companion'&&!selectedCompanion())return toast('Сначала добавьте второго спутника в отряд.');
      const b=save.incidents.bus_stop_flowers.battle=normalizeIncidentBattle(save.incidents.bus_stop_flowers.battle);b.uiTab=tab;incidentSave(null);return;
    }
    const team=event.target.closest?.('[data-action="incident-team-action"][data-v112-actor]');
    if(team){event.preventDefault();event.stopImmediatePropagation();v112ApplyCompanionAction(team.dataset.v112Actor);return;}
    const c3unit=event.target.closest?.('[data-v112-c3-tab]');
    if(c3unit&&save?.chapter3?.stage==='battle'){
      event.preventDefault();event.stopImmediatePropagation();
      save.chapter3.battle=normalizeChapter3Battle(save.chapter3.battle);save.chapter3.battle.tab=c3unit.dataset.v112C3Tab;chapter3Save(null);return;
    }
  },true);
  document.addEventListener('keydown',function(event){if((event.key==='Enter'||event.key===' ')){const t=event.target.closest?.('[data-v112-tab],[data-v112-c3-tab]');if(t){event.preventDefault();t.click();}}});
  const v112Observer=new MutationObserver(()=>requestAnimationFrame(v112EnhanceBattleUI));
  v112Observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  requestAnimationFrame(v112EnhanceBattleUI);

})();
