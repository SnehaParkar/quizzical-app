import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

import blob1 from './images/blob.png';
import blob2 from './images/bottom-blob.png';
import blob3 from './images/upper-blob.png';

import ReactConfetti from "react-confetti";
import Footer from './components/Footer';
import StartScreen from './components/StartScreen';
import Leaderboard from './components/Leaderboard';
import Quest from './components/Quest';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  // USE STATE 
  const [isShowStartScreen, setIsShowStartScreen] = React.useState(true);
  const [isShowLeaderboard, setIsShowLeaderboard] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [allComplete, setAllComplete] = React.useState(false);
  const [gameOptions, setGameOptions] = React.useState(
    {
      category: "",
      difficulty: "",
      type: ""
    }
  );

  const { category, difficulty, type } = gameOptions;
  let categoryQueryParam = "";
  let difficultyQueryParam = "";
  let typeQueryParam = "";

  // console.log("App rendered !", questions, showAnswers, isShowStartScreen);

  const INITIAL_SCORES = {
    lastGames: [],
    totalGames: 0,
    totalAnswers: 0,
    totalCorrect: 0,
    totalWrong: 0,
  }
  const [leaderboardScores, setLeaderboardScores] = useLocalStorage("leaderboardScores", INITIAL_SCORES);


  // Use Effect
  React.useEffect(() => {
    setLeaderboardScores(leaderboardScores);
  }, [leaderboardScores])

  // API Call
  React.useEffect(() => {
    if (isShowStartScreen === false) {
      console.log("USE EFFECT : Get Questions !");
      async function getQuestions() {
        if (category !== "")
          categoryQueryParam = `&category=${category}`;

        if (difficulty !== "")
          difficultyQueryParam = `&difficulty=${difficulty}`;

        if (type !== "")
          typeQueryParam = `&type=${type}`;

        let apiUrl = `https://opentdb.com/api.php?amount=5${categoryQueryParam}${difficultyQueryParam}${typeQueryParam}`;

        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log(data);

        setQuestions(data.results.map((question) => {
          let allChoices = [],
            choices = [...question.incorrect_answers];
          choices.splice(
            randomIndex(question.incorrect_answers.length),
            0,
            question.correct_answer
          )
          allChoices = choices.map((choice, i) => ({ id: i, text: choice, selected: false }))
          return ({
            question: question.question,
            selected_answer: undefined,
            correct_answer: question.correct_answer,
            options: allChoices,
          })
        }));
      }
      getQuestions();
    }
  }, [isShowStartScreen])

  //calculate score
  React.useEffect(() => {
    console.log("USE EFFECT : Calculate score !")
    var count = 0;
    questions.map((question) => {
      if (typeof question.selected_answer !== 'undefined') {
        if (question.selected_answer === question.correct_answer)
          count++;
      }
    })
    setScore(count);
  }, [showAnswers]);

  // Set All complete by checking each questions selected_answer status
  React.useEffect(() => {
    var isAllComplete = questions.every((quest) => {
      return (typeof quest.selected_answer !== 'undefined')
    });
    setAllComplete(isAllComplete);
  }, [questions])


  //===========================================
  //            Event Callbacks
  //===========================================

  function startQuiz() {
    setIsShowStartScreen(false);
    console.log("Start Quiz !", isShowStartScreen);
  }

  function goBackToStartScreen() {
    setIsShowStartScreen(true);
    console.log("Back to Start Quiz !", isShowStartScreen);
  }

  function hideLeaderboard() {
    setIsShowLeaderboard(false);
  }

  function showLeaderboard() {
    setIsShowLeaderboard(true);
  }

  function playAgain() {
    setShowAnswers(false);
    setAllComplete(false);
    setIsShowStartScreen(true);
    console.log("play again !", isShowStartScreen, showAnswers);
  }

  function checkAnswers() {
    setShowAnswers(true);
    console.log("Show answers !", showAnswers);
    let correct = 0,
      wrong = 0;

    questions.map((question) => {
      if (typeof question.selected_answer !== 'undefined') {
        if (question.selected_answer === question.correct_answer)
          correct++;
        else
          wrong++;
      }
    })

    setLeaderboardScores(prevLeaderboardScores => {
      return ({
        lastGames: [...prevLeaderboardScores.lastGames,
        {
          date: new Date().toLocaleString(),
          questions: questions.length,
          correct: correct,
          wrong: wrong,
        },],
        totalGames: prevLeaderboardScores.totalGames + 1,
        totalAnswers: prevLeaderboardScores.totalAnswers + (correct + wrong),
        totalCorrect: prevLeaderboardScores.totalCorrect + correct,
        totalWrong: prevLeaderboardScores.totalWrong + wrong,
      })
    });
  }

  function setSelectedChoice(question, option_id) {
    let allChoices = question.options.map((opt) =>
      (opt.id === option_id) ?
        { ...opt, selected: true } :
        { ...opt, selected: false }
    )
    return allChoices;
  }

  function selectAnswer(event, quest_id, option_id) {
    setQuestions(questions.map((question, id) => {
      if (id === quest_id) {
        let allChoices = setSelectedChoice(question, option_id)
        return ({
          question: question.question,
          selected_answer: allChoices[option_id].text,
          correct_answer: question.correct_answer,
          options: allChoices,
        })
      } else
        return (question)
    }));
  }

  function randomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  /////////////////////////////////////////////////////////////////

  const quests = questions.map((question, id) => {
    return (<Quest
      key={id}
      id={id}
      question={question}
      showAnswers={showAnswers}
      selectAnswer={selectAnswer}
    />)
  })

  return (
    <div className="App">
      {isShowStartScreen ?
        isShowLeaderboard ?
          <Leaderboard hideLeaderboard={hideLeaderboard} leaderboardScores={leaderboardScores} setLeaderboardScores={setLeaderboardScores} /> :
          <StartScreen startQuiz={startQuiz} showLeaderboard={showLeaderboard} gameOptions={gameOptions} setGameOptions={setGameOptions} /> :
        <div className='quiz-container'>
          {showAnswers && <ReactConfetti />}
          <button className='button back-button' onClick={goBackToStartScreen}>Back</button>
          {quests}
          {showAnswers ?
            <div className='button-container'>
              <h3 className='button-container-score'>{"You scored " + score + "/5 correct answers"}</h3>
              <button className='button' onClick={playAgain}>Play Again</button>
            </div> :
            <button className='button' disabled={!allComplete} onClick={checkAnswers}>Check Answers</button>
          }
        </div>}

      <img className='blob blob1' src={blob1} alt='' />
      <img className='blob blob2' src={blob2} alt='' />
      <img className='blob blob3' src={blob3} alt='' />
      <Footer />
    </div>
  );
}

export default App;
