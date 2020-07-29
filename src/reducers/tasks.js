import { GET_TASKS, DELETE_TASK, ADD_TASK } from "../actions/types";

const initialState = {
  tasks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case ADD_TASK:
      return {
        ...state,
        tasks: [...tasks, action.payload],
      };
    default:
      return state;
  }
}
