# SeniorDesignShort
The repo for Michael Aliberti's and Julia Zeng's Senior Design introductory project

## Walkthrough
Due to size constraints, our app walkthrough video can be found [here](https://drive.google.com/file/d/1HPByDYRgPjDz0_wSLrZRezSbE1_RxJ_B/view).  
Screenshots of the app as run on an iPad 2 can be found in the Screenshots directory.

## UI/Frontend Design Decisions
* A simple UI was implement to provide a straightforward, uni-directional navigation experience for the user. This was implemented with the design of a select number of pages: the Recipe History Page, the Camera Page, and Servings Prompt component. 
* The Camera Page includes the barcode scanner and conditionally visible Servings Prompt component. We decided to keep these two components on the same page to employ persistent state hooks to keep track of key values. 
* To create a recipe, the user presses the floating button on the Recipe History Page
* The design has been tested on both Android and iOS devices to validate functionalities on both OSes. 

## Backend Design Decisions
* React Native and Firebase were selected as the front-end and backend for this app as they both have plentiful documentation.
* The firebase package was used in lieu of react-native-firebase as it requires no native code to work.
* The firestore api key was left visible in the code as it would be visible in generated files regardless due to the nature of React; custom firestore security rules help ensure that this key provides negligible access without authentication.
* The fda api key is stored in firestore to ensure that it is only used by authenticated users.
* The fda api key is retrieved using firestore REST Api calls for proof of usability.
* Two successive calls are made to the fdc database as querrying with UPC does not yield label nutrients, but querrying with fdcID obtainable from a upc querry does.
* Recipes are uploaded piecewise to firestore as stateHooks for local storage caused too many issues.
* Recipe list documents on firestore are named after user emails for ease of retrieval with the firestore sdk.
* Documents are tied to user ids on firestore to tie recipe pages to their related user.

## Bugs & Fixes
* Added truncation for scanned UPC codes on IOS due to prepended 0.

## Michael Aliberti

### Responsibilities
* managing firestore, including access rules, google authentication, and uploading/downloading recipes
* enforcing GitHub protocols like merging to main through pull requests and outlining tasks through Github Issues

### 

## Julia Zeng

###
* In charge of creating the Frontend of the app, barcode scanner, and persistent value collection per recipe through state hooks. 
