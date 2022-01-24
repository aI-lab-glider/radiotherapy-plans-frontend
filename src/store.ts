import { createStore } from "redux";
import uploadReducer, {
  initialState,
  UploadState,
} from "./reducers/uploadReducer";
import { composeWithDevTools } from "redux-devtools-extension";

function configureStore(state = initialState) {
  return createStore(uploadReducer, state, composeWithDevTools());
}

const store = configureStore();
export type AppState = UploadState;

export type AppDispatch = typeof store.dispatch;

export default store;
