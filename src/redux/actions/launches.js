import {
    SELECT_LAUNCHES_BEGIN,
    SELECT_LAUNCHES_SUCCESS,
    SELECT_LAUNCHES_FAILURE,
    SEARCH_LAUNCHES
  } from '../types';

export const selectLaunchesBegin = () => {
    return {
        type: SELECT_LAUNCHES_BEGIN
    };
};

export const selectLaunchesSuccess = payload => {
    return {
        type: SELECT_LAUNCHES_SUCCESS,
        payload: payload
    };
};

export const selectLaunchesFailure = error => {
    return {
        type: SELECT_LAUNCHES_FAILURE,
        payload: error
    };
};

export const selectLaunches = rocketId => async dispatch => {
    dispatch(selectLaunchesBegin);
    const filter = "filter=rocket(rocket_name,rocket_type),launch_date_utc,launch_site/site_name_long,details";
    const url = "https://api.spacexdata.com/v3/launches";
    const rocket = "rocket_id=" + rocketId;
    await fetch(url + "?" + filter + "&" + rocket)
        .then(response => response.json())
        .then(result => dispatch(selectLaunchesSuccess(result)))
        .catch(error => dispatch(selectLaunchesFailure(error)))
};

export const searchLaunches = search => {
    return {
        type: SEARCH_LAUNCHES,
        search: search
    }
}