'use strict';

// Values pulled from cfg/nospoone-poll.json
const tmiConfig = {
	options: {
		clientId: ''
	},
	identity: {
		username: '',
		password: ''
	},
	channels: []
};

// Requires
const EventEmitter = require('events').EventEmitter;
const chalk = require('chalk');
const tmi = require('tmi.js');

// Fields
const indexToLetter = 'ABCD';
let activePollTimeout;

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig || !Object.keys(nodecg.bundleConfig).length > 0) {
		// TODO: better error handling
		nodecg.log.error('Missing or invalid config file (cfg/nospoone-poll.json), aborting...');
		return;
	}

	const self = new EventEmitter();
	tmiConfig.options.clientId = nodecg.bundleConfig.clientId;
	tmiConfig.identity.username = nodecg.bundleConfig.username;
	tmiConfig.identity.password = nodecg.bundleConfig.password;
	tmiConfig.channels.push(nodecg.bundleConfig.channel);

	// eslint-disable-next-line new-cap
	const client = new tmi.client(tmiConfig);
	// eslint-disable-next-line new-cap
	const poll = nodecg.Replicant('poll');
	// eslint-disable-next-line new-cap
	const announce = nodecg.Replicant('announce', {
		defaultValue: false
	});

	// Connect the client to the server..
	client.connect().then(() => {
		nodecg.log.info(`${chalk.yellow('monanbot')} connected to ${nodecg.bundleConfig.channel}.`);
	});

	client.on('chat', (channel, user, message) => {
		if (poll.value.active && message.startsWith('!poll ')) {
			const answerIndex = indexToLetter.indexOf(message.substring(6).toUpperCase().trim());
			if (answerIndex !== -1 && nodecg.readReplicant('poll').answers[parseInt(answerIndex, 10)] !== undefined) {
				addAnswer(parseInt(answerIndex, 10));
				self.emit('answer', parseInt(answerIndex, 10));
				nodecg.log.info(`[${channel}] ${user['display-name']} answered the poll: ${poll.value.answers[parseInt(answerIndex, 10)]} (${message.substring(6).toUpperCase().trim()})`);
			}
		}
	});

	poll.on('change', (newValue, oldValue) => {
		if (oldValue === undefined) {
			return;
		}

		if (activePollTimeout !== undefined) {
			clearTimeout(activePollTimeout);
		}

		if (newValue.duration !== -1) {
			setTimeout(closePoll, newValue.duration);
		}

		// Announce in chat if needed
		if (nodecg.readReplicant('announce')) {
			if (newValue.active && !oldValue.active) {
				client.say(nodecg.bundleConfig.channel, `Poll time! The question is: ${newValue.question}.`);
			} else if (!newValue.active && oldValue.active) {
				client.say(nodecg.bundleConfig.channel, `Poll over! The winner is answer ${indexToLetter[newValue.winner]} with ${newValue.answerPercentages[newValue.winner]}% of the votes!`);
			}
		}
	});

	function closePoll() {
		if (activePollTimeout !== undefined) {
			clearTimeout(activePollTimeout);
		}

		poll.value.active = false;
	}

	function addAnswer(answerIndex) {
		const pollValues = nodecg.readReplicant('poll');

		pollValues.answerCount[answerIndex]++;

		let winningAmount = 0;
		pollValues.totalAnswers = 0;
		pollValues.answerCount.forEach((count, index) => {
			pollValues.totalAnswers += count;
			if (winningAmount < count) {
				pollValues.winner = index;
			}
		});

		for (var i = 0; i < pollValues.answerCount.length; i++) {
			pollValues.answerPercentages[i] = Number((pollValues.answerCount[i] / pollValues.totalAnswers).toFixed(2)) * 100;
		}

		poll.value = pollValues;
	}
};
