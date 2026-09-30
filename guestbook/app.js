/* XUComer 留言板 —— 访客无需登录，评论存在云数据库 */
(function () {
  'use strict';

  /* publicConfig：这两个值可以出现在前端，服务端按域名校验来源 */
  const ENDPOINT = 'https://xucomer-guestbook.app.workbuddy.host';
  const PUBLISHABLE_KEY = 'wbpk_vOFjIoaEiNMwULCZUhySoh_06j7JNK5kcQq1aGxtP6Sm63xXKW8hfcH';

  const PAGE = 20;          /* 每次加载条数 */
  const COOLDOWN = 15000;   /* 两条留言最小间隔（毫秒） */
  const NICK_KEY = 'xucomer-gb-nick';
  const LAST_KEY = 'xucomer-gb-last';
  const PARENT = 'https://xazbili.github.io';

  const STR = {
    zh_CN: { title:'留言板', lede:'留下你的想法、建议或问题，不需要注册账号。', nickPh:'怎么称呼你？（选填）', textPh:'想说点什么…', send:'发表', sending:'发表中…', more:'加载更多', empty:'还没有留言，来说第一句吧。', loading:'加载中…', fail:'发表失败，请稍后再试。', ok:'发表成功，谢谢！', anon:'匿名', fast:'发得有点快，请等几秒再试。', need:'请先写点内容。', count:'{n} 条留言', offline:'留言加载失败，请刷新页面重试。' },
    zh_TW: { title:'留言板', lede:'留下你的想法、建議或問題，不需要註冊帳號。', nickPh:'怎麼稱呼你？（選填）', textPh:'想說點什麼…', send:'發表', sending:'發表中…', more:'載入更多', empty:'還沒有留言，來說第一句吧。', loading:'載入中…', fail:'發表失敗，請稍後再試。', ok:'發表成功，謝謝！', anon:'匿名', fast:'發得有點快，請等幾秒再試。', need:'請先寫點內容。', count:'{n} 則留言', offline:'留言載入失敗，請重新整理頁面再試。' },
    en: { title:'Guestbook', lede:'Leave a thought, an idea or a question — no account needed.', nickPh:'What should we call you? (optional)', textPh:'Say something…', send:'Post', sending:'Posting…', more:'Load more', empty:'No comments yet — be the first.', loading:'Loading…', fail:"Couldn't post — please try again.", ok:'Posted. Thanks!', anon:'Anonymous', fast:'That was quick — wait a few seconds.', need:'Please write something first.', count:'{n} comments', offline:"Couldn't load comments — refresh and try again." },
    ja: { title:'掲示板', lede:'感想や提案、質問などをどうぞ。アカウント登録は不要です。', nickPh:'お名前（任意）', textPh:'ひとことどうぞ…', send:'投稿', sending:'投稿中…', more:'もっと見る', empty:'まだコメントがありません。最初の一言をどうぞ。', loading:'読み込み中…', fail:'投稿できませんでした。しばらくしてからお試しください。', ok:'投稿しました。ありがとうございます！', anon:'匿名', fast:'投稿が早すぎます。数秒お待ちください。', need:'内容を入力してください。', count:'{n} 件のコメント', offline:'コメントを読み込めませんでした。再読み込みしてください。' },
    ko: { title:'방명록', lede:'생각이나 제안, 질문을 남겨 주세요. 계정은 필요 없습니다.', nickPh:'어떻게 불러드릴까요? (선택)', textPh:'하고 싶은 말…', send:'등록', sending:'등록 중…', more:'더 보기', empty:'아직 댓글이 없습니다. 첫 글을 남겨 보세요.', loading:'불러오는 중…', fail:'등록하지 못했습니다. 잠시 후 다시 시도해 주세요.', ok:'등록했습니다. 감사합니다!', anon:'익명', fast:'너무 빠릅니다. 몇 초 후에 다시 시도해 주세요.', need:'내용을 입력해 주세요.', count:'댓글 {n}개', offline:'댓글을 불러오지 못했습니다. 새로고침해 주세요.' },
    fr: { title:"Livre d'or", lede:'Laissez une idée, une suggestion ou une question — aucun compte requis.', nickPh:'Comment vous appeler ? (facultatif)', textPh:'Dites quelque chose…', send:'Publier', sending:'Publication…', more:'Afficher plus', empty:"Aucun message pour l'instant — soyez le premier.", loading:'Chargement…', fail:'Publication impossible, réessayez plus tard.', ok:'Publié. Merci !', anon:'Anonyme', fast:'C\u2019est un peu rapide — attendez quelques secondes.', need:"Écrivez d'abord quelque chose.", count:'{n} messages', offline:'Impossible de charger les messages — actualisez la page.' },
    de: { title:'Gästebuch', lede:'Hinterlasse eine Idee, einen Vorschlag oder eine Frage — kein Konto nötig.', nickPh:'Wie sollen wir dich nennen? (optional)', textPh:'Schreib etwas…', send:'Absenden', sending:'Wird gesendet…', more:'Mehr laden', empty:'Noch keine Beiträge — sei die erste Person.', loading:'Wird geladen…', fail:'Senden fehlgeschlagen — bitte später erneut versuchen.', ok:'Gesendet. Danke!', anon:'Anonym', fast:'Etwas schnell — warte ein paar Sekunden.', need:'Bitte zuerst etwas schreiben.', count:'{n} Beiträge', offline:'Beiträge konnten nicht geladen werden — Seite neu laden.' },
    es: { title:'Libro de visitas', lede:'Deja una idea, una sugerencia o una pregunta: no hace falta cuenta.', nickPh:'¿Cómo te llamamos? (opcional)', textPh:'Escribe algo…', send:'Publicar', sending:'Publicando…', more:'Cargar más', empty:'Aún no hay comentarios: sé el primero.', loading:'Cargando…', fail:'No se pudo publicar; inténtalo más tarde.', ok:'Publicado. ¡Gracias!', anon:'Anónimo', fast:'Vas muy rápido; espera unos segundos.', need:'Escribe algo primero.', count:'{n} comentarios', offline:'No se pudieron cargar los comentarios; recarga la página.' },
    pt: { title:'Livro de visitas', lede:'Deixe uma ideia, sugestão ou pergunta — não precisa de conta.', nickPh:'Como devemos chamar você? (opcional)', textPh:'Escreva algo…', send:'Publicar', sending:'Publicando…', more:'Carregar mais', empty:'Ainda não há comentários — seja o primeiro.', loading:'Carregando…', fail:'Não foi possível publicar. Tente mais tarde.', ok:'Publicado. Obrigado!', anon:'Anônimo', fast:'Muito rápido — espere alguns segundos.', need:'Escreva algo primeiro.', count:'{n} comentários', offline:'Não foi possível carregar os comentários — recarregue a página.' },
    ru: { title:'Гостевая книга', lede:'Оставьте мысль, идею или вопрос — аккаунт не нужен.', nickPh:'Как вас называть? (необязательно)', textPh:'Напишите что-нибудь…', send:'Отправить', sending:'Отправка…', more:'Показать ещё', empty:'Комментариев пока нет — будьте первым.', loading:'Загрузка…', fail:'Не удалось отправить — попробуйте позже.', ok:'Отправлено. Спасибо!', anon:'Аноним', fast:'Слишком быстро — подождите несколько секунд.', need:'Сначала напишите что-нибудь.', count:'Комментариев: {n}', offline:'Не удалось загрузить комментарии — обновите страницу.' },
    it: { title:'Libro degli ospiti', lede:"Lascia un'idea, un suggerimento o una domanda: nessun account richiesto.", nickPh:'Come ti chiamiamo? (facoltativo)', textPh:'Scrivi qualcosa…', send:'Pubblica', sending:'Pubblicazione…', more:'Carica altro', empty:'Nessun commento — scrivi il primo.', loading:'Caricamento…', fail:'Pubblicazione non riuscita, riprova più tardi.', ok:'Pubblicato. Grazie!', anon:'Anonimo', fast:'Troppo veloce: attendi qualche secondo.', need:'Scrivi prima qualcosa.', count:'{n} commenti', offline:'Impossibile caricare i commenti: ricarica la pagina.' },
    nl: { title:'Gastenboek', lede:'Laat een idee, suggestie of vraag achter — geen account nodig.', nickPh:'Hoe mogen we je noemen? (optioneel)', textPh:'Schrijf iets…', send:'Plaatsen', sending:'Bezig met plaatsen…', more:'Meer laden', empty:'Nog geen berichten — wees de eerste.', loading:'Laden…', fail:'Plaatsen mislukt — probeer het later opnieuw.', ok:'Geplaatst. Bedankt!', anon:'Anoniem', fast:'Dat ging snel — wacht een paar seconden.', need:'Schrijf eerst iets.', count:'{n} berichten', offline:'Berichten konden niet worden geladen — ververs de pagina.' },
    pl: { title:'Księga gości', lede:'Zostaw myśl, pomysł albo pytanie — konto nie jest potrzebne.', nickPh:'Jak mamy cię nazywać? (opcjonalnie)', textPh:'Napisz coś…', send:'Opublikuj', sending:'Publikowanie…', more:'Wczytaj więcej', empty:'Brak komentarzy — napisz pierwszy.', loading:'Wczytywanie…', fail:'Nie udało się opublikować — spróbuj później.', ok:'Opublikowano. Dziękujemy!', anon:'Anonim', fast:'Trochę za szybko — poczekaj kilka sekund.', need:'Najpierw coś napisz.', count:'Komentarze: {n}', offline:'Nie udało się wczytać komentarzy — odśwież stronę.' },
    tr: { title:'Konuk defteri', lede:'Bir fikir, öneri ya da soru bırak — hesap gerekmez.', nickPh:'Sana nasıl hitap edelim? (isteğe bağlı)', textPh:'Bir şeyler yaz…', send:'Gönder', sending:'Gönderiliyor…', more:'Daha fazla yükle', empty:'Henüz yorum yok — ilkini sen yaz.', loading:'Yükleniyor…', fail:'Gönderilemedi — lütfen sonra tekrar dene.', ok:'Gönderildi. Teşekkürler!', anon:'Anonim', fast:'Biraz hızlı oldu — birkaç saniye bekle.', need:'Önce bir şeyler yaz.', count:'{n} yorum', offline:'Yorumlar yüklenemedi — sayfayı yenile.' },
    ar: { title:'لوحة الزوار', lede:'اترك فكرة أو اقتراحًا أو سؤالًا — لا حاجة إلى حساب.', nickPh:'بماذا نناديك؟ (اختياري)', textPh:'اكتب شيئًا…', send:'نشر', sending:'جارٍ النشر…', more:'تحميل المزيد', empty:'لا توجد تعليقات بعد — كن الأول.', loading:'جارٍ التحميل…', fail:'تعذّر النشر — حاول لاحقًا.', ok:'تم النشر. شكرًا!', anon:'مجهول', fast:'كان ذلك سريعًا — انتظر بضع ثوانٍ.', need:'اكتب شيئًا أولًا.', count:'{n} تعليق', offline:'تعذّر تحميل التعليقات — أعد تحميل الصفحة.' },
    th: { title:'สมุดเยี่ยมชม', lede:'ฝากความคิด ข้อเสนอ หรือคำถามไว้ได้เลย ไม่ต้องมีบัญชี', nickPh:'ให้เราเรียกคุณว่าอะไร (ไม่บังคับ)', textPh:'เขียนอะไรสักหน่อย…', send:'โพสต์', sending:'กำลังโพสต์…', more:'โหลดเพิ่มเติม', empty:'ยังไม่มีความคิดเห็น มาเป็นคนแรกกัน', loading:'กำลังโหลด…', fail:'โพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง', ok:'โพสต์แล้ว ขอบคุณ!', anon:'ไม่ระบุชื่อ', fast:'เร็วไปนิด รอสักสองสามวินาที', need:'เขียนอะไรก่อนนะ', count:'{n} ความคิดเห็น', offline:'โหลดความคิดเห็นไม่สำเร็จ รีเฟรชหน้า' },
    vi: { title:'Sổ lưu bút', lede:'Để lại suy nghĩ, góp ý hoặc câu hỏi — không cần tài khoản.', nickPh:'Gọi bạn là gì? (không bắt buộc)', textPh:'Viết gì đó…', send:'Đăng', sending:'Đang đăng…', more:'Tải thêm', empty:'Chưa có bình luận — hãy là người đầu tiên.', loading:'Đang tải…', fail:'Không đăng được — vui lòng thử lại sau.', ok:'Đã đăng. Cảm ơn!', anon:'Ẩn danh', fast:'Hơi nhanh — đợi vài giây nhé.', need:'Hãy viết gì đó trước.', count:'{n} bình luận', offline:'Không tải được bình luận — tải lại trang.' },
    id: { title:'Buku tamu', lede:'Tinggalkan ide, saran, atau pertanyaan — tanpa akun.', nickPh:'Kami panggil kamu apa? (opsional)', textPh:'Tulis sesuatu…', send:'Kirim', sending:'Mengirim…', more:'Muat lagi', empty:'Belum ada komentar — jadilah yang pertama.', loading:'Memuat…', fail:'Gagal mengirim — coba lagi nanti.', ok:'Terkirim. Terima kasih!', anon:'Anonim', fast:'Terlalu cepat — tunggu beberapa detik.', need:'Tulis sesuatu dulu.', count:'{n} komentar', offline:'Gagal memuat komentar — muat ulang halaman.' }
  };

  const $ = id => document.getElementById(id);
  const el = { form:$('form'), nick:$('nick'), text:$('text'), hp:$('hp'), msg:$('msg'),
               len:$('len'), send:$('send'), list:$('list'), more:$('more'),
               count:$('tCount'), title:document.title };

  let lang = 'zh_CN';
  let total = 0;
  let loaded = 0;
  let busy = false;
  let cloud = null;

  const t = k => (STR[lang] || STR.en)[k] || STR.en[k];

  /* ---------------- 初始化云服务客户端 ---------------- */
  try {
    if (window.WorkBuddyCloud && window.WorkBuddyCloud.createWorkBuddyCloud) {
      cloud = window.WorkBuddyCloud.createWorkBuddyCloud({
        endpoint: ENDPOINT,
        publishableKey: PUBLISHABLE_KEY
      });
    }
  } catch (e) {
    cloud = null;
  }

  /* ---------------- 主题 ---------------- */
  function applyTheme(th) {
    if (!th) return;
    const r = document.documentElement.style;
    const map = { panel:'--panel', card:'--card', input:'--input', accent:'--accent',
                  text:'--text', dim:'--dim', line:'--line' };
    Object.keys(map).forEach(k => {
      if (th[k]) r.setProperty(map[k], th[k]);
    });
    document.documentElement.style.colorScheme = th.light ? 'light' : 'dark';
  }

  /* ---------------- 语言 ---------------- */
  function applyLang(code) {
    const key = STR[code] ? code : (String(code || '').indexOf('zh') === 0
      ? (String(code).toUpperCase().indexOf('TW') > -1 ? 'zh_TW' : 'zh_CN') : 'en');
    lang = key;
    document.documentElement.lang = key.replace('_', '-');
    document.documentElement.dir = key === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title') + ' · XUComer';
    el.nick.placeholder = t('nickPh');
    el.text.placeholder = t('textPh');
    el.send.textContent = t('send');
    el.more.textContent = t('more');
    renderCount();
    if (loaded === 0 && !busy) renderPlaceholder(t('empty'));
    else if (busy && loaded === 0) renderPlaceholder(t('loading'));
  }

  function renderCount() {
    el.count.textContent = t('count').replace('{n}', String(total));
  }

  function renderPlaceholder(text) {
    el.list.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = text;
    el.list.appendChild(li);
  }

  function showMsg(text, kind) {
    el.msg.textContent = text || '';
    el.msg.className = 'msg' + (kind ? ' ' + kind : '');
  }

  /* ---------------- 渲染一条留言 ---------------- */
  function fmtTime(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    try {
      return d.toLocaleString(lang.replace('_', '-'), {
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit'
      });
    } catch (e) {
      return d.toISOString().slice(0, 16).replace('T', ' ');
    }
  }

  function renderItem(row, prepend) {
    const li = document.createElement('li');
    li.className = 'item';

    const top = document.createElement('div');
    top.className = 'item-top';

    const nick = document.createElement('span');
    nick.className = 'item-nick';
    nick.textContent = (row.nick && String(row.nick).trim()) || t('anon');

    const time = document.createElement('span');
    time.className = 'item-time';
    time.textContent = fmtTime(row.created_at);

    top.appendChild(nick);
    top.appendChild(time);

    const body = document.createElement('p');
    body.className = 'item-body';
    body.textContent = row.body;

    li.appendChild(top);
    li.appendChild(body);

    if (prepend && el.list.firstChild) el.list.insertBefore(li, el.list.firstChild);
    else el.list.appendChild(li);
  }

  /* ---------------- 读取 ---------------- */
  async function load(reset) {
    if (!cloud) { renderPlaceholder(t('offline')); return; }
    if (busy) return;
    busy = true;

    if (reset) {
      loaded = 0;
      el.list.innerHTML = '';
      renderPlaceholder(t('loading'));
      el.more.hidden = true;
    }

    const { data, error, count } = await cloud.database
      .from('comments')
      .select('id, nick, body, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(loaded, loaded + PAGE - 1);

    busy = false;

    if (error) {
      if (loaded === 0) renderPlaceholder(t('offline'));
      el.more.hidden = true;
      return;
    }

    if (reset && loaded === 0) el.list.innerHTML = '';

    const rows = Array.isArray(data) ? data : [];
    if (typeof count === 'number') total = count;
    rows.forEach(r => renderItem(r, false));
    loaded += rows.length;

    if (loaded === 0) renderPlaceholder(t('empty'));

    renderCount();
    el.more.hidden = loaded >= total;
    reportHeight();
  }

  /* ---------------- 发表 ---------------- */
  async function submit(e) {
    e.preventDefault();
    if (el.send.disabled) return;

    const text = el.text.value.trim();
    const nick = el.nick.value.trim();

    if (el.hp.value) return;                       /* 蜜罐命中，静默丢弃 */
    if (!text) { showMsg(t('need'), 'err'); el.text.focus(); return; }

    const last = Number(localStorage.getItem(LAST_KEY) || 0);
    if (Date.now() - last < COOLDOWN) { showMsg(t('fast'), 'err'); return; }

    if (!cloud) { showMsg(t('fail'), 'err'); return; }

    el.send.disabled = true;
    const label = el.send.textContent;
    el.send.textContent = t('sending');
    showMsg('');

    const { data, error } = await cloud.database
      .from('comments')
      .insert({ nick: nick || t('anon'), body: text })
      .select();

    el.send.disabled = false;
    el.send.textContent = label;

    if (error) {
      showMsg(t('fail'), 'err');
      return;
    }

    localStorage.setItem(LAST_KEY, String(Date.now()));
    if (nick) localStorage.setItem(NICK_KEY, nick);

    el.text.value = '';
    updateLen();
    showMsg(t('ok'), 'ok');

    const row = Array.isArray(data) && data[0] ? data[0] : { nick: nick || t('anon'), body: text, created_at: new Date().toISOString() };
    const old = el.list.querySelector('.empty');
    if (old) old.remove();
    renderItem(row, false);
    loaded += 1;
    total += 1;
    renderCount();
    el.more.hidden = loaded >= total;
    reportHeight();
  }

  function updateLen() {
    el.len.textContent = el.text.value.length + ' / 600';
  }

  /* ---------------- 高度上报给父页面 ---------------- */
  function reportHeight() {
    if (window.parent === window) return;
    let h = document.documentElement.scrollHeight;
    h = Math.max(h, 200);
    try { window.parent.postMessage({ gb: { height: h } }, '*'); } catch (e) {}
  }

  /* ---------------- 接收父页面消息 ---------------- */
  window.addEventListener('message', function (e) {
    const d = e.data;
    if (!d || !d.gb) return;
    if (d.gb.theme) applyTheme(d.gb.theme);
    if (d.gb.lang) applyLang(d.gb.lang);
  });

  /* ---------------- 事件绑定 ---------------- */
  el.form.addEventListener('submit', submit);
  el.text.addEventListener('input', updateLen);
  el.more.addEventListener('click', () => load(false));
  window.addEventListener('resize', reportHeight);

  const savedNick = localStorage.getItem(NICK_KEY);
  if (savedNick) el.nick.value = savedNick;

  /* 父页面会通过 URL 参数带初始主题与语言，避免加载时闪一下 */
  (function readParams() {
    let p;
    try { p = new URLSearchParams(location.search); } catch (e) { return; }
    const lp = p.get('lang');
    if (lp) applyLang(lp);
    const th = {};
    ['panel', 'card', 'input', 'accent', 'text', 'dim', 'line'].forEach(k => {
      const v = p.get(k);
      if (v) th[k] = v;
    });
    if (th.panel) {
      const l = p.get('light');
      th.light = (l === '1' || l === 'true');
      applyTheme(th);
    }
  })();

  applyLang(lang);
  updateLen();

  if (document.readyState === 'complete') { load(true); reportHeight(); }
  else window.addEventListener('load', () => { load(true); reportHeight(); });
  setTimeout(reportHeight, 300);
})();
