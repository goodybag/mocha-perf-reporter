var Table = require('cli-table');

exports = module.exports = Perf;

exports.colors = {
  'fast': 32
, 'medium': 93
, 'slow': 91
, 'header': 36
, 'error': 91
};

var color = exports.color = function(type, str) {
  return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
};

var termW = process.stdout.columns - 4;
var colWidths = [
  parseInt( termW * 0.55 )
, parseInt( termW * 0.45 * 0.3333333 )
, parseInt( termW * 0.45 * 0.3333333 )
, parseInt( termW * 0.45 * 0.3333333 )
];

function Perf( runner ){
  var this_ = this;

  this.stats = {};

  runner.on( 'start', function(){
    console.log();
  });

  runner.on( 'suite', function( suite ){
    this_.stats[ suite.title ] = {};
  });

  runner.on( 'test', function( test ){
    process.stdout.write('.');
    this_.stats[ test.parent.title ][ test.title ] = {};
    test.start = new Date();
  });

  runner.on( 'test end', function( test ){
    this_.stats[ test.parent.title ][ test.title ].expected = test.ctx.expected;
    this_.stats[ test.parent.title ][ test.title ].duration = new Date() - test.start;
  });

  runner.on( 'pass', function( test ){

  });

  runner.on( 'fail', function( test, error ){
    this_.stats[ test.parent.title ][ test.title ].error = error;
  });

  runner.on( 'end', function(){
    console.log();
    Object.keys( this_.stats ).filter( function( suiteName ){
      return Object.keys( this_.stats[ suiteName ] ).length > 0;
    }).forEach( function( suiteName ){
      var table = this_.getTable( suiteName );

      Object.keys( this_.stats[ suiteName ] ).forEach( function( testName ){
        var test = this_.stats[ suiteName ][ testName ];
        var diff = ( (1 / (test.expected / (test.duration || 0))) -1 ) * 100;

        var colorType = 'fast';

        if ( diff > 0 ){
          if ( diff < 5 ) colorType = 'medium';
          else colorType = 'slow';
        }

        var error;
        if ( test.error ){
          testName = color( 'error', testName );

          error = test.error.toString();
          for ( var i = 1; i < error.length; i++ ){
            if ( i % ( colWidths[0] - 2 ) === 0 ){
              error = [
                error.substring( 0, i )
              , error.substring( i )
              ].join('\n')
            }
          }
        }

        table.push([
          testName + ( !error ? '' : ( '\n' + error ) )
        , (test.expected || 0) + 'ms'
        , error ? color( 'error', '✖' ) : test.duration + 'ms'
        , error ? color( 'error', '✖' ) : color( colorType, ( diff > 0 ? '+' : '') + diff.toFixed(2) + '%' )
        ]);
      });

      console.log( table.toString() );
    });
  });

  runner.on( 'pending', function(){

  });
}

Perf.prototype.getTable = function( suiteName ){
  return new Table({
    head: [ suiteName, 'Expected', 'Actual', 'Diff' ].map( color.bind( null, 'header' ) )
  , colWidths: colWidths
  , truncate: false
  });
};