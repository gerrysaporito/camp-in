# Camp In

![alt text](./assets/campgrounds.PNG 'Camp In's homepage')

## Introduction 🎩

This is campsite reviewing web platform that allows users to review campsites they have been to.

## Description 📝

This repository is a monolithic web platform built with Javascript & MongoDB, Express, Embedded Javascript (eJS), and Node
It is built using the Model-View-Controller (MVC) framework.

### INSPIRATION ✨

Before I go to a new place for the first time, I always like to check the reviews to see how other's experiences went. The same thing should go for campsites; I don't want to go to a dangeorus campground with bear warnings or unswimmable lake water!

In response to my fears of picking a bad campsite for my annual family hiking vacations, I worked on making a review site for campgrounds. With this web application out there, a person who loves camping and hiking never has to worry about choosing an adequate or avoiding dangerous locations ever again, and can see where the best places are during this season!

This app is the very first full stack I have ever created, as part of a Udemy capstone project. As it is my first real full stack project, I went through a lot of frustrating times and even with the tutorial it still took me 3 weeks to build this thing 😅.

Even still, I am really proud of myself for being able to build something like this. Without this project, I never would have discovered how much I loved developing. This project led the foundation of my knowledge and curiousity as a software engineer.

### Learning Experience 📚

I built this app using the course technologies as found below:

- [MongoDB]()
- [Express](https://expressjs.com/)
- [Embedded Javascript]() (ejs)
- [Node](https://nodejs.org/en/)

When it comes to learnings, I don't know where to start. I learned an incredible amount from this project. I learned about a broad range of fundamental topics such as the MVC architecture, JSON, HTTP requests, databases... the list goes on and on.

## Getting Started 🏁

### Requirements ✅

- Node & npm
- PostgreSQL or SQL alternative
- Working knowledge of AWS (to set up S3)

### Installation 💾

1. Download this repository
2. Open a command line window, navigate to this folder & run `npm run start`
3. Go to [http://localhost:3000](http://localhost:3000)

### Notes 🖍

- If you try to open the url in chrome and you get a 'this connection is not safe', click anywhere on the page and type the phrase `thisisunsafe` to bypass security

## Features 🧩

This app has the following functionalities:

- Sign in/up
- Add a campsite to the repository
- View a single or all campsites & general information from the repository
- Post reviews for campsites
- Rate campsites on a scale of 1-5 stars
- Update & delete campsites & reviews you've posted

## Roadmap 🗺

This app is a fully functioning review platform but it is pretty bare bones. To build on this, there are a few features I'd like to see:

- Location via google map integration for each campsite
- Points/reputation system for users to build credibility on their reviews
- Tags for easier and cleaner search experiences

Aside from that, there are a lot of security features that should be implemented to fight against bots making fake accounts and flooding certain campsites and exposed endpoints.

Also unit & integration tests should be created to build out a proper testing pipeline. Doing so would save time testing and prevent careless bugs to be reintroduced into the codebase.

## Edge Cases ⚠️

Because this app was created by following instructors, most of the kinks are already fleshed out. There aren't too many edge cases but below are a few I was able to identify.

### Load Testing 🚩

Because this app isn't as optimized as it could be, heavy loads could cause slow responses from the API.

To help with this, adding mongoose hooks to schemas can marginally reduce the amount of database requests going through.

### Notes 🖍

This is by no means an exhaustive list but only a few of the more critical points.
