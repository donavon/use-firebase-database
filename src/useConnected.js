import useValue from './useValue';

const useConnected = () => {
  const [connected] = useValue('/.info/connected');
  return connected;
};

export default useConnected;
