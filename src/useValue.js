import {
  useState, useEffect, useRef, useMemo,
} from 'react';

const useValue = (app, path, eventType = 'value', initialValue = null) => {
  const database = useMemo(() => app.database(), [app]);

  const [value, setValue] = useState(initialValue);

  const savedRef = useRef();

  const set = (newValueOrFunction) => {
    const newValue = typeof newValueOrFunction === 'function'
      ? newValueOrFunction(value)
      : newValueOrFunction;

    return savedRef.current.set(newValue);
  };

  useEffect(
    () => {
      const ref = database.ref(path);
      savedRef.current = ref;

      const handler = (snapshot) => {
        const val = snapshot.val();
        setValue(val);
      };

      ref.on(eventType, handler);
      return () => {
        ref.off(eventType, handler);
      };
    },
    [database, path, eventType]
  );

  return [value, set];
};

export default useValue;
