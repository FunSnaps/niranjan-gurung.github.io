# **Crossy-Road**
&nbsp;
##### *__The Game__*
Crossy Road is an offline holding page game that is loaded up when a user's connection is lost while browsing a site. You are a player starting on the left hand side. The middle of the screen is occupied by spaceships (enemies) that vertically cross the screen at random intervals starting from either the top or bottom. The goal of the player is to cross the section of enemies to reach the right hand side of the screen where the level is considered complete. Each time you complete a level, your score is increased by 10 and you are reset back to the original starting point. 
The game itself is built using basic html5, css, javascript and the canvas API. Service worker is used for caching the game files locally on the browser so that it can be fetched and loaded using a script when connection is down.
&nbsp;
##### *__Offline Testing__*
To test if the game is correctly being cached and loaded when connection is lost, visit the live site hosted on [Github Pages.](https://niranjan-gurung.github.io/) The initial html loaded is a dummy page representing the official SkyBet website. On the landing page press F12(inspect element), navigate to the application tab on the top row, then the service workers tab on the left and tick offline. Refresh the page to simulate an offline environment and the canvas game will load in, available for you to play. In the same row you'll find a cache storage tab, which you can check to see if all appropriate files have been cached to the browser. All the files listed under that tab will be loaded in offline mode.
&nbsp;
##### *__Access Repository__*
- *To download this github repo click the green `Code` drop down, select download ZIP and extract the contents on your machine.*
- *Alternatively use the following git commands in the terminal to initialise a local repo and clone the project:*
```git init```
```git clone https://github.com/niranjan-gurung/niranjan-gurung.github.io.git```
&nbsp;
>__Site hosting the final application *https://niranjan-gurung.github.io/*__