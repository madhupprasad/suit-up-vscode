// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path");


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "SUIT UP" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('SU.suitup', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from SuitUp!');

		const matchWords = (subject, words) => {
			const originalAssets = JSON.parse(JSON.stringify(words));
			var regexMetachars = /[(){[*+?.\\^$|]/g;
			for (var i = 0; i < words.length; i++) {
				words[i] = words[i].replace(regexMetachars, "\\$&");
			}
			var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "gi");
			const matchedAssets = subject.match(regex) || ["NONE"];
			let countArray = []
			originalAssets.forEach(element => {
				if (matchedAssets.includes(element)) {
					countArray.push(1)
				} else {
					countArray.push(0)
				}
			});
			return [matchedAssets, originalAssets, countArray];
		}

		const getAllFiles = (dirPath, arrayOfFiles) => {
			let files;
			try {
				files = fs.readdirSync(dirPath)
			} catch (err) {
				console.log(err)
				return
			}
			arrayOfFiles = arrayOfFiles || []
			files.forEach(function (file) {
				if (fs.statSync(dirPath + "/" + file).isDirectory()) {
					arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
				} else {
					// * leave if the image has @2x , @3x 
					if (file.match(/@.x/g) == null) {
						arrayOfFiles.push(path.join(file));
					}
				}
			})
			return arrayOfFiles
		}

		const getAllFilesPath = (dirPath, arrayOfFiles) => {
			let files;
			try {
				files = fs.readdirSync(dirPath)
			} catch (err) {
				console.log(err)
				return
			}
			arrayOfFiles = arrayOfFiles || []
			files.forEach(function (file) {
				if (fs.statSync(dirPath + "/" + file).isDirectory()) {
					arrayOfFiles = getAllFilesPath(dirPath + "/" + file, arrayOfFiles)
				} else {
					if (file.match(/@.x/g) == null) {
						arrayOfFiles.push(path.join(dirPath, "/", file))
					}
				}
			})
			return arrayOfFiles
		}

		const saveAndPrint = (result) => {
			console.table(result);
			const data = JSON.stringify(result);
			const output = path.join(__dirname, "/assets_info.json",)
			fs.writeFile(output, data, (err) => {
				if (err) {
					throw err;
				}
				console.log('Result saved in data.json');
			});
		}

		const optionalBackupAndDelete = (assetFiles ,assetFilesPath, finalCountArray) => {
			vscode.window.showInformationMessage("Do you want to delete all the unused files?", "Yes", "No").then(answer =>{
				if (answer === "Yes"){
					let assetFilesPathArray = getAllFilesPath(assetFilesPath, [])

					const backupDir = path.join(__dirname, "/backup/")

					if (!fs.existsSync(backupDir)){
						fs.mkdirSync(backupDir);
					}

					assetFilesPathArray.forEach((key,i) => {
						if(finalCountArray[i] === 0){
							const backUpPath = path.join(backupDir, assetFiles[i]);
							fs.copyFileSync(key, backUpPath);
							fs.unlink(key, (err)=>{
								if (err) throw err;
								console.log('Successfully deleted', key);
							})
						}
					});
				}else{
					return
				}
			})
		}

		vscode.window.showOpenDialog({ canSelectFolders: true }).then(res1 => {

			let assetFiles = getAllFiles(res1[0].fsPath, [])
			let finalCountArray = new Array(assetFiles.length).fill(0);
			let result = {}
			let pathResult = {}

			vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: true }).then(res2 => {

				res2.forEach(folder => {

					const files = getAllFilesPath(folder.fsPath, [])
					files.forEach(file => {
						let data;
						try {
							data = fs.readFileSync(file, 'utf8');
						} catch (err) {
							console.log(err);
						}
						let [matchedAssets, originalAssets, countArray] = matchWords(data, assetFiles)
						assetFiles = originalAssets;

						finalCountArray = finalCountArray.map(function (num, idx) {
							return num + countArray[idx];
						});
					})
					assetFiles.forEach((key, i) => {
						result[key] = finalCountArray[i]
					});


				})

				saveAndPrint(result);

				optionalBackupAndDelete(assetFiles ,res1[0].fsPath, finalCountArray);

			})
		}
		)
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
