// Description:
//    Channel-separated quote system, IRC style.
//
// Dependencies:
//    None
//
// Configuration:
//    None
//
// Commands:
//    hubot quote add <text> - Adds a quote to the database
//    hubot quote by <user> - Returns the quotes added by user <user>
//    hubot quote get <id> - Returns quote #id
//    hubot quote random - Returns a random quote
//    hubot quote remove <id> - Removes quote #id
//    hubot quote search <text> - Returns the quotes containing <text>
//    hubot quote stats - Returns the number of quotes in the database
//
// Author:
//    veggiematts

module.exports = (robot) => {

    var quotes = new Array();

    robot.brain.on("connected", () => {
        robot.brain.data.channelquotes = robot.brain.data.channelquotes || [];
        robot.brain.data.channelquotes.forEach((item,index) => {
            if (!quotes[item.room]) {
                quotes[item.room] = new Array();
            }
            quotes[item.room].push(item);
        })
    })

    robot.respond(/quote add\s?(.*)+$/i, (res) => {
        room = res.message.room;
        user = res.envelope.user.name;
        checkChannel(room);
        if (res.match[1]) {
            newquote = { 'quote': res.match[1], 'user': user, "date": Date.now(), "room": room };
            quotes[room].push(newquote);
            robot.brain.data.channelquotes.push(newquote);
            res.send("Quote #" + quotes[room].length + ' added! "' + res.match[1] + '"');
        } else {
            res.send("Usage: quote add <text>");
        }
    })

    robot.respond(/quote get (\d+)/i, (res) => {
        room = res.message.room;
        id = res.match[1];
        checkChannel(room);
        quote = quotes[room][id - 1];
        res.send(formatQuote(quote));
    })

    robot.respond(/quote random/gi, (res) => {
        room = res.message.room;
        checkChannel(room);
        if (quotes[room].length == 0) { return; }
        id = Math.ceil(Math.random() * quotes[room].length)
        quote = quotes[room][id - 1];
        res.send(formatQuote(quote));
    })

    robot.respond(/quote remove (\d+)/i, (res) => {
        id = res.match[1];
        checkChannel(room);
        if (quotes[room].length == 0) { return; }
        if (quotes[room][id - 1]) {
            quotes[room].splice(id - 1, 1);
            res.send("Quote #" + id + " removed.");
            saveQuotes();
        } else {
            res.send("Quote #" + id + " does not exist.");
        }
    })

    robot.respond(/quote (search|by)\s?(.*)+$/i, (res) => {
        room = res.message.room;
        user = res.envelope.user.name;
        checkChannel(room);
        if (res.match[2]) {
            var foundquotes = Array();
            var searchreg = new RegExp(res.match[2],"i");
            quotes[room].forEach((item,index) => {
                if ((res.match[1] == 'search' && item.quote.match(searchreg)) ||
                     res.match[1] == 'by' && item.user == res.match[2]) {
                    foundquotes.push('#' + (index + 1) + ': "' + (item.quote.length > 50 ? item.quote.substring(0, 50) + '...' : item.quote) + '"');
                }
            })
            if (foundquotes.length > 0) {
                reply = foundquotes.length + " found: " + foundquotes.join(", ");;
                res.send(reply);
            } else {
                res.send("No matching quotes were found.");
            }
        }
    })

    robot.respond(/quote stats/i, (res) => {
        room = res.message.room;
        checkChannel(room);
        res.send("There are " + quotes[room].length + " quotes in the database.");
    })

    // DANGER ZONE
    /*
    // Removes all quotes from all channels from the database
    robot.respond(/quote wipe/i, (res) => {
        robot.brain.data.channelquotes = [];
        quotes = [];
    })

    // Imports a supybot/limnoria Quote file
    // Warning: this will removes all quotes from the current channel from the database
    robot.respond(/quote loadfile/i, (res) => {
        room = res.message.room;
        user = res.envelope.user.name;
        var fs = require('fs');
        var filename = '/path/to/Quote.flat.db';
        quotes[room] = Array();
        require('fs').readFileSync(filename, 'utf-8').split(/\r?\n/).forEach(function(line) {
            var timestamp = line.substring(7,17) * 1000;
            var quote = line.substring(nthIndex(line, ',', 2) + 1);
            quote = quote.replace(/^\"\"\"/, '');
            quote = quote.replace(/\"\"\"$/, '');
            quote = quote.replace(/^\"\"/, '');
            quote = quote.replace(/\"\"$/, '');
            quote = quote.replace(/^\"\'/, '');
            quote = quote.replace(/\"\'$/, '');
            quote = quote.replace(/^\'/, '');
            quote = quote.replace(/\'$/, '');
            newquote = { 'quote': quote, 'user': '[unknown]', "date": timestamp, "room": room }; 
            quotes[room].push(newquote);
        });
        saveQuotes();
    })

    function nthIndex(str, pat, n){
        var L= str.length, i= -1;
        while(n-- && i++<L){
            i= str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }
    */

    function saveQuotes() {
        var tmpQuotes = Array();
        for (var room in quotes) {
            quotes[room].forEach((item,index) => {
                tmpQuotes.push(item);
            })
        }
        robot.brain.data.channelquotes = tmpQuotes;
    }

    function checkChannel(room) {
        if (!quotes[room]) {
            quotes[room] = new Array();
        }
    }

    function formatQuote(quote) {
        return quote ?
            "Quote #" + id + ': "' + quote.quote + '" (added by ' + quote.user + ' at ' + new Date (quote.date).toLocaleString() + ')' :
            "Quote #" + id + " does not exist.";
    }
}
