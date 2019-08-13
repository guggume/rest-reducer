import refreshToken, {
  canRefreshToken,
  isRefreshing,
  addToQueue
} from "./refresh";
import { getParams, dispatchSuccess, dispatchErrors } from "../utils";

export async function handleResponse(response, options, replay = false) {
  const { ACTIONS, dispatch, id, ids, config, getState } = options;

  if (!response.status) {
    dispatchErrors(dispatch, null, ACTIONS.FAILURE, { id, ids });
  } else if (response.status >= 200 && response.status < 300) {
    const data = await response.json();

    dispatchSuccess(
      dispatch,
      response.status,
      data.value,
      data.permissions || {},
      ACTIONS.SUCCESS,
      { id, ids }
    );
  } else if (
    response.status === 401 &&
    canRefreshToken(config, getState()) &&
    !replay
  ) {
    refreshToken(options, "removeAll", response);
  } else if (response.status >= 400 && response.status < 500) {
    const data = await response.json();

    dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
      id,
      ids,
      error: data.error
    });
  } else {
    dispatchErrors(dispatch, response, ACTIONS.FAILURE, { id, ids });
  }
}

const CONTENT_TYPE = "application/JSON";

export default async function(options, replay = false) {
  const {
    ACTIONS,
    dispatch,
    getState,
    globalParams,
    url,
    id,
    ids,
    value,
    meta,
    params,
    raw,
    config
  } = options;

  if (!replay) {
    dispatch({
      type: ACTIONS.PENDING,
      payload: { id, ids, value, meta, code: -1 }
    });
  }

  if (isRefreshing()) {
    addToQueue(options, "removeAll");
  } else {
    try {
      const response = await fetch(
        url(ids, value, meta),
        getParams(
          getState(),
          globalParams,
          {
            method: "DELETE",
            body: raw ? value : JSON.stringify(value),
            ...params
          },
          config
        )
      );
      handleResponse(response, options);
    } catch (e) {
      handleResponse({}, options);
    }
  }
}
