var wrench = require('wrench'),
	fs = require('fs'),
	walk = require('walk'),
	restler = require('restler'),
	clc = require("cli-color"),
	api_key = process.argv[2],
	targetPath = process.argv[3];

if (targetPath.substr(-1) == '/') {
    targetPath = targetPath.substr(0, targetPath.length - 1);
}

var decodedFolder = targetPath+'_decodedPHP_' + ( Date.now() / 1000 );

wrench.copyDirSyncRecursive(targetPath, decodedFolder, {
    forceDelete: false, // Whether to overwrite existing directory or not
    excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
    preserveFiles: true, // If we're overwriting something and the file already exists, keep the existing
    preserveTimestamps: true, // Preserve the mtime and atime when copying files
    inflateSymlinks: false, // Whether to follow symlinks or not when copying files
});

walker = walk.walk( decodedFolder );


walker.on("file", function (root, fileStats, next) {
	var thisFilePath = root + '/' + fileStats.name;
	var prettyPath = thisFilePath.replace(targetPath , '');
	// console.log(thisFilePath+"\n")
	if (thisFilePath.substr(thisFilePath.length - 3) === 'php' ) {
		// get file path
		process.stdout.write(clc.cyan(prettyPath));

	    restler.post("http://www.unphp.net/api/v2/post", {
	        multipart: true,
	        data: {
	            "api_key" : api_key,
	            "file": restler.file(thisFilePath, null, fileStats.size)
	        }
	    }).on("complete", function(data) {
	        if (data.result === 'success') {
	        	restler.get(data.output, {timeout: 10000})
					.on('timeout', function(ms){
						console.log('did not return within '+ms+' ms');
					}).on('complete', function(data, response){
						fs.writeFile(thisFilePath, data, function(err){
							if (err) {
								console.log(err);
								throw err;
							}
							process.stdout.write(' ' + clc.green.underline("is decoded!\n"));
							next();
						});
					});
	        }
	    });
	} else {
		next()
	}
});

walker.on("errors", function (root, nodeStatsArray, next) {
	next();
});

walker.on("end", function () {
	console.log(clc.bold.greenBright("all done"));
});