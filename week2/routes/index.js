const HttpControllers = require('../controllers/http');
const PostsControllers = require('../controllers/posts');

const routes = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/posts' && req.method === 'GET') {
    PostsControllers.getPosts({ req, res });
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => PostsControllers.createPosts({ req, res, body }));
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => PostsControllers.patchPosts({ req, res, body }));
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    PostsControllers.deleteAllPosts({ req, res });
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    PostsControllers.deleteOnePosts({ req, res });
  } else if (req.method === 'OPTIONS') {
    HttpControllers.cors(req, res);
  } else {
    HttpControllers.notFound(req, res);
  }
};

module.exports = routes;
