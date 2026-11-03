/* =========================================================================
   guard.js — 重複登録の防止（クライアント側）
   -------------------------------------------------------------------------
   実際の判定はサーバー側（Worker）でも行います。
   ここは「送信前に、その場で気づいてもらう」ための層です。

   判定の4段階
     1) 同じ写真か          … SHA-256（完全一致）
     2) 縮小・再保存した写真か … 知覚ハッシュ（8x8 平均 hash / 64bit）
     3) 同じ端末か          … Canvas + 画面情報による端末指紋
     4) 同じネットワークか   … IP（サーバー側でのみ判定）
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'komorebi_guard_v1';

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { records: [], lastAt: 0 };
      var o = JSON.parse(raw);
      if (!Array.isArray(o.records)) o.records = [];
      return o;
    } catch (e) { return { records: [], lastAt: 0 }; }
  }

  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  window.GUARD = {

    /* 端末指紋 */
    device: function () {
      return (window.PHOTO && window.PHOTO.deviceId) ? window.PHOTO.deviceId() : 'na';
    },

    /* 既存の記録（この端末で登録したもの） */
    records: function () { return read().records; },

    /**
     * 判定
     * @param {{sha256:string, ahash:string}} fp
     * @returns {{ok:boolean, reason?:string, detail?:string}}
     */
    check: function (fp) {
      var db = read();
      var now = Date.now();
      var ONE_DAY = 86400000;

      /* --- 1) 同じ端末で、24時間以内に登録済みか --- */
      if (db.lastAt && (now - db.lastAt) < ONE_DAY) {
        var hours = Math.ceil((ONE_DAY - (now - db.lastAt)) / 3600000);
        return {
          ok: false,
          reason: 'device',
          detail: 'この端末からは、すでに登録があります。' +
                  '同じ方が何度も登録されないよう、' +
                  '次の登録は約 ' + hours + ' 時間後からにしています。'
        };
      }

      /* --- 2) 完全一致（同じファイル） --- */
      for (var i = 0; i < db.records.length; i++) {
        if (db.records[i].sha256 && fp.sha256 && db.records[i].sha256 === fp.sha256) {
          return {
            ok: false,
            reason: 'duplicate',
            detail: 'この写真は、すでに登録されています。' +
                    '同じ写真を二重に登録することはできません。'
          };
        }
      }

      /* --- 3) 知覚ハッシュ（縮小・再保存・スクショでも近い） --- */
      for (var j = 0; j < db.records.length; j++) {
        var rec = db.records[j];
        if (!rec.ahash) continue;
        var dist = window.PHOTO.hamming(rec.ahash, fp.ahash);
        if (dist <= 6) {           /* 64bit 中 6bit 以内の差 = ほぼ同じ絵 */
          return {
            ok: false,
            reason: 'similar',
            detail: 'この写真は、すでに登録されている写真とほとんど同じです。' +
                    '（別の写真を選んでください）'
          };
        }
      }

      return { ok: true };
    },

    /* 送信成功時に記録 */
    commit: function (fp, meta) {
      var db = read();
      db.records.push({
        sha256: fp.sha256,
        ahash: fp.ahash,
        at: Date.now(),
        name: (meta && meta.name) || ''
      });
      if (db.records.length > 40) db.records = db.records.slice(-40);
      db.lastAt = Date.now();
      write(db);
    },

    /* サーバー側で弾かれたときの記録（同じ写真の再送を防ぐ） */
    remember: function (fp) {
      var db = read();
      db.records.push({ sha256: fp.sha256, ahash: fp.ahash, at: Date.now(), name: '' });
      if (db.records.length > 40) db.records = db.records.slice(-40);
      write(db);
    },

    /* 端末側の記録を消す（テスト・誤操作の救済） */
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };
})();
