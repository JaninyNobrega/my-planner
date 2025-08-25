import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default withPWA({});
