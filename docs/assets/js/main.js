(() => {
  'use strict';

  const root = document.documentElement;
  const store = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ============ 主题：与 XUComer 软件配色同步 ============ */
  const FALLBACK = [
    { id: 'dark.midnight', zh: '午夜蓝', en: 'Midnight', panel: '#1c1d21', card: '#24262b', accent: '#4f8cff', text: '#eceef2', sub: '#9aa3b2', line: '#2e3138', input: '#1f2126' },
    { id: 'dark.carbon', zh: '碳纤青', en: 'Carbon Cyan', panel: '#141619', card: '#1b1e22', accent: '#22d3ee', text: '#eceef2', sub: '#9aa3b2', line: '#262a2f', input: '#181b1f' },
    { id: 'dark.eclipse', zh: '暗夜蓝', en: 'Eclipse', panel: '#111318', card: '#1a1d24', accent: '#5b8cff', text: '#eceef2', sub: '#9aa3b2', line: '#262b34', input: '#171a20' },
    { id: 'dark.acid', zh: '酸性绿', en: 'Acid', panel: '#12140f', card: '#1b1f16', accent: '#a3e635', text: '#eceef2', sub: '#9aa3b2', line: '#272d1f', input: '#171b13' },
    { id: 'light.ice', zh: '冰蓝', en: 'Ice', panel: '#f3f4f7', card: '#ffffff', accent: '#3b82f6', text: '#1b1c20', sub: '#5c6377', line: '#dfe2ea', input: '#eceef3' },
    { id: 'light.paper', zh: '纸白', en: 'Paper', panel: '#f3f4f7', card: '#ffffff', accent: '#2563eb', text: '#1b1c20', sub: '#5c6377', line: '#dfe2ea', input: '#eceef3' },
    { id: 'light.cloud', zh: '云雾', en: 'Cloud', panel: '#eef0f6', card: '#ffffff', accent: '#6366f1', text: '#1b1c20', sub: '#5c6377', line: '#dde1ea', input: '#e8ebf2' },
    { id: 'light.coral', zh: '珊瑚', en: 'Coral', panel: '#fff2f2', card: '#ffffff', accent: '#f43f5e', text: '#1b1c20', sub: '#5c6377', line: '#f2dfe1', input: '#fbe9ea' }
  ];

  let THEMES = FALLBACK;

  function hex2rgb(h) {
    const s = h.replace('#', '');
    const n = s.length === 3 ? s.split('').map(c => c + c).join('') : s;
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  }
  function rgba(h, a) { const c = hex2rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function isLight(h) { const c = hex2rgb(h); return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000 > 150; }

  const THEME_KEY = 'xucomer-theme';

  function applyTheme(t) {
    root.setAttribute('data-theme', t.id);
    root.setAttribute('data-light', isLight(t.panel) ? '1' : '0');
    root.style.setProperty('--panel', t.panel);
    root.style.setProperty('--card', rgba(t.card, .72));
    root.style.setProperty('--card-hover', rgba(t.card, .96));
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-2', t.accent);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--fg', t.text);
    root.style.setProperty('--fg-dim', t.sub);
    root.style.setProperty('--input', t.input);
    root.style.setProperty('--line', rgba(t.text, .12));
    root.style.setProperty('--line-strong', rgba(t.text, .24));
    store.set(THEME_KEY, t.id);
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('on', p.dataset.id === t.id);
    });
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
      m.setAttribute('content', t.panel);
    });
    currentTheme = t;
    syncGuestbook();
  }

  /* ---- 留言板：内嵌独立应用，靠 postMessage 同步主题与语言 ---- */
  const GB_ORIGIN = 'https://xucomer-guestbook.app.workbuddy.host';
  let gbFrame = null;
  let gbLang = 'zh_CN';
  let currentTheme = null;

  /* ---- 开发者登录 ----
     口令本身不出现在任何文件里，页面只保存口令的派生值：
       登录校验值 = sha256('xucomer-login:' + 口令)   ← 只在登录页比对用
       开发者密钥 = sha256('xucomer-dev:'   + 口令)   ← 服务端触发器认这个
     两者互相推不出来，所以即使有人读到登录页的校验值也发不出开发者留言。 */
  const DEV_USER = 'XUComer';
  const LOGIN_HASH = 'c94a647bd6653a157f56f1e8441a2710719d5eace54bb90498e5f7d010d5452d';
  const DEV_STORE = 'xucomer-gb-devkey';

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const dig = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(dig)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const devKeyNow = () => store.get(DEV_STORE, '');

  function gbTheme(t) {
    return {
      light: isLight(t.panel) ? '1' : '0',
      panel: t.panel,
      card: t.card,
      input: t.input,
      accent: t.accent,
      text: t.text,
      dim: t.sub,
      line: t.line
    };
  }

  function createGuestbookFrame() {
    const box = document.getElementById('comments');
    if (!box || gbFrame || !currentTheme) return;

    const q = new URLSearchParams(gbTheme(currentTheme));
    q.set('lang', gbLang);

    const f = document.createElement('iframe');
    f.className = 'gb-frame';
    f.title = 'Guestbook';
    f.loading = 'lazy';
    f.setAttribute('scrolling', 'no');
    f.src = GB_ORIGIN + '/?' + q.toString();
    f.addEventListener('load', () => { syncGuestbook(); });
    box.appendChild(f);
    gbFrame = f;
  }

  function syncGuestbook() {
    if (!currentTheme || !document.getElementById('comments')) return;
    createGuestbookFrame();
    if (!gbFrame || !gbFrame.contentWindow) return;
    gbFrame.contentWindow.postMessage(
      { gb: { theme: gbTheme(currentTheme), lang: gbLang, devkey: devKeyNow() } },
      GB_ORIGIN
    );
  }

  function ensureGuestbook(lang) {
    gbLang = lang || 'zh_CN';
    syncGuestbook();
  }

  window.addEventListener('message', e => {
    if (e.origin !== GB_ORIGIN) return;
    const d = e.data;
    if (!d || !d.gb) return;

    if (d.gb.logout) {                       /* 留言板里点了「退出」 */
      try { localStorage.removeItem(DEV_STORE); } catch (err) {}
      syncGuestbook();
      refreshAdmin();
      return;
    }
    if (!d.gb.height || !gbFrame) return;
    const h = Math.max(320, Math.min(6000, Math.round(d.gb.height)));
    gbFrame.style.height = h + 'px';
  });

  /* ---------------- 登录页 ---------------- */
  function refreshAdmin() {
    const form = document.getElementById('admForm');
    const done = document.getElementById('admDone');
    if (!form || !done) return;
    const on = !!devKeyNow();
    form.hidden = on;
    done.hidden = !on;
  }

  function bindAdmin() {
    const form = document.getElementById('admForm');
    if (!form) return;

    const nameEl = document.getElementById('admName');
    const passEl = document.getElementById('admPass');
    const msgEl = document.getElementById('admMsg');
    const outEl = document.getElementById('admOut');

    const bad = () => {
      const { pack } = tFor(store.get(LANG_KEY, 'system'));
      msgEl.textContent = pack.admBad || 'Wrong credentials.';
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      msgEl.textContent = '';
      const name = (nameEl.value || '').trim();
      const pass = passEl.value || '';
      let loginHash;
      try { loginHash = await sha256('xucomer-login:' + pass); }
      catch (err) { bad(); return; }

      if (name !== DEV_USER || !pass || loginHash !== LOGIN_HASH) { bad(); return; }

      try { store.set(DEV_STORE, await sha256('xucomer-dev:' + pass)); }
      catch (err) { bad(); return; }

      passEl.value = '';
      refreshAdmin();
    });

    if (outEl) outEl.addEventListener('click', () => {
      try { localStorage.removeItem(DEV_STORE); } catch (err) {}
      refreshAdmin();
    });

    refreshAdmin();
  }

  function buildThemePicker() {
    const box = document.getElementById('themePicker');
    if (!box) return;
    const saved = store.get(THEME_KEY, 'dark.midnight');
    box.innerHTML = '';
    THEMES.forEach(t => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pill';
      b.dataset.id = t.id;
      b.title = t.zh + ' · ' + t.en;
      b.setAttribute('aria-label', t.zh);
      b.style.background = t.accent;
      b.addEventListener('click', () => applyTheme(t));
      box.appendChild(b);
    });
    const found = THEMES.find(t => t.id === saved) || THEMES[0];
    applyTheme(found);
    setupPillScroll(box);
  }

  /* 文档页顶栏的色点条放不下 40 个，做成可横向滚动 */
  function setupPillScroll(box) {
    if (!box || box.dataset.scrollReady) return;
    box.dataset.scrollReady = '1';
    const update = (first) => {
      const scrollable = box.scrollWidth - box.clientWidth > 2;
      box.classList.toggle('scrollable', scrollable);
      box.classList.toggle('at-start', box.scrollLeft <= 2);
      box.classList.toggle('at-end', box.scrollLeft + box.clientWidth >= box.scrollWidth - 2);
      const on = box.querySelector('.pill.on');
      if (first && on && scrollable) {
        const l = on.offsetLeft, r = l + on.offsetWidth;
        if (l < box.scrollLeft) box.scrollLeft = l - 8;
        else if (r > box.scrollLeft + box.clientWidth) box.scrollLeft = r - box.clientWidth + 8;
      }
    };
    box.addEventListener('scroll', () => update(false), { passive: true });
    window.addEventListener('resize', () => update(false));
    box.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (box.scrollWidth - box.clientWidth <= 2) return;
      e.preventDefault();
      box.scrollLeft += e.deltaY;
    }, { passive: false });
    update(true);
  }

  fetch('assets/js/themes.json')
    .then(r => (r.ok ? r.json() : null))
    .then(list => { if (Array.isArray(list) && list.length) THEMES = list; })
    .catch(() => {})
    .then(buildThemePicker);

  /* ============ 语言：与软件一致的 18 种 + 跟随系统 ============ */
  const LANGS = [
    ['system', '跟随系统', 'Follow system'],
    ['zh_CN', '简体中文', '简体中文'],
    ['zh_TW', '繁體中文', '繁體中文'],
    ['en', 'English', 'English'],
    ['ja', '日本語', '日本語'],
    ['ko', '한국어', '한국어'],
    ['fr', 'Français', 'Français'],
    ['de', 'Deutsch', 'Deutsch'],
    ['es', 'Español', 'Español'],
    ['pt', 'Português', 'Português'],
    ['ru', 'Русский', 'Русский'],
    ['it', 'Italiano', 'Italiano'],
    ['nl', 'Nederlands', 'Nederlands'],
    ['pl', 'Polski', 'Polski'],
    ['tr', 'Türkçe', 'Türkçe'],
    ['ar', 'العربية', 'العربية'],
    ['th', 'ไทย', 'ไทย'],
    ['vi', 'Tiếng Việt', 'Tiếng Việt'],
    ['id', 'Bahasa Indonesia', 'Bahasa Indonesia']
  ];

  const STRINGS = {
    zh_CN: {
      back: '返回首页', langLabel: '语言', themeLabel: '同步主题',
      nav: { install: '安装', enable: '启用与关闭', pick: '切换音效', volume: '调节音量', test: '试听', demo: '在线演示', up: '抬起音', import: '导入自定义音效', manage: '管理自定义音效', theme: '主题', lang: '语言', appearance: '网页同步设置', tray: '托盘与开机自启', data: '设置保存在哪', faq: '常见问题' },
      groups: { start: '开始使用', sound: '音效', look: '外观', other: '其它' },
      h1: '使用指南', h2demo: '在线演示', h2appearance: '网页同步设置',
      lede: 'XUComer 是一款开源的键盘 / 鼠标按键音效模拟器。它常驻后台，全局监听你的每一次敲击，实时播放对应的按键音。下面按使用顺序把每个功能讲清楚，全部看完约 5 分钟。',
      demoHint: '不想先下载？在下面的输入框里随便敲几个字，网页会用浏览器实时合成按键音，让你先感受一下「按下 / 抬起」的手感。',
      mousePad: '点这里模拟鼠标点击', labelDown: '按下', labelUp: '抬起',
      voice: '音效', volKb: '键盘音量', volMs: '鼠标音量', upOn: '抬起也发声',
      appearanceBody: '本网站的右上角有两个选择器，和软件里的设置一一对应，方便你提前挑好：',
      tag: '让每一次敲击都有回响。',
      meta: 'MIT 许可 · Windows 10 / 11 | x64 / x86',
      guide: '使用方法', dl: '下载', gh: '在 GitHub 上查看',
      x64: '推荐 · 约 110 MB', x86: '32 位 · 约 91 MB',
      docTitle: '使用方法 · XUComer',
      desc: 'XUComer 使用指南：安装、启用、切换音效、导入自定义音效、主题与语言、托盘与自启、常见问题。',
      siteDesc: 'XUComer —— 开源的键盘 / 鼠标按键音效模拟器。MIT 许可，免费，无需联网。',
      padHint: '在这里随便敲几个字试试…',
      comments: '留言板',
      ch1: '留言板',
      chLede: '有问题、有想法，或者只是想说声「不错」？都可以在这里留言。留言保存在云端，公开可见，也不需要注册账号。',
      chTitle: '留言板 · XUComer',
      chDesc: 'XUComer 留言板：提问、提建议、报告问题，或只是打个招呼。',
      chNote: '直接写就行，不用登录，发表后立刻显示。',
      vLinear: 'Linear · 线性轻触', vTactile: 'Tactile · 段落感', vClicky: 'Clicky · 清脆段落', vThock: 'Thock · 闷厚低频',
      admTitle: '开发者登录',
      admLede: '登录后才能以 XUComer 的名义发表留言。普通访客不用登录，直接就能评论。',
      admUser: '用户名',
      admPass: '密码',
      admLogin: '登录',
      admBad: '用户名或密码不对。',
      admOk: '已以开发者身份登录。',
      admGo: '前往留言板',
      admOut: '退出登录',
    },
    en: {
      back: 'Back to home', langLabel: 'Language', themeLabel: 'Synced theme',
      nav: { install: 'Install', enable: 'Enable / disable', pick: 'Switch sound', volume: 'Volume', test: 'Preview', demo: 'Live demo', up: 'Release sound', import: 'Import custom sound', manage: 'Manage custom sounds', theme: 'Themes', lang: 'Languages', appearance: 'Site settings', tray: 'Tray & autostart', data: 'Where settings live', faq: 'FAQ' },
      groups: { start: 'Getting started', sound: 'Sounds', look: 'Appearance', other: 'Other' },
      h1: 'User Guide', h2demo: 'Live demo', h2appearance: 'Site settings',
      lede: 'XUComer is an open-source keyboard / mouse click-sound simulator. It stays in the background, listens globally to every keystroke and plays the matching sound in real time. Here is every feature, in the order you will meet it.',
      demoHint: 'Not ready to download? Type a few words below and the browser will synthesize the click sounds so you can feel the press / release response.',
      mousePad: 'Click here to simulate a mouse click', labelDown: 'presses', labelUp: 'releases',
      voice: 'Sound', volKb: 'Keyboard volume', volMs: 'Mouse volume', upOn: 'Sound on release',
      appearanceBody: 'The two pickers at the top right map one-to-one onto the app settings, so you can decide before installing:',
      tag: 'Every keystroke, with a voice.',
      meta: 'MIT licensed · Windows 10 / 11 | x64 / x86',
      guide: 'User guide', dl: 'Download', gh: 'View on GitHub',
      x64: 'Recommended · ~110 MB', x86: '32-bit · ~91 MB',
      docTitle: 'User Guide · XUComer',
      desc: 'XUComer user guide: install, enable, switch sounds, import your own, themes and languages, tray and autostart, FAQ.',
      siteDesc: 'XUComer — an open-source keyboard & mouse click-sound simulator. MIT licensed, free, works offline.',
      padHint: 'Type a few words here…',
      comments: 'Guestbook',
      ch1: 'Guestbook',
      chLede: '有問題、有想法，或者只是想說聲「不錯」？都可以在這裡留言。留言保存在雲端，公開可見，也不需要註冊帳號。',
      chTitle: 'Guestbook · XUComer',
      chDesc: 'XUComer guestbook: ask questions, share ideas, report issues, or just say hello.',
      chNote: '直接寫就行，不用登入，發表後立刻顯示。',
      vLinear: 'Linear · Smooth', vTactile: 'Tactile · Bump', vClicky: 'Clicky · Crisp', vThock: 'Thock · Deep & muted',
      admTitle: 'Developer sign-in',
      admLede: 'Sign in to post as XUComer. Visitors do not need an account — they can comment right away.',
      admUser: 'Username',
      admPass: 'Password',
      admLogin: 'Sign in',
      admBad: 'Wrong username or password.',
      admOk: 'Signed in as the developer.',
      admGo: 'Go to guestbook',
      admOut: 'Sign out',
    },
    zh_TW: {
      back: '返回首頁', langLabel: '語言', themeLabel: '同步主題',
      nav: { install: '安裝', enable: '啟用與關閉', pick: '切換音效', volume: '調整音量', test: '試聽', demo: '線上示範', up: '回彈音', import: '匯入自訂音效', manage: '管理自訂音效', theme: '主題', lang: '語言', appearance: '網頁同步設定', tray: '托盤與開機自啟', data: '設定檔在哪', faq: '常見問題' },
      groups: { start: '開始使用', sound: '音效', look: '外觀', other: '其它' },
      h1: '使用指南',
      lede: 'XUComer 是一款開源的鍵盤 / 滑鼠按鍵音效模擬器。它常駐背景，全域監聽你的每一次敲擊，即時播放對應的按鍵音。以下按使用順序說明每個功能，全部看完約 5 分鐘。',
      demoHint: '還不想下載？在下面的輸入框裡隨便敲幾個字，網頁會用瀏覽器即時合成按鍵音，讓你先感受「按下 / 抬起」的手感。',
      mousePad: '點這裡模擬滑鼠點擊', labelDown: '按下', labelUp: '抬起',
      voice: '音效', volKb: '鍵盤音量', volMs: '滑鼠音量', upOn: '抬起也發聲',
      appearanceBody: '本網站的右上角有兩個選擇器，和軟體裡的設定一一對應，方便你提前挑好：',
      tag: '讓每一次敲擊都有迴響。',
      meta: 'MIT 授權 · Windows 10 / 11 | x64 / x86',
      guide: '使用說明', dl: '下載', gh: '在 GitHub 上查看',
      x64: '建議 · 約 110 MB', x86: '32 位元 · 約 91 MB',
      docTitle: '使用說明 · XUComer',
      desc: 'XUComer 使用指南：安裝、啟用、切換音效、匯入自訂音效、主題與語言、托盤與自啟、常見問題。',
      siteDesc: 'XUComer —— 開源的鍵盤 / 滑鼠按鍵音效模擬器。MIT 授權，免費，無需連網。',
      padHint: '在這裡隨便敲幾個字試試…',
      comments: '留言板',
      ch1: '留言板',
      chLede: 'Ask a question, share an idea, or just say hi. Comments are stored in the cloud and visible to everyone — no account needed.',
      chTitle: '留言板 · XUComer',
      chDesc: 'XUComer 留言板：提問、提供建議、回報問題，或只是打聲招呼。',
      chNote: 'Just write and post — no sign-in required.',
      vLinear: 'Linear · 線性輕觸', vTactile: 'Tactile · 段落感', vClicky: 'Clicky · 清脆段落', vThock: 'Thock · 悶厚低頻',
      admTitle: '開發者登入',
      admLede: '登入後才能以 XUComer 的名義發表留言。一般訪客不必登入，直接就能留言。',
      admUser: '使用者名稱',
      admPass: '密碼',
      admLogin: '登入',
      admBad: '使用者名稱或密碼錯誤。',
      admOk: '已以開發者身分登入。',
      admGo: '前往留言板',
      admOut: '登出',
    },
    ja: {
      back: 'ホームに戻る', langLabel: '言語', themeLabel: 'テーマ同期',
      nav: { install: 'インストール', enable: '有効 / 無効', pick: 'サウンド切替', volume: '音量', test: '試聴', demo: 'オンラインデモ', up: '離す音', import: 'カスタム音を読み込む', manage: 'カスタム音の管理', theme: 'テーマ', lang: '言語', appearance: 'サイト設定', tray: 'トレイと自動起動', data: '設定の保存先', faq: 'よくある質問' },
      groups: { start: 'はじめに', sound: 'サウンド', look: '外観', other: 'その他' },
      h1: '使い方ガイド',
      lede: 'XUComer はオープンソースのキーボード / マウスクリック音シミュレーターです。バックグラウンドで常駐し、すべてのキー入力を監視して対応する音をリアルタイムで再生します。機能を順に解説します。所要約 5 分。',
      demoHint: 'まだダウンロードしなくて大丈夫。下の入力欄に何か打ち込めば、ブラウザがクリック音を合成して「押す / 離す」の感覚を体験できます。',
      mousePad: 'ここをクリックしてマウスクリックを再現', labelDown: '押下', labelUp: '離す',
      voice: 'サウンド', volKb: 'キーボード音量', volMs: 'マウス音量', upOn: '離すときも音を鳴らす',
      appearanceBody: 'サイト右上の 2 つのピッカーはアプリの設定と一対一で対応しています。インストール前に選んでおけます：',
      tag: 'すべての打鍵に、響きを。',
      meta: 'MIT ライセンス · Windows 10 / 11 | x64 / x86',
      guide: '使い方', dl: 'ダウンロード', gh: 'GitHub で見る',
      x64: '推奨 · 約 110 MB', x86: '32 ビット · 約 91 MB',
      docTitle: '使い方 · XUComer',
      desc: 'XUComer 使い方ガイド：インストール、有効化、サウンド切替、カスタム音の読み込み、テーマと言語、トレイと自動起動、よくある質問。',
      siteDesc: 'XUComer —— オープンソースのキーボード / マウスクリック音シミュレーター。MIT ライセンス、無料、オフラインで動作。',
      padHint: 'ここに何か打ち込んでみてください…',
      comments: '掲示板',
      ch1: '掲示板',
      chLede: '質問やアイデア、「いいね」の一言でも大歓迎です。コメントはクラウドに保存され、誰でも見られます。アカウント登録は不要です。',
      chTitle: '掲示板 · XUComer',
      chDesc: 'XUComer 掲示板：質問、提案、不具合報告、そして挨拶まで。',
      chNote: 'ログイン不要。書いたらそのまま投稿できます。',
      vLinear: 'Linear · リニア', vTactile: 'Tactile · タクタイル', vClicky: 'Clicky · クリッキー', vThock: 'Thock · 低音ソフト',
      admTitle: '開発者ログイン',
      admLede: 'XUComer として投稿するにはログインが必要です。通常の訪問者はログイン不要で投稿できます。',
      admUser: 'ユーザー名',
      admPass: 'パスワード',
      admLogin: 'ログイン',
      admBad: 'ユーザー名またはパスワードが違います。',
      admOk: '開発者としてログインしました。',
      admGo: '掲示板へ',
      admOut: 'ログアウト',
    },
    ko: {
      back: '홈으로', langLabel: '언어', themeLabel: '테마 동기화',
      nav: { install: '설치', enable: '켜기 / 끄기', pick: '효과음 변경', volume: '볼륨', test: '미리 듣기', demo: '온라인 데모', up: '뗄 때 소리', import: '커스텀 효과음 가져오기', manage: '커스텀 효과음 관리', theme: '테마', lang: '언어', appearance: '사이트 설정', tray: '트레이 & 자동 시작', data: '설정 저장 위치', faq: '자주 묻는 질문' },
      groups: { start: '시작하기', sound: '효과음', look: '외관', other: '기타' },
      h1: '사용 설명서',
      lede: 'XUComer는 오픈 소스 키보드 / 마우스 클릭음 시뮬레이터입니다. 백그라운드에서 상주하며 모든 키 입력을 전역으로 감지해 실시간으로 알맞은 소리를 재생합니다. 사용 순서대로 모든 기능을 설명합니다.',
      demoHint: '아직 내려받지 않아도 괜찮습니다. 아래 입력란에 아무거나 입력하면 브라우저가 클릭음을 합성해 「누름 / 뗌」의 느낌을 먼저 보여 줍니다.',
      mousePad: '여기를 클릭해 마우스 클릭을 재현', labelDown: '누름', labelUp: '뗌',
      voice: '효과음', volKb: '키보드 볼륨', volMs: '마우스 볼륨', upOn: '뗄 때도 소리 내기',
      appearanceBody: '사이트 오른쪽 위의 두 선택기는 앱 설정과 일대일로 대응합니다. 설치 전에 미리 골라 두세요：',
      tag: '모든 타건에 울림을.',
      meta: 'MIT 라이선스 · Windows 10 / 11 | x64 / x86',
      guide: '사용 방법', dl: '내려받기', gh: 'GitHub에서 보기',
      x64: '권장 · 약 110 MB', x86: '32비트 · 약 91 MB',
      docTitle: '사용 방법 · XUComer',
      desc: 'XUComer 사용 설명서: 설치, 켜기, 효과음 변경, 커스텀 효과음 가져오기, 테마와 언어, 트레이와 자동 시작, 자주 묻는 질문.',
      siteDesc: 'XUComer —— 오픈 소스 키보드 / 마우스 클릭음 시뮬레이터. MIT 라이센스, 무료, 오프라인 작동.',
      padHint: '여기에 아무거나 입력해 보세요…',
      comments: '방명록',
      ch1: '방명록',
      chLede: '질문, 아이디어, 또는 그냥 인사 한마디라도 환영합니다. 댓글은 클라우드에 저장되어 누구나 볼 수 있고, 계정은 필요 없습니다.',
      chTitle: '방명록 · XUComer',
      chDesc: 'XUComer 방명록: 질문, 제안, 문제 제보, 그리고 인사까지.',
      chNote: '로그인 없이 바로 작성하고 등록할 수 있습니다.',
      vLinear: 'Linear · 리니어', vTactile: 'Tactile · 택타일', vClicky: 'Clicky · 클리키', vThock: 'Thock · 묵직한 저음',
      admTitle: '개발자 로그인',
      admLede: 'XUComer 이름으로 게시하려면 로그인이 필요합니다. 일반 방문자는 로그인 없이 바로 댓글을 남길 수 있습니다.',
      admUser: '사용자 이름',
      admPass: '비밀번호',
      admLogin: '로그인',
      admBad: '사용자 이름 또는 비밀번호가 잘못되었습니다.',
      admOk: '개발자로 로그인했습니다.',
      admGo: '방명록으로 가기',
      admOut: '로그아웃',
    },
    fr: {
      back: 'Retour à l’accueil', langLabel: 'Langue', themeLabel: 'Thème synchronisé',
      nav: { install: 'Installation', enable: 'Activer / désactiver', pick: 'Changer de son', volume: 'Volume', test: 'Aperçu', demo: 'Démo en ligne', up: 'Son au relâchement', import: 'Importer un son', manage: 'Gérer les sons', theme: 'Thèmes', lang: 'Langues', appearance: 'Réglages du site', tray: 'Zone de notification & démarrage', data: 'Emplacement des réglages', faq: 'FAQ' },
      groups: { start: 'Premiers pas', sound: 'Sons', look: 'Apparence', other: 'Autre' },
      h1: 'Guide d’utilisation',
      lede: 'XUComer est un simulateur open source des sons de frappe du clavier et de la souris. Il reste en arrière-plan, écoute chaque touche au niveau système et joue le son correspondant en temps réel. Voici toutes les fonctions, dans l’ordre où vous les rencontrerez.',
      demoHint: 'Pas encore prêt à télécharger ? Tapez quelques mots ci-dessous : le navigateur synthétisera les clics pour vous faire sentir l’appui et le relâchement.',
      mousePad: 'Cliquez ici pour simuler un clic de souris', labelDown: 'appuis', labelUp: 'relâchements',
      voice: 'Son', volKb: 'Volume clavier', volMs: 'Volume souris', upOn: 'Sonner au relâchement',
      appearanceBody: 'Les deux sélecteurs en haut à droite correspondent exactement aux réglages de l’application, pour choisir avant même d’installer :',
      tag: 'Chaque frappe a son écho.',
      meta: 'Licence MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Guide', dl: 'Télécharger', gh: 'Voir sur GitHub',
      x64: 'Recommandé · ~110 Mo', x86: '32 bits · ~91 Mo',
      docTitle: 'Guide · XUComer',
      desc: 'Guide XUComer : installation, activation, changement de son, import de sons, thèmes et langues, zone de notification et démarrage automatique, FAQ.',
      siteDesc: 'XUComer — un simulateur open source des sons de frappe clavier et souris. Licence MIT, gratuit, sans connexion.',
      padHint: 'Tapez quelques mots ici…',
      comments: 'Livre d’or',
      ch1: 'Livre d’or',
      chLede: 'Une question, une idée, ou simplement un petit mot ? Laissez un message ici. Les commentaires sont conservés dans le cloud, visibles par tous — aucun compte requis.',
      chTitle: 'Livre d’or · XUComer',
      chDesc: 'Livre d’or XUComer : questions, suggestions, rapports de bugs, ou simples coucou.',
      chNote: 'Écrivez et publiez directement — aucune connexion requise.',
      vLinear: 'Linear · Linéaire', vTactile: 'Tactile · Tactile', vClicky: 'Clicky · Cliquetis', vThock: 'Thock · Grave et sourd',
      admTitle: 'Connexion développeur',
      admLede: 'Connectez-vous pour publier au nom de XUComer. Les visiteurs n\'ont pas besoin de compte : ils peuvent commenter directement.',
      admUser: 'Nom d\'utilisateur',
      admPass: 'Mot de passe',
      admLogin: 'Se connecter',
      admBad: 'Nom d\'utilisateur ou mot de passe incorrect.',
      admOk: 'Connecté en tant que développeur.',
      admGo: 'Aller au livre d’or',
      admOut: 'Se déconnecter',
    },
    de: {
      back: 'Zur Startseite', langLabel: 'Sprache', themeLabel: 'Synchrones Theme',
      nav: { install: 'Installation', enable: 'Aktivieren / Deaktivieren', pick: 'Sound wechseln', volume: 'Lautstärke', test: 'Anhören', demo: 'Live-Demo', up: 'Loslass-Sound', import: 'Eigenen Sound importieren', manage: 'Eigene Sounds verwalten', theme: 'Themes', lang: 'Sprachen', appearance: 'Webseiten-Einstellungen', tray: 'Tray & Autostart', data: 'Wo Einstellungen liegen', faq: 'Häufige Fragen' },
      groups: { start: 'Erste Schritte', sound: 'Sounds', look: 'Aussehen', other: 'Sonstiges' },
      h1: 'Anleitung',
      lede: 'XUComer ist ein Open-Source-Simulator für Tastatur- und Mausklick-Geräusche. Er läuft im Hintergrund, hört global jeden Tastenanschlag und spielt den passenden Sound in Echtzeit ab. Hier sind alle Funktionen in der Reihenfolge, in der Sie ihnen begegnen.',
      demoHint: 'Noch nicht herunterladen? Tippen Sie unten ein paar Wörter – der Browser synthetisiert die Klickgeräusche und Sie spüren „Drücken / Loslassen“.',
      mousePad: 'Hier klicken, um einen Mausklick zu simulieren', labelDown: 'Anschläge', labelUp: 'Loslassen',
      voice: 'Sound', volKb: 'Tastatur-Lautstärke', volMs: 'Maus-Lautstärke', upOn: 'Auch beim Loslassen tönen',
      appearanceBody: 'Die beiden Auswahlen oben rechts entsprechen eins zu eins den Einstellungen der App, damit Sie schon vorher wählen können:',
      tag: 'Jeder Anschlag hat einen Klang.',
      meta: 'MIT-Lizenz · Windows 10 / 11 | x64 / x86',
      guide: 'Anleitung', dl: 'Herunterladen', gh: 'Auf GitHub ansehen',
      x64: 'Empfohlen · ~110 MB', x86: '32-Bit · ~91 MB',
      docTitle: 'Anleitung · XUComer',
      desc: 'XUComer-Anleitung: Installation, Aktivierung, Soundwechsel, eigene Sounds importieren, Themes und Sprachen, Tray und Autostart, FAQ.',
      siteDesc: 'XUComer — ein Open-Source-Simulator für Tastatur- und Mausklick-Geräusche. MIT-Lizenz, kostenlos, offline.',
      padHint: 'Tippen Sie hier ein paar Wörter…',
      comments: 'Gästebuch',
      ch1: 'Gästebuch',
      chLede: 'Eine Frage, eine Idee oder einfach ein „Gefällt mir“? Schreib es hier. Kommentare werden in der Cloud gespeichert und sind für alle sichtbar — kein Konto nötig.',
      chTitle: 'Gästebuch · XUComer',
      chDesc: 'XUComer-Gästebuch: Fragen, Vorschläge, Fehlermeldungen oder einfach ein Hallo.',
      chNote: 'Einfach schreiben und absenden — keine Anmeldung nötig.',
      vLinear: 'Linear · Linear', vTactile: 'Tactile · Taktil', vClicky: 'Clicky · Knackig', vThock: 'Thock · Dumpf und tief',
      admTitle: 'Entwickler-Anmeldung',
      admLede: 'Melde dich an, um als XUComer zu schreiben. Besucher brauchen kein Konto und können sofort kommentieren.',
      admUser: 'Benutzername',
      admPass: 'Passwort',
      admLogin: 'Anmelden',
      admBad: 'Benutzername oder Passwort ist falsch.',
      admOk: 'Als Entwickler angemeldet.',
      admGo: 'Zum Gästebuch',
      admOut: 'Abmelden',
    },
    es: {
      back: 'Volver al inicio', langLabel: 'Idioma', themeLabel: 'Tema sincronizado',
      nav: { install: 'Instalación', enable: 'Activar / desactivar', pick: 'Cambiar sonido', volume: 'Volumen', test: 'Escuchar', demo: 'Demo en línea', up: 'Sonido al soltar', import: 'Importar sonido propio', manage: 'Gestionar sonidos', theme: 'Temas', lang: 'Idiomas', appearance: 'Ajustes del sitio', tray: 'Bandeja e inicio automático', data: 'Dónde se guarda', faq: 'Preguntas frecuentes' },
      groups: { start: 'Primeros pasos', sound: 'Sonidos', look: 'Apariencia', other: 'Otros' },
      h1: 'Guía de uso',
      lede: 'XUComer es un simulador de código abierto de sonidos de teclado y ratón. Permanece en segundo plano, escucha globalmente cada pulsación y reproduce el sonido correspondiente en tiempo real. Aquí tienes todas las funciones, en el orden en que las usarás.',
      demoHint: '¿Aún no quieres descargar? Escribe unas palabras abajo y el navegador sintetizará los clics para que sientas la respuesta de pulsar y soltar.',
      mousePad: 'Haz clic aquí para simular un clic de ratón', labelDown: 'pulsaciones', labelUp: 'soltar',
      voice: 'Sonido', volKb: 'Volumen del teclado', volMs: 'Volumen del ratón', upOn: 'Sonar al soltar',
      appearanceBody: 'Los dos selectores arriba a la derecha corresponden uno a uno con los ajustes de la app, para que elijas antes de instalar:',
      tag: 'Cada pulsación, con eco.',
      meta: 'Licencia MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Guía', dl: 'Descargar', gh: 'Ver en GitHub',
      x64: 'Recomendado · ~110 MB', x86: '32 bits · ~91 MB',
      docTitle: 'Guía · XUComer',
      desc: 'Guía de XUComer: instalación, activación, cambio de sonido, importación de sonidos, temas e idiomas, bandeja e inicio automático, preguntas frecuentes.',
      siteDesc: 'XUComer — un simulador de código abierto de sonidos de teclado y ratón. Licencia MIT, gratis, sin conexión.',
      padHint: 'Escribe algo aquí…',
      comments: 'Libro de visitas',
      ch1: 'Libro de visitas',
      chLede: '¿Una pregunta, una idea o simplemente quieres saludar? Escribe aquí. Los comentarios se guardan en la nube, visibles para todos, sin necesidad de cuenta.',
      chTitle: 'Libro de visitas · XUComer',
      chDesc: 'Libro de visitas de XUComer: preguntas, sugerencias, informes de errores o simplemente un hola.',
      chNote: 'Escribe y publica directamente: no hace falta iniciar sesión.',
      vLinear: 'Linear · Lineal', vTactile: 'Tactile · Táctil', vClicky: 'Clicky · Chasquido', vThock: 'Thock · Grave y sordo',
      admTitle: 'Acceso de desarrollador',
      admLede: 'Inicia sesión para publicar como XUComer. Los visitantes no necesitan cuenta: pueden comentar directamente.',
      admUser: 'Usuario',
      admPass: 'Contraseña',
      admLogin: 'Iniciar sesión',
      admBad: 'Usuario o contraseña incorrectos.',
      admOk: 'Has iniciado sesión como desarrollador.',
      admGo: 'Ir al libro de visitas',
      admOut: 'Cerrar sesión',
    },
    pt: {
      back: 'Voltar ao início', langLabel: 'Idioma', themeLabel: 'Tema sincronizado',
      nav: { install: 'Instalação', enable: 'Ativar / desativar', pick: 'Trocar som', volume: 'Volume', test: 'Ouvir', demo: 'Demo online', up: 'Som ao soltar', import: 'Importar som próprio', manage: 'Gerenciar sons', theme: 'Temas', lang: 'Idiomas', appearance: 'Ajustes do site', tray: 'Bandeja e início automático', data: 'Onde ficam os ajustes', faq: 'Perguntas frequentes' },
      groups: { start: 'Começando', sound: 'Sons', look: 'Aparência', other: 'Outros' },
      h1: 'Guia de uso',
      lede: 'O XUComer é um simulador de código aberto de sons de teclado e mouse. Ele fica em segundo plano, ouve cada tecla em nível global e toca o som correspondente em tempo real. Aqui estão todos os recursos, na ordem em que você vai usá-los.',
      demoHint: 'Ainda não quer baixar? Digite algumas palavras abaixo e o navegador vai sintetizar os cliques para você sentir o 「pressionar / soltar」.',
      mousePad: 'Clique aqui para simular um clique do mouse', labelDown: 'pressões', labelUp: 'soltar',
      voice: 'Som', volKb: 'Volume do teclado', volMs: 'Volume do mouse', upOn: 'Tocar ao soltar',
      appearanceBody: 'Os dois seletores no topo à direita correspondem um a um às configurações do app, para você escolher antes de instalar:',
      tag: 'Cada tecla, com eco.',
      meta: 'Licença MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Guia', dl: 'Baixar', gh: 'Ver no GitHub',
      x64: 'Recomendado · ~110 MB', x86: '32 bits · ~91 MB',
      docTitle: 'Guia · XUComer',
      desc: 'Guia do XUComer: instalação, ativação, troca de som, importação de sons, temas e idiomas, bandeja e início automático, perguntas frequentes.',
      siteDesc: 'XUComer — um simulador de código aberto de sons de teclado e mouse. Licença MIT, gratuito, sem conexão.',
      padHint: 'Digite algo aqui…',
      comments: 'Livro de visitas',
      ch1: 'Livro de visitas',
      chLede: 'Tem uma dúvida, uma ideia ou só quer dizer olá? Escreva aqui. Os comentários ficam guardados na nuvem, visíveis para todos — não precisa de conta.',
      chTitle: 'Livro de visitas · XUComer',
      chDesc: 'Livro de visitas do XUComer: perguntas, sugestões, relatórios de problemas ou só um alô.',
      chNote: 'Escreva e publique direto — sem login.',
      vLinear: 'Linear · Linear', vTactile: 'Tactile · Tátil', vClicky: 'Clicky · Estalo', vThock: 'Thock · Grave e abafado',
      admTitle: 'Acesso do desenvolvedor',
      admLede: 'Entre para publicar como XUComer. Visitantes não precisam de conta e podem comentar diretamente.',
      admUser: 'Usuário',
      admPass: 'Senha',
      admLogin: 'Entrar',
      admBad: 'Usuário ou senha incorretos.',
      admOk: 'Você entrou como desenvolvedor.',
      admGo: 'Ir para o livro de visitas',
      admOut: 'Sair',
    },
    ru: {
      back: 'На главную', langLabel: 'Язык', themeLabel: 'Синхронизация темы',
      nav: { install: 'Установка', enable: 'Включить / выключить', pick: 'Сменить звук', volume: 'Громкость', test: 'Прослушать', demo: 'Онлайн-демо', up: 'Звук отпускания', import: 'Импорт своего звука', manage: 'Управление звуками', theme: 'Темы', lang: 'Языки', appearance: 'Настройки сайта', tray: 'Трей и автозапуск', data: 'Где настройки', faq: 'Частые вопросы' },
      groups: { start: 'Начало', sound: 'Звуки', look: 'Внешний вид', other: 'Прочее' },
      h1: 'Руководство',
      lede: 'XUComer — симулятор звуков клавиатуры и мыши с открытым исходным кодом. Он работает в фоне, отслеживает каждое нажатие и воспроизводит нужный звук в реальном времени. Ниже — все функции в том порядке, в котором вы с ними столкнётесь.',
      demoHint: 'Ещё не готовы скачивать? Наберите пару слов ниже — браузер синтезирует щелчки, и вы почувствуете «нажатие / отпускание».',
      mousePad: 'Нажмите здесь, чтобы сымитировать клик мыши', labelDown: 'нажатий', labelUp: 'отпусканий',
      voice: 'Звук', volKb: 'Громкость клавиатуры', volMs: 'Громкость мыши', upOn: 'Звук при отпускании',
      appearanceBody: 'Два селектора в правом верхнем углу сайта один в один повторяют настройки приложения — можно выбрать заранее:',
      tag: 'У каждого нажатия есть отклик.',
      meta: 'Лицензия MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Руководство', dl: 'Скачать', gh: 'На GitHub',
      x64: 'Рекомендуется · ~110 МБ', x86: '32 бита · ~91 МБ',
      docTitle: 'Руководство · XUComer',
      desc: 'Руководство XUComer: установка, включение, смена звука, импорт своих звуков, темы и языки, трей и автозапуск, частые вопросы.',
      siteDesc: 'XUComer — симулятор звуков клавиатуры и мыши с открытым исходным кодом. Лицензия MIT, бесплатно, без интернета.',
      padHint: 'Наберите здесь пару слов…',
      comments: 'Гостевая книга',
      ch1: 'Гостевая книга',
      chLede: 'Вопрос, идея или просто хотите сказать «класс»? Оставляйте сообщение здесь. Комментарии хранятся в облаке и видны всем — аккаунт не нужен.',
      chTitle: 'Гостевая книга · XUComer',
      chDesc: 'Гостевая книга XUComer: вопросы, предложения, сообщения об ошибках или просто приветствие.',
      chNote: 'Просто напишите и отправьте — вход не нужен.',
      vLinear: 'Linear · Линейный', vTactile: 'Tactile · Тактильный', vClicky: 'Clicky · Щелчок', vThock: 'Thock · Глухой низкий',
      admTitle: 'Вход для разработчика',
      admLede: 'Войдите, чтобы публиковать от имени XUComer. Посетителям аккаунт не нужен — они могут комментировать сразу.',
      admUser: 'Имя пользователя',
      admPass: 'Пароль',
      admLogin: 'Войти',
      admBad: 'Неверное имя пользователя или пароль.',
      admOk: 'Вы вошли как разработчик.',
      admGo: 'Перейти в гостевую книгу',
      admOut: 'Выйти',
    },
    it: {
      back: 'Torna alla home', langLabel: 'Lingua', themeLabel: 'Tema sincronizzato',
      nav: { install: 'Installazione', enable: 'Attiva / disattiva', pick: 'Cambia suono', volume: 'Volume', test: 'Ascolta', demo: 'Demo online', up: 'Suono al rilascio', import: 'Importa suono', manage: 'Gestisci suoni', theme: 'Temi', lang: 'Lingue', appearance: 'Impostazioni del sito', tray: 'Area di notifica e avvio', data: 'Dove salvato', faq: 'Domande frequenti' },
      groups: { start: 'Iniziare', sound: 'Suoni', look: 'Aspetto', other: 'Altro' },
      h1: 'Guida',
      lede: 'XUComer è un simulatore open source dei suoni di tastiera e mouse. Resta in background, ascolta ogni tasto a livello globale e riproduce il suono corrispondente in tempo reale. Ecco tutte le funzioni, nell’ordine in cui le incontrerai.',
      demoHint: 'Non vuoi ancora scaricare? Scrivi qualche parola qui sotto: il browser sintetizzerà i clic e sentirai la risposta di 「pressione / rilascio」.',
      mousePad: 'Clicca qui per simulare un clic del mouse', labelDown: 'pressioni', labelUp: 'rilasci',
      voice: 'Suono', volKb: 'Volume tastiera', volMs: 'Volume mouse', upOn: 'Suono al rilascio',
      appearanceBody: 'I due selettori in alto a destra corrispondono uno a uno alle impostazioni dell’app, così puoi decidere prima di installare:',
      tag: 'Ogni tasto ha il suo suono.',
      meta: 'Licenza MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Guida', dl: 'Scarica', gh: 'Vedi su GitHub',
      x64: 'Consigliato · ~110 MB', x86: '32 bit · ~91 MB',
      docTitle: 'Guida · XUComer',
      desc: 'Guida di XUComer: installazione, attivazione, cambio suono, importazione suoni, temi e lingue, area di notifica e avvio automatico, domande frequenti.',
      siteDesc: 'XUComer — un simulatore open source dei suoni di tastiera e mouse. Licenza MIT, gratuito, senza connessione.',
      padHint: 'Scrivi qualcosa qui…',
      comments: 'Libro degli ospiti',
      ch1: 'Libro degli ospiti',
      chLede: 'Una domanda, un’idea o semplicemente un saluto? Scrivi qui. I commenti vengono salvati nel cloud, visibili a tutti — nessun account richiesto.',
      chTitle: 'Libro degli ospiti · XUComer',
      chDesc: 'Libro degli ospiti di XUComer: domande, suggerimenti, segnalazioni o semplici saluti.',
      chNote: 'Scrivi e pubblica subito: nessun accesso richiesto.',
      vLinear: 'Linear · Lineare', vTactile: 'Tactile · Tattile', vClicky: 'Clicky · Scatto', vThock: 'Thock · Cupo e profondo',
      admTitle: 'Accesso sviluppatore',
      admLede: 'Accedi per pubblicare come XUComer. I visitatori non hanno bisogno di un account: possono commentare subito.',
      admUser: 'Nome utente',
      admPass: 'Password',
      admLogin: 'Accedi',
      admBad: 'Nome utente o password errati.',
      admOk: 'Accesso effettuato come sviluppatore.',
      admGo: 'Vai al libro degli ospiti',
      admOut: 'Esci',
    },
    nl: {
      back: 'Terug naar home', langLabel: 'Taal', themeLabel: 'Thema synchroniseren',
      nav: { install: 'Installeren', enable: 'Aan / uit', pick: 'Geluid wisselen', volume: 'Volume', test: 'Beluisteren', demo: 'Online demo', up: 'Loslaatgeluid', import: 'Eigen geluid importeren', manage: 'Eigen geluiden beheren', theme: 'Thema’s', lang: 'Talen', appearance: 'Site-instellingen', tray: 'Systeemvak & autostart', data: 'Waar instellingen staan', faq: 'Veelgestelde vragen' },
      groups: { start: 'Aan de slag', sound: 'Geluiden', look: 'Uiterlijk', other: 'Overig' },
      h1: 'Handleiding',
      lede: 'XUComer is een open-source simulator voor toetsenbord- en muisklikgeluiden. Hij draait op de achtergrond, luistert wereldwijd naar elke toetsaanslag en speelt het bijbehorende geluid in realtime af. Hieronder staat elke functie, in de volgorde waarin je ze tegenkomt.',
      demoHint: 'Nog niet downloaden? Typ hieronder een paar woorden: de browser synthetiseert de klikken zodat je 「indrukken / loslaten」 voelt.',
      mousePad: 'Klik hier om een muisklik te simuleren', labelDown: 'aanslagen', labelUp: 'loslaten',
      voice: 'Geluid', volKb: 'Toetsenbordvolume', volMs: 'Muiskvolume', upOn: 'Ook geluid bij loslaten',
      appearanceBody: 'De twee kiezers rechtsboven komen een op een overeen met de instellingen van de app, zodat je vooraf kunt kiezen:',
      tag: 'Elke aanslag heeft een klank.',
      meta: 'MIT-licentie · Windows 10 / 11 | x64 / x86',
      guide: 'Handleiding', dl: 'Downloaden', gh: 'Bekijk op GitHub',
      x64: 'Aanbevolen · ~110 MB', x86: '32-bit · ~91 MB',
      docTitle: 'Handleiding · XUComer',
      desc: 'XUComer-handleiding: installeren, inschakelen, geluid wisselen, eigen geluiden importeren, thema’s en talen, systeemvak en autostart, veelgestelde vragen.',
      siteDesc: 'XUComer — een open-source simulator voor toetsenbord- en muisklikgeluiden. MIT-licentie, gratis, offline.',
      padHint: 'Typ hier een paar woorden…',
      comments: 'Gastenboek',
      ch1: 'Gastenboek',
      chLede: 'Een vraag, een idee of gewoon even hallo zeggen? Laat hier een berichtje achter. Reacties staan in de cloud, voor iedereen zichtbaar — geen account nodig.',
      chTitle: 'Gastenboek · XUComer',
      chDesc: 'XUComer-gastenboek: vragen, suggesties, bugmeldingen of gewoon een hallo.',
      chNote: 'Schrijf en plaats direct — geen inloggen nodig.',
      vLinear: 'Linear · Lineair', vTactile: 'Tactile · Tastbaar', vClicky: 'Clicky · Klikkend', vThock: 'Thock · Dof en laag',
      admTitle: 'Inloggen als ontwikkelaar',
      admLede: 'Log in om als XUComer te plaatsen. Bezoekers hebben geen account nodig en kunnen direct reageren.',
      admUser: 'Gebruikersnaam',
      admPass: 'Wachtwoord',
      admLogin: 'Inloggen',
      admBad: 'Onjuiste gebruikersnaam of wachtwoord.',
      admOk: 'Ingelogd als ontwikkelaar.',
      admGo: 'Naar het gastenboek',
      admOut: 'Uitloggen',
    },
    pl: {
      back: 'Wróć na stronę główną', langLabel: 'Język', themeLabel: 'Zsynchronizowany motyw',
      nav: { install: 'Instalacja', enable: 'Włącz / wyłącz', pick: 'Zmień dźwięk', volume: 'Głośność', test: 'Odsłuch', demo: 'Demo online', up: 'Dźwięk puszczenia', import: 'Importuj własny dźwięk', manage: 'Zarządzaj dźwiękami', theme: 'Motywy', lang: 'Języki', appearance: 'Ustawienia strony', tray: 'Tacka i autostart', data: 'Gdzie są ustawienia', faq: 'Najczęstsze pytania' },
      groups: { start: 'Pierwsze kroki', sound: 'Dźwięki', look: 'Wygląd', other: 'Inne' },
      h1: 'Przewodnik',
      lede: 'XUComer to otwarty symulator dźwięków klawiatury i myszy. Działa w tle, nasłuchuje globalnie każdego naciśnięcia i odtwarza pasujący dźwięk w czasie rzeczywistym. Poniżej wszystkie funkcje, w kolejności, w jakiej je spotkasz.',
      demoHint: 'Nie chcesz jeszcze pobierać? Wpisz kilka słów poniżej, a przeglądarka zsyntetyzuje kliknięcia, żebyś poczuł/a „naciśnięcie / puszczenie”.',
      mousePad: 'Kliknij tutaj, aby zasymulować kliknięcie myszą', labelDown: 'naciśnięć', labelUp: 'puszczeń',
      voice: 'Dźwięk', volKb: 'Głośność klawiatury', volMs: 'Głośność myszy', upOn: 'Dźwięk przy puszczeniu',
      appearanceBody: 'Dwa selektory w prawym górnym rogu odpowiadają jeden do jednego ustawieniom aplikacji, więc możesz wybrać przed instalacją:',
      tag: 'Każde naciśnięcie ma swój dźwięk.',
      meta: 'Licencja MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Przewodnik', dl: 'Pobierz', gh: 'Zobacz na GitHubie',
      x64: 'Zalecane · ~110 MB', x86: '32-bitowy · ~91 MB',
      docTitle: 'Przewodnik · XUComer',
      desc: 'Przewodnik XUComer: instalacja, włączanie, zmiana dźwięku, import własnych dźwięków, motywy i języki, tacka i autostart, najczęstsze pytania.',
      siteDesc: 'XUComer — otwarty symulator dźwięków klawiatury i myszy. Licencja MIT, darmowy, działa offline.',
      padHint: 'Wpisz tutaj kilka słów…',
      comments: 'Księga gości',
      ch1: 'Księga gości',
      chLede: 'Pytanie, pomysł czy po prostu chcesz powiedzieć „super”? Napisz tutaj. Komentarze są przechowywane w chmurze i widoczne dla wszystkich — konto nie jest potrzebne.',
      chTitle: 'Księga gości · XUComer',
      chDesc: 'Księga gości XUComer: pytania, sugestie, zgłoszenia błędów lub zwykłe powitanie.',
      chNote: 'Napisz i opublikuj od razu — bez logowania.',
      vLinear: 'Linear · Liniowy', vTactile: 'Tactile · Wyczuwalny', vClicky: 'Clicky · Klikający', vThock: 'Thock · Głuchy i niski',
      admTitle: 'Logowanie twórcy',
      admLede: 'Zaloguj się, aby publikować jako XUComer. Goście nie potrzebują konta — mogą komentować od razu.',
      admUser: 'Nazwa użytkownika',
      admPass: 'Hasło',
      admLogin: 'Zaloguj się',
      admBad: 'Nieprawidłowa nazwa użytkownika lub hasło.',
      admOk: 'Zalogowano jako twórca.',
      admGo: 'Przejdź do księgi gości',
      admOut: 'Wyloguj się',
    },
    tr: {
      back: 'Ana sayfaya dön', langLabel: 'Dil', themeLabel: 'Senkron tema',
      nav: { install: 'Kurulum', enable: 'Aç / kapat', pick: 'Sesi değiştir', volume: 'Ses seviyesi', test: 'Önizle', demo: 'Çevrimiçi demo', up: 'Bırakma sesi', import: 'Kendi sesini içe aktar', manage: 'Sesleri yönet', theme: 'Temalar', lang: 'Diller', appearance: 'Site ayarları', tray: 'Tepsi ve açılışta başlat', data: 'Ayarlar nerede', faq: 'Sık sorulanlar' },
      groups: { start: 'Başlarken', sound: 'Sesler', look: 'Görünüm', other: 'Diğer' },
      h1: 'Kullanım kılavuzu',
      lede: 'XUComer, açık kaynaklı bir klavye / fare tıklama sesi simülatörüdür. Arka planda kalır, her tuş vuruşunu sistem genelinde dinler ve eşleşen sesi gerçek zamanlı çalar. Aşağıda tüm özellikler, karşılaşacağınız sırayla anlatılıyor.',
      demoHint: 'Henüz indirmek istemiyor musunuz? Aşağıya birkaç kelime yazın; tarayıcı tıklama seslerini sentezleyip „basış / bırakış” hissini yaşatacak.',
      mousePad: 'Fare tıklamasını denemek için buraya tıklayın', labelDown: 'basış', labelUp: 'bırakış',
      voice: 'Ses', volKb: 'Klavye sesi', volMs: 'Fare sesi', upOn: 'Bırakırken de ses çıkar',
      appearanceBody: 'Sağ üstteki iki seçici, uygulama ayarlarıyla bire bir eşleşir; kurmadan önce seçebilirsiniz:',
      tag: 'Her vuruşun bir yankısı olsun.',
      meta: 'MIT lisansı · Windows 10 / 11 | x64 / x86',
      guide: 'Kullanım', dl: 'İndir', gh: 'GitHub’da görüntüle',
      x64: 'Önerilen · ~110 MB', x86: '32 bit · ~91 MB',
      docTitle: 'Kullanım · XUComer',
      desc: 'XUComer kullanım kılavuzu: kurulum, etkinleştirme, ses değiştirme, kendi sesini içe aktarma, temalar ve diller, tepsi ve açılışta başlatma, sık sorulanlar.',
      siteDesc: 'XUComer — açık kaynaklı klavye / fare tıklama sesi simülatörü. MIT lisansı, ücretsiz, çevrimdışı çalışır.',
      padHint: 'Buraya birkaç kelime yazın…',
      comments: 'Ziyaretçi defteri',
      ch1: 'Ziyaretçi defteri',
      chLede: 'Bir sorunuz, fikriniz var ya da sadece merhaba mı demek istiyorsunuz? Buraya yazın. Yorumlar bulutta saklanır ve herkese açıktır — hesap gerekmez.',
      chTitle: 'Ziyaretçi defteri · XUComer',
      chDesc: 'XUComer ziyaretçi defteri: sorular, öneriler, hata bildirimleri ya da sadece bir merhaba.',
      chNote: 'Yaz ve doğrudan gönder — giriş gerekmez.',
      vLinear: 'Linear · Doğrusal', vTactile: 'Tactile · Dokunsal', vClicky: 'Clicky · Tıkırtılı', vThock: 'Thock · Boğuk ve derin',
      admTitle: 'Geliştirici girişi',
      admLede: 'XUComer olarak göndermek için giriş yapın. Ziyaretçilerin hesaba ihtiyacı yok — hemen yorum yazabilirler.',
      admUser: 'Kullanıcı adı',
      admPass: 'Şifre',
      admLogin: 'Giriş yap',
      admBad: 'Kullanıcı adı veya şifre hatalı.',
      admOk: 'Geliştirici olarak giriş yapıldı.',
      admGo: 'Konuk defterine git',
      admOut: 'Çıkış yap',
    },
    ar: {
      back: 'العودة إلى الرئيسية', langLabel: 'اللغة', themeLabel: 'مزامنة السمة',
      nav: { install: 'التثبيت', enable: 'التشغيل والإيقاف', pick: 'تغيير الصوت', volume: 'مستوى الصوت', test: 'تجربة', demo: 'عرض مباشر', up: 'صوت الرفع', import: 'استيراد صوت مخصص', manage: 'إدارة الأصوات المخصصة', theme: 'السمات', lang: 'اللغات', appearance: 'إعدادات الموقع', tray: 'الدرج والتشغيل التلقائي', data: 'مكان حفظ الإعدادات', faq: 'الأسئلة الشائعة' },
      groups: { start: 'البدء', sound: 'الأصوات', look: 'المظهر', other: 'أخرى' },
      h1: 'دليل الاستخدام',
      lede: 'XUComer محاكٍ مفتوح المصدر لأصوات لوحة المفاتيح والفأرة. يعمل في الخلفية ويراقب كل ضغطة على مستوى النظام ويشغّل الصوت المناسب فورًا. فيما يلي كل الميزات بالترتيب الذي ستستخدمها به.',
      demoHint: 'لا تريد التنزيل بعد؟ اكتب بضع كلمات في الأسفل وسيقوم المتصفح بتوليد أصوات النقر لتجربة إحساس «الضغط / الرفع».',
      mousePad: 'انقر هنا لمحاكاة نقرة الفأرة', labelDown: 'ضغطة', labelUp: 'رفعة',
      voice: 'الصوت', volKb: 'صوت لوحة المفاتيح', volMs: 'صوت الفأرة', upOn: 'صوت عند الرفع',
      appearanceBody: 'المُنتقيان في أعلى اليمين يطابقان إعدادات التطبيق تمامًا، لتختار قبل التثبيت:',
      tag: 'لكل ضغطة صدى.',
      meta: 'ترخيص MIT · Windows 10 / 11 | x64 / x86',
      guide: 'طريقة الاستخدام', dl: 'تنزيل', gh: 'اطّلع على GitHub',
      x64: 'مُوصى به · حوالي 110 ميغابايت', x86: '32 بت · حوالي 91 ميغابايت',
      docTitle: 'طريقة الاستخدام · XUComer',
      desc: 'دليل XUComer: التثبيت، التشغيل، تغيير الصوت، استيراد الأصوات المخصصة، السمات واللغات، الدرج والتشغيل التلقائي، الأسئلة الشائعة.',
      siteDesc: 'XUComer — محاكٍ مفتوح المصدر لأصوات لوحة المفاتيح والفأرة. ترخيص MIT، مجانٍي، يعمل دون اتصال.',
      padHint: 'اكتب بضع كلمات هنا…',
      comments: 'سجل الزوار',
      ch1: 'سجل الزوار',
      chLede: 'هل لديك سؤال أو فكرة، أم تريد فقط أن تقول «رائع»؟ اترك تعليقًا هنا. تُحفظ التعليقات في السحابة وتظهر للجميع — دون حاجة إلى حساب.',
      chTitle: 'سجل الزوار · XUComer',
      chDesc: 'سجل زوار XUComer: الأسئلة والاقتراحات وبلاغات الأخطاء، أو مجرد تحية.',
      chNote: 'اكتب وانشر مباشرة — لا حاجة لتسجيل الدخول.',
      vLinear: 'Linear · خطي', vTactile: 'Tactile · ملموس', vClicky: 'Clicky · طقطقة', vThock: 'Thock · عميق ومكتوم',
      admTitle: 'تسجيل دخول المطور',
      admLede: 'سجّل الدخول لتنشر باسم XUComer. الزوار لا يحتاجون حسابًا ويمكنهم التعليق مباشرة.',
      admUser: 'اسم المستخدم',
      admPass: 'كلمة المرور',
      admLogin: 'تسجيل الدخول',
      admBad: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
      admOk: 'تم تسجيل الدخول كمطور.',
      admGo: 'الانتقال إلى لوحة الزوار',
      admOut: 'تسجيل الخروج',
    },
    th: {
      back: 'กลับหน้าแรก', langLabel: 'ภาษา', themeLabel: 'ธีมที่ซิงค์',
      nav: { install: 'ติดตั้ง', enable: 'เปิด / ปิดใช้งาน', pick: 'เปลี่ยนเสียง', volume: 'ระดับเสียง', test: 'ฟังตัวอย่าง', demo: 'เดโมออนไลน์', up: 'เสียงตอนปล่อย', import: 'นำเข้าเสียงเอง', manage: 'จัดการเสียง', theme: 'ธีม', lang: 'ภาษา', appearance: 'ตั้งค่าเว็บ', tray: 'เทรย์และเริ่มอัตโนมัติ', data: 'ที่เก็บการตั้งค่า', faq: 'คำถามที่พบบ่อย' },
      groups: { start: 'เริ่มต้นใช้งาน', sound: 'เสียง', look: 'รูปลักษณ์', other: 'อื่น ๆ' },
      h1: 'คู่มือการใช้งาน',
      lede: 'XUComer เป็นโปรแกรมจำลองเสียงแป้นพิมพ์และเมาส์แบบโอเพนซอร์ส ทำงานเบื้องหลัง ฟังทุกการกดทั่วทั้งระบบ และเล่นเสียงที่ตรงกันแบบเรียลไทม์ ด้านล่างอธิบายทุกฟังก์ชันตามลำดับการใช้งาน',
      demoHint: 'ยังไม่อยากดาวน์โหลด? พิมพ์ข้อความด้านล่างสักหน่อย เบราว์เซอร์จะสังเคราะห์เสียงคลิกให้คุณสัมผัสความรู้สึก 「กด / ปล่อย」',
      mousePad: 'คลิกที่นี่เพื่อจำลองการคลิกเมาส์', labelDown: 'กด', labelUp: 'ปล่อย',
      voice: 'เสียง', volKb: 'ระดับเสียงแป้นพิมพ์', volMs: 'ระดับเสียงเมาส์', upOn: 'มีเสียงตอนปล่อยด้วย',
      appearanceBody: 'ตัวเลือกสองตัวที่มุมขวาบนตรงกับการตั้งค่าในแอปแบบหนึ่งต่อหนึ่ง เพื่อให้คุณเลือกก่อนติดตั้ง:',
      tag: 'ทุกการกด มีเสียงตอบรับ',
      meta: 'ใบอนุญาต MIT · Windows 10 / 11 | x64 / x86',
      guide: 'วิธีใช้งาน', dl: 'ดาวน์โหลด', gh: 'ดูบน GitHub',
      x64: 'แนะนำ · ~110 MB', x86: '32 บิต · ~91 MB',
      docTitle: 'วิธีใช้งาน · XUComer',
      desc: 'คู่มือ XUComer: การติดตั้ง, การเปิดใช้งาน, การเปลี่ยนเสียง, การนำเข้าเสียงเอง, ธีมและภาษา, เทรย์และเริ่มอัตโนมัติ, คำถามที่พบบ่อย',
      siteDesc: 'XUComer — โปรแกรมจำลองเสียงแป้นพิมพ์และเมาส์แบบโอเพนซอร์ส ใบอนุญาต MIT ฟรี ทำงานได้โดยไม่ต้องต่อเน็ต',
      padHint: 'พิมพ์ข้อความที่นี่…',
      comments: 'สมุดเยี่ยม',
      ch1: 'สมุดเยี่ยม',
      chLede: 'มีคำถาม มีไอเดีย หรือแค่ทักทาย? เขียนไว้ที่นี่ได้เลย ความเห็นจะถูกเก็บไว้บนคลาวด์ ใครก็เห็นได้ และไม่ต้องมีบัญชี',
      chTitle: 'สมุดเยี่ยม · XUComer',
      chDesc: 'สมุดเยี่ยม XUComer: คำถาม ข้อเสนอแนะ แจ้งปัญหา หรือแค่ทักทาย',
      chNote: 'เขียนแล้วโพสต์ได้เลย ไม่ต้องเข้าสู่ระบบ',
      vLinear: 'Linear · เส้นตรงนุ่มนวล', vTactile: 'Tactile · มีจังหวะ', vClicky: 'Clicky · กรอบใส', vThock: 'Thock · ทุ้มหนา',
      admTitle: 'เข้าสู่ระบบผู้พัฒนา',
      admLede: 'ลงชื่อเข้าใช้เพื่อโพสต์ในชื่อ XUComer ผู้เยี่ยมชมไม่ต้องมีบัญชี สามารถคอมเมนต์ได้ทันที',
      admUser: 'ชื่อผู้ใช้',
      admPass: 'รหัสผ่าน',
      admLogin: 'เข้าสู่ระบบ',
      admBad: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      admOk: 'ลงชื่อเข้าใช้ในฐานะผู้พัฒนาแล้ว',
      admGo: 'ไปที่สมุดเยี่ยมชม',
      admOut: 'ออกจากระบบ',
    },
    vi: {
      back: 'Về trang chủ', langLabel: 'Ngôn ngữ', themeLabel: 'Đồng bộ giao diện',
      nav: { install: 'Cài đặt', enable: 'Bật / tắt', pick: 'Đổi âm thanh', volume: 'Âm lượng', test: 'Nghe thử', demo: 'Demo trực tuyến', up: 'Âm khi nhả', import: 'Nhập âm thanh riêng', manage: 'Quản lý âm thanh', theme: 'Giao diện', lang: 'Ngôn ngữ', appearance: 'Cài đặt trang web', tray: 'Khay hệ thống & khởi động cùng Windows', data: 'Nơi lưu cài đặt', faq: 'Câu hỏi thường gặp' },
      groups: { start: 'Bắt đầu', sound: 'Âm thanh', look: 'Giao diện', other: 'Khác' },
      h1: 'Hướng dẫn sử dụng',
      lede: 'XUComer là trình mô phỏng âm thanh gõ phím / chuột mã nguồn mở. Nó chạy nền, lắng nghe toàn cục từng lần nhấn và phát âm thanh tương ứng theo thời gian thực. Dưới đây là mọi tính năng, theo đúng thứ tự bạn sẽ dùng.',
      demoHint: 'Chưa muốn tải? Gõ vài từ bên dưới, trình duyệt sẽ tổng hợp tiếng click để bạn cảm nhận được cảm giác 「nhấn / nhả」.',
      mousePad: 'Nhấn vào đây để mô phỏng click chuột', labelDown: 'lần nhấn', labelUp: 'lần nhả',
      voice: 'Âm thanh', volKb: 'Âm lượng phím', volMs: 'Âm lượng chuột', upOn: 'Phát âm khi nhả',
      appearanceBody: 'Hai bộ chọn ở góc trên bên phải tương ứng một-một với cài đặt trong ứng dụng, để bạn chọn trước khi cài:',
      tag: 'Mỗi lần gõ, một tiếng vang.',
      meta: 'Giấy phép MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Hướng dẫn', dl: 'Tải xuống', gh: 'Xem trên GitHub',
      x64: 'Khuyên dùng · ~110 MB', x86: '32-bit · ~91 MB',
      docTitle: 'Hướng dẫn · XUComer',
      desc: 'Hướng dẫn XUComer: cài đặt, bật tắt, đổi âm thanh, nhập âm thanh riêng, giao diện và ngôn ngữ, khay hệ thống và khởi động cùng Windows, câu hỏi thường gặp.',
      siteDesc: 'XUComer — trình mô phỏng âm thanh phím / chuột mã nguồn mở. Giấy phép MIT, miễn phí, không cần mạng.',
      padHint: 'Gõ vài từ ở đây…',
      comments: 'Sổ lưu bút',
      ch1: 'Sổ lưu bút',
      chLede: 'Có câu hỏi, ý tưởng, hay chỉ muốn nói một lời khen? Cứ để lại lời nhắn tại đây. Bình luận được lưu trên đám mây, ai cũng xem được và không cần tài khoản.',
      chTitle: 'Sổ lưu bút · XUComer',
      chDesc: 'Sổ lưu bút XUComer: hỏi đáp, góp ý, báo lỗi, hay chỉ là một lời chào.',
      chNote: 'Viết và đăng ngay — không cần đăng nhập.',
      vLinear: 'Linear · Tuyến tính', vTactile: 'Tactile · Có nấc', vClicky: 'Clicky · Giòn', vThock: 'Thock · Trầm đục',
      admTitle: 'Đăng nhập nhà phát triển',
      admLede: 'Đăng nhập để đăng với tên XUComer. Khách không cần tài khoản, có thể bình luận ngay.',
      admUser: 'Tên người dùng',
      admPass: 'Mật khẩu',
      admLogin: 'Đăng nhập',
      admBad: 'Tên người dùng hoặc mật khẩu không đúng.',
      admOk: 'Đã đăng nhập với tư cách nhà phát triển.',
      admGo: 'Đi tới sổ lưu bút',
      admOut: 'Đăng xuất',
    },
    id: {
      back: 'Kembali ke beranda', langLabel: 'Bahasa', themeLabel: 'Sinkronisasi tema',
      nav: { install: 'Pemasangan', enable: 'Aktifkan / nonaktifkan', pick: 'Ganti suara', volume: 'Volume', test: 'Dengarkan', demo: 'Demo online', up: 'Suara saat lepas', import: 'Impor suara sendiri', manage: 'Kelola suara', theme: 'Tema', lang: 'Bahasa', appearance: 'Pengaturan situs', tray: 'Tray & mulai otomatis', data: 'Lokasi pengaturan', faq: 'Pertanyaan umum' },
      groups: { start: 'Mulai', sound: 'Suara', look: 'Tampilan', other: 'Lainnya' },
      h1: 'Panduan penggunaan',
      lede: 'XUComer adalah simulator suara ketikan keyboard / klik mouse bersumber terbuka. Ia berjalan di latar belakang, memantau setiap tombol secara global dan memutar suaranya secara real time. Berikut semua fitur, sesuai urutan pemakaiannya.',
      demoHint: 'Belum mau mengunduh? Ketik beberapa kata di bawah dan browser akan menyintesis bunyi klik agar Anda merasakan sensasi 「tekan / lepas」.',
      mousePad: 'Klik di sini untuk mensimulasikan klik mouse', labelDown: 'tekanan', labelUp: 'lepasan',
      voice: 'Suara', volKb: 'Volume keyboard', volMs: 'Volume mouse', upOn: 'Bunyi saat dilepas',
      appearanceBody: 'Dua pemilih di kanan atas berkaitan satu-satu dengan pengaturan aplikasi, jadi Anda bisa memilih sebelum memasang:',
      tag: 'Setiap ketukan punya gema.',
      meta: 'Lisensi MIT · Windows 10 / 11 | x64 / x86',
      guide: 'Panduan', dl: 'Unduh', gh: 'Lihat di GitHub',
      x64: 'Direkomendasikan · ~110 MB', x86: '32-bit · ~91 MB',
      docTitle: 'Panduan · XUComer',
      desc: 'Panduan XUComer: pemasangan, pengaktifan, ganti suara, impor suara sendiri, tema dan bahasa, tray dan mulai otomatis, pertanyaan umum.',
      siteDesc: 'XUComer — simulator suara ketikan keyboard / klik mouse open source. Lisensi MIT, gratis, tanpa koneksi.',
      padHint: 'Ketik beberapa kata di sini…',
      comments: 'Buku tamu',
      ch1: 'Buku tamu',
      chLede: 'Punya pertanyaan, ide, atau sekadar ingin menyapa? Tinggalkan pesan di sini. Komentar disimpan di cloud, terlihat oleh semua, dan tanpa akun.',
      chTitle: 'Buku tamu · XUComer',
      chDesc: 'Buku tamu XUComer: bertanya, memberi saran, melaporkan masalah, atau sekadar menyapa.',
      chNote: 'Tulis dan kirim langsung — tanpa login.',
      vLinear: 'Linear · Linier', vTactile: 'Tactile · Berbuku', vClicky: 'Clicky · Klik tajam', vThock: 'Thock · Berat dan rendah',
      admTitle: 'Login pengembang',
      admLede: 'Masuk untuk memposting sebagai XUComer. Pengunjung tidak perlu akun dan bisa langsung berkomentar.',
      admUser: 'Nama pengguna',
      admPass: 'Kata sandi',
      admLogin: 'Masuk',
      admBad: 'Nama pengguna atau kata sandi salah.',
      admOk: 'Masuk sebagai pengembang.',
      admGo: 'Ke buku tamu',
      admOut: 'Keluar'
    }
  };

  const NAV_KEYS = ['install', 'enable', 'pick', 'volume', 'test', 'demo', 'up', 'import', 'manage', 'theme', 'lang', 'appearance', 'tray', 'data', 'faq'];

  function resolveLang(code) {
    if (code && code !== 'system') return code;
    const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (const raw of list) {
      const full = String(raw).replace('-', '_');
      if (STRINGS[full]) return full;
      const it = LANGS.find(l => l[0] !== 'system' && l[0].split('_')[0] === full.split('_')[0]);
      if (it) return it[0];
    }
    return 'en';
  }

  function baseLang(code) {
    if (STRINGS[code]) return code;
    const head = code.split('_')[0];
    if (STRINGS[head]) return head;
    return 'en';
  }

  function tFor(code) {
    const resolved = resolveLang(code);
    const base = baseLang(resolved);
    const pack = STRINGS[base];
    const zh = resolved.startsWith('zh');
    return { pack, base, resolved, zh };
  }

  const LANG_KEY = 'xucomer-lang';

  function applyLang(code) {
    const { pack, resolved } = tFor(code);
    root.lang = resolved.replace('_', '-');
    root.dir = resolved === 'ar' ? 'rtl' : 'ltr';
    const page = document.body.dataset.page || (document.querySelector('.doc-main') ? 'guide' : 'home');

    const setText = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.textContent = val; };
    const back = document.querySelector('.doc-back');
    if (back) back.innerHTML = '<span aria-hidden="true">←</span> ' + pack.back;

    const lbl = document.querySelector('.pick-label');
    if (lbl) lbl.textContent = pack.langLabel;
    const pick = document.getElementById('langPicker');
    if (pick) pick.setAttribute('aria-label', pack.langLabel);
    const grp = document.getElementById('themePicker');
    if (grp) grp.setAttribute('aria-label', pack.themeLabel);

    const tagEl = document.querySelector('.tag');
    if (tagEl) tagEl.textContent = pack.tag;
    const metaEl = document.querySelector('.meta');
    if (metaEl) metaEl.textContent = pack.meta;
    const gl = document.querySelector('.guide-link');
    if (gl) gl.innerHTML = pack.guide + ' <span aria-hidden="true">→</span>';
    const ghLabel = document.getElementById('ghLabel');
    if (ghLabel) ghLabel.textContent = pack.gh;
    const dlList = document.getElementById('dlList');
    if (dlList) dlList.setAttribute('aria-label', pack.dl);

    document.querySelectorAll('h4[data-group]').forEach(h => {
      h.textContent = pack.groups[h.dataset.group];
    });
    document.querySelectorAll('[data-nav]').forEach(a => {
      const k = a.dataset.nav;
      if (pack.nav[k]) a.textContent = pack.nav[k];
    });
    document.querySelectorAll('h2[id]').forEach(h => {
      if (pack.nav[h.id]) h.textContent = pack.nav[h.id];
    });

    setText('[data-i18n="h1"]', pack.h1);
    setText('[data-i18n="lede"]', pack.lede);
    setText('[data-i18n="demoHint"]', pack.demoHint);
    setText('[data-i18n="mousePad"]', pack.mousePad);
    setText('[data-i18n="labelDown"]', pack.labelDown);
    setText('[data-i18n="labelUp"]', pack.labelUp);
    setText('[data-i18n="voice"]', pack.voice);
    setText('#volKbLabel', pack.volKb);
    setText('#volMsLabel', pack.volMs);
    setText('#upOnLabel', pack.upOn);
    setText('[data-i18n="x64Size"]', pack.x64);
    setText('[data-i18n="x86Size"]', pack.x86);
    setText('[data-i18n="ch1"]', pack.ch1);
    setText('[data-i18n="chLede"]', pack.chLede);
    setText('#commentNote', pack.chNote);
    setText('[data-i18n="admTitle"]', pack.admTitle);
    setText('[data-i18n="admLede"]', pack.admLede);
    setText('[data-i18n="admUser"]', pack.admUser);
    setText('[data-i18n="admPass"]', pack.admPass);
    setText('[data-i18n="admLogin"]', pack.admLogin);
    setText('[data-i18n="admOk"]', pack.admOk);
    setText('[data-i18n="admGo"]', pack.admGo);
    setText('[data-i18n="admOut"]', pack.admOut);

    document.querySelectorAll('option[data-voice]').forEach(o => {
      const k = o.dataset.voice;
      if (pack[k]) o.textContent = pack[k];
    });
    const padEl = document.getElementById('pad');
    if (padEl) padEl.setAttribute('placeholder', pack.padHint);

    document.querySelectorAll('meta[name="description"]').forEach(m => {
      m.setAttribute('content',
        page === 'guide' ? pack.desc : page === 'comments' ? pack.chDesc : pack.siteDesc);
    });
    if (page === 'guide') document.title = pack.docTitle;
    else if (page === 'comments') document.title = pack.chTitle;
    else if (page === 'admin') document.title = pack.admTitle + ' · XUComer';

    document.querySelectorAll('.pill').forEach(p => {
      const th = THEMES.find(x => x.id === p.dataset.id);
      if (th) p.title = th.zh + ' · ' + th.en;
    });

    if (page === 'comments') ensureGuestbook(resolved);

    store.set(LANG_KEY, code);
  }

  function buildLangPicker() {
    const sel = document.getElementById('langPicker');
    if (!sel) return;
    const saved = store.get(LANG_KEY, 'system');
    sel.innerHTML = '';
    LANGS.forEach(([code, zhName, enName]) => {
      const o = document.createElement('option');
      o.value = code;
      o.textContent = code === 'system' ? zhName + ' / Follow system' : zhName;
      sel.appendChild(o);
    });
    sel.value = LANGS.some(l => l[0] === saved) ? saved : 'system';
    sel.addEventListener('change', () => applyLang(sel.value));
    applyLang(sel.value);
  }

  buildLangPicker();
  bindAdmin();

  /* ============ 指南页：滚动高亮当前章节 ============ */
  const links = Array.prototype.slice.call(document.querySelectorAll('.doc-nav a[href^="#"]'));
  if (links.length) {
    const targets = links
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const mark = () => {
      let current = targets[0];
      targets.forEach(t => {
        if (t.getBoundingClientRect().top <= 120) current = t;
      });
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
      });
    };
    mark();
    document.addEventListener('scroll', mark, { passive: true });
  }

  /* ============ 在线演示：浏览器实时合成按键音 ============ */
  const PRESETS = {
    linear: { down: { bp: 1500, q: 1.1, dur: .045, body: 205, bg: .16, amp: .55 }, up: { bp: 2300, q: 1.4, dur: .028, body: 320, bg: .06, amp: .3 } },
    tactile: { down: { bp: 2100, q: 2.2, dur: .05, body: 240, bg: .2, amp: .6, tick: .5 }, up: { bp: 2700, q: 2.4, dur: .03, body: 380, bg: .07, amp: .32 } },
    clicky: { down: { bp: 2900, q: 3.0, dur: .042, body: 180, bg: .14, amp: .62, tick: .85 }, up: { bp: 3400, q: 3.2, dur: .028, body: 300, bg: .06, amp: .34, tick: .4 } },
    thock: { down: { bp: 780, q: .9, dur: .085, body: 118, bg: .42, amp: .6 }, up: { bp: 1400, q: 1.2, dur: .04, body: 200, bg: .12, amp: .28 } }
  };
  const MOUSE = {
    down: { bp: 1900, q: 2.4, dur: .038, body: 230, bg: .2, amp: .6, tick: .6 },
    up: { bp: 2600, q: 2.6, dur: .026, body: 360, bg: .08, amp: .32 }
  };

  let actx = null, noise = null;

  function ctxOf() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
      const len = Math.floor(actx.sampleRate * .25);
      noise = actx.createBuffer(1, len, actx.sampleRate);
      const ch = noise.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function play(p, vol) {
    if (!p || vol <= 0) return;
    const c = ctxOf();
    if (!c) return;
    const t = c.currentTime;
    const detune = 1 + (Math.random() * .1 - .05);
    const out = c.createGain();
    out.gain.value = vol;
    out.connect(c.destination);

    const src = c.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = detune;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = p.bp * detune;
    bp.Q.value = p.q;
    const g = c.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(p.amp, t + .0015);
    g.gain.exponentialRampToValueAtTime(.0001, t + p.dur);
    src.connect(bp).connect(g).connect(out);
    src.start(t, Math.random() * .1);
    src.stop(t + p.dur + .02);

    if (p.body) {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(p.body * detune, t);
      o.frequency.exponentialRampToValueAtTime(p.body * .7, t + p.dur);
      const og = c.createGain();
      og.gain.setValueAtTime(.0001, t);
      og.gain.exponentialRampToValueAtTime(p.bg, t + .003);
      og.gain.exponentialRampToValueAtTime(.0001, t + p.dur);
      o.connect(og).connect(out);
      o.start(t);
      o.stop(t + p.dur + .02);
    }

    if (p.tick) {
      const s = c.createBufferSource();
      s.buffer = noise;
      const hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 5200;
      const tg = c.createGain();
      tg.gain.setValueAtTime(.0001, t);
      tg.gain.exponentialRampToValueAtTime(p.tick * vol * .5, t + .001);
      tg.gain.exponentialRampToValueAtTime(.0001, t + .014);
      s.connect(hp).connect(tg).connect(out);
      s.start(t, Math.random() * .1);
      s.stop(t + .04);
    }
  }

  const voice = document.getElementById('voice');
  const volKb = document.getElementById('volKb');
  const volMs = document.getElementById('volMs');
  const upOn = document.getElementById('upOn');
  const pad = document.getElementById('pad');
  const keyRow = document.getElementById('keyRow');
  const mousePad = document.getElementById('mousePad');
  const countDown = document.getElementById('countDown');
  const countUp = document.getElementById('countUp');
  const wpmEl = document.getElementById('wpm');
  const volKbVal = document.getElementById('volKbVal');
  const volMsVal = document.getElementById('volMsVal');

  if (pad) {
    let downCount = 0, upCount = 0, firstAt = 0, lastAt = 0;

    const pushCap = key => {
      if (!keyRow) return;
      const cap = document.createElement('span');
      cap.className = 'dcap';
      cap.textContent = key.length === 1 ? key.toUpperCase() : key;
      keyRow.appendChild(cap);
      while (keyRow.children.length > 18) keyRow.removeChild(keyRow.firstChild);
    };

    pad.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      ctxOf();
      const p = PRESETS[(voice && voice.value) || 'clicky'].down;
      play(p, (volKb ? volKb.value : 70) / 100);
      pushCap(e.key);
      if (!e.repeat) {
        downCount++;
        const now = Date.now();
        if (!firstAt) firstAt = now;
        lastAt = now;
        countDown.textContent = String(downCount);
      }
    });

    pad.addEventListener('keyup', e => {
      if (upOn && !upOn.checked) return;
      const p = PRESETS[(voice && voice.value) || 'clicky'].up;
      play(p, (volKb ? volKb.value : 70) / 100);
      if (!e.repeat) { upCount++; lastAt = Date.now(); countUp.textContent = String(upCount); }
    });

    setInterval(() => {
      if (!downCount || !firstAt) return;
      const min = (Date.now() - firstAt) / 60000;
      wpmEl.textContent = String(Math.round(downCount / 5 / Math.max(min, .05)));
      if (Date.now() - lastAt > 4000) {
        downCount = 0; upCount = 0; firstAt = 0;
        countDown.textContent = '0';
        countUp.textContent = '0';
      }
    }, 300);
  }

  if (mousePad) {
    const dn = () => {
      ctxOf();
      play(MOUSE.down, (volMs ? volMs.value : 60) / 100);
      mousePad.classList.add('hit');
    };
    const up = () => {
      if (!upOn || upOn.checked) play(MOUSE.up, (volMs ? volMs.value : 60) / 100);
      mousePad.classList.remove('hit');
    };
    mousePad.addEventListener('pointerdown', dn);
    mousePad.addEventListener('pointerup', up);
    mousePad.addEventListener('pointerleave', up);
  }

  voice && voice.addEventListener('change', () => {
    play(PRESETS[voice.value].down, (volKb ? volKb.value : 70) / 100);
  });
  volKb && volKb.addEventListener('input', () => {
    if (volKbVal) volKbVal.textContent = volKb.value;
  });
  volKb && volKb.addEventListener('change', () => {
    play(PRESETS[(voice && voice.value) || 'clicky'].down, volKb.value / 100);
  });
  volMs && volMs.addEventListener('input', () => {
    if (volMsVal) volMsVal.textContent = volMs.value;
  });
  volMs && volMs.addEventListener('change', () => {
    play(MOUSE.down, volMs.value / 100);
  });
})();
