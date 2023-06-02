const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const express = require('express');
const bodyParser =  require('body-parser');
const app = express();

app.use( express.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use( express.static('static') ); // static file serving folder
app.set('view engine', 'ejs'); // EJS is an awesome templating engine

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/chat', async (req, res) => {
	console.log('/chat', `"${req.body.ai_input}"`);
	let ai_output = 'You must provide an input';

	if ( req.body.ai_input.trim().length > 10 ) { // verify they've sent something
		ai_output = await runCompletion(req.body.ai_input);
	}

	res.json({ 'ai_output': ai_output });
});

async function runCompletion(input) {
	let completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'user', 'content': input }
		]
	});

	try {
		return completion.data.choices[0].message.content;
	} catch(e) {
		console.error(`ChatGPT Error: ${e}`);
		return `There was an error. ${e}`;
	}
}

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Web Server starting on ${port}`));