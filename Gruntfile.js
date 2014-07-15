module.exports = function(grunt) {
    var config = grunt.file.readJSON('config.json');
    grunt.initConfig(config);

    // load npm tasks
    grunt.loadNpmTasks('grunt-crane');

    grunt.registerTask('default', ['build']);
};

