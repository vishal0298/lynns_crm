import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { getPreloadedState, saveToLocalStorage } from "./stateStorage";
import appSlice from "./appSlice";

const combinedReducer = combineReducers({
  app: appSlice,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: getPreloadedState(),
});

function onStateChange() {
  saveToLocalStorage(store.getState());
}
store.subscribe(onStateChange);
export default store;
