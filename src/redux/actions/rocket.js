import {
    SELECT_ROCKET
  } from '../types';

export const selectRocket = (rocketId, rocketName) => {
    return {
        type: SELECT_ROCKET,
        rocket: {rocketId: rocketId, rocketName: rocketName},
    };
};