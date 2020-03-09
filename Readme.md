# koa-auth-parser

A tiny Koa middleware for parsing Auth headers of various types and saving it to the Koa's context.

## Installation

```bash
yarn add psylence303/koa-auth-parser
```

## Example

  Using the middleware:

```js
import Koa from 'koa';
import authParser from 'koa-auth-parser';

const app = new Koa();

app.use(async (ctx, next) => {
    await next();

    console.log(ctx.state.auth);
});

app.use(authParser());

app.use(ctx => {
    ctx.body = 'Hello Koa';
    ctx.status = 200;
});

app.listen(3000);
```

  Example request:

    curl --location --request POST 'localhost:3000' --header 'Authorization: Basic c29tZV9hZG1pbjpwYXNzd29yZA=='

  Output of the ctx.state.auth:

    {
      digest: 'c29tZV9hZG1pbjpwYXNzd29yZA==',
      scheme: 'Basic',
      username: 'some_admin',
      password: 'password'
    }

## Currently supported auth methods

 * [Basic](https://tools.ietf.org/html/rfc7617)
 * [Bearer](https://tools.ietf.org/html/rfc6750)
 * [Digest](https://tools.ietf.org/html/rfc7616)

## TODO:

 * add more auth methods to parse
 * cover with tests

## License

MIT
