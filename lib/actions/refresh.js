import getAction, { handleResponse as handleGetResponse } from "./get";
import getAllAction, { handleResponse as handleGetAllResponse } from "./getAll";
import postAction, { handleResponse as handlePostResponse } from "./post";
import patchAction, { handleResponse as handlePatchResponse } from "./patch";
import putAction, { handleResponse as handlePutResponse } from "./put";
import removeAction, { handleResponse as handleRemoveResponse } from "./remove";
import removeAllAction, {
  handleResponse as handleRemoveAllResponse
} from "./removeAll";

const handleResponse = {
  get: handleGetResponse,
  getAll: handleGetAllResponse,
  post: handlePostResponse,
  patch: handlePatchResponse,
  put: handlePutResponse,
  remove: handleRemoveResponse,
  removeAll: handleRemoveAllResponse
};
const replayAction = {
  get: getAction,
  getAll: getAllAction,
  post: postAction,
  patch: patchAction,
  put: putAction,
  remove: removeAction,
  removeAll: removeAllAction
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
    refreshTokenURL
  } = config;
  const refreshToken = refreshTokenExtractor(getState());

  try {
    const resp = await fetch(refreshTokenURL, {
      headers: {
        "Content-Type": "application/JSON"
      },
      body: JSON.stringify({
        [refreshTokenKey]: refreshToken
      }),
      method: "POST"
    });

    if (resp && resp.status && resp.status >= 200 && resp.status < 300) {
      const data = await resp.json();

      dispatch({
        type: refreshTokenACTION,
        payload: data
      });

      refreshing = false;
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
  refreshTokenURL
}) {
  return (
    refreshTokenKey &&
    refreshTokenExtractor &&
    refreshTokenACTION &&
    refreshTokenURL
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
