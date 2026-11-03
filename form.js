/* =========================================================================
   フォーム送信の共通処理
   config.js の設定に応じて、外部サービス / mailto を切り替えます。
   ========================================================================= */
(function () {
  'use strict';

  var C = window.SITE_CONFIG || {};

  function show(box, type, html) {
    box.className = 'form-msg ' + type;
    box.innerHTML = html;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function toMailto(payload) {
    var rows = [];
    Object.keys(payload).forEach(function (k) {
      if (k === 'type' || k === 'url' || k === 'subject') return;
      if (!payload[k]) return;
      rows.push(k + ': ' + payload[k]);
    });
    var subject = payload.subject || 'お申し込み';
    var body = rows.join('\n') + '\n\n──\n送信元: ' + location.href;
    return 'mailto:' + encodeURIComponent(C.mailTo || '') +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  window.sendForm = async function (payload, box, btn, doneText) {
    /* honeypot */
    if (payload.website) return;

    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = '送信中…';

    try {
      /* ---- 1) 外部サービス ---- */
      if (C.formEndpoint) {
        var body = {
          access_key: C.accessKey || undefined,
          subject: payload.subject || 'お申し込み',
          from_name: C.brand || 'website',
          replyto: payload.email,
          redirect: 'false'
        };
        Object.keys(payload).forEach(function (k) {
          if (k === 'subject' || k === 'url') return;
          body[k] = payload[k];
        });

        var res = await fetch(C.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body)
        });

        var data = null;
        try { data = await res.json(); } catch (e) { data = null; }

        if (!res.ok || (data && (data.success === false || data.ok === false))) {
          throw new Error((data && (data.message || data.error)) || '送信できませんでした。');
        }

        show(box, 'ok', doneText);
        return true;
      }

      /* ---- 2) mailto フォールバック ---- */
      var url = toMailto(payload);
      window.location.href = url;
      show(box, 'ok',
        'メールソフトが開きます。内容はすでに入力されていますので、' +
        'そのまま送信してください。<br>' +
        '<span style="font-size:11px;opacity:.75">' +
        'メールソフトが開かない場合は、' + esc(C.mailTo || '') + ' までご連絡ください。</span>');
      return true;

    } catch (err) {
      show(box, 'err',
        '送信できませんでした。お手数ですが、時間をおいてもう一度お試しください。' +
        '<br><span style="font-size:11px;opacity:.75">（' + esc(err.message) + '）</span>');
      return false;

    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  };

  window.formMsgBox = function (id) {
    return document.getElementById(id);
  };
})();
