# Conveyor Belt Milk

This is an infinite scrolling game where you try to collect milk or hop over it 🥛

![Title Screen](/public/sprites/title.png)

This was made with kaplay.js, previously known as kaboom.js. \\
I followed the kaplay tutorial to refresh myself on javascript and \\
I ended up adding a few more features. I kept changing more things \\
until I ended up with this 🐄













## Folder structure 😄

- `src` - source code for your kaplay project
- `dist` - distribution folder, contains your index.html, built js bundle and static assets


## Development

```sh
$ npm run dev
```

will start a dev server at http://localhost:8000

## Distribution

```sh
$ npm run build
```

will build your js files into `dist/`

```sh
$ npm run zip
```

will build your game and package into a .zip file, you can upload to your server or itch.io / newground etc.

## For github pages
- run npm run build and npm run zip
- make repo on github, put your game in there, init git in local etc
- inside of local repo...
- make a folder called .github, then another folder inside called workflows, then a file called deploy.yaml
- copy paste my yaml file content into your yaml file. Change versions if out of date
- add, commit, push to your github repo
- go to github settings, then to pages, under branch and deployment change branch to gh-pages

The workflow yaml does everything 👍
