module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    'public/scripts/home.min.js': [
                        'data/recipes.js',
                        'scripts/factories/recipes.js',
                        'scripts/models/Search.js',
                        'scripts/models/TagSearch.js',
                        'scripts/models/RecipesSearch.js',
                        'scripts/pages/home.js'
                    ]
                }
            }
        },
        sass: {
            options: {
                style: 'compressed'
            },
            files: { 
                src: 'sass/main.scss',  // source files mask
                dest: 'public/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.css'   // replace .js to .min.js
            }
        },
        copy: {
            main: {
                files: [
                    {src : 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', dest: 'public/scripts/bootstrap.bundle.min.js'},
                    {src : 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff', dest: 'public/fonts/bootstrap-icons.woff'},
                    {src : 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2', dest: 'public/fonts/bootstrap-icons.woff2'}
                ]
            },
        },
        watch: {
            js:  { files: 'scripts/**/*.js', tasks: [ 'uglify' ] },
            css:  { files: ['sass/main.scss', 'sass/**/*.scss'], tasks: [ 'copy','sass' ] }
        },
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // register at least this one task
    grunt.registerTask('default', ['uglify', 'copy', 'sass']);
};