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
			var regexMetachars = /[(){[*+?.\\^$|]/g;

			for (var i = 0; i < words.length; i++) {
				words[i] = words[i].replace(regexMetachars, "\\$&");
			}
		
			var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "gi");
		
			return subject.match(regex) || ["Nothing"];
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
				const assetFiles = getAllFiles(res1[0].fsPath,[])
				
				vscode.window.showOpenDialog({canSelectFolders:true}).then(res2 =>  {

					const files = getAllFilesPath(res2[0].fsPath,[])

						files.forEach(file => {
							fs.readFile(file, 'utf8' , (err, data) => {
								if (err) console.error(err)
								console.log(file + " has " + matchWords(data, assetFiles));
							  })
						})
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
