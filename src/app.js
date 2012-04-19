/*
  Get Off My Lawn
  App Server
  Written for NodeJS
  (c) 2012
  original author: Jared Barboza<codeimpossible@gmail.com> @codeimpossible

*/
var express     = require('express'),
    jade        = require('jade'),
    app         = express.createServer(),
    io          = require('socket.io').listen(app),
    config      = {
                      routes:{
                          index: "/",
                          config: "/config.:format?"
                      }
                  };

app.set('views', __dirname + '/views');

app.use("/css", express.static(__dirname + '/css'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/images", express.static(__dirname + '/images'));

app.listen(8000);

app.configure( function() {
  console.log('Express server listening on port %d in %s mode',
    app.address().port, app.settings.env);
});


app.get(config.routes.index, function(req, res) {
  res.render('index.jade', {
    title: 'Get Off My Lawn',
    layout: false,
    date: (new Date()).toString()
  });
});

app.get(config.routes.config, function(req, res) {
  req.params.format = req.params.format || "html";
  var response_for = {
    "html": function() {
      res.render("config/index.jade", config);
    },
    "json": function() {
      res.send(JSON.stringify(config));
    }
  };

  response_for[req.params.format]();
});
