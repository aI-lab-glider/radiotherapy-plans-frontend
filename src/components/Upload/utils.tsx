import { ActionType, Action } from "./reducer";

export const resetStudyUid = (
  studyUid: React.MutableRefObject<String>,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({ type: ActionType.RESET });
  studyUid.current = "";
};
