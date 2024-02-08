export const isDev = process.env.NODE_ENV === 'development';

export const api = isDev
  ? 'http://localhost:3000'
  : 'https://api.soundmeter.live';
