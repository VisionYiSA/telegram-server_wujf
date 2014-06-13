### Telegram server

* Client side repo: [https://github.com/yhagio/telegram-cli](https://github.com/yhagio/telegram-cli)

#### Todos:
* nginx settings [http://yhagio.github.io/blog/2014/06/12/nginx-setup/](http://yhagio.github.io/blog/2014/06/12/nginx-setup/)
* Implement all the routes required by the ember.js app with the same dummy data from the previously used fixtures adapter (client side). 
- [Routing ](http://expressjs.com/4x/api.html#app.VERB), 
- [req.params ](http://expressjs.com/4x/api.html#req.params), 
- [res.send()](http://expressjs.com/4x/api.html#res.send)

* Deleted `res.redirect()` since in client-side takes care of the transition `.transitionToRoute()`

* Register / Login issue [https://gist.github.com/yhagio/899e743441c66e15c2f6](https://gist.github.com/yhagio/899e743441c66e15c2f6)