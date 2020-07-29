import { GET_ERRORS } from "../actions/types";

const initialStatus = {
  message: {},
  status: null,
};

export default function (state = initialStatus, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        message: action.payload.message,
        status: action.payload.status,
      };
    default:
      return state;
  }
}
