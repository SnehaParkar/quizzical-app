import React from 'react'

export default function Leaderboard(props) {
	let scores = props.leaderboardScores;

	function resetLeaderboard() {
		props.setLeaderboardScores({
			lastGames: [],
			totalGames: 0,
			totalAnswers: 0,
			totalCorrect: 0,
			totalWrong: 0,
		});
	}

	return (
		<div className='leaderboard-container'>
			<h1 className='leaderboard-title'>Leaderboard</h1>
			<div className='score-container'>
				<h2 className='last-games-title'>Last Games</h2>
				<div className='last-games-container'>
					{scores.lastGames.length > 0 ? (
						scores.lastGames.map((game, i) => {
							return (
								<div key={i} className='game-score-card'>
									<div className="game-ques">Questions: {game.questions}</div>
									<div className="game-correct">Correct: {game.correct}</div>
									<div className="game-wrong">Wrong: {game.wrong}</div>
									<div className="game-date">{game.date}</div>
								</div>
							);
						})
					) : (
						<div className="empty-game-result">No Game Played yet!</div>
					)}
				</div>
				<h2 className="total-results-title">Total Results</h2>

				<div className='total-results-container'>
					<div className="total-games">Games: {scores.totalGames}</div>
					<div className="total-games">Answers: {scores.totalAnswers}</div>
					<div className="total-games">Correct Answers: {scores.totalCorrect}</div>
					<div className="total-games">Wrong Answers: {scores.totalWrong}</div>
				</div>
			</div>
			<div className='leaderboard-button-container'>
				<button className='leaderboard-back-button' onClick={props.hideLeaderboard}>Back</button>

				<button className='leaderboard-reset-button' onClick={resetLeaderboard}>Reset Scores</button>
			</div >
		</div >
	)
}