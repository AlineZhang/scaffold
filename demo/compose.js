const Koa = require('koa');
const Compose = require('koa-compose');
const app = new Koa();


const  log = console.log;
// random
const random = async (ctx, next) => {
  if(ctx.path == '/random') {
    ctx.body = Math.floor(Math.random() * 10);
  } else {
    await next();
  }
};

// backwards
const backwards =async (ctx, next) => {
  if(ctx.path == '/backwards') {
    ctx.body = "backwards";
  } else {
    await next();
  }
};

// pi
const pi = async (ctx, next) => {
  if(ctx.path == '/pi') {
    ctx.body = String(Math.PI);
  } else {
    await next();
  }
};

const apis = Compose([random, backwards, pi]);


// response
app.use(apis);

// throw new Error('test error');
app.on('error', (err, ctx) => {
 log(`server error: ${err} ${ctx}`)
});

app.listen(3000);

console.log('demo is starting at port 3000');
