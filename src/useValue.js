import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

const useValue = (database, path, eventType = 'value', initialValue = null) => {
  const [value, setValue] = useState(initialValue);

  const savedRef = useRef();

  const set = useCallback(newValue => savedRef.current.set(newValue), [
    savedRef.current,
  ]);

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
