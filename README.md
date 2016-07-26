# Undertow

## A platform for publishing web animations

*NOTE: This project is unfinished.  It doesn't do anything meaningful yet, and everything is in flux.  It is not recommended for use right now.*

Undertow is a server application for supporting and serving the [Stylie](https://github.com/jeremyckahn/stylie) and [Mantra](https://github.com/jeremyckahn/mantra) projects, as well as hosting the [static files for rekapi.com](https://github.com/jeremyckahn/rekapi.com).

### Using Undertow

Start the server:

````
npm run start
````

And then open http://localhost:8666/.  Alternatively, start the debug server (with auto-reload!):

````
npm run start:debug
````

Run the tests:

````
npm test

# With a watcher!
npm run test:watch
````

To debug:

````
npm run test:debug
````

Set up or reset test data:

````
npm run use-data:basic
````

### Licensing

<a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode"><img alt="Creative Commons License" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/3.0/88x31.png" /></a>

Undertow is distributed under the CC BY-NC-SA license.  You may NOT use Undertow for commercial use.  The source code is shared as a means of knowledge distribution, transparency, and quality improvement.  You may, however, freely use and modify Undertow for your own personal needs and interests.
