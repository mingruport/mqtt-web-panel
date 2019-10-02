const Widget = require('../widgets/widget');
const request = require('supertest');
const expect = require('expect');
const app = require('../index.js');

const validAttrs = { name: 'Temperature', topic: 'widgets/temperature', qos: 0, unit: '℃' };
const updateAttrs = { name: 'Humidity', topic: 'widgets/humidity', qos: 1, unit: '%' };
const invalidAttrs = { name: '', topic: '', qos: 3, unit: '' };

const invalidId = '5d8a0cfb4a26124b25d8db59';

let widget;

beforeEach(done => {
  (new Widget({ name: 'Amount', topic: 'widgets/amount', unit: '?', value: 42 }))
    .save()
    .then(document => {
      widget = document;
      done();
    })
    .catch(done);
});

afterEach(() => {
  Widget.collection.drop();
});

describe('# GET /api/widgets/', () => {
  it('should get all widgets', done => {
    request(app)
      .get('/api/widgets')
      .expect(200)
      .then(res => {
        expect(res.body.widgets.length).toBe(1);
        done();
      })
      .catch(done);
  });
});

describe('# GET /api/widgets/:id', () => {
  it('should get widget details', (done) => {
    request(app)
      .get(`/api/widgets/${widget._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.name).toEqual(widget.name);
        expect(res.body.topic).toEqual(widget.topic);
        expect(res.body.qos).toEqual(widget.qos);
        expect(res.body.unit).toEqual(widget.unit);
        done();
      })
      .catch(done);
  });

  it('should return error for a nonexistent widget', done => {
    request(app)
      .get(`/api/widgets/${invalidId}`)
      .expect(404)
      .then(res => {
        expect(res.body.message).toEqual('Not Found');
        expect(res.body.status).toEqual(404);
        done();
      })
      .catch(done);
  });
});

describe('# POST /api/widgets', () => {
  it('should create a new widget with valid attrs', done => {
    request(app)
      .post('/api/widgets')
      .send(validAttrs)
      .expect(201)
      .then(res => {
        expect(res.body.name).toEqual(validAttrs.name);
        expect(res.body.topic).toEqual(validAttrs.topic);
        expect(res.body.qos).toEqual(validAttrs.qos);
        expect(res.body.unit).toEqual(validAttrs.unit);
        done();
      })
      .catch(done);
  });

  it('should return error with invalid attrs', done => {
    request(app)
      .post('/api/widgets')
      .send(invalidAttrs)
      .expect(422)
      .then(res => done())
      .catch(done);
  });
});

describe('# PUT /api/widgets/:id', () => {
  it('should update widget details with valid attrs', done => {
    request(app)
      .put(`/api/widgets/${widget._id}`)
      .send(updateAttrs)
      .expect(200)
      .then(res => {
        expect(res.body.name).toEqual(updateAttrs.name);
        expect(res.body.topic).toEqual(updateAttrs.topic);
        expect(res.body.qos).toEqual(updateAttrs.qos);
        expect(res.body.unit).toEqual(updateAttrs.unit);
        done();
      })
      .catch(done);
  });

  it('should update widget details with invalid attrs', done => {
    request(app)
      .put(`/api/widgets/${widget._id}`)
      .send(invalidAttrs)
      .expect(422)
      .then(res => done())
      .catch(done);
  });

  it('should return error for a nonexistent widget', done => {
    request(app)
      .put(`/api/widgets/${invalidId}`)
      .expect(404)
      .then(res => {
        expect(res.body.message).toEqual('Not Found');
        expect(res.body.status).toEqual(404);
        done();
      })
      .catch(done);
  });
});

describe('# DELETE /api/widgets/:id', () => {
  it('should delete widget', (done) => {
    request(app)
      .delete(`/api/widgets/${widget._id}`)
      .expect(204)
      .then((res) => done())
      .catch(done);
  });

  it('should return error for a nonexistent widget', done => {
    request(app)
      .delete(`/api/widgets/${invalidId}`)
      .expect(404)
      .then(res => {
        expect(res.body.message).toEqual('Not Found');
        expect(res.body.status).toEqual(404);
        done();
      })
      .catch(done);
  });
});
