var assert = require('assert');

describe('Header Column', function(){
  it('Should be slower', function( done ){
    this.expected = 132;
    setTimeout( done, 200 );
  });

  it('Should be faster', function( done ){
    this.expected = 1000;
    setTimeout( done, 133 );
  });

  it('Should be roughly the same', function( done ){
    this.expected = 100;
    setTimeout( done, 100 );
  });
});