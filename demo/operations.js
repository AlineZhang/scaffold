const Koa = require('koa');
const fs = require('mz/fs');

const app = new Koa();

app.use(async (ctx, next) => {
  const paths = await fs.readdir('docs');
  const files = await Promise.all(
    paths.map( 
      path => fs.readFile(`docs/${path}`, 'utf-8') 
    )
  );
  ctx.type = 'markdown';
  ctx.body = files.join('\n');
});

app.listen(3000);
console.log('demo is running at port 3000');