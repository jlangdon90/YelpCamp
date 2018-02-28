# YelpCamp
Node.js application for testing out the New Relic agent

You'll need to create a .env file containing the following items:

NEW_RELIC_LICENSE_KEY = your license key
MONGO_DB_CONNECTION_STRING

I used a free tier instance of a MongoDB on mlab.com, it's super easy to set up.  You can grab your connection string from there.  Or, you can install MongoDB locally on your machine and point to that instance.  If you're super lazy and don't want to do either of those, you can use my connection string, I guess: mongodb://yelpcamp-gc:admin@ds143907.mlab.com:43907/yelpcamp-gc
