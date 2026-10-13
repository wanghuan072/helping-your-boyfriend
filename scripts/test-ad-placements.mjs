import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chooseAdPositions } from '../lib/ads/placement.mjs';

// 位置测试使用模拟正文，不请求真实广告，不产生广告展示或点击。
const boundaries = Array.from({ length: 20 }, (_, row) => ({ row, y: (row + 1) * 400 }));
for (const home of [true, false]) {
  for (const end of [1000, 2200, 5000, 8500]) {
    const positions = chooseAdPositions({ start: 0, end, boundaries, home });
    assert.equal(positions[0], 0);
    assert.equal(positions.at(-1), end);
    assert(positions.length <= (home ? 6 : 4));
    for (let index = 1; index < positions.length; index++) assert(positions[index] - positions[index - 1] >= 640);
    if (home && end >= 5000) assert(positions.length >= 4);
    if (!home && end < 1280) assert.equal(positions.length, 2);
  }
}
assert.deepEqual(chooseAdPositions({ start: 0, end: 600, boundaries: [] }), [0], '不靠空白凑两个广告');
for (const [device, key, width, height] of [['desktop','8778af2e0d8e53f9a8293534609330d7',728,90],['mobile','cb6d35c1191898a8472964d23377c299',300,250]]) {
  const html = fs.readFileSync(`public/ad-frame/${device}.html`, 'utf8');
  assert(html.includes(`https://www.highrevenueformat.com/${key}/invoke.js`));
  assert(html.includes(`'width': ${width}`) && html.includes(`'height': ${height}`));
  assert.equal((html.match(/invoke\.js/g) ?? []).length, 1);
}
console.log('广告位置测试通过：首尾、640px 正文间隔、数量上限、两行节奏、设备尺寸、独立配置。');
