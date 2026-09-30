(function () {
  'use strict';

  const ENDPOINT = 'https://xucomer-guestbook.app.workbuddy.host';
  const PUBLISHABLE_KEY = 'wbpk_vOFjIoaEiNMwULCZUhySoh_06j7JNK5kcQq1aGxtP6Sm63xXKW8hfcH';

  const PAGE = 20;
  const COOLDOWN = 10000;
  const NICK_KEY = 'xucomer-gb-nick';
  const AVA_KEY = 'xucomer-gb-avatar';
  const LAST_KEY = 'xucomer-gb-last';
  const SID_KEY = 'xucomer-gb-sid';
  const AVA_MAX = 8000;
  const MINE_KEY = 'xucomer-gb-mine';
  const PARENT = 'https://xazbili.github.io';

  const STR = {
    zh_CN: { title:'留言板', lede:'留下你的想法、建议或问题，不需要注册账号。', nickPh:'怎么称呼你？（选填）', textPh:'想说点什么…', send:'发表', sending:'发表中…', prev:'上一页', next:'下一页', page:'第 {a} / {b} 页', empty:'还没有留言，来说第一句吧。', loading:'加载中…', fail:'发表失败，请稍后再试。', ok:'发表成功，谢谢！', anon:'匿名', fast:'发得有点快，请等几秒再试。', need:'请先写点内容。', count:'{n} 条留言', offline:'留言加载失败，请刷新页面重试。' , dev:'开发者', reserved:'「XUComer」是开发者专属昵称，请换一个。' , out:'退出登录', rpl:'回复', rplPh:'写下你的回复…', cd:'请等 {n} 秒再发送。', ops:'更多操作', del:'删除', delConfirm:'再点一次确认删除', delOk:'已删除', delNo:'删不掉这条留言', pinLbl:'置顶', pinOn:'置顶到最前', pinOff:'取消置顶', pinOk:'已置顶', pinUndo:'已取消置顶', pinFail:'操作失败，请稍后再试。',  ava:'头像', avaDel:'移除头像', avaBad:'这张图片读不出来，换一张试试。', avaBig:'图片太大了，换一张小一点的。', pinnedTag:'置顶', emailPh:'邮箱', codePh:'验证码', getCode:'获取验证码', codeSent:'验证码已发到邮箱，去查收吧', codeFail:'验证码发不出去，过一会儿再试', codeBad:'验证码不对或已失效', badMail:'邮箱看着不对', logged:'已登录：', needNick:'先给自己起个名字', nickTaken:'这个名字已经有人用了', setNickPh:'给自己起个名字（不能和别人重复）', loginTip:'登录后在别的设备也能删自己的留言，不登录照样可以匿名发言。', logging:'登录中…', login:'登录' },
    zh_TW: { title:'留言板', lede:'留下你的想法、建議或問題，不需要註冊帳號。', nickPh:'怎麼稱呼你？（選填）', textPh:'想說點什麼…', send:'發表', sending:'發表中…', prev:'上一頁', next:'下一頁', page:'第 {a} / {b} 頁', empty:'還沒有留言，來說第一句吧。', loading:'載入中…', fail:'發表失敗，請稍後再試。', ok:'發表成功，謝謝！', anon:'匿名', fast:'發得有點快，請等幾秒再試。', need:'請先寫點內容。', count:'{n} 則留言', offline:'留言載入失敗，請重新整理頁面再試。' , dev:'開發者', reserved:'「XUComer」是開發者專屬暱稱，請換一個。' , out:'登出', rpl:'回覆', rplPh:'寫下你的回覆…', cd:'請等 {n} 秒後再發送。', ops:'更多操作', del:'刪除', delConfirm:'再點一次確認刪除', delOk:'已刪除', delNo:'刪不掉這則留言', pinLbl:'置頂', pinOn:'置頂到最前', pinOff:'取消置頂', pinOk:'已置頂', pinUndo:'已取消置頂', pinFail:'操作失敗，請稍後再試。',  ava:'頭像', avaDel:'移除頭像', avaBad:'這張圖片讀不出來，換一張試試。', avaBig:'圖片太大了，換一張小一點的。', pinnedTag:'置頂', emailPh:'信箱', codePh:'驗證碼', getCode:'取得驗證碼', codeSent:'驗證碼已寄到信箱，去收信吧', codeFail:'驗證碼寄不出去，過一會兒再試', codeBad:'驗證碼不對或已失效', badMail:'信箱格式不對', logged:'已登入：', needNick:'先給自己取個名字', nickTaken:'這個名字已經有人用了', setNickPh:'給自己取個名字（不能和別人重複）', loginTip:'登入後在別的裝置也能刪自己的留言，不登入照樣可以匿名發言。', logging:'登入中…', login:'登入' },
    en: { title:'Guestbook', lede:'Leave a thought, an idea or a question — no account needed.', nickPh:'What should we call you? (optional)', textPh:'Say something…', send:'Post', sending:'Posting…', prev:'Prev', next:'Next', page:'Page {a} / {b}', empty:'No comments yet — be the first.', loading:'Loading…', fail:"Couldn't post — please try again.", ok:'Posted. Thanks!', anon:'Anonymous', fast:'That was quick — wait a few seconds.', need:'Please write something first.', count:'{n} comments', offline:"Couldn't load comments — refresh and try again." , dev:'Developer', reserved:'"XUComer" is reserved for the developer — please pick another name.' , out:'Log out', rpl:'Reply', rplPh:'Write a reply…', cd:'Wait {n}s before posting again.', ops:'More actions', del:'Delete', delConfirm:'Tap again to confirm', delOk:'Deleted', delNo:'You cannot delete that one', pinLbl:'Pin', pinOn:'Pin to top', pinOff:'Unpin', pinOk:'Pinned', pinUndo:'Unpinned', pinFail:'Something went wrong — please retry.',  ava:'Avatar', avaDel:'Remove avatar', avaBad:'That image cannot be read — try another one.', avaBig:'That image is too big — pick a smaller one.', pinnedTag:'Pinned', emailPh:'Email', codePh:'Code', getCode:'Get code', codeSent:'Check your inbox, the code is on its way', codeFail:'Could not send the code, try again later', codeBad:'Wrong or expired code', badMail:'That email does not look right', logged:'Signed in as ', needNick:'Pick a name first', nickTaken:'That name is already taken', setNickPh:'Pick a name (cannot repeat someone else)', loginTip:'Sign in to manage your own posts from any device. Posting anonymously still works.', logging:'Signing in…', login:'Sign in' },
    ja: { title:'掲示板', lede:'感想や提案、質問などをどうぞ。アカウント登録は不要です。', nickPh:'お名前（任意）', textPh:'ひとことどうぞ…', send:'投稿', sending:'投稿中…', prev:'前へ', next:'次へ', page:'{a} / {b} ページ', empty:'まだコメントがありません。最初の一言をどうぞ。', loading:'読み込み中…', fail:'投稿できませんでした。しばらくしてからお試しください。', ok:'投稿しました。ありがとうございます！', anon:'匿名', fast:'投稿が早すぎます。数秒お待ちください。', need:'内容を入力してください。', count:'{n} 件のコメント', offline:'コメントを読み込めませんでした。再読み込みしてください。' , dev:'開発者', reserved:'「XUComer」は開発者専用の名前です。別の名前をお選びください。' , out:'ログアウト', rpl:'返信', rplPh:'返信を書く…', cd:'あと {n} 秒お待ちください。', ops:'操作', del:'削除', delConfirm:'もう一度押して確定', delOk:'削除しました', delNo:'このコメントは削除できません', pinLbl:'固定', pinOn:'トップに固定', pinOff:'固定を解除', pinOk:'固定しました', pinUndo:'固定を解除しました', pinFail:'操作に失敗しました。もう一度お試しください。',  ava:'アイコン', avaDel:'アイコンを削除', avaBad:'この画像は読み込めません。別の画像をお試しください。', avaBig:'画像が大きすぎます。もう少し小さいものを選んでください。', pinnedTag:'固定済み', emailPh:'メールアドレス', codePh:'認証コード', getCode:'コードを受け取る', codeSent:'コードをメールで送りました', codeFail:'コードを送信できませんでした', codeBad:'コードが違うか期限切れです', badMail:'メールアドレスが正しくありません', logged:'ログイン中：', needNick:'まず名前を決めてください', nickTaken:'その名前は既に使われています', setNickPh:'名前を決めてください（他人と重複不可）', loginTip:'ログインすると別の端末からでも自分の投稿を削除できます。ログインしなくても匿名で投稿できます。', logging:'ログイン中…', login:'ログイン' },
    ko: { title:'방명록', lede:'생각이나 제안, 질문을 남겨 주세요. 계정은 필요 없습니다.', nickPh:'어떻게 불러드릴까요? (선택)', textPh:'하고 싶은 말…', send:'등록', sending:'등록 중…', prev:'이전', next:'다음', page:'{a} / {b} 페이지', empty:'아직 댓글이 없습니다. 첫 글을 남겨 보세요.', loading:'불러오는 중…', fail:'등록하지 못했습니다. 잠시 후 다시 시도해 주세요.', ok:'등록했습니다. 감사합니다!', anon:'익명', fast:'너무 빠릅니다. 몇 초 후에 다시 시도해 주세요.', need:'내용을 입력해 주세요.', count:'댓글 {n}개', offline:'댓글을 불러오지 못했습니다. 새로고침해 주세요.' , dev:'개발자', reserved:'"XUComer"는 개발자 전용 이름입니다. 다른 이름을 써 주세요.' , out:'로그아웃', rpl:'답글', rplPh:'답글을 남겨 주세요…', cd:'{n}초 후에 다시 시도해 주세요.', ops:'추가 작업', del:'삭제', delConfirm:'한 번 더 눌러 확인', delOk:'삭제되었습니다', delNo:'이 댓글은 삭제할 수 없습니다', pinLbl:'고정', pinOn:'상단에 고정', pinOff:'고정 해제', pinOk:'고정되었습니다', pinUndo:'고정이 해제되었습니다', pinFail:'작업에 실패했습니다. 다시 시도해 주세요.',  ava:'프로필', avaDel:'프로필 삭제', avaBad:'이 이미지는 읽을 수 없습니다. 다른 이미지를 사용해 보세요.', avaBig:'이미지가 너무 큽니다. 더 작은 이미지를 선택해 주세요.', pinnedTag:'고정됨', emailPh:'이메일', codePh:'인증 코드', getCode:'코드 받기', codeSent:'코드를 메일로 보냈습니다', codeFail:'코드를 보내지 못했습니다', codeBad:'코드가 틀렸거나 만료되었습니다', badMail:'이메일 형식이 올바르지 않습니다', logged:'로그인 중:', needNick:'먼저 이름을 정하세요', nickTaken:'이미 사용 중인 이름입니다', setNickPh:'이름을 정하세요(다른 사람과 중복 불가)', loginTip:'로그인하면 다른 기기에서도 내 글을 삭제할 수 있습니다. 로그인하지 않아도 익명으로 남길 수 있습니다.', logging:'로그인 중…', login:'로그인' },
    fr: { title:"Livre d'or", lede:'Laissez une idée, une suggestion ou une question — aucun compte requis.', nickPh:'Comment vous appeler ? (facultatif)', textPh:'Dites quelque chose…', send:'Publier', sending:'Publication…', prev:'Précédent', next:'Suivant', page:'Page {a} / {b}', empty:"Aucun message pour l'instant — soyez le premier.", loading:'Chargement…', fail:'Publication impossible, réessayez plus tard.', ok:'Publié. Merci !', anon:'Anonyme', fast:'C\u2019est un peu rapide — attendez quelques secondes.', need:"Écrivez d'abord quelque chose.", count:'{n} messages', offline:'Impossible de charger les messages — actualisez la page.' , dev:'Développeur', reserved:'« XUComer » est réservé au développeur — choisissez un autre nom.' , out:'Déconnexion', rpl:'Répondre', rplPh:'Écrivez une réponse…', cd:'Attendez {n} s avant de republier.', ops:'Autres actions', del:'Supprimer', delConfirm:'Appuyez encore pour confirmer', delOk:'Supprimé', delNo:'Suppression impossible', pinLbl:'Épingler', pinOn:'Épingler en haut', pinOff:'Désépingler', pinOk:'Épinglé', pinUndo:'Épinglage annulé', pinFail:'Opération échouée — réessayez.',  ava:'Avatar', avaDel:'Retirer avatar', avaBad:'Image illisible — essayez-en une autre.', avaBig:'Image trop lourde — choisissez-en une plus petite.', pinnedTag:'Épinglé', emailPh:'E-mail', codePh:'Code', getCode:'Recevoir le code', codeSent:'Code envoyé par e-mail', codeFail:'Envoi impossible, réessayez plus tard', codeBad:'Code erroné ou expiré', badMail:'Cet e-mail semble incorrect', logged:'Connecté : ', needNick:'Choisissez un nom', nickTaken:'Ce nom est déjà pris', setNickPh:'Choisissez un nom (unique)', loginTip:'Connectez-vous pour gérer vos messages depuis n importe quel appareil. Sans connexion, vous pouvez toujours écrire en anonyme.', logging:'Connexion…', login:'Se connecter' },
    de: { title:'Gästebuch', lede:'Hinterlasse eine Idee, einen Vorschlag oder eine Frage — kein Konto nötig.', nickPh:'Wie sollen wir dich nennen? (optional)', textPh:'Schreib etwas…', send:'Absenden', sending:'Wird gesendet…', prev:'Zurück', next:'Weiter', page:'Seite {a} / {b}', empty:'Noch keine Beiträge — sei die erste Person.', loading:'Wird geladen…', fail:'Senden fehlgeschlagen — bitte später erneut versuchen.', ok:'Gesendet. Danke!', anon:'Anonym', fast:'Etwas schnell — warte ein paar Sekunden.', need:'Bitte zuerst etwas schreiben.', count:'{n} Beiträge', offline:'Beiträge konnten nicht geladen werden — Seite neu laden.' , dev:'Entwickler', reserved:'"XUComer" ist dem Entwickler vorbehalten — bitte wähle einen anderen Namen.' , out:'Abmelden', rpl:'Antworten', rplPh:'Antwort schreiben…', cd:'Bitte {n} s warten.', ops:'Weitere Aktionen', del:'Löschen', delConfirm:'Noch einmal tippen zum Bestätigen', delOk:'Gelöscht', delNo:'Dieser Beitrag kann nicht gelöscht werden', pinLbl:'Anpinnen', pinOn:'Oben anpinnen', pinOff:'Anpinnen aufheben', pinOk:'Angepinnt', pinUndo:'Anpinnen aufgehoben', pinFail:'Fehlgeschlagen — bitte erneut versuchen.',  ava:'Profilbild', avaDel:'Profilbild entfernen', avaBad:'Das Bild kann nicht gelesen werden — nimm ein anderes.', avaBig:'Das Bild ist zu groß — nimm ein kleineres.', pinnedTag:'Angepinnt', emailPh:'E-Mail', codePh:'Code', getCode:'Code holen', codeSent:'Code ist per E-Mail unterwegs', codeFail:'Code konnte nicht gesendet werden', codeBad:'Code falsch oder abgelaufen', badMail:'Diese E-Mail stimmt nicht', logged:'Angemeldet als ', needNick:'Wähle zuerst einen Namen', nickTaken:'Dieser Name ist bereits vergeben', setNickPh:'Wähle einen Namen (einmalig)', loginTip:'Melde dich an, um deine Beiträge auf jedem Gerät zu verwalten. Ohne Anmeldung kannst du weiter anonym schreiben.', logging:'Anmeldung…', login:'Anmelden' },
    es: { title:'Libro de visitas', lede:'Deja una idea, una sugerencia o una pregunta: no hace falta cuenta.', nickPh:'¿Cómo te llamamos? (opcional)', textPh:'Escribe algo…', send:'Publicar', sending:'Publicando…', prev:'Anterior', next:'Siguiente', page:'Página {a} / {b}', empty:'Aún no hay comentarios: sé el primero.', loading:'Cargando…', fail:'No se pudo publicar; inténtalo más tarde.', ok:'Publicado. ¡Gracias!', anon:'Anónimo', fast:'Vas muy rápido; espera unos segundos.', need:'Escribe algo primero.', count:'{n} comentarios', offline:'No se pudieron cargar los comentarios; recarga la página.' , dev:'Desarrollador', reserved:'«XUComer» está reservado para el desarrollador; elige otro nombre.' , out:'Salir', rpl:'Responder', rplPh:'Escribe una respuesta…', cd:'Espera {n} s antes de volver a publicar.', ops:'Más acciones', del:'Eliminar', delConfirm:'Pulsa otra vez para confirmar', delOk:'Eliminado', delNo:'No se puede eliminar este comentario', pinLbl:'Fijar', pinOn:'Fijar arriba', pinOff:'Quitar fijado', pinOk:'Fijado', pinUndo:'Fijado quitado', pinFail:'La operación falló; inténtalo de nuevo.',  ava:'Avatar', avaDel:'Quitar avatar', avaBad:'No se puede leer esa imagen: prueba con otra.', avaBig:'La imagen es demasiado grande: elige una más pequeña.', pinnedTag:'Fijado', emailPh:'Correo', codePh:'Código', getCode:'Obtener código', codeSent:'Código enviado a tu correo', codeFail:'No se pudo enviar el código', codeBad:'Código incorrecto o caducado', badMail:'Ese correo no parece válido', logged:'Sesión iniciada: ', needNick:'Elige un nombre antes', nickTaken:'Ese nombre ya está en uso', setNickPh:'Elige un nombre (que no se repita)', loginTip:'Inicia sesión para gestionar tus mensajes desde cualquier dispositivo. Sin sesión puedes seguir escribiendo de forma anónima.', logging:'Iniciando…', login:'Entrar' },
    pt: { title:'Livro de visitas', lede:'Deixe uma ideia, sugestão ou pergunta — não precisa de conta.', nickPh:'Como devemos chamar você? (opcional)', textPh:'Escreva algo…', send:'Publicar', sending:'Publicando…', prev:'Anterior', next:'Próxima', page:'Página {a} / {b}', empty:'Ainda não há comentários — seja o primeiro.', loading:'Carregando…', fail:'Não foi possível publicar. Tente mais tarde.', ok:'Publicado. Obrigado!', anon:'Anônimo', fast:'Muito rápido — espere alguns segundos.', need:'Escreva algo primeiro.', count:'{n} comentários', offline:'Não foi possível carregar os comentários — recarregue a página.' , dev:'Desenvolvedor', reserved:'"XUComer" é reservado ao desenvolvedor — escolha outro nome.' , out:'Sair', rpl:'Responder', rplPh:'Escreva uma resposta…', cd:'Espere {n} s antes de publicar de novo.', ops:'Mais ações', del:'Excluir', delConfirm:'Toque novamente para confirmar', delOk:'Excluído', delNo:'Não é possível excluir este comentário', pinLbl:'Fixar', pinOn:'Fixar no topo', pinOff:'Desafixar', pinOk:'Fixado', pinUndo:'Fixação removida', pinFail:'A operação falhou — tente de novo.',  ava:'Avatar', avaDel:'Remover avatar', avaBad:'Não foi possível ler essa imagem — tente outra.', avaBig:'A imagem é grande demais — escolha uma menor.', pinnedTag:'Fixado', emailPh:'E-mail', codePh:'Código', getCode:'Receber código', codeSent:'Código enviado para o e-mail', codeFail:'Não foi possível enviar o código', codeBad:'Código errado ou expirado', badMail:'Esse e-mail não parece válido', logged:'Sessão iniciada: ', needNick:'Escolha um nome primeiro', nickTaken:'Esse nome já está em uso', setNickPh:'Escolha um nome (sem repetir)', loginTip:'Entre para gerenciar suas mensagens em qualquer aparelho. Sem entrar, você ainda pode escrever anonimamente.', logging:'Entrando…', login:'Entrar' },
    ru: { title:'Гостевая книга', lede:'Оставьте мысль, идею или вопрос — аккаунт не нужен.', nickPh:'Как вас называть? (необязательно)', textPh:'Напишите что-нибудь…', send:'Отправить', sending:'Отправка…', prev:'Назад', next:'Далее', page:'Страница {a} / {b}', empty:'Комментариев пока нет — будьте первым.', loading:'Загрузка…', fail:'Не удалось отправить — попробуйте позже.', ok:'Отправлено. Спасибо!', anon:'Аноним', fast:'Слишком быстро — подождите несколько секунд.', need:'Сначала напишите что-нибудь.', count:'Комментариев: {n}', offline:'Не удалось загрузить комментарии — обновите страницу.' , dev:'Разработчик', reserved:'Имя «XUComer» зарезервировано за разработчиком — выберите другое.' , out:'Выйти', rpl:'Ответить', rplPh:'Напишите ответ…', cd:'Подождите {n} с.', ops:'Ещё действия', del:'Удалить', delConfirm:'Нажмите ещё раз для подтверждения', delOk:'Удалено', delNo:'Этот комментарий нельзя удалить', pinLbl:'Закрепить', pinOn:'Закрепить сверху', pinOff:'Открепить', pinOk:'Закреплено', pinUndo:'Закрепление снято', pinFail:'Не удалось выполнить — попробуйте снова.',  ava:'Аватар', avaDel:'Убрать аватар', avaBad:'Не удалось прочитать изображение — попробуйте другое.', avaBig:'Изображение слишком большое — выберите поменьше.', pinnedTag:'Закреплено', emailPh:'E-mail', codePh:'Код', getCode:'Получить код', codeSent:'Код отправлен на почту', codeFail:'Не удалось отправить код', codeBad:'Неверный или устаревший код', badMail:'Похоже, адрес указан неверно', logged:'Вы вошли как ', needNick:'Сначала выберите имя', nickTaken:'Это имя уже занято', setNickPh:'Выберите имя (уникальное)', loginTip:'Войдите, чтобы управлять своими записями с любого устройства. Без входа можно писать анонимно.', logging:'Вход…', login:'Войти' },
    it: { title:'Libro degli ospiti', lede:"Lascia un'idea, un suggerimento o una domanda: nessun account richiesto.", nickPh:'Come ti chiamiamo? (facoltativo)', textPh:'Scrivi qualcosa…', send:'Pubblica', sending:'Pubblicazione…', prev:'Indietro', next:'Avanti', page:'Pagina {a} / {b}', empty:'Nessun commento — scrivi il primo.', loading:'Caricamento…', fail:'Pubblicazione non riuscita, riprova più tardi.', ok:'Pubblicato. Grazie!', anon:'Anonimo', fast:'Troppo veloce: attendi qualche secondo.', need:'Scrivi prima qualcosa.', count:'{n} commenti', offline:'Impossibile caricare i commenti: ricarica la pagina.' , dev:'Sviluppatore', reserved:'"XUComer" è riservato allo sviluppatore: scegli un altro nome.' , out:'Esci', rpl:'Rispondi', rplPh:'Scrivi una risposta…', cd:'Attendi {n} s prima di pubblicare.', ops:'Altre azioni', del:'Elimina', delConfirm:'Premi di nuovo per confermare', delOk:'Eliminato', delNo:'Questo commento non può essere eliminato', pinLbl:'Fissa', pinOn:'Fissa in alto', pinOff:'Togli il fissaggio', pinOk:'Fissato', pinUndo:'Fissaggio rimosso', pinFail:'Operazione non riuscita — riprova.',  ava:'Avatar', avaDel:'Rimuovi avatar', avaBad:'Non riesco a leggere questa immagine: provane un altra.', avaBig:'Immagine troppo grande: scegline una piu piccola.', pinnedTag:'Fissato', emailPh:'E-mail', codePh:'Codice', getCode:'Ricevi codice', codeSent:'Codice inviato per e-mail', codeFail:'Impossibile inviare il codice', codeBad:'Codice errato o scaduto', badMail:'Questa e-mail non sembra corretta', logged:'Accesso attivo: ', needNick:'Scegli un nome prima', nickTaken:'Questo nome è già usato', setNickPh:'Scegli un nome (unico)', loginTip:'Accedi per gestire i tuoi messaggi da qualsiasi dispositivo. Senza accesso puoi ancora scrivere in anonimo.', logging:'Accesso…', login:'Accedi' },
    nl: { title:'Gastenboek', lede:'Laat een idee, suggestie of vraag achter — geen account nodig.', nickPh:'Hoe mogen we je noemen? (optioneel)', textPh:'Schrijf iets…', send:'Plaatsen', sending:'Bezig met plaatsen…', prev:'Vorige', next:'Volgende', page:'Pagina {a} / {b}', empty:'Nog geen berichten — wees de eerste.', loading:'Laden…', fail:'Plaatsen mislukt — probeer het later opnieuw.', ok:'Geplaatst. Bedankt!', anon:'Anoniem', fast:'Dat ging snel — wacht een paar seconden.', need:'Schrijf eerst iets.', count:'{n} berichten', offline:'Berichten konden niet worden geladen — ververs de pagina.' , dev:'Ontwikkelaar', reserved:'"XUComer" is gereserveerd voor de ontwikkelaar — kies een andere naam.' , out:'Uitloggen', rpl:'Antwoorden', rplPh:'Schrijf een antwoord…', cd:'Wacht {n} s voor je opnieuw plaatst.', ops:'Meer acties', del:'Verwijderen', delConfirm:'Nogmaals tikken om te bevestigen', delOk:'Verwijderd', delNo:'Dit bericht kan niet worden verwijderd', pinLbl:'Vastzetten', pinOn:'Bovenaan vastzetten', pinOff:'Vastzetting opheffen', pinOk:'Vastgezet', pinUndo:'Vastzetting opgeheven', pinFail:'Mislukt — probeer het opnieuw.',  ava:'Profielfoto', avaDel:'Profielfoto verwijderen', avaBad:'Deze afbeelding kan niet worden gelezen — probeer een andere.', avaBig:'De afbeelding is te groot — kies een kleinere.', pinnedTag:'Vastgezet', emailPh:'E-mail', codePh:'Code', getCode:'Code ontvangen', codeSent:'De code is per e-mail verstuurd', codeFail:'Kon de code niet versturen', codeBad:'Code klopt niet of is verlopen', badMail:'Dit e-mailadres klopt niet', logged:'Ingelogd als ', needNick:'Kies eerst een naam', nickTaken:'Deze naam is al bezet', setNickPh:'Kies een naam (uniek)', loginTip:'Log in om je berichten op elk apparaat te beheren. Zonder login kun je nog steeds anoniem schrijven.', logging:'Inloggen…', login:'Inloggen' },
    pl: { title:'Księga gości', lede:'Zostaw myśl, pomysł albo pytanie — konto nie jest potrzebne.', nickPh:'Jak mamy cię nazywać? (opcjonalnie)', textPh:'Napisz coś…', send:'Opublikuj', sending:'Publikowanie…', prev:'Poprzednia', next:'Następna', page:'Strona {a} / {b}', empty:'Brak komentarzy — napisz pierwszy.', loading:'Wczytywanie…', fail:'Nie udało się opublikować — spróbuj później.', ok:'Opublikowano. Dziękujemy!', anon:'Anonim', fast:'Trochę za szybko — poczekaj kilka sekund.', need:'Najpierw coś napisz.', count:'Komentarze: {n}', offline:'Nie udało się wczytać komentarzy — odśwież stronę.' , dev:'Twórca', reserved:'Nazwa "XUComer" jest zarezerwowana dla twórcy — wybierz inną.' , out:'Wyloguj', rpl:'Odpowiedz', rplPh:'Napisz odpowiedź…', cd:'Poczekaj {n} s.', ops:'Więcej akcji', del:'Usuń', delConfirm:'Naciśnij ponownie, aby potwierdzić', delOk:'Usunięto', delNo:'Nie można usunąć tego komentarza', pinLbl:'Przypnij', pinOn:'Przypnij na górze', pinOff:'Odepnij', pinOk:'Przypięto', pinUndo:'Przypięcie usunięte', pinFail:'Nie udało się — spróbuj ponownie.',  ava:'Awatar', avaDel:'Usuń awatar', avaBad:'Nie udało się odczytać tego obrazu — spróbuj innego.', avaBig:'Obraz jest za duży — wybierz mniejszy.', pinnedTag:'Przypięty', emailPh:'E-mail', codePh:'Kod', getCode:'Otrzymaj kod', codeSent:'Kod wysłany e-mailem', codeFail:'Nie udało się wysłać kodu', codeBad:'Błędny lub wygasły kod', badMail:'Ten e-mail wygląda na błędny', logged:'Zalogowany jako ', needNick:'Najpierw wybierz nazwę', nickTaken:'Ta nazwa jest już zajęta', setNickPh:'Wybierz nazwę (unikalną)', loginTip:'Zaloguj się, by zarządzać swoimi wpisami na dowolnym urządzeniu. Bez logowania możesz pisać anonimowo.', logging:'Logowanie…', login:'Zaloguj' },
    tr: { title:'Konuk defteri', lede:'Bir fikir, öneri ya da soru bırak — hesap gerekmez.', nickPh:'Sana nasıl hitap edelim? (isteğe bağlı)', textPh:'Bir şeyler yaz…', send:'Gönder', sending:'Gönderiliyor…', prev:'Önceki', next:'Sonraki', page:'Sayfa {a} / {b}', empty:'Henüz yorum yok — ilkini sen yaz.', loading:'Yükleniyor…', fail:'Gönderilemedi — lütfen sonra tekrar dene.', ok:'Gönderildi. Teşekkürler!', anon:'Anonim', fast:'Biraz hızlı oldu — birkaç saniye bekle.', need:'Önce bir şeyler yaz.', count:'{n} yorum', offline:'Yorumlar yüklenemedi — sayfayı yenile.' , dev:'Geliştirici', reserved:'"XUComer" geliştiriciye ayrılmıştır — lütfen başka bir ad seçin.' , out:'Çıkış', rpl:'Yanıtla', rplPh:'Bir yanıt yaz…', cd:'Yeniden göndermek için {n} sn bekle.', ops:'Daha fazla işlem', del:'Sil', delConfirm:'Onaylamak için tekrar dokun', delOk:'Silindi', delNo:'Bu yorum silinemiyor', pinLbl:'Sabitle', pinOn:'Üste sabitle', pinOff:'Sabitlemeyi kaldır', pinOk:'Sabitlendi', pinUndo:'Sabitleme kaldırıldı', pinFail:'İşlem başarısız — tekrar deneyin.',  ava:'Profil', avaDel:'Profili kaldır', avaBad:'Bu görsel okunamadı — başka bir tane dene.', avaBig:'Görsel çok büyük — daha küçük bir tane seç.', pinnedTag:'Sabitlendi', emailPh:'E-posta', codePh:'Kod', getCode:'Kod al', codeSent:'Kod e-postayla gönderildi', codeFail:'Kod gönderilemedi', codeBad:'Kod hatalı veya süresi geçmiş', badMail:'Bu e-posta geçersiz görünüyor', logged:'Oturum açık: ', needNick:'Önce bir isim seç', nickTaken:'Bu isim zaten kullanılıyor', setNickPh:'Bir isim seç (benzersiz)', loginTip:'Oturum açarak kendi yorumlarını her cihazdan yönetebilirsin. Oturum açmadan da anonim yazabilirsin.', logging:'Giriş…', login:'Giriş' },
    ar: { title:'لوحة الزوار', lede:'اترك فكرة أو اقتراحًا أو سؤالًا — لا حاجة إلى حساب.', nickPh:'بماذا نناديك؟ (اختياري)', textPh:'اكتب شيئًا…', send:'نشر', sending:'جارٍ النشر…', prev:'السابق', next:'التالي', page:'صفحة {a} / {b}', empty:'لا توجد تعليقات بعد — كن الأول.', loading:'جارٍ التحميل…', fail:'تعذّر النشر — حاول لاحقًا.', ok:'تم النشر. شكرًا!', anon:'مجهول', fast:'كان ذلك سريعًا — انتظر بضع ثوانٍ.', need:'اكتب شيئًا أولًا.', count:'{n} تعليق', offline:'تعذّر تحميل التعليقات — أعد تحميل الصفحة.' , dev:'المطور', reserved:'الاسم "XUComer" مخصص للمطور — الرجاء اختيار اسم آخر.' , out:'تسجيل الخروج', rpl:'رد', rplPh:'اكتب ردًا…', cd:'انتظر {n} ثانية قبل النشر مجددًا.', ops:'إجراءات أخرى', del:'حذف', delConfirm:'اضغط مرة أخرى للتأكيد', delOk:'تم الحذف', delNo:'لا يمكن حذف هذا التعليق', pinLbl:'تثبيت', pinOn:'تثبيت في الأعلى', pinOff:'إلغاء التثبيت', pinOk:'تم التثبيت', pinUndo:'تم إلغاء التثبيت', pinFail:'تعذر تنفيذ الإجراء — حاول مرة أخرى.',  ava:'الصورة', avaDel:'إزالة الصورة', avaBad:'تعذّر قراءة هذه الصورة — جرّب صورة أخرى.', avaBig:'الصورة كبيرة جدًا — اختر صورة أصغر.', pinnedTag:'مثبت', emailPh:'البريد', codePh:'الرمز', getCode:'أرسل الرمز', codeSent:'أُرسل الرمز إلى بريدك', codeFail:'تعذّر إرسال الرمز', codeBad:'الرمز غير صحيح أو منتهي', badMail:'هذا البريد غير صحيح', logged:'مسجّل الدخول: ', needNick:'اختر اسمًا أولًا', nickTaken:'هذا الاسم مستخدم بالفعل', setNickPh:'اختر اسمًا (لا يكرره أحد)', loginTip:'سجّل الدخول لإدارة تعليقاتك من أي جهاز، وبدون تسجيل يمكنك الكتابة كمجهول', logging:'جارٍ الدخول…', login:'دخول' },
    th: { title:'สมุดเยี่ยมชม', lede:'ฝากความคิด ข้อเสนอ หรือคำถามไว้ได้เลย ไม่ต้องมีบัญชี', nickPh:'ให้เราเรียกคุณว่าอะไร (ไม่บังคับ)', textPh:'เขียนอะไรสักหน่อย…', send:'โพสต์', sending:'กำลังโพสต์…', prev:'ก่อนหน้า', next:'ถัดไป', page:'หน้า {a} / {b}', empty:'ยังไม่มีความคิดเห็น มาเป็นคนแรกกัน', loading:'กำลังโหลด…', fail:'โพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง', ok:'โพสต์แล้ว ขอบคุณ!', anon:'ไม่ระบุชื่อ', fast:'เร็วไปนิด รอสักสองสามวินาที', need:'เขียนอะไรก่อนนะ', count:'{n} ความคิดเห็น', offline:'โหลดความคิดเห็นไม่สำเร็จ รีเฟรชหน้า' , dev:'ผู้พัฒนา', reserved:'ชื่อ "XUComer" สงวนไว้สำหรับผู้พัฒนา กรุณาใช้ชื่ออื่น' , out:'ออกจากระบบ', rpl:'ตอบกลับ', rplPh:'เขียนคำตอบ…', cd:'รออีก {n} วินาทีก่อนโพสต์อีกครั้ง', ops:'การกระทำเพิ่มเติม', del:'ลบ', delConfirm:'แตะอีกครั้งเพื่อยืนยัน', delOk:'ลบแล้ว', delNo:'ไม่สามารถลบความคิดเห็นนี้ได้', pinLbl:'ปักหมุด', pinOn:'ปักหมุดไว้ด้านบน', pinOff:'ยกเลิกปักหมุด', pinOk:'ปักหมุดแล้ว', pinUndo:'ยกเลิกปักหมุดแล้ว', pinFail:'ทำไม่สำเร็จ ลองใหม่',  ava:'รูปโปรไฟล์', avaDel:'ลบรูปโปรไฟล์', avaBad:'อ่านรูปนี้ไม่ได้ ลองรูปอื่น', avaBig:'รูปใหญ่เกินไป เลือกรูปที่เล็กกว่านี้', pinnedTag:'ปักหมุดแล้ว', emailPh:'อีเมล', codePh:'รหัส', getCode:'รับรหัส', codeSent:'ส่งรหัสไปที่อีเมลแล้ว', codeFail:'ส่งรหัสไม่ได้', codeBad:'รหัสไม่ถูกต้องหรือหมดอายุ', badMail:'อีเมลนี้ดูไม่ถูกต้อง', logged:'เข้าสู่ระบบแล้ว: ', needNick:'ตั้งชื่อก่อน', nickTaken:'ชื่อนี้ถูกใช้แล้ว', setNickPh:'ตั้งชื่อของคุณ (ห้ามซ้ำใคร)', loginTip:'เข้าสู่ระบบเพื่อจัดการความเห็นของคุณจากอุปกรณ์ใดก็ได้ ไม่เข้าสู่ระบบก็เขียนแบบไม่ระบุชื่อได้', logging:'กำลังเข้าสู่ระบบ…', login:'เข้าสู่ระบบ' },
    vi: { title:'Sổ lưu bút', lede:'Để lại suy nghĩ, góp ý hoặc câu hỏi — không cần tài khoản.', nickPh:'Gọi bạn là gì? (không bắt buộc)', textPh:'Viết gì đó…', send:'Đăng', sending:'Đang đăng…', prev:'Trước', next:'Sau', page:'Trang {a} / {b}', empty:'Chưa có bình luận — hãy là người đầu tiên.', loading:'Đang tải…', fail:'Không đăng được — vui lòng thử lại sau.', ok:'Đã đăng. Cảm ơn!', anon:'Ẩn danh', fast:'Hơi nhanh — đợi vài giây nhé.', need:'Hãy viết gì đó trước.', count:'{n} bình luận', offline:'Không tải được bình luận — tải lại trang.' , dev:'Nhà phát triển', reserved:'"XUComer" là tên dành riêng cho nhà phát triển — hãy chọn tên khác.' , out:'Đăng xuất', rpl:'Trả lời', rplPh:'Viết phản hồi…', cd:'Đợi {n} giây trước khi đăng lại.', ops:'Thao tác khác', del:'Xóa', delConfirm:'Nhấn lại để xác nhận', delOk:'Đã xóa', delNo:'Không thể xóa bình luận này', pinLbl:'Ghim', pinOn:'Ghim lên đầu', pinOff:'Bỏ ghim', pinOk:'Đã ghim', pinUndo:'Đã bỏ ghim', pinFail:'Thao tác thất bại — thử lại sau.',  ava:'Ảnh đại diện', avaDel:'Xóa ảnh đại diện', avaBad:'Không đọc được ảnh này — thử ảnh khác.', avaBig:'Ảnh quá lớn — chọn ảnh nhỏ hơn.', pinnedTag:'Đã ghim', emailPh:'Email', codePh:'Mã', getCode:'Nhận mã', codeSent:'Mã đã gửi qua email', codeFail:'Không gửi được mã', codeBad:'Mã sai hoặc đã hết hạn', badMail:'Email này có vẻ không đúng', logged:'Đã đăng nhập: ', needNick:'Hãy chọn tên trước', nickTaken:'Tên này đã có người dùng', setNickPh:'Chọn tên (không trùng ai)', loginTip:'Đăng nhập để quản lý bình luận của bạn trên mọi thiết bị. Không đăng nhập vẫn có thể viết ẩn danh.', logging:'Đang đăng nhập…', login:'Đăng nhập' },
    id: { title:'Buku tamu', lede:'Tinggalkan ide, saran, atau pertanyaan — tanpa akun.', nickPh:'Kami panggil kamu apa? (opsional)', textPh:'Tulis sesuatu…', send:'Kirim', sending:'Mengirim…', prev:'Sebelumnya', next:'Berikutnya', page:'Halaman {a} / {b}', empty:'Belum ada komentar — jadilah yang pertama.', loading:'Memuat…', fail:'Gagal mengirim — coba lagi nanti.', ok:'Terkirim. Terima kasih!', anon:'Anonim', fast:'Terlalu cepat — tunggu beberapa detik.', need:'Tulis sesuatu dulu.', count:'{n} komentar', offline:'Gagal memuat komentar — muat ulang halaman.', dev:'Pengembang', reserved:'Nama "XUComer" khusus untuk pengembang — silakan pilih nama lain.' , out:'Keluar', rpl:'Balas', rplPh:'Tulis balasan…', cd:'Tunggu {n} detik sebelum mengirim lagi.', ops:'Tindakan lain', del:'Hapus', delConfirm:'Ketuk lagi untuk mengonfirmasi', delOk:'Dihapus', delNo:'Komentar ini tidak dapat dihapus', pinLbl:'Sematkan', pinOn:'Sematkan di atas', pinOff:'Batal semat', pinOk:'Disematkan', pinUndo:'Semat dibatalkan', pinFail:'Gagal — coba lagi.',  ava:'Avatar', avaDel:'Hapus avatar', avaBad:'Gambar ini tidak bisa dibaca — coba yang lain.', avaBig:'Gambar terlalu besar — pilih yang lebih kecil.', pinnedTag:'Disematkan', emailPh:'Email', codePh:'Kode', getCode:'Minta kode', codeSent:'Kode sudah dikirim ke email', codeFail:'Kode gagal dikirim', codeBad:'Kode salah atau kedaluwarsa', badMail:'Email ini sepertinya salah', logged:'Masuk sebagai: ', needNick:'Pilih nama dulu', nickTaken:'Nama ini sudah dipakai', setNickPh:'Pilih nama (tidak boleh sama)', loginTip:'Masuk untuk mengatur komentar Anda dari perangkat mana pun. Tanpa masuk pun Anda tetap bisa menulis anonim.', logging:'Masuk…', login:'Masuk' }
  };

  const DEV_NAME = 'xucomer';
  const normNick = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const isDev = s => normNick(s).indexOf(DEV_NAME) > -1;

  const $ = id => document.getElementById(id);
  const el = { form:$('form'), nick:$('nick'), text:$('text'), hp:$('hp'), msg:$('msg'),
               len:$('len'), send:$('send'), list:$('list'),
               foot:$('foot'), prev:$('prev'), next:$('next'), pgNo:$('pgNo'),
               count:$('tCount'), as:$('as'), asTag:$('asTag'), asOut:$('asOut'),
               pinBox:$('pinBox'), pinTxt:$('pinTxt'),
               avaBtn:$('avaBtn'), avaImg:$('avaImg'), avaPh:$('avaPh'),
               avaDel:$('avaDel'), file:$('file'), title:document.title,
               authState:$('authState'), authTip:$('authTip'),
               email:$('email'), code:$('code'), codeBtn:$('codeBtn'),
               loginBtn:$('loginBtn'), authOut:$('authOut') };

  let lang = 'zh_CN';
  let total = 0;
  let page = 0;
  let pages = 1;
  let busy = false;
  let mainBusy = false;
  let coolTimer = null;
  let cloud = null;
  let devKey = null;
  let uid = null;
  let myNick = '';
  let vid = '';
  let mailNow = '';

  const t = k => (STR[lang] || STR.en)[k] || STR.en[k];

  function clean(s, max) {
    return String(s == null ? '' : s)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .slice(0, max);
  }

  const HEX64 = /^[0-9a-f]{64}$/;
  const safeKey = k => (typeof k === 'string' && HEX64.test(k)) ? k : null;
  const MAIL_OK = s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());

  function sidNow() {
    let s = '';
    try { s = sessionStorage.getItem(SID_KEY) || ''; } catch (e) {}
    if (/^[0-9a-f]{32,64}$/.test(s)) return s;
    try {
      const a = new Uint8Array(16);
      crypto.getRandomValues(a);
      s = Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      s = ('x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).slice(0, 32);
    }
    try { sessionStorage.setItem(SID_KEY, s); } catch (e) {}
    return s;
  }

  function mineIds() {
    try {
      const a = JSON.parse(sessionStorage.getItem(MINE_KEY) || '[]');
      if (!Array.isArray(a)) return [];
      return a.map(Number).filter(n => n > 0);
    } catch (e) { return []; }
  }

  function addMine(id) {
    const n = Number(id);
    if (!n) return;
    const a = mineIds();
    if (a.indexOf(n) < 0) a.push(n);
    try {
      sessionStorage.setItem(MINE_KEY, JSON.stringify(a.slice(-300)));
    } catch (e) {}
  }

  function dropMine(id) {
    const n = Number(id);
    if (!n) return;
    try {
      sessionStorage.setItem(MINE_KEY, JSON.stringify(mineIds().filter(x => x !== n)));
    } catch (e) {}
  }

  const isMine = id => {
    const n = Number(id);
    return !!n && mineIds().indexOf(n) > -1;
  };

  const ownsRow = row => !!uid && !!row.user_id && String(row.user_id) === uid;

  const AVA_OK = s => typeof s === 'string'
    && s.length > 20 && s.length <= AVA_MAX
    && s.indexOf('base64,') > 8
    && (s.indexOf('data:image/png;') === 0
        || s.indexOf('data:image/jpeg;') === 0
        || s.indexOf('data:image/webp;') === 0);

  let idNick = '';
  let idAvatar = null;
  const idViews = [];

  function saveId() {
    try {
      localStorage.setItem(NICK_KEY, idNick);
      if (idAvatar) localStorage.setItem(AVA_KEY, idAvatar);
      else localStorage.removeItem(AVA_KEY);
    } catch (e) {}
  }

  function paintViews(skip) {
    idViews.forEach(v => {
      if (v.nick && v.nick !== skip) v.nick.value = idNick;
      if (v.img) {
        if (idAvatar) { v.img.src = idAvatar; v.img.hidden = false; }
        else { v.img.removeAttribute('src'); v.img.hidden = true; }
      }
      if (v.ph) v.ph.hidden = !!idAvatar;
      if (v.del) v.del.hidden = !idAvatar;
    });
    reportHeight();
  }

  const setNick = (v, skip) => { idNick = clean(v, 24); saveId(); paintViews(skip); };
  const setAvatar = d => { idAvatar = AVA_OK(d) ? d : null; saveId(); paintViews(); };

  const mainView = { nick: el.nick, img: el.avaImg, ph: el.avaPh, del: el.avaDel, btn: el.avaBtn };
  idViews.push(mainView);

  function readFile(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result || ''));
      fr.onerror = () => rej(new Error('read'));
      fr.readAsDataURL(file);
    });
  }

  function loadImg(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error('img'));
      im.src = src;
    });
  }

  function shrink(im, size, q) {
    const cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    const g = cv.getContext('2d');
    const side = Math.min(im.width, im.height) || size;
    g.drawImage(im, (im.width - side) / 2, (im.height - side) / 2, side, side, 0, 0, size, size);
    return cv.toDataURL('image/jpeg', q);
  }

  async function pickAvatar(file) {
    if (!file || !/^image\//.test(String(file.type || ''))) { showMsg(t('avaBad'), 'err'); return; }
    if (file.size > 12 * 1024 * 1024) { showMsg(t('avaBig'), 'err'); return; }

    let raw;
    try { raw = await readFile(file); } catch (e) { showMsg(t('avaBad'), 'err'); return; }
    let im;
    try { im = await loadImg(raw); } catch (e) { showMsg(t('avaBad'), 'err'); return; }

    const sizes = [96, 80, 64, 48];
    const qs = [0.72, 0.6, 0.5];
    for (const s of sizes) {
      for (const q of qs) {
        let d = '';
        try { d = shrink(im, s, q); } catch (e) { showMsg(t('avaBad'), 'err'); return; }
        if (d && d.length <= AVA_MAX) { setAvatar(d); return; }
      }
    }
    showMsg(t('avaBig'), 'err');
  }

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

  if (cloud) {
    afterLogin();
    cloud.auth.onAuthStateChange(function () { afterLogin(); });
  }

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

  function applyLang(code) {
    const key = STR[code] ? code : (String(code || '').indexOf('zh') === 0
      ? (String(code).toUpperCase().indexOf('TW') > -1 ? 'zh_TW' : 'zh_CN') : 'en');
    const changed = key !== lang;
    lang = key;
    document.documentElement.lang = key.replace('_', '-');
    document.documentElement.dir = key === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title') + ' · XUComer';
    el.nick.placeholder = t('nickPh');
    el.avaBtn.setAttribute('aria-label', t('ava'));
    el.avaDel.setAttribute('aria-label', t('avaDel'));
    idViews.forEach(v => {
      if (v.nick) v.nick.placeholder = t('nickPh');
      if (v.btn) v.btn.setAttribute('aria-label', t('ava'));
      if (v.del) v.del.setAttribute('aria-label', t('avaDel'));
    });
    el.text.placeholder = t('textPh');
    el.prev.textContent = t('prev');
    el.next.textContent = t('next');
    if (devKey) { el.asTag.textContent = t('dev'); el.asOut.textContent = t('out'); }
    el.pinTxt.textContent = t('pinLbl');
    el.authTip.textContent = t('loginTip');
    renderCount();
    renderPager();
    paintCool();
    paintAuth();
    if (!changed || busy) return;
    load();
  }

  function renderCount() {
    el.count.textContent = t('count').replace('{n}', String(total));
  }

  function pagesOf() {
    return Math.max(1, Math.ceil(total / PAGE));
  }

  function renderPager() {
    pages = pagesOf();
    if (page > pages - 1) page = pages - 1;
    if (page < 0) page = 0;
    el.pgNo.textContent = t('page')
      .replace('{a}', String(page + 1))
      .replace('{b}', String(pages));
    el.prev.disabled = page <= 0;
    el.next.disabled = page >= pages - 1;
    el.foot.hidden = pages <= 1;
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

  function coolLeft() {
    const last = Number(localStorage.getItem(LAST_KEY) || 0);
    return Math.max(0, COOLDOWN - (Date.now() - last));
  }

  function paintCool() {
    const left = coolLeft();
    const secs = Math.max(1, Math.ceil(left / 1000));
    document.querySelectorAll('.rf-send').forEach(b => {
      if (b.dataset.busy === '1') return;
      b.disabled = left > 0;
      b.textContent = left > 0 ? secs + 's' : t('rpl');
    });
    if (!mainBusy) {
      el.send.disabled = left > 0;
      el.send.textContent = left > 0 ? secs + 's' : t('send');
    }
    if (left <= 0 && coolTimer) { clearInterval(coolTimer); coolTimer = null; }
  }

  function startCool() {
    paintCool();
    if (!coolTimer) coolTimer = setInterval(paintCool, 250);
  }

  function markPosted() {
    try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch (e) {}
    startCool();
  }

  let delTimer = null;

  function closeMenus(except) {
    Array.prototype.forEach.call(document.querySelectorAll('.i-menu'), m => {
      if (m !== except) m.hidden = true;
    });
  }

  function disarmAll() {
    Array.prototype.forEach.call(document.querySelectorAll('.mi-del'), b => {
      if (b.dataset.arms === '1') {
        b.dataset.arms = '0';
        b.classList.remove('danger');
        b.textContent = t('del');
      }
    });
  }

  const canManage = row => !!devKey || !!row.id && isMine(row.id) || ownsRow(row);

  function buildMenu(li, row, isReply) {
    const wrap = document.createElement('div');
    wrap.className = 'i-more-wrap';

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'i-more';
    dot.setAttribute('aria-label', t('ops'));
    dot.textContent = '⋯';

    const menu = document.createElement('div');
    menu.className = 'i-menu';
    menu.hidden = true;

    if (devKey && !isReply) {
      const bPin = document.createElement('button');
      bPin.type = 'button';
      bPin.className = 'mi mi-pin';
      bPin.textContent = row.pinned ? t('pinOff') : t('pinOn');
      bPin.addEventListener('click', function (e) {
        e.stopPropagation();
        doPin(li, bPin);
      });
      menu.appendChild(bPin);
    }

    const bDel = document.createElement('button');
    bDel.type = 'button';
    bDel.className = 'mi mi-del';
    bDel.textContent = t('del');
    bDel.dataset.arms = '0';
    bDel.addEventListener('click', function (e) {
      e.stopPropagation();
      if (bDel.dataset.arms === '1') { doDel(li, bDel); return; }
      disarmAll();
      bDel.dataset.arms = '1';
      bDel.classList.add('danger');
      bDel.textContent = t('delConfirm');
      clearTimeout(delTimer);
      delTimer = setTimeout(disarmAll, 3500);
    });
    menu.appendChild(bDel);

    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      const wasOpen = !menu.hidden;
      closeMenus();
      disarmAll();
      if (!wasOpen) menu.hidden = false;
      reportHeight();
    });

    wrap.appendChild(dot);
    wrap.appendChild(menu);
    return wrap;
  }

  async function doPin(li, btn) {
    const id = Number(li.dataset.id) || 0;
    const key = safeKey(devKey);
    if (!id || !key || !cloud) return;

    const was = btn.textContent;
    btn.disabled = true;
    btn.textContent = t('sending');

    const { data, error } = await cloud.database.rpc('gb_pin', { pid: id, pkey: key });

    btn.disabled = false;
    btn.textContent = was;

    if (error) { showMsg(t('pinFail'), 'err'); return; }
    closeMenus();
    showMsg(data ? t('pinOk') : t('pinUndo'), 'ok');
    load();
  }

  async function doDel(li, btn) {
    const id = Number(li.dataset.id) || 0;
    if (!id || !cloud) return;

    btn.disabled = true;

    const key = safeKey(devKey);
    const { error } = await cloud.database.rpc('gb_del', { pid: id, psid: sidNow(), pkey: key });

    btn.disabled = false;

    if (error) {
      disarmAll();
      showMsg(t('delNo'), 'err');
      return;
    }

    showMsg(t('delOk'), 'ok');

    if (li.classList.contains('reply')) {
      total = Math.max(0, total - 1);
      renderCount();
      renderPager();
      reportHeight();
      return;
    }
    const replies = Array.prototype.slice.call(li.querySelectorAll('.replies > li.reply'));
    replies.forEach(r => dropMine(r.dataset.id));
    dropMine(id);
    total = Math.max(0, total - 1 - replies.length);
    li.remove();
    renderCount();
    load();
  }

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

  function buildItem(row, isReply) {
    const li = document.createElement('li');
    li.className = isReply ? 'item reply' : 'item';
    if (row.pinned) li.classList.add('pinned');
    if (row.id != null) li.dataset.id = String(row.id);

    const top = document.createElement('div');
    top.className = 'item-top';

    const name = (row.nick && String(row.nick).trim()) || t('anon');

    const nick = document.createElement('span');
    nick.className = 'item-nick';
    nick.textContent = name;

    if (AVA_OK(row.avatar)) {
      const pic = document.createElement('img');
      pic.className = 'item-ava';
      pic.src = row.avatar;
      pic.alt = '';
      top.appendChild(pic);
    }

    if (isDev(name)) {
      const cjk = (lang === 'zh_CN' || lang === 'zh_TW' || lang === 'ja');
      const tag = document.createElement('span');
      tag.className = 'item-dev';
      tag.textContent = cjk ? '（' + t('dev') + '）' : ' (' + t('dev') + ')';
      nick.appendChild(tag);
    }

    const time = document.createElement('span');
    time.className = 'item-time';
    time.textContent = fmtTime(row.created_at);

    top.appendChild(nick);
    if (row.pinned) {
      const p = document.createElement('span');
      p.className = 'item-pin';
      p.textContent = t('pinnedTag');
      top.appendChild(p);
    }
    top.appendChild(time);

    const body = document.createElement('p');
    body.className = 'item-body';
    body.textContent = row.body;

    li.appendChild(top);
    li.appendChild(body);

    if (isReply) {
      if (canManage(row)) {
        const acts = document.createElement('div');
        acts.className = 'item-acts';
        acts.appendChild(buildMenu(li, row, true));
        li.appendChild(acts);
      }
      return li;
    }

    const replies = document.createElement('ul');
    replies.className = 'replies';

    const acts = document.createElement('div');
    acts.className = 'item-acts';
    const rbtn = document.createElement('button');
    rbtn.type = 'button';
    rbtn.className = 'item-rbtn';
    rbtn.textContent = t('rpl');
    acts.appendChild(rbtn);

    const form = document.createElement('form');
    form.className = 'rform';
    form.hidden = true;
    form.autocomplete = 'off';

    const head = document.createElement('div');
    head.className = 'rhead';
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'ava-pick small';
    pick.setAttribute('aria-label', t('ava'));
    const pic = document.createElement('img');
    pic.className = 'ava-img';
    pic.alt = '';
    const ph = document.createElement('span');
    ph.className = 'ava-ph';
    ph.textContent = '+';
    pick.appendChild(pic);
    pick.appendChild(ph);
    const nickIn = document.createElement('input');
    nickIn.type = 'text';
    nickIn.maxLength = 24;
    nickIn.placeholder = t('nickPh');
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'ava-del';
    rm.setAttribute('aria-label', t('avaDel'));
    rm.textContent = '×';
    head.appendChild(pick);
    head.appendChild(nickIn);
    head.appendChild(rm);

    const view = { nick: nickIn, img: pic, ph: ph, del: rm, btn: pick };
    idViews.push(view);
    pick.addEventListener('click', function (e) {
      e.stopPropagation();
      try { el.file.click(); } catch (err) {}
    });
    rm.addEventListener('click', function (e) {
      e.stopPropagation();
      setAvatar(null);
    });
    nickIn.addEventListener('input', function () { setNick(nickIn.value, nickIn); });
    paintViews(nickIn);

    const ta = document.createElement('textarea');
    ta.rows = 2;
    ta.maxLength = 600;
    ta.placeholder = t('rplPh');
    const bar = document.createElement('div');
    bar.className = 'rbar';
    const st = document.createElement('span');
    st.className = 'msg';
    st.setAttribute('role', 'status');
    const sb = document.createElement('button');
    sb.type = 'submit';
    sb.className = 'rf-send';
    sb.textContent = t('rpl');
    bar.appendChild(st);
    bar.appendChild(sb);
    form.appendChild(head);
    form.appendChild(ta);
    form.appendChild(bar);

    rbtn.addEventListener('click', function () {
      form.hidden = !form.hidden;
      if (!form.hidden) { try { ta.focus(); } catch (e) {} }
      paintCool();
      reportHeight();
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      sendReply(li, ta, sb, st);
    });
    ta.addEventListener('input', reportHeight);
    if (canManage(row)) acts.appendChild(buildMenu(li, row, false));

    li.appendChild(acts);
    li.appendChild(form);
    li.appendChild(replies);
    return li;
  }

  function insertReplies(parentLi, rows) {
    const ul = parentLi.querySelector('.replies');
    if (!ul) return;
    rows.forEach(r => ul.appendChild(buildItem(r, true)));
  }

  async function load() {
    if (!cloud) { renderPlaceholder(t('offline')); return; }
    if (busy) return;
    busy = true;

    el.list.innerHTML = '';
    idViews.length = 0;
    idViews.push(mainView);
    renderPlaceholder(t('loading'));
    el.foot.hidden = true;

    pages = pagesOf();
    if (page > pages - 1) page = pages - 1;
    if (page < 0) page = 0;

    const from = page * PAGE;
    const top = await cloud.database
      .from('comments')
      .select('id, nick, body, created_at, avatar, pinned, user_id', { count: 'exact' })
      .is('parent_id', null)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1);

    if (top.error) {
      busy = false;
      renderPlaceholder(t('offline'));
      return;
    }

    if (typeof top.count === 'number') total = top.count;

    let rows = Array.isArray(top.data) ? top.data : [];

    if (!rows.length && total > 0 && page > 0) {
      pages = pagesOf();
      page = Math.min(page, pages - 1);
      busy = false;
      load();
      return;
    }

    el.list.innerHTML = '';
    const nodes = rows.map(r => buildItem(r, false));
    nodes.forEach(n => el.list.appendChild(n));

    const ids = rows.map(r => r.id).filter(v => v != null);
    if (ids.length) {
      const rep = await cloud.database
        .from('comments')
        .select('id, nick, body, created_at, avatar, parent_id, user_id')
        .in('parent_id', ids)
        .order('created_at', { ascending: true })
        .limit(600);
      if (!rep.error && Array.isArray(rep.data) && rep.data.length) {
        const map = {};
        nodes.forEach(n => { map[n.dataset.id] = n; });
        const groups = {};
        rep.data.forEach(r => {
          const k = String(r.parent_id);
          (groups[k] || (groups[k] = [])).push(r);
        });
        Object.keys(groups).forEach(k => {
          if (map[k]) insertReplies(map[k], groups[k]);
        });
      }
    }

    busy = false;
    if (!rows.length) renderPlaceholder(t('empty'));
    renderCount();
    renderPager();
    paintCool();
    reportHeight();
  }

  function payload(text, parentId) {
    const key = safeKey(devKey);
    const row = { body: text, sid: sidNow() };
    if (parentId) row.parent_id = parentId;
    if (key) {
      row.nick = 'XUComer';
      row.devkey = key;

      if (el.pinBox && el.pinBox.checked) row.pinned = true;
    } else if (uid && myNick) {
      row.nick = myNick;
    } else {
      row.nick = clean(el.nick.value, 24) || t('anon');
    }
    if (AVA_OK(idAvatar)) row.avatar = idAvatar;
    return row;
  }

  const isFast = err => {
    const c = String((err && (err.code || err.status)) || '');
    const m = String((err && err.message) || '');
    return c === '54000' || c === 'DATABASE_54000' || /too fast/i.test(m);
  };

  async function submit(e) {
    e.preventDefault();
    if (mainBusy) return;

    const text = clean(el.text.value, 600);
    const nick = clean(el.nick.value, 24);

    if (el.hp.value) return;
    if (!text) { showMsg(t('need'), 'err'); el.text.focus(); return; }
    if (isDev(nick) && !devKey) { showMsg(t('reserved'), 'err'); el.nick.focus(); return; }

    if (uid && !myNick) {
      if (!nick) { showMsg(t('needNick'), 'err'); el.nick.focus(); return; }
      const saved = await saveNick(nick);
      if (!saved.ok) { showMsg(t('nickTaken'), 'err'); return; }
    }

    const left = coolLeft();
    if (left > 0) {
      showMsg(t('cd').replace('{n}', String(Math.ceil(left / 1000))), 'err');
      paintCool();
      return;
    }

    if (!cloud) { showMsg(t('fail'), 'err'); return; }

    mainBusy = true;
    el.send.disabled = true;
    el.send.textContent = t('sending');
    showMsg('');

    const row = payload(text, 0);

    const { data, error } = await cloud.database
      .from('comments')
      .insert(row)
      .select('id, nick, body, created_at, avatar, parent_id, pinned, user_id');

    mainBusy = false;

    if (error) {
      showMsg(isFast(error) ? t('fast') : t('fail'), 'err');
      paintCool();
      return;
    }

    try { if (nick) localStorage.setItem(NICK_KEY, nick); } catch (err) {}
    markPosted();

    el.text.value = '';
    updateLen();
    showMsg(t('ok'), 'ok');

    const fresh = (Array.isArray(data) && data[0]) ? data[0] : null;
    if (fresh && fresh.id) addMine(fresh.id);

    page = 0;
    load();
    reportHeight();
  }

  async function sendReply(parentLi, ta, btn, st) {
    if (btn.dataset.busy === '1') return;

    const text = clean(ta.value, 600);
    if (!text) { st.textContent = t('need'); st.className = 'msg err'; try { ta.focus(); } catch (e) {} return; }

    const left = coolLeft();
    if (left > 0) { st.textContent = t('cd').replace('{n}', String(Math.ceil(left / 1000))); st.className = 'msg err'; return; }

    if (!cloud) { st.textContent = t('fail'); st.className = 'msg err'; return; }

    btn.dataset.busy = '1';
    btn.disabled = true;
    btn.textContent = t('sending');
    st.textContent = '';
    st.className = 'msg';

    const row = payload(text, Number(parentLi.dataset.id) || 0);

    const { data, error } = await cloud.database
      .from('comments')
      .insert(row)
      .select('id, nick, body, created_at, avatar, parent_id, user_id');

    btn.dataset.busy = '0';

    if (error) {
      st.textContent = isFast(error) ? t('fast') : t('fail');
      st.className = 'msg err';
      paintCool();
      return;
    }

    markPosted();
    ta.value = '';
    const fresh = (Array.isArray(data) && data[0]) ? data[0] : null;
    if (fresh && fresh.id) addMine(fresh.id);
    insertReplies(parentLi, [fresh || Object.assign({ created_at: new Date().toISOString() }, row)]);
    total += 1;
    renderCount();
    reportHeight();
  }

  function paintAuth() {
    const on = !!uid;
    const step2 = !on && !!vid;

    el.authState.hidden = !on;
    el.authOut.hidden = !on;
    el.email.hidden = on || step2;
    el.codeBtn.hidden = on || step2;
    el.code.hidden = !step2;
    el.loginBtn.hidden = !step2;
    el.authTip.hidden = on;

    el.email.placeholder = t('emailPh');
    el.code.placeholder = t('codePh');
    el.codeBtn.textContent = t('getCode');
    el.loginBtn.textContent = t('login');
    el.authOut.textContent = t('out');

    if (on) el.authState.textContent = t('logged') + (myNick || '');

    if (devKey) {
      el.nick.hidden = true;
    } else if (on && myNick) {
      el.nick.hidden = true;
    } else {
      el.nick.hidden = false;
      el.nick.placeholder = (on && !myNick) ? t('setNickPh') : t('nickPh');
    }
    reportHeight();
  }

  async function readMe() {
    myNick = '';
    if (!uid || !cloud) { paintAuth(); return; }
    const r = await cloud.database.rpc('gb_me', {});
    if (!r.error && typeof r.data === 'string') myNick = r.data;
    paintAuth();
  }

  async function afterLogin() {
    const s = await cloud.auth.getSession();
    const u = (s && s.data && s.data.user) || null;
    uid = (u && u.id) ? String(u.id) : null;
    vid = '';
    el.code.value = '';
    await readMe();
    if (uid) load();
  }

  async function sendCode() {
    const mail = clean(el.email.value, 64).toLowerCase();
    if (!MAIL_OK(mail)) { showMsg(t('badMail'), 'err'); el.email.focus(); return; }
    if (!cloud) { showMsg(t('fail'), 'err'); return; }

    el.codeBtn.disabled = true;
    el.codeBtn.textContent = t('sending');
    showMsg('');

    const r = await cloud.auth.signInWithOtp({ email: mail });

    el.codeBtn.disabled = false;
    el.codeBtn.textContent = t('getCode');

    if (r.error || !r.data || !r.data.verificationId) {
      showMsg(t('codeFail'), 'err');
      return;
    }
    vid = r.data.verificationId;
    mailNow = mail;
    paintAuth();
    showMsg(t('codeSent'), 'ok');
    try { el.code.focus(); } catch (e) {}
  }

  async function doLogin() {
    const token = clean(el.code.value, 12);
    if (!token || !vid) { showMsg(t('codeBad'), 'err'); return; }
    if (!cloud) { showMsg(t('fail'), 'err'); return; }

    el.loginBtn.disabled = true;
    el.loginBtn.textContent = t('logging');
    showMsg('');

    const r = await cloud.auth.verifyOtp({ verificationId: vid, token: token, email: mailNow });

    el.loginBtn.disabled = false;
    el.loginBtn.textContent = t('login');

    if (r.error) { showMsg(t('codeBad'), 'err'); return; }

    await afterLogin();
    showMsg(uid ? t('ok') : t('codeBad'), uid ? 'ok' : 'err');
  }

  async function doLogout() {
    if (cloud) { try { await cloud.auth.signOut(); } catch (e) {} }
    uid = null;
    myNick = '';
    vid = '';
    el.code.value = '';
    paintAuth();
    load();
  }

  async function saveNick(nm) {
    if (!cloud || !uid) return { ok: false };
    const r = await cloud.database.rpc('gb_nick', { pnick: nm });
    if (r.error || typeof r.data !== 'string') return { ok: false, taken: true };
    myNick = r.data;
    try { localStorage.setItem(NICK_KEY, myNick); } catch (e) {}
    idNick = myNick;
    setNick(myNick, null);
    paintAuth();
    return { ok: true };
  }

  function updateLen() {
    el.len.textContent = el.text.value.length + ' / 600';
  }

  function reportHeight() {
    if (window.parent === window) return;
    let h = document.documentElement.scrollHeight;
    h = Math.max(h, 200);
    try { window.parent.postMessage({ gb: { height: h } }, '*'); } catch (e) {}
  }

  function enterDev() {
    el.as.hidden = false;
    el.asTag.textContent = t('dev');
    el.asOut.textContent = t('out');
    el.pinTxt.textContent = t('pinLbl');
    el.pinBox.checked = false;
    el.nick.hidden = true;
    el.nick.value = '';
  }

  function resetDev() {
    devKey = null;
    el.as.hidden = true;
    if (el.pinBox) el.pinBox.checked = false;
    el.nick.hidden = false;
    el.nick.value = idNick;
  }

  function leaveDev() {
    resetDev();
    paintCool();
    try { window.parent.postMessage({ gb: { logout: true } }, '*'); } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    const d = e.data;
    if (!d || !d.gb) return;
    if (d.gb.theme) applyTheme(d.gb.theme);
    if (d.gb.lang) applyLang(d.gb.lang);
    if (typeof d.gb.devkey === 'string') {
      const k = safeKey(d.gb.devkey);
      const changed = k !== devKey;
      if (k) { devKey = k; enterDev(); }
      else if (devKey) resetDev();

      if (changed && total > 0) load();
    }
  });

  el.form.addEventListener('submit', submit);
  el.text.addEventListener('input', updateLen);
  el.prev.addEventListener('click', function () { if (page > 0) { page -= 1; load(); } });
  el.next.addEventListener('click', function () { if (page < pages - 1) { page += 1; load(); } });
  el.asOut.addEventListener('click', leaveDev);
  el.codeBtn.addEventListener('click', sendCode);
  el.loginBtn.addEventListener('click', doLogin);
  el.authOut.addEventListener('click', doLogout);
  el.email.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); sendCode(); } });
  el.code.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); doLogin(); } });
  el.nick.addEventListener('input', function () { setNick(el.nick.value, el.nick); });
  el.avaBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    try { el.file.click(); } catch (err) {}
  });
  el.avaDel.addEventListener('click', function (e) {
    e.stopPropagation();
    setAvatar(null);
  });
  el.file.addEventListener('change', function () {
    const f = el.file.files && el.file.files[0];
    el.file.value = '';
    pickAvatar(f);
  });
  window.addEventListener('resize', reportHeight);
  document.addEventListener('click', function () {
    closeMenus();
    disarmAll();
  });

  (function initId() {
    let n = '';
    let a = '';
    try { n = localStorage.getItem(NICK_KEY) || ''; } catch (e) {}
    try { a = localStorage.getItem(AVA_KEY) || ''; } catch (e) {}
    if (isDev(n)) { n = ''; try { localStorage.removeItem(NICK_KEY); } catch (e) {} }
    idNick = clean(n, 24);
    idAvatar = AVA_OK(a) ? a : null;
    if (a && !idAvatar) { try { localStorage.removeItem(AVA_KEY); } catch (e) {} }
    paintViews();
  })();

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
  paintCool();

  if (document.readyState === 'complete') { load(); reportHeight(); }
  else window.addEventListener('load', () => { load(); reportHeight(); });
  setTimeout(reportHeight, 300);
})();
