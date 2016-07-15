/* globals define*/
define([
    'intern/chai!assert',

    'intern!bdd',
    'intern/dojo/node!child_process',
    'intern/dojo/node!../../globals',
], function (
    assert,
    bdd,
    childProcess,
    GLOBALS
) {
    var spawn = childProcess.spawn,
        port = GLOBALS.getGmeConfig().server.port;

    bdd.describe('Index', function() {
        bdd.before(function(done) {
            GLOBALS.DeepForge.startServer(done);
        });

        bdd.it('should show project list', function() {
            return this.remote
                .get('http://localhost:'+port)
                .setFindTimeout(5000)
                .findByCssSelector('.projects-dialog.modal')
                //.findByCssSelector('.btn-create-new')
                .isDisplayed()
                .then(function(displayed) {
                    console.log('displayed is', displayed);
                    assert(displayed, 'Logo is not found');
                });
        });

        bdd.it('should create new project', function() {
            return this.remote
                .get('http://localhost:'+port)
                .setFindTimeout(5000)
                .findByCssSelector('.btn-create-new')
                    .click()
                    .end()
                .pressKeys('testProject')
                .findByCssSelector('.btn-save')
                    .click()
                    .end()
                .findByCssSelector('.btn-create')
                    .click()
                    .end()
                .findById('pluginBtn')
                .isDisplayed()
                .then(function(displayed) {
                    assert(displayed, 'fab is not shown!');
                });
        });

        //bdd.it('should load main view', function() {
            //return this.remote
                //.get('http://localhost:'+port)
                //.setFindTimeout(5000)
                //.findByCssSelector('#pluginBtn')
                //.isDisplayed()
                //.then(function(displayed) {
                    //console.log('displayed is', displayed);
                    //assert(displayed, 'Logo is not found');
                //});
        //});
    });

});
