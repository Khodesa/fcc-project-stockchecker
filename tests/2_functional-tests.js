const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(9000);
  test('Test GET with one stock', function (done)  {
    chai.request(server)
    .get('/api/stock-prices?stock=GOOG')
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      done();
    });
  });

  test('Test GET one stock with like', function(done) {
    chai.request(server)
    .get('/api/stock-prices?stock=GOOG&like=true')
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      done();
    });
  });

  test('Test GET with two stocks', function(done) {
    chai.request(server)
    .get('/api/stock-prices?stock=GOOG&stock=MSFT')
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      done();
    });
  });

  test('Test GET with stocks and like', function(done) {
    chai.request(server)
    .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      done();
    });
  });

  test('Liking stocks already liked', function(done) {
    chai.request(server)
    .get('/api/stock-prices?stock=GOOG&like=true')
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      done();
    });
  })
});
