

# Recipe_Project

This is a **JavaScript ES6**  app used **MVC pattern **, and the back-end api is Forkify API(https://forkify-api.herokuapp.com/)

## Features:

People could search their favorite dishes by typing key words, such as pizza or pasta; then the dishes will be shown on the left part of the page, 



and when clicking on one specific dish, then the detailed information about it will be shown in the middle part of the page, we can then adjust the servings, we can also add those ingredients to the shopping list, besides, user could click on that heart icon, then that dish will be saved to the favorite dish list which is the upper top right red heart icon.



once the user clicks on the "add to shopping list" button, then all the ingredients with numbers of unit will be placed to the "my shopping list" area, user can also adjust the amount of those ingredients or choose to delete it.

when the user clicks on the red heart icon, then all the saved dishes will be shown below

![image](https://img-blog.csdnimg.cn/20200822162402266.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

when clicks on the red heart icon

![image](https://img-blog.csdnimg.cn/20200822162543914.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)




## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```



### Project Structure

```
├── dist                        // Production file folder
│   ├── css
│	│	└── style.css           
│   ├── img                     // dishes imgs
│   ├── js                      // js code
│	│	└── bundle.js           // bundled into this only one js file
│	└── index.html              // homepage
├── node_modules
├── src                         // development code folder
│   ├── js
│   	├── models              // model: manipulating data
│   	│	├── Likes.js        // about like dish feature
│   	│	├── List.js         // put all ingredients into shoppinglist
│   	│	├── Recipe.js       // a class holds the recipe object
│   	│	└── Search.js       // which get search result from API
│   	├── views               // views: presenting the UI
│   	│	├── base.js         // store elements of page & loader icon
│   	│	├── likesView.js    // render UI of liked dishes
│   	│	├── listView.js     // render ingredients to shopping list
│   	│	├── recipeView.js   // render the recipe which choosen
│   	│	└── searchView.js   // render search results
│       └── index.js            // which connects models and views
│   └── index.html         		// homepage
├── .babelrc                    // babel config file 
├── package.json
├── package-lock.json
├── webpack.config.js           // webpack config file
└── Readme.md                   // description file
```