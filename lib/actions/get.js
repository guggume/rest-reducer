import refreshToken, {
  canRefreshToken,
  isRefreshing,
  addToQueue
} from "./refresh";
import { getParams, dispatchSuccess, dispatchErrors } from "../utils";

export async function handleResponse(response, options, replay = false) {
  const { ACTIONS, dispatch, id, query, config, getState } = options;

  if (!response.status) {
    dispatchErrors(dispatch, null, ACTIONS.FAILURE, { id, query });
  } else if (response.status >= 200 && response.status < 300) {
    const data = await response.json();

    dispatchSuccess(
      dispatch,
      response.status,
      data.value,
      data.permissions || {},
      ACTIONS.SUCCESS,
      { id, query }
    );
  } else if (
    response.status === 401 &&
    canRefreshToken(config, getState()) &&
    !replay
  ) {
    refreshToken(options, "get", response);
  } else if (response.status >= 400 && response.status < 500) {
    const data = await response.json();

    dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
      id,
      query,
      error: data.error
    });
  } else {
    dispatchErrors(dispatch, response, ACTIONS.FAILURE, { id, query });
  }
}

export default async function(options, replay = false) {
  const {
    ACTIONS,
    dispatch,
    getState,
    globalParams,
    url,
    id,
    query,
    meta,
    params,
    config
  } = options;

  if (!replay) {
    dispatch({
      type: ACTIONS.PENDING,
      payload: { id, query, meta, code: -1 }
    });
  }

  if (isRefreshing()) {
    addToQueue(options, "get");
  } else {
    try {
      const response = await fetch(
        url(id, query, meta),
        getParams(
          getState(),
          globalParams,
          {
            method: "GET",
            ...params
          },
          config
        )
      );

      handleResponse(response, options);
    } catch (e) {
      console.log("rrr-exception", e);
      handleResponse({}, options);
    }
  }
}
