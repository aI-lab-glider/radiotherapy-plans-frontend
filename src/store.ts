import { createStore } from "redux";
import uploadReducer, { initialState } from "./reducers/uploadReducer";

function configureStore(state = initialState) {
  return createStore(uploadReducer, state);
}

const store = configureStore();

export type AppDispatch = typeof store.dispatch;

export default store;
