import {atom} from 'recoil';

export const playerDataState = atom({
    key: 'playerDataState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

export const itemDataState = atom({
    key: 'itemDataState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

export const placeDataState = atom({
    key: 'placeDataState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

export const allGamesDataState = atom({
  key: 'allGamesDataState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const activePlayersDataState = atom({
  key: 'activePlayersDataState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});