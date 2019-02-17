import firebase from 'firebase'
declare module '@use-firebase/database' {
  /**
   * A custom React Hook that provides a declarative useInterval..
   */
  export default function useValue(
    app: firebase,
    path: string,
    eventType?: string,
    initialValue?: any
  ): void;
}
