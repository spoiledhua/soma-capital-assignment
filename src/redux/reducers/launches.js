import {
    SELECT_LAUNCHES_BEGIN,
    SELECT_LAUNCHES_SUCCESS,
    SELECT_LAUNCHES_FAILURE
  } from '../types';

const launches = (state = {
    launches: [],
  }, action) => {
    switch (action.type) {
      case SELECT_LAUNCHES_BEGIN: {
        return {
          ...state,
          loading: true,
        }
      }
      case SELECT_LAUNCHES_SUCCESS: {
        return {
          ...state,
          loading: false,
          launches: action.payload,
          error: '',
        }
      }
      case SELECT_LAUNCHES_FAILURE: {
        return {
          ...state,
          loading: false,
          launches: [],
          error: action.payload,
        }
      }
    default:
        return state;
    }
}

export default launches;