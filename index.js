var fs = require('fs'),
    path = require('path');

exports.apply = function (options) {
    options = defaults(options || {});

    var pkg = readJSON('package.json');
    var template = fs.readFileSync(options.templatePath, {encoding: 'utf-8'});
    var module = tryGetUnifyModule() || pkg.name;
    var vers = pkg.version;

    var output = template
        .replace('%MODULE%', module)
        .replace('%LABEL%', options.label)
        .replace('%VERSION%', vers);

    fs.writeFileSync(options.dest, output);
};

function defaults(options) {
    if (!options.templatePath) {
        options.templatePath = path.join(__dirname, '..', 'template', 'version_template.ts');
    }
    if (!options.label) {
        options.label = 'version';
    }
    if (!options.dest) {
        options.dest = 'src/_version.ts';
    }
    return options;
}

function tryGetUnifyModule() {
    if (!fs.existsSync('unify.json'))
        return null;
    var json = readJSON('unify.json');
    if (!json || !json.library)
        return null;
    return json.library.exports || null;
}

function readJSON(filepath) {
    return JSON.parse(fs.readFileSync(filepath, {encoding: 'utf-8'}));
}