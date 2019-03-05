import { testHook, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import useValue from '../src/useValue';

afterEach(cleanup);

const createMockApp = events => ({
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
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    testHook(() => {
      useValue('/a/b/c', undefined, undefined, useFirebaseApp);
    });

    expect(events.length).toBe(1);
    expect(events[0][0]).toBe('on');
    expect(events[0][1]).toBe('value');
  });

  test('before an `on` event is fired, the return value is `null`', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    let value;
    testHook(() => {
      [value] = useValue('/a/b/c', undefined, undefined, useFirebaseApp);
    });

    expect(value).toBeNull();
    expect(events.length).toBe(1);
    expect(events[0][0]).toBe('on');
    expect(events[0][1]).toBe('value');
  });

  test('after an `on` event is fired, the return value is determined from the `snapshot`', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    const snapshot = {
      val: () => 'foo',
    };

    let value;
    testHook(() => {
      [value] = useValue('/a/b/c', undefined, undefined, useFirebaseApp);
    });

    events[0][2](snapshot);
    expect(value).toBe('foo');
  });

  test('on unmount, `off` is called', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    const { unmount } = testHook(() => {
      useValue('/a/b/c', undefined, undefined, useFirebaseApp);
    });

    unmount();

    expect(events.length).toBe(2);
    expect(events[1][0]).toBe('off');
    expect(events[1][1]).toBe('value');
  });

  test('if `database` changes, listeners will `off` and back `on`', () => {
    const events1 = [];
    const mockApp1 = createMockApp(events1);
    const useFirebaseApp1 = () => mockApp1;
    const events2 = [];
    const mockApp2 = createMockApp(events2);
    const useFirebaseApp2 = () => mockApp2;

    let useFirebaseApp = useFirebaseApp1;
    const { rerender } = testHook(() => {
      useValue('/a/b/c', undefined, undefined, useFirebaseApp);
    });

    useFirebaseApp = useFirebaseApp2;
    rerender();

    expect(events2.length).toBe(1);
    expect(events2[0][0]).toBe('on');
    expect(events2[0][1]).toBe('value');
  });

  test('if `path` changes, listeners will `off` and back `on`', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    let path = '/a/b/c';
    const { rerender } = testHook(() => {
      useValue(path, undefined, undefined, useFirebaseApp);
    });

    path = '/d/e/f';
    rerender();

    expect(events.length).toBe(3);
    expect(events[2][0]).toBe('on');
    expect(events[2][1]).toBe('value');
  });

  test('if `eventType` changes, listeners will `off` and back `on`', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    let eventType = 'foo';
    const { rerender } = testHook(() => {
      useValue('a/b/c', eventType, undefined, useFirebaseApp);
    });

    eventType = 'bar';
    rerender();

    expect(events.length).toBe(3);
    expect(events[2][0]).toBe('on');
    expect(events[2][1]).toBe('bar');
  });

  test('if nothing changes, listeners do not cycle', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    const { rerender } = testHook(() => {
      useValue('a/b/c', undefined, undefined, useFirebaseApp);
    });
    rerender();

    expect(events.length).toBe(1);
  });

  test('if nothing changes, return value is identical', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    let arr;
    const { rerender } = testHook(() => {
      arr = useValue('a/b/c', undefined, undefined, useFirebaseApp);
    });
    expect([...arr]).toEqual(arr);

    const initialArr = arr;
    rerender();

    expect(initialArr).toEqual(arr);
  });

  test('calling `setValue` will send the data to the cloud and return a Promise', () => {
    const events = [];
    const mockApp = createMockApp(events);
    const useFirebaseApp = () => mockApp;

    let setValue;
    testHook(() => {
      [, setValue] = useValue('a/b/c', undefined, undefined, useFirebaseApp);
    });

    const promise = setValue('foo');

    expect(events.length).toBe(2);
    expect(events[1][0]).toBe('set');
    expect(events[1][1]).toBe('foo');

    expect(promise).toBe('I promise');
  });
});
