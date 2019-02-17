import {
  useState, useEffect, useMemo, useCallback,
} from 'react';

const useValue = (app, path, eventType = 'value', initialValue = null) => {
  const ref = useMemo(() => app.database().ref(path), [app, path]);

  const [value, setValue] = useState(initialValue);

  const set = useCallback(
    (newValueOrFunction) => {
      const newValue = typeof newValueOrFunction === 'function'
        ? newValueOrFunction(value)
        : newValueOrFunction;

      return ref.set(newValue);
    },
    [ref]
  );

  useEffect(
    () => {
      const handler = (snapshot) => {
        const val = snapshot.val();
        setValue(val);
      };

      ref.on(eventType, handler);
      return () => {
        ref.off(eventType, handler);
      };
    },
    [ref, eventType]
  );

  return [value, set];
};

export default useValue;
