# SUIT UP DEVELOPERS README 

## Find the info about assets in the source files of the project.

## It works like this :
1. Select a folder of assets ( eg: folder with images in it )
2. Select a folder of source files ( eg : src folder with lot of js files in it )

## What happens is :
1. It takes all the names of files(say header.png) from the first folder (recursively all files inside it).
2. Then a user can give in a regular expression to exclude any files (like files with @2x @3x).
3. Then I search for the file name in the source folder files recursively ( require(../../header.png) => its a hit ).
4. Then I save and print the result in a file as json (assets_info.json).
5. After the information about the assets are gained, there is an optional feature to delete the unused assets.


## DEMO

### ctrl + shift + p and type >SUIT UP
![image](https://user-images.githubusercontent.com/38370391/124355852-ed238100-dc30-11eb-9a77-33160b517ff8.png)

### Select the first directory for assets
![image](https://user-images.githubusercontent.com/38370391/124355960-5efbca80-dc31-11eb-823d-b17ee16a9019.png)

### Type the Regular Expression if you want exclude any files
![image](https://user-images.githubusercontent.com/38370391/124356038-b39f4580-dc31-11eb-827f-bfff6095c9f6.png)

### Select the second directory of Source files
![image](https://user-images.githubusercontent.com/38370391/124356088-f19c6980-dc31-11eb-8d68-6abd171f8ee1.png)

### Then the info bar pop asking the question 
![image](https://user-images.githubusercontent.com/38370391/124356140-23adcb80-dc32-11eb-925b-918751706786.png)

## There are two files created as output

assets_info.json ---> has all the info about files

backup/ ---> back up of files deleted

