:: CD into debug, were dependancies for Node JS and angular live.
:: Start NPM, which will also run install, to run the debug server

%UserProfile%\Downloads\CURL.EXE http://olympics.atelerix.co/medals > medals\medals.json
cd debug_tools
npm start