# SaRiGe

Word puzzle generator (sanaristikkogeneraattori).
A web page that can be used for generating word puzzles from a list of words.

You can access the latest version from the following page:
[sarige.lepovirta.org](https://sarige.lepovirta.org/)

## Development

Follow these instructions to develop the SaRiGe project.

### Project structure

This project is composed of JavaScript, HTML and CSS that is intended to be run on a web browser.
All of the JavaScript and CSS can be found from the `src/` directory.
The main HTML file is found from `www/index.html`.
The code is bundled to a single website using [esbuild](https://esbuild.github.io/).

This project follows these design choices:

1. **Everything running in the browser.**
   There's no backend component needed to run the website.
   Everything is shipped as static files.
   You should be able to download the website and run it in your browser offline.
2. **No 3rd party dependencies in the browser.**
   Libraries can be used for building the website, but no 3rd party libraries should be loaded in the browser.
   This is to ensure that the website remains lightweight and fast to use.

### Install tools

This project uses [NodeJS](https://nodejs.org/en/) to run various development tasks.
Installing the latest LTS version of NodeJS is enough for this project.

In addition to NodeJS, this project needs [NPM](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/) to install various dependencies.
NPM often installs together with NodeJS.

You can either [install NodeJS and NPM from their website](https://nodejs.org/en/download/) or [using a package manager](https://nodejs.org/en/download/package-manager/).

### Installing dependencies

Once you have NPM installed, you can install the rest of the project dependencies by running the following command in the project directory.

```
npm install
```

### Website live preview

You can live preview the website by running the following command:

```
npm run serve
```

You can then open up the address <http://127.0.0.1:8000> to access the preview website.
Any changes to the source code will be automatically rebuilt, and you only need to refresh your browser to reload the latest changes.

### Building a website

You can build a full version of the website using the following command:

```
npm run build
```

All of the generated content can be found from the `www/` directory.

### Running tests

You can use the following NPM commands to run tests and static analysis tools:

```
npm run test

npm run lint
```

## Licence

MIT License. See [LICENSE](LICENSE) for more details.
