import { GET_BLOCKS, DELETE_BLOCK, ADD_BLOCK } from "../actions/types";

const initialState = {
  blocks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BLOCKS:
      return {
        ...state,
        blocks: action.payload,
      };
    case DELETE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.payload),
      };
    case ADD_BLOCK:
      return {
        ...state,
        blocks: [...blocks, action.payload],
      };
    default:
      return state;
  }
}
