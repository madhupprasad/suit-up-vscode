// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path")

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "SU" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('SU.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from SuitUp!');

		function matchWords(subject, words) {

			const temp = JSON.parse(JSON.stringify(words));

			var regexMetachars = /[(){[*+?.\\^$|]/g;

			for (var i = 0; i < words.length; i++) {
				words[i] = words[i].replace(regexMetachars, "\\$&");
			}
		
			var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "gi");

			const result = subject.match(regex) || ["NONE"];
			let dummy = []

			console.log(result,temp);

			temp.forEach(element => {
				if (result.includes(element)){
					dummy.push(1)
				}else{
					dummy.push(0)
				}
			});

			console.log(dummy)
			return [result, temp, dummy];
		}

		const getAllFiles = function(dirPath, arrayOfFiles) {
			let files = fs.readdirSync(dirPath)
		  
			arrayOfFiles = arrayOfFiles || []
		  
			files.forEach(function(file) {
			  if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
			  } else {
				// arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
				arrayOfFiles.push(path.join(file));
			  }
			})
			return arrayOfFiles
		  }

		  const getAllFilesPath = function(dirPath, arrayOfFiles) {
			let files = fs.readdirSync(dirPath)
		  
			arrayOfFiles = arrayOfFiles || []
		  
			files.forEach(function(file) {
			  if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
			  } else {
				arrayOfFiles.push(path.join(dirPath, "\\", file))
			  }
			})
			return arrayOfFiles
		  }

		vscode.window.showOpenDialog({canSelectFolders:true}).then(res1 =>  
			{
				let assetFiles = getAllFiles(res1[0].fsPath,[])
				let totalC = new Array(assetFiles.length).fill(0);
				vscode.window.showOpenDialog({canSelectFolders:true}).then(res2 =>  {

					const files = getAllFilesPath(res2[0].fsPath,[])

						files.forEach(file => {
							let data = fs.readFileSync(file, 'utf8');
							let [result, copy, total] =  matchWords(data, assetFiles)
							assetFiles = copy;
							console.log(file + " has " + result);
							totalC = totalC.map(function (num, idx) {
								return num + total[idx];
							});
						})
						console.log(totalC);
				})
			}
			)
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
