REM Starts our nodejs server in the current directory
supervisor -w "views,scripts,css,images,app.js,maps.js" -e "jade,js,css,png" app.js
