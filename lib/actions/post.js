import refreshToken, {
  canRefreshToken,
  isRefreshing,
  addToQueue
} from "./refresh";
import { getParams, dispatchSuccess, dispatchErrors } from "../utils";

export async function handleResponse(response, options, replay = false) {
  const { ACTIONS, dispatch, id, config } = options;

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
  } else if (response.status === 401 && canRefreshToken(config) && !replay) {
    refreshToken(options, "post", response);
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
    value,
    meta,
    params,
    raw,
    config
  } = options;

  if (!replay) {
    dispatch({
      type: ACTIONS.PENDING,
      payload: { id, value, meta, code: -1 }
    });
  }

  if (isRefreshing()) {
    addToQueue(options, "post");
  } else {
    try {
      const response = await fetch(
        url(id, value, meta),
        getParams(
          getState(),
          globalParams,
          {
            method: "POST",
            headers: {
              "Content-Type": CONTENT_TYPE
            },
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
