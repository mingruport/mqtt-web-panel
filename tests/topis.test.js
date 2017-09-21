const request = require('supertest');
const expect = require('expect');
const httpStatus = require('http-status');
const app = require('../index.js');

const newTopic = {
  friendlyId: 'test',
  friendly: 'Test',
  topic: 'topics/test',
};

describe('# POST /api/topics', () => {
  it('should create a new topic', (done) => {
    request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.friendly).toEqual(newTopic.friendly);
        expect(res.body.topic).toEqual(newTopic.topic);
        done();
      })
      .catch(done);
  });
});

describe('# GET /api/topics/:friendlyId', () => {
  it('should get topic details', (done) => {
    request(app)
      .get(`/api/topics/${newTopic.friendlyId}`)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.friendly).toEqual(newTopic.friendly);
        expect(res.body.topic).toEqual(newTopic.topic);
        done();
      })
      .catch(done);
  });

  it('should report error with message - Not found', (done) => {
    request(app)
      .get('/api/topics/test1')
      .expect(httpStatus.NOT_FOUND)
      .then((res) => {
        expect(res.body.message).toEqual('Not Found');
        done();
      })
      .catch(done);
  });
});

describe('# GET /api/topics/', () => {
  it('should get all topics', (done) => {
    request(app)
      .get('/api/topics')
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.topics.length).toBe(1);
        done();
      })
      .catch(done);
  });
});

describe('# PUT /api/topics/:friendlyId', () => {
  it('should update topic details', (done) => {
    newTopic.friendly = 'Test1';
    request(app)
      .put(`/api/topics/${newTopic.friendlyId}`)
      .send(newTopic)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.friendly).toEqual('Test');
        expect(res.body.topic).toEqual(newTopic.topic);
        done();
      })
      .catch(done);
  });
});

describe('# DELETE /api/topics/:friendlyId', () => {
  it('should delete topic', (done) => {
    request(app)
      .delete(`/api/topics/${newTopic.friendlyId}`)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.friendly).toEqual('Test1');
        expect(res.body.topic).toEqual(newTopic.topic);
        done();
      })
      .catch(done);
  });
});
