# Tour of Heros (Tested)

This is the Tour of Heroes example app fully tested using best practices. It can be used to learn better ways to test Angular components and services or as reference guide.

These are some of the concepts showcased in this repo:

- Isolating the components
  - Stubbing dependencies
- Isolating tests
  - Avoiding global variables
  - Testing the UI of the components, not the code
  - Reset components and dependencies before using them
  - Faking the clock instead of delaying tests
- Using Jasmine blocks to organize the tests

For more information on testing each individual component check these articles:

- [MessagesComponent](https://medium.com/@SimonTestNet/testing-the-tour-of-heroes-messages-component-bf9d000a1205?source=your_stories_page---------------------------)
- [DashboardComponent](https://blog.simontest.net/testing-the-tour-of-heroes-03-dashboardcomponent-6c996faa5476?source=your_stories_page---------------------------)
- [HeroDetailComponent](https://itnext.io/testing-the-tour-of-heros-herodetailcomponent-447d49494411?source=your_stories_page---------------------------)
- [HeroSearchComponent](https://itnext.io/testing-the-tour-of-heroes-hero-search-component-c5b379e93fd3?source=your_stories_page---------------------------)
- [HeroesComponent](https://medium.com/@SimonTestNet/testing-the-tour-of-heroes-heroes-component-b6c4bdbffa99?source=your_stories_page---------------------------)
- [MessageService](https://blog.simontest.net/testing-the-tour-of-heroes-01-messageservice-f1d735a18692?source=your_stories_page---------------------------)
- [HeroService](https://blog.simontest.net/testing-the-tour-of-heroes-02-heroservice-ead77adeb894?source=your_stories_page---------------------------)

## Get the Code

```
git clone https://github.com/SimonTestNet/TourOfHeroes.git
cd TourOfHeroes
npm i
```

## npm scripts

- `start`: Run the app
- `test`: Run the unit tests using Karma
- `coverage`: Run the tests and generate a coverage report

## Test Generator

https://marketplace.visualstudio.com/items?itemName=SimonTest.simontest
