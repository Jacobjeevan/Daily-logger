import axios from "axios";
import { GET_TASKS, DELETE_TASK, ADD_TASK } from "./types";
import { returnErrorMessages } from "./messages";

export const getTasks = () => (dispatch, getState) => {
  axios
    .get("/tasks/")
    .then((res) => {
      dispatch({
        type: GET_TASKS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};

export const deleteTask = (id) => (dispatch, getState) => {
  axios
    .delete(`/tasks/${id}/`)
    .then((res) => {
      dispatch(createMessage({ taskDeleted: "Task Deleted" }));
      dispatch({
        type: DELETE_TASK,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};

export const addTask = (task) => (dispatch, getState) => {
  axios
    .post("/tasks/add/", task)
    .then((res) => {
      dispatch({
        type: ADD_TASK,
        payload: res.data,
      });
      dispatch(createMessage({ taskAdded: "Task Added" }));
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};
