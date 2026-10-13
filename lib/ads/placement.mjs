/** 根据完整内容块选位置；坐标不包含广告自身高度。 */
export function chooseAdPositions({ start, end, boundaries, home = false }) {
  // 额外预留 64px，抵消广告相邻板块原有外边距被清理后的几何差异。
  const minimum = 704;
  // 正文过短时不靠额外空白凑间距。
  if (end - start < minimum) return [start];
  const eligible = boundaries.filter(item => item.y - start >= minimum && end - item.y >= minimum);
  const middle = [];
  if (home) {
    let previousY = start, previousRow = -1;
    for (const item of eligible) {
      if (item.y - previousY < minimum || item.row - previousRow < 2) continue;
      middle.push(item.y);
      previousY = item.y;
      previousRow = item.row;
      if (middle.length === 4) break;
    }
  } else {
    const targets = end - start >= 2400 ? [1 / 3, 2 / 3] : end - start >= 1280 ? [1 / 2] : [];
    for (const fraction of targets) {
      const previousY = middle.at(-1) ?? start;
      const target = start + (end - start) * fraction;
      const nearest = eligible.filter(item => item.y - previousY >= minimum)
        .sort((a, b) => Math.abs(a.y - target) - Math.abs(b.y - target))[0];
      if (nearest) middle.push(nearest.y);
    }
  }
  return [start, ...middle, end];
}
