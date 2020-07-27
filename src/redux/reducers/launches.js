import {
    SELECT_LAUNCHES_BEGIN,
    SELECT_LAUNCHES_SUCCESS,
    SELECT_LAUNCHES_FAILURE,
    SEARCH_LAUNCHES
  } from '../types';

const launches = (state = {
    launches: [],
    launchesCopy: []
  }, action) => {
    switch (action.type) {
      case SELECT_LAUNCHES_BEGIN: {
        return {
          ...state
        }
      }
      case SELECT_LAUNCHES_SUCCESS: {
        return {
          ...state,
          launches: action.payload,
          launchesCopy: action.payload,
          error: '',
        }
      }
      case SELECT_LAUNCHES_FAILURE: {
        return {
          ...state,
          launches: [],
          launchesCopy: [],
          error: action.payload,
        }
      }
      case SEARCH_LAUNCHES: {
        return {
          ...state,
          launches: state.launchesCopy.filter(launch => {
            if (launch.rocket.rocket_type !== null && launch.details !== null) {
              return (launch.rocket.rocket_type.toLowerCase().includes(action.search.toLowerCase()) || launch.details.toLowerCase().includes(action.search.toLowerCase()));
            }
            else if (launch.rocket.rocket_type !== null) {
              return launch.rocket.rocket_type.toLowerCase().includes(action.search.toLowerCase());
            }
            else if (launch.details !== null) {
              launch.details.toLowerCase().includes(action.search.toLowerCase());
            }
            else {
              return false;
            }
          }),
        }
      }
    default:
        return state;
    }
}

export default launches;