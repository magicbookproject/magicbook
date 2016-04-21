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
      return callback(null, config, stream, extras);
    }

    // save consolidated file to destination
    stream = stream.pipe(vfs.dest(extras.destination));

    // when stream is finished
    stream.on('finish', function() {

      // run prince PDF generation
      var pdf = Prince();

      if(_.get(config, 'log')) {
        pdf = pdf.option('log', path.join(extras.destination, config.log));
      }

      pdf.inputs(path.join(extras.destination, "consolidated.html"))
        .output(path.join(extras.destination, "consolidated.pdf"))
        .execute()
        .then(function () {
          callback(null, config, stream, extras);
        }, function (error) {
          console.log("Prince XML error")
          callback(error);
        });
    });
  }
};

module.exports = Plugin;
