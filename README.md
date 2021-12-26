# Auto scheduling for arirlines manager
## Instructions
### First time setup
1. (if needed) install node - https://nodejs.org/en/
2. open a terminal and run `npm i`
3. create a `cypress.env.json` file in the root directory (`.../airline-manager`)
add contents, and replacing the `your-username` and `your-password` with your actual usernamd and password:
```
{
    "username": "your-username",
    "password": "your-password"
}
```
### Each start up in a terminal window
1. git pull
2. npm run cypress:open
## or in package.json left click on and run
3. cypress:open
