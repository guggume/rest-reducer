import getAction, { handleResponse as handleGetResponse } from './get';

const handleResponse = {
  get: handleGetResponse,
};
const replayAction = {
  get: getAction,
};
let refreshing = false;
let queue = [];

function handleResponses(response) {
  queue.forEach(({ options, action }) => {
    handleResponse[action](response, options, true);
  });
  queue = [];
}

function replayActions() {
  queue.forEach(({ options, action }) => {
    replayAction[action](options, true);
  });
  queue = [];
}

async function fetchAccessToken(options) {
  const { config, dispatch, getState } = options;
  const {
    refreshTokenKey,
    refreshTokenExtractor,
    refreshTokenACTION,
    refreshTokenURL,
  } = config;
  const refreshToken = refreshTokenExtractor(getState());

  try {
    const resp = await fetch(refreshTokenURL, {
      [refreshTokenKey]: refreshToken,
      method: 'POST',
    });

    if (resp && resp.status && resp.status >= 200 && resp.status < 300) {
      const data = await resp.json();

      dispatch({
        type: refreshTokenACTION,
        payload: data.value,
      });

      replayActions();
    } else {
      handleResponses(resp);
    }
  } catch (e) {
    handleResponses({});
  }
}

export function canRefreshToken({
  refreshTokenKey,
  refreshTokenExtractor,
  refreshTokenACTION,
  refreshTokenURL,
}) {
  return (
    refreshTokenKey && refreshTokenExtractor && refreshTokenACTION && refreshTokenURL
  );
}

export function isRefreshing() {
  return refreshing;
}

export function addToQueue(options, action) {
  queue.push({ options, action });
}

export default function(options, action) {
  queue.push({ options, action });

  if (!refreshing) {
    refreshing = true;
    fetchAccessToken(options);
  }
}
