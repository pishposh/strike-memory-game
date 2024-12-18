import { useEffect, useState } from 'react'
import './App.css'
import { GameSettings } from './components/GameSettings'
import { Header } from './components/Header'
import { InfoDialog } from './components/InfoDialog'
import { PicketSign } from './components/PicketSign'
import { ResultsDialog } from './components/ResultsDialog'
import { Scoreboard } from './components/Scoreboard'
import { TextOrIcon } from './components/TextOrIcon'
import { Game, NewGame } from './game'

function App() {
  const [game, setGame] = useState<Game>(NewGame())
  const [duration, setDuration] = useState('0m 0s')
  const [gameSettingsOpen, setGameSettingsOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(game.getDuration())
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, setDuration, game])

  useEffect(() => {
    let timeout: number | undefined

    if (game.hasFlippedTwoCardsWithoutMatch()) {
      timeout = setTimeout(() => {
        setGame(game.resetUnmatchedCards())
      }, 1000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [game, setGame])

  useEffect(() => {
    let timeout: number | undefined
    if (game.hasMatchAllCards()) {
      timeout = setTimeout(() => setShowDialog(true), 1200)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [game])

  return (
    <>
      <Header>
        <a href="https://nytimesguild.org/tech/guild-builds/">
          <TextOrIcon icon="👾" text="More Games" />
        </a>

        <button onClick={() => setInfoDialogOpen(!infoDialogOpen)}>
          <TextOrIcon icon="❓" text="What's this?" />
        </button>
        <button onClick={() => setGameSettingsOpen(!gameSettingsOpen)}>
          <TextOrIcon icon="⚙️" text="Settings" />
        </button>
        {gameSettingsOpen && (
          <GameSettings
            onClose={() => setGameSettingsOpen(false)}
            onSave={(difficulty) => {
              setGame(game.resetWithDifficulty(difficulty))
            }}
            currentDifficulty={game.getDifficulty()}
          />
        )}
      </Header>

      <div id="game-container">
        <div id="game">
          {game.getCards().map((card, index) => (
            <div
              className="card"
              key={card.id}
              onClick={() => setGame(game.handleClick(card))}
            >
              <PicketSign card={card} cardIndex={index} />
            </div>
          ))}
        </div>
      </div>
      <Scoreboard game={game} duration={duration} />
      {showDialog && (
        <ResultsDialog
          game={game}
          onClose={() => setShowDialog(false)}
          onReset={() => {
            setShowDialog(false)
            setGame(game.reset())
          }}
          duration={duration}
        />
      )}
      {infoDialogOpen && (
        <InfoDialog onClose={() => setInfoDialogOpen(false)} />
      )}
    </>
  )
}

export default App
