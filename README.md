software_visualizer
===================

This is a nodejs project for visualizing your code


Installation
------------

Extra Requirements Need to Install:
* MongoDB

Create a node environment so when installing you don't have to worry about the
packages on your entire computer. (If you don't have nodeenv, install it first)
```bash
nodeenv software_visualizer
```

Then, go into the environment
```bash
cd software_visualizer
source bin/activate
```

Then, clone the repository onto your computer
```bash
cd src
git clone https://github.com/rhintz42/software_visualizer.git
```

Go into the new folder and install all the required packages
```bash
cd software_visualizer
npm-install
```


Running in Debug Mode
----------------------
Start Node Inspector in the background
```bash
node-inspector &
```

Start your app in debug mode
```bash
nodemon --debug ./bin/www
```
or
```bash
npm start       # I've added this to package.json as an option
```


Open up Browser with Debug console:
`localhost:8080/debug?port=5858`

Open up Browser to your app
`0.0.0.0:3000/`

Profit
