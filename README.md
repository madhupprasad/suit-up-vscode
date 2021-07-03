# SUIT UP README

## Find the info about assets in the source files of the project.

## It works like this :
1. Select a folder of assets ( eg: folder with images in it )
2. Select a folder of source files ( eg : src folder with lot of js files in it )

## What happens is :
1. It takes all the names of files(say header.png) from the first folder (recursively all files inside it)
2. Then I search for the file name in the source folder files recursively ( require(../../header.png) => its a hit ) in a brutal brute force algorithm 😆.
3. Then I save and print the result in a file as json (assets_info.json).
