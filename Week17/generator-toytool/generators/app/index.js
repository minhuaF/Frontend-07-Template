var Genarator = require('yaoman-genarator');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async initPackage() {
    let answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: "Your project name",
        default: this.appname
      }
    ]);


    const pkgJson = {
      "name": answer.name,
      "version": "0.0.1",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha --require @babel/register"
      },
      "author": "",
      "license": "ISC",
      "devDependencies": {

      },
      "dependencise": {

      }
    };

    this.fs.extendJSON(this.descriptionPath('package.json'), pkgJson);
    this.npmInstall(["vue"], {'save-dec': false});
    this.npmInstall([
      "babel-loader",
      "@babel/core",
      "@babel/preset-env",
      "@babel/register",
      "webpack",
      "webpack-cli"],
      { 'save-dev': true}
    );

    this.fs.copyIpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    )

    this.fs.copyIpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {}
    )
  }
}