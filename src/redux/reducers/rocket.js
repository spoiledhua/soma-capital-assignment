import {
    SELECT_ROCKET
  } from '../types';

const rocket = (state = {
    rocket: { rocketId: "", rocketName: ""},
  }, action) => {
    switch (action.type) {
      case SELECT_ROCKET: {
        return {
          ...state,
          rocket: action.rocket,
        }
      }
    default:
        return state;
    }
}

export default rocket;