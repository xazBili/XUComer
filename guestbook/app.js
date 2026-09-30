(function () {
  'use strict';

  const ENDPOINT = 'https://xucomer-guestbook.app.workbuddy.host';
  const PUBLISHABLE_KEY = 'wbpk_vOFjIoaEiNMwULCZUhySoh_06j7JNK5kcQq1aGxtP6Sm63xXKW8hfcH';

  const PAGE = 20;
  const COOLDOWN = 10000;
  const NICK_KEY = 'xucomer-gb-nick';
  const TOK_KEY = 'xucomer-gb-tok';
  const REG_KEY = 'xucomer-gb-reg';
  const AVA_KEY = 'xucomer-gb-avatar';
  const LAST_KEY = 'xucomer-gb-last';
  const SID_KEY = 'xucomer-gb-sid';
  const AVA_MAX = 8000;
  const MINE_KEY = 'xucomer-gb-mine';
  const PARENT = 'https://xazbili.github.io';

  const STR = {
    zh_CN: { title:'留言板', lede:'留下你的想法、建议或问题，不需要注册账号。', nickPh:'怎么称呼你？（选填）', textPh:'想说点什么…', send:'发表', sending:'发表中…', prev:'上一页', next:'下一页', page:'第 {a} / {b} 页', empty:'还没有留言，来说第一句吧。', loading:'加载中…', fail:'发表失败，请稍后再试。', ok:'发表成功，谢谢！', anon:'匿名', fast:'发得有点快，请等几秒再试。', need:'请先写点内容。', count:'{n} 条留言', offline:'留言加载失败，请刷新页面重试。' , dev:'开发者', reserved:'「XUComer」是开发者专属昵称，请换一个。' , out:'退出登录', rpl:'回复', rplPh:'写下你的回复…', cd:'请等 {n} 秒再发送。', ops:'更多操作', del:'删除', delConfirm:'再点一次确认删除', delOk:'已删除', delNo:'删不掉这条留言', pinLbl:'置顶', pinOn:'置顶到最前', pinOff:'取消置顶', pinOk:'已置顶', pinUndo:'已取消置顶', pinFail:'操作失败，请稍后再试。',  ava:'头像', avaDel:'移除头像', avaBad:'这张图片读不出来，换一张试试。', avaBig:'图片太大了，换一张小一点的。', pinnedTag:'置顶' , userPh:'用户名', passPh:'密码', login:'登录', reg:'注册', logged:'已登录：', badName:'名字要 2–24 个字', badPass:'密码至少 6 位', nameTaken:'这个名字已经有人用了', badLogin:'名字或密码不对', accTip:'注册后换设备也能删自己的留言，不注册照样可以匿名发言。', logging:'登录中…' , regOnce:'这个浏览器已经注册过账号了', delUser:'删除账号', delUserOk:'账号已删除', delUserNo:'删不掉这个账号' },
    zh_TW: { title:'留言板', lede:'留下你的想法、建議或問題，不需要註冊帳號。', nickPh:'怎麼稱呼你？（選填）', textPh:'想說點什麼…', send:'發表', sending:'發表中…', prev:'上一頁', next:'下一頁', page:'第 {a} / {b} 頁', empty:'還沒有留言，來說第一句吧。', loading:'載入中…', fail:'發表失敗，請稍後再試。', ok:'發表成功，謝謝！', anon:'匿名', fast:'發得有點快，請等幾秒再試。', need:'請先寫點內容。', count:'{n} 則留言', offline:'留言載入失敗，請重新整理頁面再試。' , dev:'開發者', reserved:'「XUComer」是開發者專屬暱稱，請換一個。' , out:'登出', rpl:'回覆', rplPh:'寫下你的回覆…', cd:'請等 {n} 秒後再發送。', ops:'更多操作', del:'刪除', delConfirm:'再點一次確認刪除', delOk:'已刪除', delNo:'刪不掉這則留言', pinLbl:'置頂', pinOn:'置頂到最前', pinOff:'取消置頂', pinOk:'已置頂', pinUndo:'已取消置頂', pinFail:'操作失敗，請稍後再試。',  ava:'頭像', avaDel:'移除頭像', avaBad:'這張圖片讀不出來，換一張試試。', avaBig:'圖片太大了，換一張小一點的。', pinnedTag:'置頂' , userPh:'使用者名稱', passPh:'密碼', login:'登入', reg:'註冊', logged:'已登入：', badName:'名字要 2–24 個字', badPass:'密碼至少 6 位', nameTaken:'這個名字已經有人用了', badLogin:'名字或密碼不對', accTip:'註冊後換裝置也能刪自己的留言，不註冊照樣可以匿名發言。', logging:'登入中…' , regOnce:'這個瀏覽器已經註冊過帳號了', delUser:'刪除帳號', delUserOk:'帳號已刪除', delUserNo:'刪不掉這個帳號' },
    en: { title:'Guestbook', lede:'Leave a thought, an idea or a question — no account needed.', nickPh:'What should we call you? (optional)', textPh:'Say something…', send:'Post', sending:'Posting…', prev:'Prev', next:'Next', page:'Page {a} / {b}', empty:'No comments yet — be the first.', loading:'Loading…', fail:"Couldn't post — please try again.", ok:'Posted. Thanks!', anon:'Anonymous', fast:'That was quick — wait a few seconds.', need:'Please write something first.', count:'{n} comments', offline:"Couldn't load comments — refresh and try again." , dev:'Developer', reserved:'"XUComer" is reserved for the developer — please pick another name.' , out:'Log out', rpl:'Reply', rplPh:'Write a reply…', cd:'Wait {n}s before posting again.', ops:'More actions', del:'Delete', delConfirm:'Tap again to confirm', delOk:'Deleted', delNo:'You cannot delete that one', pinLbl:'Pin', pinOn:'Pin to top', pinOff:'Unpin', pinOk:'Pinned', pinUndo:'Unpinned', pinFail:'Something went wrong — please retry.',  ava:'Avatar', avaDel:'Remove avatar', avaBad:'That image cannot be read — try another one.', avaBig:'That image is too big — pick a smaller one.', pinnedTag:'Pinned' , userPh:'Username', passPh:'Password', login:'Log in', reg:'Sign up', logged:'Signed in:', badName:'Name must be 2-24 characters', badPass:'Password must be at least 6 characters', nameTaken:'That name is already taken', badLogin:'Wrong name or password', accTip:'Sign up to manage your own posts from any device. Without it you can still post anonymously.', logging:'Signing in…' , regOnce:'This browser already has an account', delUser:'Delete account', delUserOk:'Account deleted', delUserNo:'That account cannot be deleted' },
    ja: { title:'掲示板', lede:'感想や提案、質問などをどうぞ。アカウント登録は不要です。', nickPh:'お名前（任意）', textPh:'ひとことどうぞ…', send:'投稿', sending:'投稿中…', prev:'前へ', next:'次へ', page:'{a} / {b} ページ', empty:'まだコメントがありません。最初の一言をどうぞ。', loading:'読み込み中…', fail:'投稿できませんでした。しばらくしてからお試しください。', ok:'投稿しました。ありがとうございます！', anon:'匿名', fast:'投稿が早すぎます。数秒お待ちください。', need:'内容を入力してください。', count:'{n} 件のコメント', offline:'コメントを読み込めませんでした。再読み込みしてください。' , dev:'開発者', reserved:'「XUComer」は開発者専用の名前です。別の名前をお選びください。' , out:'ログアウト', rpl:'返信', rplPh:'返信を書く…', cd:'あと {n} 秒お待ちください。', ops:'操作', del:'削除', delConfirm:'もう一度押して確定', delOk:'削除しました', delNo:'このコメントは削除できません', pinLbl:'固定', pinOn:'トップに固定', pinOff:'固定を解除', pinOk:'固定しました', pinUndo:'固定を解除しました', pinFail:'操作に失敗しました。もう一度お試しください。',  ava:'アイコン', avaDel:'アイコンを削除', avaBad:'この画像は読み込めません。別の画像をお試しください。', avaBig:'画像が大きすぎます。もう少し小さいものを選んでください。', pinnedTag:'固定済み' , userPh:'ユーザー名', passPh:'パスワード', login:'ログイン', reg:'登録', logged:'ログイン中：', badName:'名前は 2〜24 文字', badPass:'パスワードは 6 文字以上', nameTaken:'その名前はもう使われています', badLogin:'名前かパスワードが違います', accTip:'登録すると別の端末からも自分の投稿を削除できます。登録しなくても匿名で投稿できます。', logging:'ログイン中…' , regOnce:'このブラウザでは登録済みです', delUser:'アカウントを削除', delUserOk:'アカウントを削除しました', delUserNo:'このアカウントは削除できません' },
    ko: { title:'방명록', lede:'생각이나 제안, 질문을 남겨 주세요. 계정은 필요 없습니다.', nickPh:'어떻게 불러드릴까요? (선택)', textPh:'하고 싶은 말…', send:'등록', sending:'등록 중…', prev:'이전', next:'다음', page:'{a} / {b} 페이지', empty:'아직 댓글이 없습니다. 첫 글을 남겨 보세요.', loading:'불러오는 중…', fail:'등록하지 못했습니다. 잠시 후 다시 시도해 주세요.', ok:'등록했습니다. 감사합니다!', anon:'익명', fast:'너무 빠릅니다. 몇 초 후에 다시 시도해 주세요.', need:'내용을 입력해 주세요.', count:'댓글 {n}개', offline:'댓글을 불러오지 못했습니다. 새로고침해 주세요.' , dev:'개발자', reserved:'"XUComer"는 개발자 전용 이름입니다. 다른 이름을 써 주세요.' , out:'로그아웃', rpl:'답글', rplPh:'답글을 남겨 주세요…', cd:'{n}초 후에 다시 시도해 주세요.', ops:'추가 작업', del:'삭제', delConfirm:'한 번 더 눌러 확인', delOk:'삭제되었습니다', delNo:'이 댓글은 삭제할 수 없습니다', pinLbl:'고정', pinOn:'상단에 고정', pinOff:'고정 해제', pinOk:'고정되었습니다', pinUndo:'고정이 해제되었습니다', pinFail:'작업에 실패했습니다. 다시 시도해 주세요.',  ava:'프로필', avaDel:'프로필 삭제', avaBad:'이 이미지는 읽을 수 없습니다. 다른 이미지를 사용해 보세요.', avaBig:'이미지가 너무 큽니다. 더 작은 이미지를 선택해 주세요.', pinnedTag:'고정됨' , userPh:'사용자 이름', passPh:'비밀번호', login:'로그인', reg:'가입', logged:'로그인됨:', badName:'이름은 2~24자', badPass:'비밀번호는 6자 이상', nameTaken:'이미 사용된 이름입니다', badLogin:'이름 또는 비밀번호가 틀렸습니다', accTip:'가입하면 다른 기기에서도 내 글을 지울 수 있습니다. 가입하지 않아도 익명으로 쓸 수 있습니다.', logging:'로그인 중…' , regOnce:'이 브라우저에서는 이미 가입했습니다', delUser:'계정 삭제', delUserOk:'계정이 삭제되었습니다', delUserNo:'이 계정은 삭제할 수 없습니다' },
    fr: { title:"Livre d'or", lede:'Laissez une idée, une suggestion ou une question — aucun compte requis.', nickPh:'Comment vous appeler ? (facultatif)', textPh:'Dites quelque chose…', send:'Publier', sending:'Publication…', prev:'Précédent', next:'Suivant', page:'Page {a} / {b}', empty:"Aucun message pour l'instant — soyez le premier.", loading:'Chargement…', fail:'Publication impossible, réessayez plus tard.', ok:'Publié. Merci !', anon:'Anonyme', fast:'C\u2019est un peu rapide — attendez quelques secondes.', need:"Écrivez d'abord quelque chose.", count:'{n} messages', offline:'Impossible de charger les messages — actualisez la page.' , dev:'Développeur', reserved:'« XUComer » est réservé au développeur — choisissez un autre nom.' , out:'Déconnexion', rpl:'Répondre', rplPh:'Écrivez une réponse…', cd:'Attendez {n} s avant de republier.', ops:'Autres actions', del:'Supprimer', delConfirm:'Appuyez encore pour confirmer', delOk:'Supprimé', delNo:'Suppression impossible', pinLbl:'Épingler', pinOn:'Épingler en haut', pinOff:'Désépingler', pinOk:'Épinglé', pinUndo:'Épinglage annulé', pinFail:'Opération échouée — réessayez.',  ava:'Avatar', avaDel:'Retirer avatar', avaBad:'Image illisible — essayez-en une autre.', avaBig:'Image trop lourde — choisissez-en une plus petite.', pinnedTag:'Épinglé' , userPh:'Nom', passPh:'Mot de passe', login:'Se connecter', reg:'Créer un compte', logged:'Connecté :', badName:'Le nom doit faire 2-24 caractères', badPass:'Le mot de passe doit faire 6 caractères ou plus', nameTaken:'Ce nom est déjà pris', badLogin:'Nom ou mot de passe incorrect', accTip:'Créez un compte pour gérer vos messages depuis n’importe quel appareil. Sans compte, vous pouvez écrire anonymement.', logging:'Connexion…' , regOnce:'Ce navigateur a déjà un compte', delUser:'Supprimer le compte', delUserOk:'Compte supprimé', delUserNo:'Ce compte ne peut pas être supprimé' },
    de: { title:'Gästebuch', lede:'Hinterlasse eine Idee, einen Vorschlag oder eine Frage — kein Konto nötig.', nickPh:'Wie sollen wir dich nennen? (optional)', textPh:'Schreib etwas…', send:'Absenden', sending:'Wird gesendet…', prev:'Zurück', next:'Weiter', page:'Seite {a} / {b}', empty:'Noch keine Beiträge — sei die erste Person.', loading:'Wird geladen…', fail:'Senden fehlgeschlagen — bitte später erneut versuchen.', ok:'Gesendet. Danke!', anon:'Anonym', fast:'Etwas schnell — warte ein paar Sekunden.', need:'Bitte zuerst etwas schreiben.', count:'{n} Beiträge', offline:'Beiträge konnten nicht geladen werden — Seite neu laden.' , dev:'Entwickler', reserved:'"XUComer" ist dem Entwickler vorbehalten — bitte wähle einen anderen Namen.' , out:'Abmelden', rpl:'Antworten', rplPh:'Antwort schreiben…', cd:'Bitte {n} s warten.', ops:'Weitere Aktionen', del:'Löschen', delConfirm:'Noch einmal tippen zum Bestätigen', delOk:'Gelöscht', delNo:'Dieser Beitrag kann nicht gelöscht werden', pinLbl:'Anpinnen', pinOn:'Oben anpinnen', pinOff:'Anpinnen aufheben', pinOk:'Angepinnt', pinUndo:'Anpinnen aufgehoben', pinFail:'Fehlgeschlagen — bitte erneut versuchen.',  ava:'Profilbild', avaDel:'Profilbild entfernen', avaBad:'Das Bild kann nicht gelesen werden — nimm ein anderes.', avaBig:'Das Bild ist zu groß — nimm ein kleineres.', pinnedTag:'Angepinnt' , userPh:'Benutzername', passPh:'Passwort', login:'Anmelden', reg:'Registrieren', logged:'Angemeldet:', badName:'Der Name muss 2-24 Zeichen haben', badPass:'Das Passwort muss mindestens 6 Zeichen haben', nameTaken:'Dieser Name ist schon vergeben', badLogin:'Name oder Passwort falsch', accTip:'Mit Konto kannst du deine Beiträge von jedem Gerät löschen. Ohne Konto schreibst du anonym.', logging:'Anmeldung…' , regOnce:'Dieser Browser hat schon ein Konto', delUser:'Konto löschen', delUserOk:'Konto gelöscht', delUserNo:'Dieses Konto kann nicht gelöscht werden' },
    es: { title:'Libro de visitas', lede:'Deja una idea, una sugerencia o una pregunta: no hace falta cuenta.', nickPh:'¿Cómo te llamamos? (opcional)', textPh:'Escribe algo…', send:'Publicar', sending:'Publicando…', prev:'Anterior', next:'Siguiente', page:'Página {a} / {b}', empty:'Aún no hay comentarios: sé el primero.', loading:'Cargando…', fail:'No se pudo publicar; inténtalo más tarde.', ok:'Publicado. ¡Gracias!', anon:'Anónimo', fast:'Vas muy rápido; espera unos segundos.', need:'Escribe algo primero.', count:'{n} comentarios', offline:'No se pudieron cargar los comentarios; recarga la página.' , dev:'Desarrollador', reserved:'«XUComer» está reservado para el desarrollador; elige otro nombre.' , out:'Salir', rpl:'Responder', rplPh:'Escribe una respuesta…', cd:'Espera {n} s antes de volver a publicar.', ops:'Más acciones', del:'Eliminar', delConfirm:'Pulsa otra vez para confirmar', delOk:'Eliminado', delNo:'No se puede eliminar este comentario', pinLbl:'Fijar', pinOn:'Fijar arriba', pinOff:'Quitar fijado', pinOk:'Fijado', pinUndo:'Fijado quitado', pinFail:'La operación falló; inténtalo de nuevo.',  ava:'Avatar', avaDel:'Quitar avatar', avaBad:'No se puede leer esa imagen: prueba con otra.', avaBig:'La imagen es demasiado grande: elige una más pequeña.', pinnedTag:'Fijado' , userPh:'Usuario', passPh:'Contraseña', login:'Entrar', reg:'Registrarse', logged:'Sesión iniciada:', badName:'El nombre debe tener 2-24 caracteres', badPass:'La contraseña debe tener al menos 6 caracteres', nameTaken:'Ese nombre ya está en uso', badLogin:'Nombre o contraseña incorrectos', accTip:'Regístrate para borrar tus mensajes desde cualquier dispositivo. Sin cuenta puedes escribir de forma anónima.', logging:'Entrando…' , regOnce:'Este navegador ya tiene una cuenta', delUser:'Eliminar cuenta', delUserOk:'Cuenta eliminada', delUserNo:'No se puede eliminar esta cuenta' },
    pt: { title:'Livro de visitas', lede:'Deixe uma ideia, sugestão ou pergunta — não precisa de conta.', nickPh:'Como devemos chamar você? (opcional)', textPh:'Escreva algo…', send:'Publicar', sending:'Publicando…', prev:'Anterior', next:'Próxima', page:'Página {a} / {b}', empty:'Ainda não há comentários — seja o primeiro.', loading:'Carregando…', fail:'Não foi possível publicar. Tente mais tarde.', ok:'Publicado. Obrigado!', anon:'Anônimo', fast:'Muito rápido — espere alguns segundos.', need:'Escreva algo primeiro.', count:'{n} comentários', offline:'Não foi possível carregar os comentários — recarregue a página.' , dev:'Desenvolvedor', reserved:'"XUComer" é reservado ao desenvolvedor — escolha outro nome.' , out:'Sair', rpl:'Responder', rplPh:'Escreva uma resposta…', cd:'Espere {n} s antes de publicar de novo.', ops:'Mais ações', del:'Excluir', delConfirm:'Toque novamente para confirmar', delOk:'Excluído', delNo:'Não é possível excluir este comentário', pinLbl:'Fixar', pinOn:'Fixar no topo', pinOff:'Desafixar', pinOk:'Fixado', pinUndo:'Fixação removida', pinFail:'A operação falhou — tente de novo.',  ava:'Avatar', avaDel:'Remover avatar', avaBad:'Não foi possível ler essa imagem — tente outra.', avaBig:'A imagem é grande demais — escolha uma menor.', pinnedTag:'Fixado' , userPh:'Usuário', passPh:'Senha', login:'Entrar', reg:'Cadastrar', logged:'Conectado:', badName:'O nome deve ter 2-24 caracteres', badPass:'A senha deve ter pelo menos 6 caracteres', nameTaken:'Esse nome já está em uso', badLogin:'Nome ou senha incorretos', accTip:'Cadastre-se para apagar suas mensagens de qualquer aparelho. Sem conta você ainda pode escrever anonimamente.', logging:'Entrando…' , regOnce:'Este navegador já tem uma conta', delUser:'Excluir conta', delUserOk:'Conta excluída', delUserNo:'Não é possível excluir esta conta' },
    ru: { title:'Гостевая книга', lede:'Оставьте мысль, идею или вопрос — аккаунт не нужен.', nickPh:'Как вас называть? (необязательно)', textPh:'Напишите что-нибудь…', send:'Отправить', sending:'Отправка…', prev:'Назад', next:'Далее', page:'Страница {a} / {b}', empty:'Комментариев пока нет — будьте первым.', loading:'Загрузка…', fail:'Не удалось отправить — попробуйте позже.', ok:'Отправлено. Спасибо!', anon:'Аноним', fast:'Слишком быстро — подождите несколько секунд.', need:'Сначала напишите что-нибудь.', count:'Комментариев: {n}', offline:'Не удалось загрузить комментарии — обновите страницу.' , dev:'Разработчик', reserved:'Имя «XUComer» зарезервировано за разработчиком — выберите другое.' , out:'Выйти', rpl:'Ответить', rplPh:'Напишите ответ…', cd:'Подождите {n} с.', ops:'Ещё действия', del:'Удалить', delConfirm:'Нажмите ещё раз для подтверждения', delOk:'Удалено', delNo:'Этот комментарий нельзя удалить', pinLbl:'Закрепить', pinOn:'Закрепить сверху', pinOff:'Открепить', pinOk:'Закреплено', pinUndo:'Закрепление снято', pinFail:'Не удалось выполнить — попробуйте снова.',  ava:'Аватар', avaDel:'Убрать аватар', avaBad:'Не удалось прочитать изображение — попробуйте другое.', avaBig:'Изображение слишком большое — выберите поменьше.', pinnedTag:'Закреплено' , userPh:'Имя', passPh:'Пароль', login:'Войти', reg:'Регистрация', logged:'Вы вошли:', badName:'Имя: от 2 до 24 символов', badPass:'Пароль: минимум 6 символов', nameTaken:'Это имя уже занято', badLogin:'Неверное имя или пароль', accTip:'Зарегистрируйтесь, чтобы удалять свои сообщения с любого устройства. Без этого можно писать анонимно.', logging:'Вход…' , regOnce:'В этом браузере уже есть аккаунт', delUser:'Удалить аккаунт', delUserOk:'Аккаунт удалён', delUserNo:'Этот аккаунт нельзя удалить' },
    it: { title:'Libro degli ospiti', lede:"Lascia un'idea, un suggerimento o una domanda: nessun account richiesto.", nickPh:'Come ti chiamiamo? (facoltativo)', textPh:'Scrivi qualcosa…', send:'Pubblica', sending:'Pubblicazione…', prev:'Indietro', next:'Avanti', page:'Pagina {a} / {b}', empty:'Nessun commento — scrivi il primo.', loading:'Caricamento…', fail:'Pubblicazione non riuscita, riprova più tardi.', ok:'Pubblicato. Grazie!', anon:'Anonimo', fast:'Troppo veloce: attendi qualche secondo.', need:'Scrivi prima qualcosa.', count:'{n} commenti', offline:'Impossibile caricare i commenti: ricarica la pagina.' , dev:'Sviluppatore', reserved:'"XUComer" è riservato allo sviluppatore: scegli un altro nome.' , out:'Esci', rpl:'Rispondi', rplPh:'Scrivi una risposta…', cd:'Attendi {n} s prima di pubblicare.', ops:'Altre azioni', del:'Elimina', delConfirm:'Premi di nuovo per confermare', delOk:'Eliminato', delNo:'Questo commento non può essere eliminato', pinLbl:'Fissa', pinOn:'Fissa in alto', pinOff:'Togli il fissaggio', pinOk:'Fissato', pinUndo:'Fissaggio rimosso', pinFail:'Operazione non riuscita — riprova.',  ava:'Avatar', avaDel:'Rimuovi avatar', avaBad:'Non riesco a leggere questa immagine: provane un altra.', avaBig:'Immagine troppo grande: scegline una piu piccola.', pinnedTag:'Fissato' , userPh:'Nome utente', passPh:'Password', login:'Accedi', reg:'Registrati', logged:'Accesso come:', badName:'Il nome deve essere 2-24 caratteri', badPass:'La password deve avere almeno 6 caratteri', nameTaken:'Questo nome è già usato', badLogin:'Nome o password errati', accTip:'Registrati per cancellare i tuoi messaggi da qualsiasi dispositivo. Senza account puoi scrivere in anonimo.', logging:'Accesso…' , regOnce:'Questo browser ha già un account', delUser:'Elimina account', delUserOk:'Account eliminato', delUserNo:'Questo account non può essere eliminato' },
    nl: { title:'Gastenboek', lede:'Laat een idee, suggestie of vraag achter — geen account nodig.', nickPh:'Hoe mogen we je noemen? (optioneel)', textPh:'Schrijf iets…', send:'Plaatsen', sending:'Bezig met plaatsen…', prev:'Vorige', next:'Volgende', page:'Pagina {a} / {b}', empty:'Nog geen berichten — wees de eerste.', loading:'Laden…', fail:'Plaatsen mislukt — probeer het later opnieuw.', ok:'Geplaatst. Bedankt!', anon:'Anoniem', fast:'Dat ging snel — wacht een paar seconden.', need:'Schrijf eerst iets.', count:'{n} berichten', offline:'Berichten konden niet worden geladen — ververs de pagina.' , dev:'Ontwikkelaar', reserved:'"XUComer" is gereserveerd voor de ontwikkelaar — kies een andere naam.' , out:'Uitloggen', rpl:'Antwoorden', rplPh:'Schrijf een antwoord…', cd:'Wacht {n} s voor je opnieuw plaatst.', ops:'Meer acties', del:'Verwijderen', delConfirm:'Nogmaals tikken om te bevestigen', delOk:'Verwijderd', delNo:'Dit bericht kan niet worden verwijderd', pinLbl:'Vastzetten', pinOn:'Bovenaan vastzetten', pinOff:'Vastzetting opheffen', pinOk:'Vastgezet', pinUndo:'Vastzetting opgeheven', pinFail:'Mislukt — probeer het opnieuw.',  ava:'Profielfoto', avaDel:'Profielfoto verwijderen', avaBad:'Deze afbeelding kan niet worden gelezen — probeer een andere.', avaBig:'De afbeelding is te groot — kies een kleinere.', pinnedTag:'Vastgezet' , userPh:'Gebruikersnaam', passPh:'Wachtwoord', login:'Inloggen', reg:'Registreren', logged:'Ingelogd:', badName:'Naam moet 2-24 tekens zijn', badPass:'Wachtwoord moet minstens 6 tekens zijn', nameTaken:'Deze naam is al bezet', badLogin:'Naam of wachtwoord fout', accTip:'Registreer je om je berichten van elk apparaat te verwijderen. Zonder account kun je anoniem schrijven.', logging:'Inloggen…' , regOnce:'Deze browser heeft al een account', delUser:'Account verwijderen', delUserOk:'Account verwijderd', delUserNo:'Dit account kan niet worden verwijderd' },
    pl: { title:'Księga gości', lede:'Zostaw myśl, pomysł albo pytanie — konto nie jest potrzebne.', nickPh:'Jak mamy cię nazywać? (opcjonalnie)', textPh:'Napisz coś…', send:'Opublikuj', sending:'Publikowanie…', prev:'Poprzednia', next:'Następna', page:'Strona {a} / {b}', empty:'Brak komentarzy — napisz pierwszy.', loading:'Wczytywanie…', fail:'Nie udało się opublikować — spróbuj później.', ok:'Opublikowano. Dziękujemy!', anon:'Anonim', fast:'Trochę za szybko — poczekaj kilka sekund.', need:'Najpierw coś napisz.', count:'Komentarze: {n}', offline:'Nie udało się wczytać komentarzy — odśwież stronę.' , dev:'Twórca', reserved:'Nazwa "XUComer" jest zarezerwowana dla twórcy — wybierz inną.' , out:'Wyloguj', rpl:'Odpowiedz', rplPh:'Napisz odpowiedź…', cd:'Poczekaj {n} s.', ops:'Więcej akcji', del:'Usuń', delConfirm:'Naciśnij ponownie, aby potwierdzić', delOk:'Usunięto', delNo:'Nie można usunąć tego komentarza', pinLbl:'Przypnij', pinOn:'Przypnij na górze', pinOff:'Odepnij', pinOk:'Przypięto', pinUndo:'Przypięcie usunięte', pinFail:'Nie udało się — spróbuj ponownie.',  ava:'Awatar', avaDel:'Usuń awatar', avaBad:'Nie udało się odczytać tego obrazu — spróbuj innego.', avaBig:'Obraz jest za duży — wybierz mniejszy.', pinnedTag:'Przypięty' , userPh:'Nazwa użytkownika', passPh:'Hasło', login:'Zaloguj', reg:'Zarejestruj', logged:'Zalogowano:', badName:'Nazwa musi mieć 2-24 znaki', badPass:'Hasło musi mieć co najmniej 6 znaków', nameTaken:'Ta nazwa jest już zajęta', badLogin:'Zła nazwa lub hasło', accTip:'Zarejestruj się, aby usuwać swoje wpisy z każdego urządzenia. Bez konta możesz pisać anonimowo.', logging:'Logowanie…' , regOnce:'Ta przeglądarka ma już konto', delUser:'Usuń konto', delUserOk:'Konto usunięte', delUserNo:'Nie można usunąć tego konta' },
    tr: { title:'Konuk defteri', lede:'Bir fikir, öneri ya da soru bırak — hesap gerekmez.', nickPh:'Sana nasıl hitap edelim? (isteğe bağlı)', textPh:'Bir şeyler yaz…', send:'Gönder', sending:'Gönderiliyor…', prev:'Önceki', next:'Sonraki', page:'Sayfa {a} / {b}', empty:'Henüz yorum yok — ilkini sen yaz.', loading:'Yükleniyor…', fail:'Gönderilemedi — lütfen sonra tekrar dene.', ok:'Gönderildi. Teşekkürler!', anon:'Anonim', fast:'Biraz hızlı oldu — birkaç saniye bekle.', need:'Önce bir şeyler yaz.', count:'{n} yorum', offline:'Yorumlar yüklenemedi — sayfayı yenile.' , dev:'Geliştirici', reserved:'"XUComer" geliştiriciye ayrılmıştır — lütfen başka bir ad seçin.' , out:'Çıkış', rpl:'Yanıtla', rplPh:'Bir yanıt yaz…', cd:'Yeniden göndermek için {n} sn bekle.', ops:'Daha fazla işlem', del:'Sil', delConfirm:'Onaylamak için tekrar dokun', delOk:'Silindi', delNo:'Bu yorum silinemiyor', pinLbl:'Sabitle', pinOn:'Üste sabitle', pinOff:'Sabitlemeyi kaldır', pinOk:'Sabitlendi', pinUndo:'Sabitleme kaldırıldı', pinFail:'İşlem başarısız — tekrar deneyin.',  ava:'Profil', avaDel:'Profili kaldır', avaBad:'Bu görsel okunamadı — başka bir tane dene.', avaBig:'Görsel çok büyük — daha küçük bir tane seç.', pinnedTag:'Sabitlendi' , userPh:'Kullanıcı adı', passPh:'Şifre', login:'Giriş', reg:'Kayıt ol', logged:'Giriş yapıldı:', badName:'Ad 2-24 karakter olmalı', badPass:'Şifre en az 6 karakter olmalı', nameTaken:'Bu ad alınmış', badLogin:'Ad veya şifre hatalı', accTip:'Kayıt olursan kendi yorumlarını her cihazdan silebilirsin. Kayıt olmadan da anonim yazabilirsin.', logging:'Giriş yapılıyor…' , regOnce:'Bu tarayıcıda zaten bir hesap var', delUser:'Hesabı sil', delUserOk:'Hesap silindi', delUserNo:'Bu hesap silinemiyor' },
    ar: { title:'لوحة الزوار', lede:'اترك فكرة أو اقتراحًا أو سؤالًا — لا حاجة إلى حساب.', nickPh:'بماذا نناديك؟ (اختياري)', textPh:'اكتب شيئًا…', send:'نشر', sending:'جارٍ النشر…', prev:'السابق', next:'التالي', page:'صفحة {a} / {b}', empty:'لا توجد تعليقات بعد — كن الأول.', loading:'جارٍ التحميل…', fail:'تعذّر النشر — حاول لاحقًا.', ok:'تم النشر. شكرًا!', anon:'مجهول', fast:'كان ذلك سريعًا — انتظر بضع ثوانٍ.', need:'اكتب شيئًا أولًا.', count:'{n} تعليق', offline:'تعذّر تحميل التعليقات — أعد تحميل الصفحة.' , dev:'المطور', reserved:'الاسم "XUComer" مخصص للمطور — الرجاء اختيار اسم آخر.' , out:'تسجيل الخروج', rpl:'رد', rplPh:'اكتب ردًا…', cd:'انتظر {n} ثانية قبل النشر مجددًا.', ops:'إجراءات أخرى', del:'حذف', delConfirm:'اضغط مرة أخرى للتأكيد', delOk:'تم الحذف', delNo:'لا يمكن حذف هذا التعليق', pinLbl:'تثبيت', pinOn:'تثبيت في الأعلى', pinOff:'إلغاء التثبيت', pinOk:'تم التثبيت', pinUndo:'تم إلغاء التثبيت', pinFail:'تعذر تنفيذ الإجراء — حاول مرة أخرى.',  ava:'الصورة', avaDel:'إزالة الصورة', avaBad:'تعذّر قراءة هذه الصورة — جرّب صورة أخرى.', avaBig:'الصورة كبيرة جدًا — اختر صورة أصغر.', pinnedTag:'مثبت' , userPh:'اسم المستخدم', passPh:'كلمة المرور', login:'دخول', reg:'إنشاء حساب', logged:'تم الدخول:', badName:'يجب أن يكون الاسم 2-24 حرفًا', badPass:'كلمة المرور 6 أحرف على الأقل', nameTaken:'هذا الاسم مستخدم بالفعل', badLogin:'الاسم أو كلمة المرور خطأ', accTip:'أنشئ حسابًا لتحذف رسائلك من أي جهاز. وبدون حساب يمكنك الكتابة باسم مجهول.', logging:'جارٍ الدخول…' , regOnce:'هذا المتصفح لديه حساب بالفعل', delUser:'حذف الحساب', delUserOk:'تم حذف الحساب', delUserNo:'لا يمكن حذف هذا الحساب' },
    th: { title:'สมุดเยี่ยมชม', lede:'ฝากความคิด ข้อเสนอ หรือคำถามไว้ได้เลย ไม่ต้องมีบัญชี', nickPh:'ให้เราเรียกคุณว่าอะไร (ไม่บังคับ)', textPh:'เขียนอะไรสักหน่อย…', send:'โพสต์', sending:'กำลังโพสต์…', prev:'ก่อนหน้า', next:'ถัดไป', page:'หน้า {a} / {b}', empty:'ยังไม่มีความคิดเห็น มาเป็นคนแรกกัน', loading:'กำลังโหลด…', fail:'โพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง', ok:'โพสต์แล้ว ขอบคุณ!', anon:'ไม่ระบุชื่อ', fast:'เร็วไปนิด รอสักสองสามวินาที', need:'เขียนอะไรก่อนนะ', count:'{n} ความคิดเห็น', offline:'โหลดความคิดเห็นไม่สำเร็จ รีเฟรชหน้า' , dev:'ผู้พัฒนา', reserved:'ชื่อ "XUComer" สงวนไว้สำหรับผู้พัฒนา กรุณาใช้ชื่ออื่น' , out:'ออกจากระบบ', rpl:'ตอบกลับ', rplPh:'เขียนคำตอบ…', cd:'รออีก {n} วินาทีก่อนโพสต์อีกครั้ง', ops:'การกระทำเพิ่มเติม', del:'ลบ', delConfirm:'แตะอีกครั้งเพื่อยืนยัน', delOk:'ลบแล้ว', delNo:'ไม่สามารถลบความคิดเห็นนี้ได้', pinLbl:'ปักหมุด', pinOn:'ปักหมุดไว้ด้านบน', pinOff:'ยกเลิกปักหมุด', pinOk:'ปักหมุดแล้ว', pinUndo:'ยกเลิกปักหมุดแล้ว', pinFail:'ทำไม่สำเร็จ ลองใหม่',  ava:'รูปโปรไฟล์', avaDel:'ลบรูปโปรไฟล์', avaBad:'อ่านรูปนี้ไม่ได้ ลองรูปอื่น', avaBig:'รูปใหญ่เกินไป เลือกรูปที่เล็กกว่านี้', pinnedTag:'ปักหมุดแล้ว' , userPh:'ชื่อผู้ใช้', passPh:'รหัสผ่าน', login:'เข้าสู่ระบบ', reg:'สมัครสมาชิก', logged:'เข้าสู่ระบบแล้ว:', badName:'ชื่อต้องมี 2-24 ตัวอักษร', badPass:'รหัสผ่านอย่างน้อย 6 ตัว', nameTaken:'ชื่อนี้ถูกใช้แล้ว', badLogin:'ชื่อหรือรหัสผ่านไม่ถูกต้อง', accTip:'สมัครสมาชิกเพื่อลบข้อความของคุณจากทุกอุปกรณ์ ไม่สมัครก็เขียนแบบไม่ระบุชื่อได้', logging:'กำลังเข้าสู่ระบบ…' , regOnce:'เบราว์เซอร์นี้มีบัญชีแล้ว', delUser:'ลบบัญชี', delUserOk:'ลบบัญชีแล้ว', delUserNo:'ไม่สามารถลบบัญชีนี้ได้' },
    vi: { title:'Sổ lưu bút', lede:'Để lại suy nghĩ, góp ý hoặc câu hỏi — không cần tài khoản.', nickPh:'Gọi bạn là gì? (không bắt buộc)', textPh:'Viết gì đó…', send:'Đăng', sending:'Đang đăng…', prev:'Trước', next:'Sau', page:'Trang {a} / {b}', empty:'Chưa có bình luận — hãy là người đầu tiên.', loading:'Đang tải…', fail:'Không đăng được — vui lòng thử lại sau.', ok:'Đã đăng. Cảm ơn!', anon:'Ẩn danh', fast:'Hơi nhanh — đợi vài giây nhé.', need:'Hãy viết gì đó trước.', count:'{n} bình luận', offline:'Không tải được bình luận — tải lại trang.' , dev:'Nhà phát triển', reserved:'"XUComer" là tên dành riêng cho nhà phát triển — hãy chọn tên khác.' , out:'Đăng xuất', rpl:'Trả lời', rplPh:'Viết phản hồi…', cd:'Đợi {n} giây trước khi đăng lại.', ops:'Thao tác khác', del:'Xóa', delConfirm:'Nhấn lại để xác nhận', delOk:'Đã xóa', delNo:'Không thể xóa bình luận này', pinLbl:'Ghim', pinOn:'Ghim lên đầu', pinOff:'Bỏ ghim', pinOk:'Đã ghim', pinUndo:'Đã bỏ ghim', pinFail:'Thao tác thất bại — thử lại sau.',  ava:'Ảnh đại diện', avaDel:'Xóa ảnh đại diện', avaBad:'Không đọc được ảnh này — thử ảnh khác.', avaBig:'Ảnh quá lớn — chọn ảnh nhỏ hơn.', pinnedTag:'Đã ghim' , userPh:'Tên người dùng', passPh:'Mật khẩu', login:'Đăng nhập', reg:'Đăng ký', logged:'Đã đăng nhập:', badName:'Tên phải dài 2-24 ký tự', badPass:'Mật khẩu ít nhất 6 ký tự', nameTaken:'Tên này đã có người dùng', badLogin:'Sai tên hoặc mật khẩu', accTip:'Đăng ký để xóa bài của bạn từ mọi thiết bị. Không đăng ký vẫn có thể viết ẩn danh.', logging:'Đang đăng nhập…' , regOnce:'Trình duyệt này đã có tài khoản', delUser:'Xóa tài khoản', delUserOk:'Đã xóa tài khoản', delUserNo:'Không thể xóa tài khoản này' },
    id: { title:'Buku tamu', lede:'Tinggalkan ide, saran, atau pertanyaan — tanpa akun.', nickPh:'Kami panggil kamu apa? (opsional)', textPh:'Tulis sesuatu…', send:'Kirim', sending:'Mengirim…', prev:'Sebelumnya', next:'Berikutnya', page:'Halaman {a} / {b}', empty:'Belum ada komentar — jadilah yang pertama.', loading:'Memuat…', fail:'Gagal mengirim — coba lagi nanti.', ok:'Terkirim. Terima kasih!', anon:'Anonim', fast:'Terlalu cepat — tunggu beberapa detik.', need:'Tulis sesuatu dulu.', count:'{n} komentar', offline:'Gagal memuat komentar — muat ulang halaman.', dev:'Pengembang', reserved:'Nama "XUComer" khusus untuk pengembang — silakan pilih nama lain.' , out:'Keluar', rpl:'Balas', rplPh:'Tulis balasan…', cd:'Tunggu {n} detik sebelum mengirim lagi.', ops:'Tindakan lain', del:'Hapus', delConfirm:'Ketuk lagi untuk mengonfirmasi', delOk:'Dihapus', delNo:'Komentar ini tidak dapat dihapus', pinLbl:'Sematkan', pinOn:'Sematkan di atas', pinOff:'Batal semat', pinOk:'Disematkan', pinUndo:'Semat dibatalkan', pinFail:'Gagal — coba lagi.',  ava:'Avatar', avaDel:'Hapus avatar', avaBad:'Gambar ini tidak bisa dibaca — coba yang lain.', avaBig:'Gambar terlalu besar — pilih yang lebih kecil.', pinnedTag:'Disematkan', userPh:'Nama pengguna', passPh:'Kata sandi', login:'Masuk', reg:'Daftar', logged:'Masuk sebagai:', badName:'Nama harus 2-24 karakter', badPass:'Kata sandi minimal 6 karakter', nameTaken:'Nama ini sudah dipakai', badLogin:'Nama atau kata sandi salah', accTip:'Daftar untuk menghapus pesanmu dari perangkat mana pun. Tanpa akun kamu tetap bisa menulis anonim.', logging:'Sedang masuk…' , regOnce:'Browser ini sudah punya akun', delUser:'Hapus akun', delUserOk:'Akun dihapus', delUserNo:'Akun ini tidak dapat dihapus' }
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
               accState:$('accState'), accTip:$('accTip'),
               user:$('user'), pass:$('pass'),
               loginBtn:$('loginBtn'), regBtn:$('regBtn'), accOut:$('accOut') };

  let lang = 'zh_CN';
  let total = 0;
  let page = 0;
  let pages = 1;
  let busy = false;
  let mainBusy = false;
  let coolTimer = null;
  let cloud = null;
  let devKey = null;
  let tok = '';
  let regDone = false;
  let myUid = '';
  let myName = '';

  const t = k => (STR[lang] || STR.en)[k] || STR.en[k];

  function clean(s, max) {
    return String(s == null ? '' : s)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .slice(0, max);
  }

  const HEX64 = /^[0-9a-f]{64}$/;
  const safeKey = k => (typeof k === 'string' && HEX64.test(k)) ? k : null;
  const TOK_OK = s => (typeof s === 'string' && HEX64.test(s)) ? s : '';

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

  (function initToken() {
    let v = '';
    try { v = localStorage.getItem(TOK_KEY) || ''; } catch (e) {}
    tok = TOK_OK(v);
    try { regDone = localStorage.getItem(REG_KEY) === '1'; } catch (e) {}
  })();

  if (cloud) { readMe(); }

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
    paintAcc();
    renderCount();
    renderPager();
    paintCool();
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
    Array.prototype.forEach.call(document.querySelectorAll('.mi-del, .mi-udel'), b => {
      if (b.dataset.arms === '1') {
        b.dataset.arms = '0';
        b.classList.remove('danger');
        b.textContent = b.classList.contains('mi-udel') ? t('delUser') : t('del');
      }
    });
  }

  const canManage = row => !!devKey || isMine(row.id)
    || (!!myUid && !!row.user_id && String(row.user_id) === myUid);

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

    if (devKey && row.user_id) {
      const bUser = document.createElement('button');
      bUser.type = 'button';
      bUser.className = 'mi mi-udel';
      bUser.textContent = t('delUser');
      bUser.dataset.arms = '0';
      bUser.addEventListener('click', function (e) {
        e.stopPropagation();
        if (bUser.dataset.arms === '1') { doDelUser(li, bUser, row); return; }
        disarmAll();
        bUser.dataset.arms = '1';
        bUser.classList.add('danger');
        bUser.textContent = t('delConfirm');
        clearTimeout(delTimer);
        delTimer = setTimeout(disarmAll, 3500);
      });
      menu.appendChild(bUser);
    }

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
    const { error } = await cloud.database.rpc('gb_del', { pid: id, psid: sidNow(), pkey: key, ptok: tok || null });

    btn.disabled = false;

    if (error) {
      disarmAll();
      showMsg(t('delNo'), 'err');
      return;
    }

    showMsg(t('delOk'), 'ok');
    closeMenus();
    disarmAll();

    if (!li.classList.contains('reply')) {
      const replies = Array.prototype.slice.call(li.querySelectorAll('.replies > li.reply'));
      replies.forEach(r => dropMine(r.dataset.id));
    }
    dropMine(id);
    load();
  }

  async function doDelUser(li, btn, row) {
    const uid = (row && row.user_id) ? String(row.user_id) : '';
    const key = safeKey(devKey);
    if (!uid || !key || !cloud) return;

    btn.disabled = true;

    const { data, error } = await cloud.database
      .rpc('gb_deluser', { puid: uid, pkey: key });

    btn.disabled = false;

    if (error || !data) {
      disarmAll();
      showMsg(t('delUserNo'), 'err');
      return;
    }

    closeMenus();
    showMsg(t('delUserOk'), 'ok');

    if (myUid && myUid === uid) {
      tok = '';
      myName = '';
      myUid = '';
      try { localStorage.removeItem(TOK_KEY); } catch (e) {}
      paintAcc();
    }
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
    } else if (tok) {
      row.nick = myName || t('anon');
      row.logintoken = tok;
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

  function updateLen() {
    el.len.textContent = el.text.value.length + ' / 600';
  }

  function reportHeight() {
    if (window.parent === window) return;
    let h = document.documentElement.scrollHeight;
    h = Math.max(h, 200);
    try { window.parent.postMessage({ gb: { height: h } }, '*'); } catch (e) {}
  }

  function paintAcc() {
    const on = !!myName;
    const once = regDone && !on;

    el.accState.hidden = !on;
    el.accOut.hidden = !on;
    el.user.hidden = on;
    el.pass.hidden = on;
    el.loginBtn.hidden = on;
    el.regBtn.hidden = on || regDone;
    el.accTip.hidden = on;

    el.user.placeholder = t('userPh');
    el.pass.placeholder = t('passPh');
    el.loginBtn.textContent = t('login');
    el.regBtn.textContent = once ? t('regOnce') : t('reg');
    el.accOut.textContent = t('out');
    el.accTip.textContent = t('accTip');

    if (on) el.accState.textContent = t('logged') + myName;
    if (once) el.accTip.textContent = t('regOnce');
    else el.accTip.textContent = t('accTip');
    el.nick.hidden = !!devKey || on;
    reportHeight();
  }

  async function readMe() {
    myName = '';
    myUid = '';
    if (!tok || !cloud) { paintAcc(); return; }
    const r = await cloud.database.rpc('gb_who', { ptok: tok });
    const d = (!r.error && r.data) ? r.data : null;
    if (d && d.name) {
      myName = String(d.name);
      myUid = String(d.uid || '');
    } else {
      tok = '';
      try { localStorage.removeItem(TOK_KEY); } catch (e) {}
    }
    paintAcc();
  }

  async function account(fn, bad) {
    const nm = clean(el.user.value, 24);
    const pw = String(el.pass.value || '');

    if (fn === 'gb_reg' && regDone) { showMsg(t('regOnce'), 'err'); return; }

    if (fn === 'gb_reg' && (nm.length < 2 || pw.length < 6)) {
      showMsg(nm.length < 2 ? t('badName') : t('badPass'), 'err');
      (nm.length < 2 ? el.user : el.pass).focus();
      return;
    }
    if (!nm || !pw) {
      showMsg(!nm ? t('badName') : t('badPass'), 'err');
      (!nm ? el.user : el.pass).focus();
      return;
    }
    if (!cloud) { showMsg(t('fail'), 'err'); return; }

    el.loginBtn.disabled = true;
    el.regBtn.disabled = true;
    el.loginBtn.textContent = t('logging');
    showMsg('');

    const r = await cloud.database.rpc(fn, { pname: nm, ppass: pw });

    el.loginBtn.disabled = false;
    el.regBtn.disabled = false;
    el.loginBtn.textContent = t('login');

    if (r.error) {
      const m = String(r.error.message || '');
      showMsg(/taken/.test(m) ? t('nameTaken')
        : (/reserved/.test(m) ? t('reserved') : t(bad)), 'err');
      return;
    }

    tok = TOK_OK(r.data);
    if (fn === 'gb_reg') { regDone = true; try { localStorage.setItem(REG_KEY, '1'); } catch (e) {} }
    el.pass.value = '';
    try { localStorage.setItem(TOK_KEY, tok); } catch (e) {}
    await readMe();
    showMsg(t('ok'), 'ok');
    load();
  }

  async function doLogout() {
    if (cloud && tok) {
      try { await cloud.database.rpc('gb_bye', { ptok: tok }); } catch (e) {}
    }
    tok = '';
    myName = '';
    myUid = '';
    try { localStorage.removeItem(TOK_KEY); } catch (e) {}
    paintAcc();
    load();
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
    el.nick.hidden = !!myName;
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
  el.loginBtn.addEventListener('click', function () { account('gb_log', 'badLogin'); });
  el.regBtn.addEventListener('click', function () { account('gb_reg', 'badLogin'); });
  el.accOut.addEventListener('click', doLogout);
  el.pass.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); account('gb_log', 'badLogin'); } });
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
