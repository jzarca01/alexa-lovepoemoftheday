const alexaSkillKit = require('alexa-skill-kit');
const fetch = require('node-fetch');

const apiUrl = "http://poetrydb.org/lines,linecount/love;2/author,title,lines.json";

function getLovePoetryOfTheDay(url) {
    return fetch(url).then(res => {
        return res.json();
    }).then(response => {
        return response.filter(poem => poem.lines.length < 30);
    })
    .then(response => {
        var numberOfPoems = response.length;
        var randomPoemId = (Math.random() * numberOfPoems - 1).toFixed();
        return response[randomPoemId];
    });
}

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
      return getLovePoetryOfTheDay(apiUrl).then(poem => {
          return {
                version: '1.0',
                response: {
                    shouldEndSession: true,
                    outputSpeech: {
                    type: 'PlainText',
                    text: poem.lines.join(" ")
                },
                card: {
                    type: 'Simple',
                    title: `${poem.author} - ${poem.title}`,
                    content: poem.lines.join(" ")
                }
            }
        }
      }) 
  })
};
