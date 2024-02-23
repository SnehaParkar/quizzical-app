import React from 'react'

export default function Quest(props) {

	function setClassName(option) {
		if (props.showAnswers === true) {
			if (props.question.correct_answer === option.text) {
				return "correct-option";
			} else
				return option.selected ? "incorrect-option" : "normal-option";
		} else {
			return option.selected ? "selected-option" : "normal-option";
		}
	}

	const options = props.question.options.map((option) => {
		// console.log(option);
		return (<button
			key={option.id}
			onClick={(event) => props.selectAnswer(event, props.id, option.id)}
			disabled={props.showAnswers}
			className={`quiz-container-question-options-container-option ${setClassName(option)}`}
			dangerouslySetInnerHTML={{ __html: option.text }}></button>)
	})

	return (
		<div className='quiz-container-question' >
			<h1 className='quiz-container-question-title' dangerouslySetInnerHTML={{ __html: props.question.question }}></h1>
			<div className='quiz-container-question-options-container'>{options}</div>
			<hr className='quiz-container-question-divider' />
		</div>
	)
}