const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync(process.env.TMP + '/wb-sdk.js', 'utf8');
const store = {};
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: (...a) => globalThis.fetch(...a),
  Headers: globalThis.Headers, Request: globalThis.Request, Response: globalThis.Response,
  URL: globalThis.URL, URLSearchParams: globalThis.URLSearchParams,
  AbortController: globalThis.AbortController,
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; }, clear: () => {} },
  location: { href: 'https://xucomer-guestbook.app.workbuddy.host/', origin: 'https://xucomer-guestbook.app.workbuddy.host', search: '' },
  navigator: { userAgent: 'node-verify' },
  document: { documentElement: { style: { setProperty() {} } } },
  atob: globalThis.atob, btoa: globalThis.btoa
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const DEV = '55a356f523d9e3591db19b136fc0335ebb59b79d09940816cb8dad8797a4404e';
const cloud = sandbox.WorkBuddyCloud.createWorkBuddyCloud({
  endpoint: 'https://xucomer-guestbook.app.workbuddy.host',
  publishableKey: 'wbpk_vOFjIoaEiNMwULCZUhySoh_06j7JNK5kcQq1aGxtP6Sm63xXKW8hfcH'
});

async function tryInsert(nick, devkey, why) {
  const row = { nick, body: '__devtest__ ' + why };
  if (devkey) row.devkey = devkey;
  const r = await cloud.database.from('comments').insert(row).select('id, nick, body, devkey');
  if (r.error) return { ok: false, msg: (r.error.code || '') + ' ' + (r.error.message || '') };
  const d = r.data && r.data[0];
  return { ok: true, id: d && d.id, devkeyStored: d ? String(d.devkey) : '(none)' };
}

(async () => {
  const cases = [
    ['XUComer', null, '冒充：无密钥'],
    ['xucomer', null, '冒充：小写'],
    ['XUComer', 'wrong-key-xxx', '冒充：错误密钥'],
    ['XUComer', DEV, '开发者：正确密钥'],
    ['小明', null, '普通访客']
  ];
  for (const [nick, dk, why] of cases) {
    const r = await tryInsert(nick, dk, why);
    console.log((r.ok ? '  通过 ' : '  拦截 ') + why + '  ' + JSON.stringify(nick) +
      (r.ok ? '   id=' + r.id + '  库里devkey=' + r.devkeyStored : '   ' + r.msg));
  }
})();
