const alexaSkillKit = require('alexa-skill-kit');
const fetch = require('node-fetch');

const apiUrl = "http://poetrydb.org/lines,linecount/love;2/lines.json";

function getLovePoetryOfTheDay(url) {
    return fetch(url).then(res => {
        return res.json();
    }).then(response => {
        var numberOfPoems = response.length;
        var randomPoemId = (Math.random() * numberOfPoems - 1).toFixed();
        return response[randomPoemId];
    })
    .then(poem => {
        return poem.lines.join(" ");
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
                    text: poem
                },
                card: {
                    type: 'Simple',
                    title: 'Simple Card',
                    content: 'An example for a simple card reply'
                }
            }
        }
      }) 
  })
};
