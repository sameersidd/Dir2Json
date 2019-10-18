#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let args = process.argv[2];
const root =
	args == undefined ? __dirname : fs.existsSync(args) ? args : "Error";
if (root == "Error") {
	console.log("Directory Not Found!");
	process.exit();
}
const ignoreDirs = [".git", "node_modules", "vendor", "build"];

let currentDir = root;
console.time("In");
Dir2Json(currentDir, (err, results) => {
	try {
		let OutPut = JSON.stringify(results, null, 3);
		let OPFile = path.resolve(root, "DirectoryListing.json");
		fs.writeFile(OPFile, OutPut, (err) => {
			if (err) console.log(err);
			else {
				console.log("Done at", root);
				console.timeEnd("In");
				return;
			}
		});
	} catch (error) {
		console.log(error);
	}
});

function Dir2Json(currentDir, done) {
	let dir = {};
	let dirName = path.basename(currentDir);
	fs.readdir(currentDir, (err, files) => {
		if (err) return done(err);

		let dirFiles = files.length;
		if (!dirFiles) return done(null, dir);
		let list = [];

		files.forEach(function(file) {
			file = path.resolve(currentDir, file);

			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					if (dirName)
						Dir2Json(file, function(err, res) {
							if (err) console.log("Error At " + file);
							list.push(res);
							dir[dirName] = list;
							if (!--dirFiles) done(null, dir);
						});
				} else {
					list.push(path.basename(file));
					dir[dirName] = list;

					if (!--dirFiles) done(null, dir);
				}
			});
		});
	});
}
