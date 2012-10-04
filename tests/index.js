require.config({
    baseUrl: '../src',
    shim : {
        mocha : {
            exports : 'mocha'
        },
        chai : {
            exports : 'chai'
        }
    },
    paths : {
        mocha : '../tests/mocha',
        chai : '../tests/chai'
    }
})

require(['require', 'mocha', 'chai'], function (require, mocha, chai) {
    window.should = chai.Should()
    window.expect = chai.expect

    mocha.setup('bdd')
    
    require(['../tests/Emitter'], function () {
        mocha.run()
    })
})
