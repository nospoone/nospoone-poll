(() => {
	'use strict';

	// Button
	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
	const announce = document.getElementById('announce');
	const expires = document.querySelector('label.expires');
	const expiresTime = document.querySelector('label.expires span');

	// eslint-disable-next-line new-cap
	let currentPoll = nodecg.Replicant('poll');

	// eslint-disable-next-line new-cap
	let chatAnnounce = nodecg.Replicant('announce');

	let durationInterval;

	start.addEventListener('click', () => {
		nodecg.readReplicant('poll', 'nospoone-poll', value => {
			const pollValue = value;
			pollValue.active = true;
			pollValue.startedAt = Date.now();
			pollValue.duration = (!isNaN(document.getElementById('expires').value) && parseInt(document.getElementById('expires').value, 10) > 0) ? parseInt(document.getElementById('expires').value, 10) * 1000 * 60 : -1;
			pollValue.question = document.getElementById('question').value;
			pollValue.answers = [document.getElementById('a').value, document.getElementById('b').value, document.getElementById('c').value, document.getElementById('d').value].filter(answer => answer !== undefined && answer.length > 0);
			pollValue.participants = [];
			let answerCount = [];
			pollValue.answers.forEach(() => {
				answerCount.push(0);
			});
			pollValue.answerCount = answerCount;
			pollValue.totalAnswers = 0;
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

	currentPoll.on('change', newValue => {
		clearInterval(durationInterval);
		if (newValue.active) {
			expires.style.display = 'block';
			start.disabled = true;
			stop.disabled = false;
			changeStateAll(true);
			expiresTime.innerHTML = moment(newValue.startedAt).add(newValue.duration).fromNow();
			durationInterval = setInterval(() => {
				expiresTime.innerHTML = moment(newValue.startedAt).add(newValue.duration).fromNow();
			}, 1000);
		} else {
			start.disabled = false;
			stop.disabled = true;
			changeStateAll(false);
			expires.style.display = 'none';
		}
	});

	function changeStateAll(state) {
		announce.disabled = state;
		document.getElementById('expires').disabled = state;
		document.getElementById('question').disabled = state;
		document.getElementById('a').disabled = state;
		document.getElementById('b').disabled = state;
		document.getElementById('c').disabled = state;
		document.getElementById('d').disabled = state;
	}
})();

