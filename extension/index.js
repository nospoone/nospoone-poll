'use strict';

const pollDefaultValues = {
	active: false,
	startedAt: null,
	duration: null,
	question: '',
	answers: [],
	answerCount: [],
	answerPercentages: [],
	totalAnswers: 0,
	winner: -1
};

module.exports = function (nodecg) {
	const currentPoll = nodecg.Replicant('poll', {
		defaultValue: Object.assign({}, pollDefaultValues),
		persistent: false
	});
	const chatInterface = require('./chat-interface')(nodecg);
};
