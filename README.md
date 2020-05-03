# hubot-channel-quotes

A channel-separated quote system, IRC style.

This script was made to be as close as possible to the Supybot/Limnoria Quote plugin.

See [`src/channel-quotes.js`](src/channel-quotes.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-channel-quotes --save`

Then add **hubot-channel-quotes** to your `external-scripts.json`:

```json
[
  "hubot-channel-quotes"
]
```

You will need a persistance script for your hubot brain if you want the quotes to be kept across restarts, like [hubot-redis-brain](https://github.com/hubotio/hubot-redis-brain) or [hubot-file-brain](https://github.com/throneless-tech/hubot-file-brain).

## Commands
    - hubot quote add <text> - Adds a quote to the database
    - hubot quote by <user> - Returns the quotes added by user <user>
    - hubot quote get <id> - Returns quote #id
    - hubot quote random - Returns a random quote
    - hubot quote remove <id> - Removes quote #id
    - hubot quote search <text> - Returns the quotes containing <text>
    - hubot quote stats - Returns the number of quotes in the database

Some commands are disabled by default, uncomment them in the code if you want to use them:

    - hubot quote wipe - Removes all quotes from all channels from the database
    - hubot loadfile - Imports a Supybot/Limnoria Quote file
