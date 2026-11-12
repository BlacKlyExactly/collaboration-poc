import * as Y from 'yjs';

type PageItem = number | 'ellipsis';

export function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function slidingWindowPagination(
  pages: number,
  page: number,
  siblingsPerSide: number,
) {
  pages = Math.floor(pages);
  siblingsPerSide = Math.max(0, Math.floor(siblingsPerSide));

  if (!(pages >= 1)) return [];
  page = Math.floor(clamp(1, page, pages));

  const size = siblingsPerSide * 2 + 5;

  if (pages <= size) {
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  const result: PageItem[] = [1];

  const hasLeftEllipsis = page - siblingsPerSide >= 4;
  const hasRightEllipsis = page + siblingsPerSide <= pages - 3;

  if (hasLeftEllipsis) {
    result.push('ellipsis');
  }

  const windowLength =
    size - 2 - (hasLeftEllipsis ? 1 : 0) - (hasRightEllipsis ? 1 : 0);

  const start = hasLeftEllipsis
    ? Math.min(page - siblingsPerSide, pages - windowLength)
    : 2;

  for (let i = start; i < start + windowLength; i++) {
    result.push(i);
  }

  if (hasRightEllipsis) {
    result.push('ellipsis');
  }

  result.push(pages);
  return result;
}

export function updateYText(text: Y.Text, nextValue: string) {
  const currentValue = text.toString();

  let start = 0;

  while (
    start < currentValue.length &&
    start < nextValue.length &&
    currentValue[start] === nextValue[start]
  ) {
    start++;
  }

  let oldEnd = currentValue.length;
  let newEnd = nextValue.length;

  while (
    oldEnd > start &&
    newEnd > start &&
    currentValue[oldEnd - 1] === nextValue[newEnd - 1]
  ) {
    oldEnd--;
    newEnd--;
  }

  text.doc!.transact(() => {
    if (oldEnd > start) {
      text.delete(start, oldEnd - start);
    }

    if (newEnd > start) {
      text.insert(start, nextValue.slice(start, newEnd));
    }
  });
}
