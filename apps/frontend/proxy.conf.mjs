const target = process.env.API_PROXY_TARGET || 'http://localhost:5000';

export default {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
