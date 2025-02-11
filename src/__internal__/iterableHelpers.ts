export function* map<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<B> {
  for (const a of iterable) {
    yield f(a);
  }
}

export function* filter<A>(f: (a: A) => boolean, iterable: Iterable<A>) {
  for (const a of iterable) {
    if (f(a)) {
      yield a;
    }
  }
}

export function join<A>(separator: string, iterable: Iterable<A>): string {
  const iterator = iterable[Symbol.iterator]();
  const first = iterator.next();

  if (first.done) {
    return '';
  }

  let res = `${first.value}`;

  while (true) {
    const { value, done } = iterator.next();

    if (done) {
      break;
    }
    res = `${res}${separator}${value}`;
  }

  return res;
}

export const isIterable = (value: unknown): value is Iterable<unknown> => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return typeof (value as any)[Symbol.iterator] === 'function';
};
