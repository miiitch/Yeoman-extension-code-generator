'use strict';
var path = require('path');
const sinon = require(`sinon`);
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var crypto = require('crypto');
var promise;
var spawnStub;

describe('generator-vsts-ext:hub', function () {

   var testPath = path.join(__dirname, '../TestsResults/' + crypto.randomBytes(20).toString('hex'));
   console.log(testPath);
   before(function () {
      return helpers.run(path.join(__dirname, '../generators/hub'))
         .inDir(testPath)
         .withPrompts({
            extName: "Test1",
            extId: "Test1",
            extDescription: "Description of the extension",
            yourPublisher: "fabrikam",
            extensionType: "ms.vss-web.hub",
            hubPoint: "ms.vss-code-web.code-hub-group",
            useVS: true
         })
         .on(`error`, e => {
            assert.fail(e);
         })
         .on(`ready`, function (generator) {
            // This is called right before `generator.run()` is called
            // Stub the calls to spawnCommandSync
            spawnStub = sinon.stub(generator, `spawnCommandSync`);
         });
   });

   it('Extension directory should be created', function () {
      assert.file(testPath + '/Test1/');
   });





   it('creates files', () => {
      var root = testPath + '\\Test1\\Test1\\';
      assert.file([
         root + 'gruntfile.js',
         root + 'Test1.csproj',
         root + 'typings.json',
         root + 'package.json',
         root + 'settings.tfx.json',
         root + 'vss-extension.json',
         root + 'test/TestSpec.js',
         root + '.vscode/tasks.json',
         root + 'src/module/app.ts',
         root + 'static/index.html',
         root + 'static/images/logo.png',
         root + 'static/images/screen1.png',
         root + 'static/css/app.css',
         root + 'marketplace/mp_terms.md',
         root + 'marketplace/overview.md',
         root + 'marketplace/ThirdPartyNotices.txt',
      ]);
      assert.fileContent(root + 'vss-extension.json', /"id": "Test1"/);
      assert.fileContent(root + 'vss-extension.json', /"name": "Test1"/)
      assert.fileContent(root + 'vss-extension.json', /"type": "ms.vss-web.hub"/)




   })

   it(`npm install should be called`, () => {
      assert.equal(1, spawnStub.withArgs(`npm`, [`install`], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `npm install was not be called`);
   });

   it(`grunt copy should be called`, () => {
      assert.equal(1, spawnStub.withArgs(`grunt`, [`copy`], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `grunt copy was not be called`);
   });

   it(`grunt typescript should be called`, () => {
      assert.equal(1, spawnStub.withArgs(`grunt`, ['exec:typescriptCompile'], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `grunt typescriptCompile was not be called`);
   });

   it(`grunt package should be called`, () => {
      assert.equal(1, spawnStub.withArgs(`grunt`, ['exec:package'], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `grunt package was not be called`);
   });

});