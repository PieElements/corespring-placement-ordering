import fs from 'fs';
import path from 'path';
import register from 'babel-core/register';
import chai from 'chai';
// Ignore all node_modules except these
const modulesToCompile = [
  'corespring-show-correct-answer-toggle-react'
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));
const rcPath = path.join(__dirname, '..', '.babelrc');
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = function(filename) {
  if (!(/\/node_modules\//).test(filename)) {
    return false;
  } else {
    const matches = modulesToCompile.filter((regex) => regex.test(filename));
    const shouldIgnore = matches.length === 0;
    return shouldIgnore;
  }
} ;
register(config);
// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;
