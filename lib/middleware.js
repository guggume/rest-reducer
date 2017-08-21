export default function (fn, middlewares) {
  middlewares.forEach(mw => {
    fn = mw(fn);
  });

  return fn;
}
