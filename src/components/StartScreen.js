import React from 'react';
import { quizCategories } from '../data/quizCategories';

export default function StartScreen(props) {

	function setSettings(e) {
		const { name, value } = e.target;
		props.setGameOptions(prevGameOptions => ({
			...prevGameOptions,
			[name]: value,
		}));
	}

	return (
		<div className='start-container'>
			<h1 className='start-container-title'>Quizzical</h1>
			<h2 className='start-container-subtitle'>Welcome to Quizzical React App! Answer the questions and try your best. Questions taken from the free Trivia database.</h2>
			<div className='start-setting-container'>
				<div className="setting">
					<label htmlFor="category">Category:</label>
					<select
						value={props.gameOptions.category}
						onChange={e => setSettings(e)}
						name="category"
					>
						<option value="">Any Category</option>
						{quizCategories.map(cat => {
							return (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							);
						})}
					</select>
				</div>
				<div className="setting">
					<label htmlFor="difficulty">Difficulty:</label>
					<select
						value={props.gameOptions.difficulty}
						onChange={e => setSettings(e)}
						name="difficulty"
					>
						<option value="">Any Difficulty</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>
				<div className="setting">
					<label htmlFor="type">Questions Type:</label>
					<select
						value={props.gameOptions.type}
						onChange={e => setSettings(e)}
						name="type"
					>
						<option value="">Any Type</option>
						<option value="multiple">Multiple Choice</option>
						<option value="boolean">True / False</option>
					</select>
				</div>
			</div>
			<div className='start-button-container'>
				<button className='leaderboard-button' onClick={props.showLeaderboard}>Leaderboard</button>
				<button className='start-container-button' onClick={props.startQuiz}>Start Quiz</button>
			</div>
		</div>
	)
}