import { useReducer, useCallback } from "react";

export type WindowState = {
  open: boolean;
  min: boolean;
  max: boolean;
  z: number;
};

type State = {
  wins: Record<string, WindowState>;
  top: number;
};

type Action =
  | { t: "open"; id: string }
  | { t: "close"; id: string }
  | { t: "min"; id: string }
  | { t: "max"; id: string }
  | { t: "focus"; id: string };

function reducer(state: State, action: Action): State {
  const current = state.wins[action.id] ?? { open: false, min: false, max: false, z: 0 };

  switch (action.t) {
    case "close":
      return {
        ...state,
        wins: {
          ...state.wins,
          [action.id]: { open: false, min: false, max: false, z: 0 },
        },
      };

    case "min":
      return {
        ...state,
        wins: {
          ...state.wins,
          [action.id]: { ...current, min: true },
        },
      };

    case "max":
      return {
        ...state,
        wins: {
          ...state.wins,
          [action.id]: { ...current, max: !current.max },
        },
      };

    case "open":
    case "focus": {
      const nextTop = state.top + 1;
      return {
        top: nextTop,
        wins: {
          ...state.wins,
          [action.id]: {
            open: true,
            min: false,
            max: current.max,
            z: nextTop,
          },
        },
      };
    }

    default:
      return state;
  }
}

export function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, { wins: {}, top: 10 });

  const open = useCallback((id: string) => dispatch({ t: "open", id }), []);
  const close = useCallback((id: string) => dispatch({ t: "close", id }), []);
  const minimize = useCallback((id: string) => dispatch({ t: "min", id }), []);
  const maximize = useCallback((id: string) => dispatch({ t: "max", id }), []);
  const focus = useCallback((id: string) => dispatch({ t: "focus", id }), []);

  const toggle = useCallback(
    (id: string) => {
      const w = state.wins[id];
      if (w?.open && !w.min && w.z === state.top) {
        minimize(id);
      } else {
        open(id);
      }
    },
    [state.wins, state.top, minimize, open]
  );

  return {
    wins: state.wins,
    top: state.top,
    open,
    close,
    minimize,
    maximize,
    focus,
    toggle,
  };
}
