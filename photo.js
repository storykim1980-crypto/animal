/* =========================================================================
   photo.js — 画像の取り扱いと重複検出
   すべてブラウザ内で完結します。画像はどこにも送信されません。
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1. SHA-256（完全一致の検出） ---------- */
  async function sha256hex(buf) {
    if (!window.crypto || !window.crypto.subtle) return null;
    var h = await crypto.subtle.digest('SHA-256', buf);
    return Array.prototype.map.call(new Uint8Array(h), function (b) {
      return ('00' + b.toString(16)).slice(-2);
    }).join('');
  }

  /* ---------- 2. aHash（知覚ハッシュ：縮小→再圧縮でも一致） ---------- */
  /*  8x8 に縮小してグレースケール平均と比較 → 64bit の指紋  */
  function aHashFromCanvas(cv) {
    var ctx = cv.getContext('2d');
    var d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    var vals = [];
    var sum = 0;
    for (var i = 0; i < d.length; i += 4) {
      var g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
      vals.push(g);
      sum += g;
    }
    var avg = sum / vals.length;
    var bits = '';
    for (var j = 0; j < vals.length; j++) bits += vals[j] >= avg ? '1' : '0';
    return bits;
  }

  function hamming(a, b) {
    if (!a || !b || a.length !== b.length) return 999;
    var d = 0;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
    return d;
  }

  /* ---------- 3. 画像を読み込み、縮小して dataURL 化 ---------- */
  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('画像を読み込めませんでした。')); };
      img.src = url;
    });
  }

  function drawToCanvas(img, maxSide, squareCrop) {
    var sw = img.naturalWidth, sh = img.naturalHeight;
    var cv = document.createElement('canvas');
    var ctx = cv.getContext('2d');

    if (squareCrop) {
      var side = Math.min(sw, sh);
      cv.width = maxSide; cv.height = maxSide;
      ctx.drawImage(img, (sw - side) / 2, (sh - side) / 2, side, side,
                    0, 0, maxSide, maxSide);
    } else {
      var scale = Math.min(1, maxSide / Math.max(sw, sh));
      cv.width = Math.round(sw * scale);
      cv.height = Math.round(sh * scale);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
    }
    return cv;
  }

  /* ---------- 4. メイン：ファイル → 指紋と表示用データ ---------- */
  window.PHOTO = {

    /**
     * @param {File} file
     * @returns {Promise<{sha256,ahash,dataUrl,width,height,size,name}>}
     */
    analyze: async function (file) {
      if (!file.type || file.type.indexOf('image/') !== 0) {
        throw new Error('画像ファイルを選んでください。');
      }
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('20MB を超える画像は登録できません。');
      }

      /* 完全一致用ハッシュ（元ファイルそのもの） */
      var buf = await file.arrayBuffer();
      var sha = await sha256hex(buf);

      var img = await loadImage(file);

      /* 知覚ハッシュ（8x8） */
      var small = drawToCanvas(img, 8, true);
      var ah = aHashFromCanvas(small);

      /* 表示用（長辺 1100px、JPEG 82%） */
      var big = drawToCanvas(img, 1100, false);
      var dataUrl = big.toDataURL('image/jpeg', 0.82);

      return {
        sha256: sha,
        ahash: ah,
        dataUrl: dataUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        name: file.name
      };
    },

    hamming: hamming,

    /* ---------- 5. 端末の指紋（同じ人が何度も登録するのを抑える） ---------- */
    deviceId: function () {
      var parts = [];
      var s = window.screen || {};
      parts.push('scr' + (s.width || 0) + 'x' + (s.height || 0) + 'x' + (s.colorDepth || 0));
      parts.push('dpr' + (window.devicePixelRatio || 1));
      parts.push('tz' + (Intl.DateTimeFormat().resolvedOptions().timeZone || ''));
      parts.push('lang' + (navigator.language || ''));
      parts.push('langs' + ((navigator.languages || []).join(',')));
      parts.push('cores' + (navigator.hardwareConcurrency || 0));
      parts.push('mem' + (navigator.deviceMemory || 0));
      parts.push('touch' + (('ontouchstart' in window) ? 1 : 0));
      parts.push('ua' + (navigator.userAgent || ''));

      /* Canvas 指紋（GPU/フォント差異が出る） */
      try {
        var c = document.createElement('canvas');
        c.width = 220; c.height = 40;
        var x = c.getContext('2d');
        x.textBaseline = 'top';
        x.font = '14px "Hiragino Mincho ProN", serif';
        x.fillStyle = '#f60'; x.fillRect(0, 0, 100, 20);
        x.fillStyle = '#069'; x.fillText('うちの子の星 あア😀', 2, 12);
        x.fillStyle = 'rgba(102,204,0,0.7)'; x.fillText('Komorebi', 4, 22);
        parts.push('cv' + c.toDataURL().slice(-140));
      } catch (e) { parts.push('cv0'); }

      var raw = parts.join('|');
      /* 簡易ハッシュ（衝突しにくい 64bit 風の文字列） */
      var h1 = 0x811c9dc5, h2 = 0x01000193;
      for (var i = 0; i < raw.length; i++) {
        var ch = raw.charCodeAt(i);
        h1 = (h1 ^ ch) * 16777619 >>> 0;
        h2 = (h2 + ch * (i + 7)) * 2654435761 >>> 0;
      }
      return ('00000000' + h1.toString(16)).slice(-8) +
             ('00000000' + h2.toString(16)).slice(-8);
    }
  };
})();
