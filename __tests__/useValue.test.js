import { testHook, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import useValue from '../src/useValue';

afterEach(cleanup);

const createMockDatabase = events => ({
  database: () => ({
    ref: () => ({
      on: (eventType, handler) => events.push(['on', eventType, handler]),
      off: (eventType, handler) => events.push(['off', eventType, handler]),
      set: value => events.push(['set', value]) && 'I promise',
    }),
  }),
});

describe('useValue', () => {
  test('`eventType` defaults to `value`', () => {
    const events = [];
    const mockApp = createMockDatabase(events);

    testHook(() => {
      useValue(mockApp, '/a/b/c');
    });

    expect(events.length).toBe(1);
    expect(events[0][0]).toBe('on');
    expect(events[0][1]).toBe('value');
  });

  test('before an `on` event is fired, the return value is `null`', () => {
    const events = [];
    const mockApp = createMockDatabase(events);

    let value;
    testHook(() => {
      [value] = useValue(mockApp, '/a/b/c');
    });

    expect(value).toBeNull();
    expect(events.length).toBe(1);
    expect(events[0][0]).toBe('on');
    expect(events[0][1]).toBe('value');
  });

  test('after an `on` event is fired, the return value is determined from the `snapshot`', () => {
    const events = [];
    const mockApp = createMockDatabase(events);

    const snapshot = {
      val: () => 'foo',
    };

    let value;
    testHook(() => {
      [value] = useValue(mockApp, '/a/b/c');
    });

    events[0][2](snapshot);
    expect(value).toBe('foo');
  });

  test('on unmount, `off` is called', () => {
    const events = [];
    const mockApp = createMockDatabase(events);

    const { unmount } = testHook(() => {
      useValue(mockApp, '/a/b/c');
    });

    unmount();

    expect(events.length).toBe(2);
    expect(events[1][0]).toBe('off');
    expect(events[1][1]).toBe('value');
  });

  test('if `database` changes, listeners will `off` and back `on`', () => {
    const events1 = [];
    const mockApp1 = createMockDatabase(events1);
    const events2 = [];
    const mockApp2 = createMockDatabase(events2);

    let database = mockApp1;
    const { rerender } = testHook(() => {
      useValue(database, '/a/b/c');
    });

    database = mockApp2;
    rerender();

    expect(events2.length).toBe(1);
    expect(events2[0][0]).toBe('on');
    expect(events2[0][1]).toBe('value');
  });

  test('if `path` changes, listeners will `off` and back `on`', () => {
    const events = [];
    const mockApp1 = createMockDatabase(events);

    let path = '/a/b/c';
    const { rerender } = testHook(() => {
      useValue(mockApp1, path);
    });

    path = '/d/e/f';
    rerender();

    expect(events.length).toBe(3);
    expect(events[2][0]).toBe('on');
    expect(events[2][1]).toBe('value');
  });

  test('if `eventType` changes, listeners will `off` and back `on`', () => {
    const events = [];
    const mockApp1 = createMockDatabase(events);

    let eventType = 'foo';
    const { rerender } = testHook(() => {
      useValue(mockApp1, 'a/b/c', eventType);
    });

    eventType = 'bar';
    rerender();

    expect(events.length).toBe(3);
    expect(events[2][0]).toBe('on');
    expect(events[2][1]).toBe('bar');
  });

  test('if nothing changes, listeners do not cycle', () => {
    const events = [];
    const mockApp1 = createMockDatabase(events);

    const { rerender } = testHook(() => {
      useValue(mockApp1, 'a/b/c');
    });
    rerender();

    expect(events.length).toBe(1);
  });

  test('calling `setValue` will send the data to the cloud and return a Promise', () => {
    const events = [];
    const mockApp1 = createMockDatabase(events);

    let setValue;
    testHook(() => {
      [, setValue] = useValue(mockApp1, 'a/b/c');
    });

    const promise = setValue('foo');

    expect(events.length).toBe(2);
    expect(events[1][0]).toBe('set');
    expect(events[1][1]).toBe('foo');

    expect(promise).toBe('I promise');
  });
});
