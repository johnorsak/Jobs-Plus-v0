import './gridpack.css';
import factory from './gridpack.js';

// prefer global if the script sets it, otherwise call the factory
const dhx =
  (typeof window !== 'undefined' && window.dhx)
    ? window.dhx
    : (typeof factory === 'function'
        ? factory()
        : (factory && factory.default ? factory.default() : factory));

export default dhx;
