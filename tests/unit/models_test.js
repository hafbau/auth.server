'use strict'
const db = require('../support/test_setup')();

require('../../models/test/user_model_test')(db);
