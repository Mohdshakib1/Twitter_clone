export const toIST = (date = new Date()) => {
  const offsetMs = (5 * 60 + 30) * 60 * 1000;
  return new Date(date.getTime() + offsetMs);
};

export const inISTWindow = ({ startHH, startMM = 0, endHH, endMM = 0 }) => {
  const d = toIST();
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const now = h * 60 + m;
  const start = startHH * 60 + startMM;
  const end = endHH * 60 + endMM;
  return now >= start && now <= end;
};
