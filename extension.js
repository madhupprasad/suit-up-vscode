// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

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

		vscode.window.showOpenDialog({canSelectFolders:true}).then(res1 =>  
			{
			//read the source directory
			fs.readdir(res1[0].fsPath, (err, assetFiles) => {
				vscode.window.showOpenDialog({canSelectFolders:true}).then(res2 =>  {
					//read the target dir
					fs.readdir(res2[0].fsPath, (err, files2) => {
						// Looping through the files
						files2.forEach(file2 => {
							const uri = res2[0].fsPath + '\\' + file2;
							fs.readFile(uri, 'utf8' , (err, data) => {
								if (err) console.error(err)
								console.log(file2 + " has " + matchWords(data.toString(), assetFiles));
							  })
						})
						// console.log(totalCount);
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
