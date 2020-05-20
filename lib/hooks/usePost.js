import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../store";

export default function usePost(request) {
  const { id, key, action, args } = request || {};

  const dispatch = useDispatch();
  const lastRequest = useRef(null);
  const storeData = useSelector((store) => store[key]);
  const resource = id ? store.postNew(storeData, id) : null;
  const isNewRequest = !!(
    lastRequest.current !== request &&
    request &&
    request.id
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    if (resource && resource.isCreating === true) {
      return;
    }

    dispatch(action(id, ...args));
  }, [id]);

  if (lastRequest.current !== request) {
    lastRequest.current = request;
  }

  if (!id) {
    return [{}];
  }

  if (!resource) {
    return [{}];
  }

  if (resource.isCreatingFailed) {
    if (isNewRequest) {
      return [{}];
    }

    const error = store.getError(resource);

    return [resource, resource.data, error ? error.message || null : null];
  }

  return [resource, resource.data];
}
