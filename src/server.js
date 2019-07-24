
const Koa = require('koa');
// const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const router = require('koa-router')();

import React from 'react';
import Layout from './components/Layout';
import { StaticRouter, matchPath } from "react-router-dom";
import { renderToString } from 'react-dom/server';

const app = new Koa();
// const router = new KoaRouter();


app.use(async ( ctx, next ) => {
    const context = {};
    const jsx = ( 
        <StaticRouter context={ context } location={ ctx.url }>
            <Layout />
        </StaticRouter>
    );
    const reactDom = renderToString( jsx );
    const rst = htmlTemplate( reactDom );
    // console.log(rst);
    ctx.body=rst;
    await next();
} );

/* app.use('/*', async (ctx, next) => {
   const res = ctx.response;
    res.writeHead(200, { "Content-Type": "text/html" } );
    const context = { };
    const jsx = (
        <StaticRouter context={ context } location={ req.url }>
            <Layout />
        </StaticRouter>
    );
    const reactDom = renderToString( jsx );

    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end( htmlTemplate( reactDom ) );
}); */


// app.use(router.routes());
//    .use(router.allowedMethods());

const port = 8086;
app.listen(port);
console.log(`this server is running at port ${port}`);

function htmlTemplate( reactDom ) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
        </body>
        </html>
    `;
}