import 'firebase/database';

export { default as useValue } from './useValue';
export { default as useConnected } from './useConnected';

// import useValue from './useValue';

// const useConnected = (app) => {
//   const [connected] = useValue(app, '.info/connected');
//   return connected;
// };

// export { useValue, useConnected };
