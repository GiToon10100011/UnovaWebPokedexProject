import { combineReducers } from "redux";
import pokeReducer from "./pokeReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  pokeReducer,
  userReducer,
});

export default rootReducer;
