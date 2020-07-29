import { CREATE_MESSAGE, GET_ERRORS } from "./types";

export const createMessage = (message) => {
  return {
    type: CREATE_MESSAGE,
    payload: message,
  };
};

export const returnErrorMessages = (message, status) => {
  return {
    type: GET_ERRORS,
    payload: { message, status },
  };
};
