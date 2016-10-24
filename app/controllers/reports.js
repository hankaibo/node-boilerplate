'use strict';

/**
 * 模块依赖
 */
const mongoose=require('mongoose');
const {wrap:async}=require('co');
const only =require('only');
const {respond,respondOrRedirect} =require('../utils');
const Report=mongoose.model('Report');
