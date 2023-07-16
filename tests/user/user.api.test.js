const request = require('supertest');
const { expect } = require('chai');

const myRequest = request('http://localhost:3000/users');

require('../test.setup');
