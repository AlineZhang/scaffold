const Koa = require('koa');
const app = new Koa();

app.use(async function (ctx, next) {
  console.log('>> one');
  await next();
  console.log('<< one');
});

app.use(async function (ctx, next) {
  console.log('>> two');
  ctx.body = 'two';
  // await next();  // >> one >> two >> three >> three >> two >> one   >> one >> two >> two >> one
  console.log('<< two');
});

app.use(async function (ctx, next) {
  console.log('>> three');
  await next();
  console.log('<< three');
});

app.listen(3000);
console.log('app is running at port 3000');