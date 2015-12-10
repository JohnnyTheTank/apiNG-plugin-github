module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files : {
                    'dist/aping-plugin-github.min.js' : [
                        'src/aping-github-directive.js',
                        'src/aping-github-helper.js',
                        'bower_components/angular-github-api-factory/src/angular-github-api-factory.js'
                    ]
                }
            },
            options: {
                banner: '\n/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("dd-mm-yyyy") %>) by <%= pkg.author %> */\n',
            }
        },
        watch: {
            minifiyJs: {
                files: [
                    'src/aping-github-directive.js',
                    'src/aping-github-helper.js',
                    'bower_components/angular-github-api-factory/src/angular-github-api-factory.js'
                ],
                tasks: ['uglify'],
                options: {
                    spawn: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);

};

