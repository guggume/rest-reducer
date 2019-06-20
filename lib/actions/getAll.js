import refreshToken, {
  canRefreshToken,
  isRefreshing,
  addToQueue
} from "./refresh";
import { getParams, dispatchSuccess, dispatchErrors } from "../utils";

export async function handleResponse(response, options, replay = false) {
  const { ACTIONS, dispatch, id, query, config } = options;

  if (!response.status) {
    dispatchErrors(dispatch, null, ACTIONS.FAILURE, { query });
  } else if (response.status >= 200 && response.status < 300) {
    const data = await response.json();

    dispatchSuccess(
      dispatch,
      response.status,
      data.value,
      data.permissions || {},
      ACTIONS.SUCCESS,
      { query }
    );
  } else if (response.status === 401 && canRefreshToken(config) && !replay) {
    refreshToken(options, "getAll", response);
  } else if (response.status >= 400 && response.status < 500) {
    const data = await response.json();

    dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
      query,
      error: data.error
    });
  } else {
    dispatchErrors(dispatch, response, ACTIONS.FAILURE, { query });
  }
}

export default async function(options, replay = false) {
  const {
    ACTIONS,
    dispatch,
    getState,
    globalParams,
    url,
    query,
    meta,
    params,
    config
  } = options;

  if (!replay) {
    dispatch({
      type: ACTIONS.PENDING,
      payload: { query, meta, code: -1 }
    });
  }

  if (isRefreshing()) {
    addToQueue(options, "getAll");
  } else {
    try {
      const response = await fetch(
        url(query, meta),
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
      handleResponse({}, options);
    }
  }
}
