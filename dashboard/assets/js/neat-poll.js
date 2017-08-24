(() => {
	'use strict';

	// Button
	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
	const announce = document.getElementById('announce');

	// eslint-disable-next-line new-cap
	let currentPoll = nodecg.Replicant('poll');

	// eslint-disable-next-line new-cap
	let chatAnnounce = nodecg.Replicant('announce');

	start.addEventListener('click', () => {
		nodecg.readReplicant('poll', 'nospoone-poll', value => {
			const pollValue = value;
			pollValue.active = true;
			pollValue.startedAt = Date.now();
			pollValue.duration = (!isNaN(document.getElementById('expires').value) && parseInt(document.getElementById('expires').value, 10) > 0) ? parseInt(document.getElementById('expires').value > 0, 10) * 1000 : -1;
			pollValue.question = document.getElementById('question').value;
			pollValue.answers = [document.getElementById('a').value, document.getElementById('b').value, document.getElementById('c').value, document.getElementById('d').value].filter(answer => answer !== undefined && answer.length > 0);
			let answerCount = [];
			pollValue.answers.forEach(() => {
				answerCount.push(0);
			});
			pollValue.answerCount = answerCount;
			currentPoll.value = pollValue;
		});
	});

	stop.addEventListener('click', () => {
		currentPoll.value.active = false;
	});

	nodecg.readReplicant('announce', 'nospoone-poll', value => {
		if (value) {
			announce.setAttribute('checked', true);
		}
	});

	announce.addEventListener('change', e => {
		chatAnnounce.value = e.target.checked;
	});
})();
