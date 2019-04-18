# Major Project Proposal - Jelanye's Cookie Clicker
I am going to be creating a game that will, at the core, be very similar to cookie clicker. There will be a big cookie that can be clicked in the center of the screen to get cookies, upgrades to get cookies per second, etc. However, I will add several more elements to make the game more fun and interactive. Players will have the option to play mini-games to earn extra cookies. Players will be able to purchase weapons and other items for use in other game modes. I plan to put together the idea of an idle clicker game and an RPG game together, providing a basic narrative and quests or missions the player must complete to progress a storyline. This makes the cookies earned in the game more than just a random, satisfying number.

## Need to have list
### 1: Refactor a large portion of game's back end
- Provide a more robust window manager
- Clean up classes to better incorporate improved mouse priority controller
- Sort classes so code is less messy
- Basically just spend a chunk of time finding where and how the code the game runs on can be optimized

### 2: Create a scaling system that creates a consistently good looking game
I find that in a full-screen, 1920x1080 situation, the game looks good and as expected. However, upon reducing the window size, although things scale properly and stay where they should on the screen, they become too tiny. So,
- Fine-tune calculations providing a similarly good looking game on smaller window sizes
- Incorporate a smart scaling system that does not just scale by some factor of the window width or height

### 3: Rework game intro, add a tutorial
The current functions and classes I am using for the game intro are killing me. I would like to reduce the intro down to classes that are actually useful and can be used elsewhere in the game. Think of RPGs where text boxes are generally rectangles at the bottom of the screen with a character's face on the left and text on the right: this is what I will try to create. So,
- Provide a better intro that utilizes classes that can be used globally in the game
- Program some sort of tutorial to launch right after the intro so new players know what to do

### 4: Add content
With a strong back end at this point and with the classes and functions to support the game, I will add the following content:
- An RPG-esque "game mode" that utilizes cookies earned and items purchased in the basic idle game
- Several mini games for players to play to earn bonus cookies
- Other ways to earn bonus cookies, like random loot drops and maybe a casino-like game
- Use time calculations to allow players to earn cookies/loot while not playing
- A lot of sound effects (I will make them myself in FL Studio)
- Successfully link this game to an non-Github domain (ex. jelanye.com)
- Being able to "prestige" to reset (most of) a player's progress but gain permanent rewards by doing so

### 5: Add mobile mode
Although I do not think I will have the time to successfully port the RPG mode, I would like to:
- Have a way to detect if the player is on a mobile device
- Have a separate scaling system do the scaling if so
- Have this apply to all of the **clicker game aspects**
Having the time to convert everything to be mobile friendly is in the nice to have list. Otherwise, other content will not be accessible by mobile users.

## Nice to have list
- Several different songs (which I will also make myself in FL Studio) to serve as background music in various spots in the game
- An online database to store players' save files and take them from phone to computer, computer to computer, etc.
- Being able to spend cookies on customization like costumes for a character, costumes for the cookie, etc.
- Don't know how it would be possible, but an anti-cheat of sorts (can't type 'cookies = 100000;' into javascript console on page and have it work)
- A more animated game in general ex. cookie does a random spin move sometimes, things randomly fly across the screen sometimes, better button animations on hover, etc.
