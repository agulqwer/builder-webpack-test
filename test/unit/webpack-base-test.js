const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base');

    it('entry', () => {
        assert.equal(baseConfig.entry.index, 'I:/webpack/demo/travis-ci/builder-webpack-test/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, 'I:/webpack/demo/travis-ci/builder-webpack-test/test/smoke/template/src/search/index.js');
    })
})