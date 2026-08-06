export function animateValue(
  start,
  end,
  duration,
  callback,
) {
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min(
      (now - startTime) / duration,
      1,
    );

    const value =
      start + (end - start) * progress;

    callback(Math.round(value));

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}