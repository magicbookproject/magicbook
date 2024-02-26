var debug = require('debug')('magicbook:pdf');
var vfs = require('vinyl-fs');
var concat = require('gulp-concat');
var Prince = require("prince");
var path = require('path');
var _ = require('lodash');
var streamHelpers = require('../helpers/stream');

var Plugin = function(registry) {
  registry.after('markdown:convert', 'pdf:consolidate', this.consolidate);
  registry.add('pdf:save', this.savePdf);
};

Plugin.prototype = {

  consolidate: function(config, stream, extras, callback) {

    // if this is the pdf format
    if(config.format == "pdf") {
      stream = stream.pipe(concat('consolidated.html'))
        .pipe(streamHelpers.resetCheerio());
    }
    callback(null, config, stream, extras);
  },

  savePdf: function(config, stream, extras, callback) {

    // Do not run for other formats than PDF
    if(config.format !== 'pdf') {

      debug('Skipped');

      return callback(null, config, stream, extras);
    }

    // save consolidated file to destination
    stream = stream.pipe(vfs.dest(extras.destination));

    // when stream is finished
    stream.on('finish', function() {

      // run prince PDF generation
      var pdf = Prince();

      if(_.get(config, 'prince.log')) {
        pdf = pdf.option('log', path.join(extras.destination, config.prince.log));
      }

      if(_.get(config, 'prince.timeout')) {
        pdf = pdf.timeout(config.prince.timeout);
      }

      if (_.get(config, 'prince.license')) {
        pdf = pdf.license(config.prince.license);
      }

      if (_.get(config, 'prince.javascript')) {
        pdf = pdf.option('javascript', config.prince.javascript);
      }

      if (_.get(config, 'prince.maxPasses')) {
        pdf = pdf.option('max-passes', config.prince.maxPasses, true);
      }

      pdf.inputs(path.join(extras.destination, "consolidated.html"))
        .output(path.join(extras.destination, "consolidated.pdf"))
        .execute()
        .then(function () {
          console.log('-> PDF build finished');
          callback(null, config, stream, extras);
        }, function (error) {
          console.log("Prince XML error")
          callback(error);
        });

      debug('Finished');
    });
  }
};

module.exports = Plugin;
