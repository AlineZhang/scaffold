const Koa = require('koa');
const app = new Koa();



const  log = console.log;
// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log(`X-Response-Time ${ms}`);
});

// logger
/* app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log(`${ctx.method} ${ctx.url} - ${ms}`);
}) */

// logger middleware
const logger = (format) => {
  format = format || ':method ":url"';

  return async (ctx, next) => {
    const str = format
                .replace(':method', ctx.method)
                .replace(':url', ctx.url);
    log(str);
    await next();
  }
}
app.use(logger());


// response
app.context.db={
  name: 'aline',
  time: (new Date()).toLocaleString()
};
app.use(async (ctx) => {
  ctx.body = `hello ${ctx.db.name} koa2 ${ctx.db.time}`;
})

app.listen(3000);

console.log('demo is starting at port 3000');
