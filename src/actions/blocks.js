import axios from "axios";
import { GET_BLOCKS, DELETE_BLOCK, ADD_BLOCK } from "./types";
import { returnErrorMessages } from "./messages";

export const getBlocks = () => (dispatch, getState) => {
  axios
    .get("/blocks/")
    .then((res) => {
      dispatch({
        type: GET_BLOCKS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};

export const deleteBlock = (id) => (dispatch, getState) => {
  axios
    .delete(`/blocks/${id}/`)
    .then((res) => {
      dispatch(createMessage({ blockDeleted: "Block Deleted" }));
      dispatch({
        type: DELETE_BLOCK,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};

export const addBlock = (block) => (dispatch, getState) => {
  axios
    .post("/blocks/add/", block)
    .then((res) => {
      dispatch({
        type: ADD_BLOCK,
        payload: res.data,
      });
      dispatch(createMessage({ blockAdded: "Block Added" }));
    })
    .catch((err) => {
      dispatch(returnErrorMessages(err.response.data, err.response.status));
    });
};
