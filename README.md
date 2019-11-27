## ngx-domoboard [![Build Status](https://travis-ci.org/domoticz/ngx-domoboard.svg?branch=master)](https://travis-ci.org/domoticz/ngx-domoboard)

# Manage your [Domoticz](https://www.domoticz.com/) devices

<p align="center">
  <img src="https://github.com/domoticz/ngx-domoboard/blob/master/src/assets/images/ScreenND_1.PNG">
  <img src="https://github.com/domoticz/ngx-domoboard/blob/master/src/assets/images/ScreenND_2.PNG">
</p>

# Table of contents

- [Domoticz](#domoticz)
- [PWA](#pwa)
- [Nebular](#nebular)
- [ngx-admin](#ngx-admin)
- [Requirements](#requirements)
- [Personal data](#personal-data)
- [Getting started](#getting-started)
- [Features](#features)
- [WIP Features](#wip-features)
- [BIY - Build It Yourself](#biy---build-it-yourself)

## [Domoticz](https://www.domoticz.com/)

Domoticz is a very light weight home automation system that lets you monitor and configure various devices like: lights, switches, various sensors/meters like temperature, rainfall, wind, Ultraviolet (UV) radiation, electricity usage/production, gas consumption, water consumption and much more.

## PWA

PWAs (Progressive Web Apps) are a mean to reach native-like experience with web-based technologies (HTML, JS, CSS). To know more about PWA: https://developers.google.com/web/progressive-web-apps/.

## [Nebular](https://akveo.github.io/nebular/)

Nebular is a customizable Angular UI Library based on [Eva Design System](https://eva.design/) specifications, with 40+ UI components, 4 visual themes, Auth and Security modules.

## [ngx-admin](https://akveo.github.io/ngx-admin/)

Customizable admin dashboard template based on Angular 8+ and using Nebular.

## Requirements

- A [Domoticz](https://www.domoticz.com/) server running on your home network.
- An access to the server over https with a valid certificate (https://www.domoticz.com/wiki/Native_secure_access_with_Lets_Encrypt) if you want to access the [production](https://domoticz.github.io/ngx-domoboard/) app and unleash the power of PWA.

## Personal data

- The project is thought for personal data protection with the use of [Fathom](https://usefathom.com/), "a more privacy-focused alternative to Google Analytics".

- Every user input is also stored locally in the browser for convenience, never in a database on a server located wherever in the world, which means that no one has access to the user data except for the user.

- Self-hosted domoticz build does not include calls to the [Fathom](https://usefathom.com/) server.

## Getting started

- Click the green gear at the top (mobile) or right (desktop) of the screen:

<p align="center">
  <img src="https://github.com/domoticz/ngx-domoboard/blob/master/src/assets/images/ScreenND_3.PNG">
</p>

- Fill the form with your server infos.
- Once the app gets a valid response from the server, the form will turn green and Domoticz version and status will appear at the bottom:

<p align="center">
  <img src="https://github.com/domoticz/ngx-domoboard/blob/master/src/assets/images/ScreenND_4.png">
</p>

- Devices should now appear on pages Switches and/or Temperature.
- To install the app, trigger the Add to Home Screen option on your device.

## Features

- Toggle switchable devices.
- Change the name of your device on your [Domoticz](https://www.domoticz.com/) server.
- Choose the app icon for your device in [Eva icons](https://akveo.github.io/eva-icons/#/).
- Push Notifications on device status change (Windows and Android).
- Dim level
- Color picker
- Color temperature
- Temperature graphs

## WIP Features

- Switch devices history

## BIY - Build It Yourself

Once you've cloned/downloaded the repo, you'll be able to generate a build and deploy the app on a web server given you've already installed [nodejs](https://nodejs.org/en/) and npm. The build folder is called 'dist' and can be found at the root of the project. First, you'll need to install the dependencies powering the app by heading to the root of the project and run:

```
npm install
```

To start a dev environment, run:

```
npm run start
```

The app will be served at localhost:4200. To get the default production build that you can find at https://domoticz.github.io/ngx-domoboard/:

```
npm run build
```

Now, one of the motivation for a local build is to have your domoticz web server work the app. To get the domoticz-friendly build:

```
npm run build:domoticz
```

You'll then have to copy the content of the 'dist' folder in the /domoticz/www/ folder where your domoticz system is installed. You should then be able to access the app at:

```
http(s)://ip_domoticz:port/ngx-domoboard/
```

Note that you'll likely not be able to register the service worker by deploying in the domoticz web server. That means that your app will not have the features of a PWA like increase performance, automatic update notifications and push notifications.
