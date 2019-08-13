import refreshToken, {
  canRefreshToken,
  isRefreshing,
  addToQueue
} from "./refresh";
import { getParams, dispatchSuccess, dispatchErrors } from "../utils";

export async function handleResponse(response, options, replay = false) {
  const { ACTIONS, dispatch, id, config, getState } = options;

  if (!response.status) {
    dispatchErrors(dispatch, null, ACTIONS.FAILURE, { id });
  } else if (response.status >= 200 && response.status < 300) {
    const data = await response.json();

    dispatchSuccess(
      dispatch,
      response.status,
      data.value,
      data.permissions || {},
      ACTIONS.SUCCESS,
      { id }
    );
  } else if (
    response.status === 401 &&
    canRefreshToken(config, getState()) &&
    !replay
  ) {
    refreshToken(options, "remove", response);
  } else if (response.status >= 400 && response.status < 500) {
    const data = await response.json();

    dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
      id,
      error: data.error
    });
  } else {
    dispatchErrors(dispatch, response, ACTIONS.FAILURE, { id });
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
    meta,
    params,
    raw,
    config
  } = options;

  if (!replay) {
    dispatch({
      type: ACTIONS.PENDING,
      payload: { id, meta, code: -1 }
    });
  }

  if (isRefreshing()) {
    addToQueue(options, "remove");
  } else {
    try {
      const response = await fetch(
        url(id, meta),
        getParams(
          getState(),
          globalParams,
          {
            method: "DELETE",
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
