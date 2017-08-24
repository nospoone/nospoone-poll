(() => {
	'use strict';

	// eslint-disable-next-line new-cap
	let currentPoll = nodecg.Replicant('poll');

	// elements
	const noPoll = document.querySelector('.no-poll');
	const empty = document.querySelector('.empty');
	const progress = document.querySelector('.progress');

	currentPoll.on('change', newValue => {
		if (newValue.active) {
			if (newValue.totalAnswers === 0) {
				empty.style.display = 'block';
				noPoll.style.display = 'none';
				progress.style.display = 'none';
			} else {
				empty.style.display = 'none';
				noPoll.style.display = 'none';
				progress.style.display = 'block';

				document.querySelector('span.header').innerHTML = newValue.question;
				document.querySelector('.answer-a span.answer').innerHTML = newValue.answers[0];
				document.querySelector('.answer-a span.percent').innerHTML = ` - ${newValue.answerPercentages[0]}%`;
				document.querySelector('.answer-a paper-progress').value = newValue.answerPercentages[0];

				if (newValue.answers[1] !== undefined) {
					document.querySelector('.answer-b span.answer').innerHTML = newValue.answers[1];
					document.querySelector('.answer-b span.percent').innerHTML = ` - ${newValue.answerPercentages[1]}%`;
					document.querySelector('.answer-b paper-progress').value = newValue.answerPercentages[1];
				} else {
					document.querySelector('.answer-b').style.display = 'none';
				}

				if (newValue.answers[2] !== undefined) {
					document.querySelector('.answer-c span.answer').innerHTML = newValue.answers[2];
					document.querySelector('.answer-c span.percent').innerHTML = ` - ${newValue.answerPercentages[2]}%`;
					document.querySelector('.answer-c paper-progress').value = newValue.answerPercentages[2];
				} else {
					document.querySelector('.answer-c').style.display = 'none';
				}

				if (newValue.answers[3] !== undefined) {
					document.querySelector('.answer-d span.answer').innerHTML = newValue.answers[3];
					document.querySelector('.answer-d span.percent').innerHTML = ` - ${newValue.answerPercentages[3]}%`;
					document.querySelector('.answer-d paper-progress').value = newValue.answerPercentages[3];
				} else {
					document.querySelector('.answer-d').style.display = 'none';
				}
			}
		} else {
			empty.style.display = 'none';
			noPoll.style.display = 'block';
			progress.style.display = 'none';
		}
	});
})();
