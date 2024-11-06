import clsx from 'clsx';
import { useRef } from 'react';
import './InfoDialog.css';

export const InfoDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog className={clsx('dialog', isOpen && 'show')} ref={dialogRef}>
      <span
        className="close-button"
        onClick={() => {
          dialogRef?.current?.close();
          onClose();
        }}
      >
        ❌
      </span>
      <div className="container">

        <h2>What’s this?</h2>

        <p>
          A Times Tech Guild-themed variant on the classic Memory card game, where playing cards are placed face down in a grid format and then turned over two at a time, seeking matching pairs. Instead of playing cards, we used strike placards.
        </p>

        <h3>Why did we build it?</h3>

        <p>
          The Times Tech Guild is on strike, and we are asking that our supporters boycott all NYT Games as well as NYT Cooking. We are not currently asking for a boycott of NYT News. We made this game so our supporters can play games without crossing the picket digital line.
        </p>

        <h3>Why are you on strike?</h3>

        <p>
          The Times Tech Guild—unionized workers who build and maintain election-critical programs and power all the games you love—have been fighting for a first contract for over two years. The company failed to come to an acceptable deal, and we are now on strike over the company's numerous unfair labor practices.
        </p>

        <p>
          We need your support. <a href="https://docs.google.com/forms/d/e/1FAIpQLSdtdcZ7zzDBS2WTf8dbGQ5hyCOvb0hYCDOPetOwucGJLDQj6w/viewform">Tell The New York Times you stand with tech workers in our fight for a fair contract!</a>
        </p>

        <p>
          <a href="https://www.gofundme.com/f/nyt-tech-strike-fund">Please also consider donating to support striking Times Tech Guild workers!</a>
        </p>

      </div>
    </dialog>
  );
};
