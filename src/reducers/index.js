import { combineReducers } from "redux";
import tasks from "./tasks";
import blocks from "./blocks";

export default combineReducers({
  tasks,
  blocks,
});
