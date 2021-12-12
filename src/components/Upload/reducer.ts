export interface State {
  ctFiles: File[];
  rtStructFile: File[];
  rtDoseFile: File[];
}

export const initialState: State = {
  ctFiles: [],
  rtStructFile: [],
  rtDoseFile: [],
};

export enum ActionType {
  CT = "CT",
  DOSE = "RTDOSE",
  STRUCT = "RTSTRUCT",
  RESET = "RESET",
}

export interface Action {
  type: ActionType | string;
  payload?: File;
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CT:
      return { ...state, ctFiles: [...state.ctFiles, action.payload!] };
    case ActionType.DOSE:
      return { ...state, rtDoseFile: [action.payload!] };
    case ActionType.STRUCT:
      return { ...state, rtStructFile: [action.payload!] };
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
}
