export function currentTime() {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();

  const addZero = (number) => {
    return (number < 10 ? '0' : '') + number
  }

  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}