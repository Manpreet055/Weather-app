const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

let debounceCity = debounce(async (e) => {
  await getCityName(e);
}, 500);

export default debounceCity;
