# Chat app with express and socket.io

## Description

Chat app allows the user to join the room he wants and choose the username to be identified.   
The communication is real time using socket.io as event manager.   
The app updates the new messages for all users in the same room.   
Identifies when user connects and disconnects.   
Allows the user to send his location using the navigator geolocation object.   

## Features

Uses **express** to create and run a basic server.   
**Socket.io** to handle the socket events.   
**bad-words** to filter the messages the user send.   
**Mustache** library in the front en to create the html templates.   
**momnet** javscript library to manage dates and times.   
Also uses **qs** library to parse query params from the url.   

### Screenshots

#### Login page / select username and room
![](https://dessinstudio.com/portfolio-imgs/05_01.png)

#### Room chat / user window
![](https://dessinstudio.com/portfolio-imgs/05_02.png)
![](https://dessinstudio.com/portfolio-imgs/05_03.png)


### How to install and run the app

Download the code, and run `npm install`  
Open the command line console in the app root folder.    
to launch it run `npm run dev`   
The app is setup to run in port 3000 so you can open multiple windows and start chatting.