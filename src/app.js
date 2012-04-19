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
    maps        = require('./maps'),
    config      = {
                      routes:{
                          index: "/",
                          config: "/config.:format?",
                          maps: "/maps/:id?.:format?"
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
  console.log((new Date()).toString());
});


app.get(config.routes.index, function(req, res) {
  res.render('index.jade', {
    title: 'Get Off My Lawn',
    layout: false,
    date: (new Date()).toString()
  });
});

app.get(config.routes.maps, function(req, res) {
  req.params.format = req.params.format || "html";
  var response_for = {
    "html": function() {
      res.render("maps/index.jade", maps);
    },
    "json": function() {
      var callback_name = req.query.callback,
          json = "",
          jsonp = function(json){
            return callback_name + "(" + json + ")";
          };

      json = JSON.stringify( req.params.id ? maps[req.params.id] : maps );

      res.send( callback_name ? jsonp(json) : json );
    }
  };

  response_for[req.params.format]();
});
