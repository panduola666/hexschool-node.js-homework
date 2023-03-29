const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Posts = require('./model/posts');

dotenv.config({ path: './config.env' });
const DB = process.env.MONGODB_URL.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

mongoose.connect(DB).then(() => console.log('資料庫連接成功'));
const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/posts' && req.method === 'GET') {
    const allPosts = await Posts.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        state: 'success',
        data: allPosts,
      })
    );
    res.end();
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content) {
          const newPost = await Posts.create({
            name: data.name,
            content: data.content,
          });
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              state: 'success',
              data: newPost,
            })
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              state: 'error',
              message: 'Content 未填寫',
            })
          );
          res.end();
        }
      } catch (err) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            state: 'error',
            message: err,
          })
        );
        res.end();
      }
    });
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    const id = req.url.split('/').pop();
    req.on('end',async() =>{
      try{
        const data = JSON.parse(body);
        const allPosts = await Posts.findByIdAndUpdate({_id:id},data);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            state: 'success',
            data: allPosts,
          })
        );
        res.end();
      }
      catch(err){
  
      }
    })
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    const allPosts = await Posts.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        state: 'success',
        data: allPosts,
      })
    );
    res.end();
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const allPosts = await Posts.findByIdAndDelete({_id:id});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        state: 'success',
        data: allPosts,
      })
    );
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
