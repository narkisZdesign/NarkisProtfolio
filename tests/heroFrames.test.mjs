import assert from 'node:assert/strict';
import test from 'node:test';
import { createHeroFrames } from '../src/lib/heroFrames.ts';

const flush = () => new Promise((resolve) => setImmediate(resolve));

function harness(t, mobile = false) {
  const fetched = [];
  const pending = [];
  const bitmaps = [];
  let notifications = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const index = Number(url);
    fetched.push({ index, signal: options.signal });
    const blob = new Blob(['frame']);
    blob.frame = index;
    return { ok: true, blob: async () => blob };
  });
  const originalBitmap = globalThis.createImageBitmap;
  globalThis.createImageBitmap = t.mock.fn((blob) => new Promise((resolve) => {
    pending.push({ index: blob.frame, resolve });
  }));
  t.after(() => {
    if (originalBitmap) globalThis.createImageBitmap = originalBitmap;
    else delete globalThis.createImageBitmap;
  });
  const frames = createHeroFrames(String, 193, mobile, () => notifications++);
  t.after(() => frames.dispose());
  const complete = async (index = pending[0]?.index) => {
    const position = pending.findIndex((job) => job.index === index);
    assert.notEqual(position, -1, `frame ${index} has a queued decode`);
    const [job] = pending.splice(position, 1);
    const bitmap = { index, closed: false, close() { this.closed = true; } };
    bitmaps.push(bitmap);
    job.resolve(bitmap);
    await flush();
  };
  const drain = async () => {
    while (pending.length) { assert.ok(pending.length <= 3); await complete(); }
  };
  return { frames, fetched, pending, bitmaps, complete, drain, notifications: () => notifications };
}

test('preloads compressed frames while prioritizing the handoff and predicted scroll frames', async (t) => {
  const h = harness(t);
  h.frames.request(0, 100, 1, 8);
  h.frames.warm();
  await flush();
  assert.equal(h.fetched.length, 193);
  assert.deepEqual(h.pending.map((job) => job.index), [0, 8, 16]);
  await h.complete(0);
  assert.ok(h.frames.get(0));
  assert.equal(h.frames.nearest(3, 0, 1).index, 0);
  assert.ok(h.pending.some((job) => job.index === 100));
  await h.complete(100);
  assert.equal(h.frames.nearest(3, 0, 1).index, 0, 'do not show the target too early');
});

test('retains useful late decodes and prevents a backwards flash during forward scrolling', async (t) => {
  const h = harness(t);
  h.frames.request(50, 100, 1);
  await flush();
  h.frames.request(55, 100, 1);
  await h.complete(50);
  assert.equal(h.frames.nearest(55, 49, 1).index, 50, 'hold a usable frame instead of going empty');
  assert.equal(h.frames.nearest(55, 51, 1), null, 'do not regress behind the painted frame');
  await h.complete(51);
  assert.equal(h.frames.nearest(55, 50, 1).index, 51);
});

for (const mobile of [false, true]) {
  test(`${mobile ? 'phone' : 'desktop'} cache stays bounded and reverses without refetching`, async (t) => {
    const h = harness(t, mobile);
    h.frames.request(0, 0, 1);
    h.frames.warm();
    await flush();
    await h.drain();
    h.frames.request(192, 192, -1);
    await h.drain();
    assert.equal(h.frames.nearest(192, 192, -1).index, 192);
    h.frames.request(0, 0, -1);
    await h.drain();
    assert.equal(h.frames.nearest(0, 2, -1).index, 0, 'reverse reaches the exact 00:02 boundary');
    assert.equal(h.fetched.length, 193);
    assert.ok(h.bitmaps.filter((bitmap) => !bitmap.closed).length <= (mobile ? 20 : 24));
    h.frames.dispose();
    assert.ok(h.bitmaps.every((bitmap) => bitmap.closed));
  });
}

test('nearby reverse frames stay decoded for small direction changes', async (t) => {
  const h = harness(t);
  h.frames.request(50, 50, 1);
  await flush();
  await h.drain();
  h.frames.request(49, 40, -1);
  assert.equal(h.frames.nearest(49, 50, -1).index, 49);
  assert.ok(h.frames.get(48));
  assert.ok(h.frames.get(47));
});

test('pauses background work and closes in-flight bitmaps after disposal', async (t) => {
  const h = harness(t);
  h.frames.request(0, 80, 1);
  await flush();
  h.frames.setActive(false);
  await h.drain();
  h.frames.request(100, 100, 1);
  assert.equal(h.pending.length, 0);
  h.frames.setActive(true);
  await flush();
  assert.ok(h.pending.length > 0);
  const notifications = h.notifications();
  h.frames.dispose();
  await h.drain();
  assert.equal(h.notifications(), notifications);
  assert.ok(h.bitmaps.every((bitmap) => bitmap.closed));
});

test('failed requests do not block the rest of the sequence', async (t) => {
  const h = harness(t);
  t.mock.method(globalThis, 'fetch', async (url) => {
    const blob = new Blob(['frame']);
    blob.frame = Number(url);
    return { ok: blob.frame !== 0, status: 404, blob: async () => blob };
  });
  h.frames.request(0, 0, 1);
  await flush();
  assert.ok(h.frames.hasFailed(0));
  await h.complete(1);
  assert.equal(h.frames.nearest(1).index, 1);
});
