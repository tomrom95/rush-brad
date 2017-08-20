# rush-brad

Recruitment web app written with React.js and Firebase

# Development

## Initialization
To initialize the app, follow the following steps. You'll need to have permissions on the firebase app to do this.

1. `git clone https://github.com/tomrom95/rush-brad.git`
2. If you have access to the private scripts folder, add it as `app/scripts`
3. Run `npm install` to install all app dependencies
4. Run `npm install -g firebase-tools webpack http-server` to install global developer tools
5. To bundle the app and run it in development, run `npm start`, or `webpack` if you just want to bundle the app
6. To deploy the app, run `firebase deploy`. This will send the app to firebase to serve it.

If you are using this app with your own firebase app, then edit the config in `app/App.js`

## Adding users and rush chairs

Users can be added to the site by adding their facebook profile as **testers** to the rush-brad Facebook Developers app. This app can be changed in the firebase developers console.

To change a user to be a rush chair, or 'admin', then go to the project database console, `https://console.firebase.google.com/project/**YOUR APP**/database/data/users`, find the user and add the field/value `admin: true` to them. Then they have access to things like marking a rushee as cut.

## Switching rounds

Currently this is not integrated into the hosted site, and is instead a manual script. If you have access, run `node scripts/NextRound.js`. This will mark all the cut rushees as cut and change the other rushees back to a neutral round status. The cut rushees are not removed from the database, so you can get them back by going to the firebase console.

## Other Notes
The app is entirely written in ReactJS with the components in `app/components`. The routes can be found in `app/config/routes.js`. To add a new feature, simply add a component and link it in the routes if need be.

For tips on reading and writing to firebase, go to https://firebase.google.com/docs/database/web/read-and-write .

