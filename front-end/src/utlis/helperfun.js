export function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

export function dateTimeToTimestamp(dateTimeStr) {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date-time string');
    }
    return date.getTime();
}

export function isDiff(timestamp1, timestamp2) {
    const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2);
    const differenceInSeconds = differenceInMilliseconds / 1000;
    return differenceInSeconds < 5;
}