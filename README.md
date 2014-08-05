unphp-folder
============

A helper utility to step through a folder of obfuscated PHP and reveal it, using the awesome power of [http://www.unphp.net/](http://www.unphp.net/)'s API. This is very useful for working out what's going on inside dodgy Wordpress plugins, and why said plugin is breaking your lovely code.

It will clone the target folder, appending `_decodedPHP_` and a timestamp.

You need to [request an API key](http://www.unphp.net/api/request/) from UnPHP

Use it like so:

	node unphp-folder.js <api key> <folder path>

An example might be:

	node unphp-folder.js 1c2755023f354893ed17c99182d44464 /projects/obfuscatedPHPfiles/