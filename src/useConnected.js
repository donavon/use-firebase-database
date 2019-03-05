import useValue from './useValue';

const useConnected = () => {
  const [connected] = useValue('./info/connected');
  return connected;
};

export default useConnected;

// var connectedRef = firebase.database().ref(".info/connected");
// connectedRef.on("value", function (snap) {
//   if (snap.val() === true) {
//     alert("connected");
//   } else {
//     alert("not connected");
//   }
// });
