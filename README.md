# SeniorDesignShort
The repo for Michael Aliberti's and Julia Zeng's Senior Design introductory project

# UI/Frontend Design Decisions

* A simple UI was implement to provide a straightforward, uni-directional navigation experience for the user. This was implemented with the design of a select number of pages: the Recipe History Page, the Camera Page, and Servings Prompt component. 
* The Camera Page includes the barcode scanner and conditionally visible Servings Prompt component. We decided to keep these two components on the same page to employ persistent state hooks to keep track of key values. 
* To create a recipe, the user presses the floating button on the Recipe History Page
* The design has been tested on both Android and iOS devices to validate functionalities on both OSes. 

# Julia Zeng

* In charge of creating the Frontend of the app, barcode scanner, and persistent value collection per recipe through state hooks. 
