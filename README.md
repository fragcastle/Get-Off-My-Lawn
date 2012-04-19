# Get Off My Lawn!

A game written using JavaScript and the HTML 5 Canvas element.

## Demo

We'll eventually post a demo on our [Github page](http://jbubriski.github.com/Get-Off-My-Lawn/).

For now, you can download the source and simply open it in your browser.

## Two ways to run Get off my lawn
first, you can run GOML on IISExpress. Simply run the following command from the `src` directory:

    $ .\start_server.bat

This will start an iisexpress site in the `src` directory. You can now run GOML in your browser by visiting [http://localhost:8080](http://localhost:8080).

You can also run GOML using nodejs. This is probably what we will use to host GOML when we go live and it is the best way to debug/test GOML. Just [download and install NodeJS for windows](http://nodejs.org/#download) then run the commands below from the `src` directory:

    $ npm install supervisor -g
    $ npm install

These commands will install the GOML nodejs application dependencies on your machine. This will also install a tool called "supervisor" which enables hot reload of a nodejs application when source files change. Now, just start the nodejs server with supervisor enabled:

    $  supervisor -w "views,scripts,css,images,app.js" -e "jade,js,css,png" app.js

Now, whenever you change a javascript, css, png or jade view file, the server will reload and the client will refresh in the browser.
