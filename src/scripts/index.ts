import { Lab } from "./lab/Lab";

const zeroPadding = (value: number): string => {
  return ('00' + `${value}`).slice(-2);
}

const main = () => {
  const now = new Date();
  const hours = zeroPadding(now.getHours());
  const minutes = zeroPadding(now.getMinutes());
  const seconds = zeroPadding(now.getSeconds());
  console.log(`started at ${hours}:${minutes}:${seconds}`);
  
  const lab = Lab.create('#lab');
};

main();
