# Mocha Perf Reporter

> Test performance reporter

![http://storage.j0.hn/perf-reporter.png](http://storage.j0.hn/perf-reporter.png)

__Install__

```
npm install mocha-perf-reporter
```

__Usage__

```javascript
var assert = require('assert');

// Each suite is a table
describe ('This is the first header col', function(){
  // Each test is a row
  it ('Does something that takes time', function( done ){
    // Expected time for this test
    this.expected = 1200;
    // Yay, you've decreased the time
    setTimeout( done, 1180 );
  });
});
```