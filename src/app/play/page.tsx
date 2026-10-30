'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'signal',
    title: 'Spotting the Signal: Empty Transit Walk',
    category: 'Stalking & Awareness',
    situation:
      'You just exited the metro station at 9:30 PM. A person walked out behind you and has slowed down and matched your pace when you turned into your street. What is your most effective move?',
    options: [
      {
        text: 'Put on headphones and pretend not to notice them so they do not get agitated.',
        isCorrect: false,
        feedback:
          'Wearing headphones impairs auditory perception and signals vulnerability to opportunists.',
      },
      {
        text: 'Cross the road immediately and enter the brightly lit pharmacy to verify their intention.',
        isCorrect: true,
        feedback:
          'Seeking an immediate lit commercial zone with witnesses and testing their intent is the safest move.',
      },
      {
        text: 'Walk faster down the dark shortcut alley to reach your gate 2 minutes sooner.',
        isCorrect: false,
        feedback:
          'Never take unlit, narrow shortcuts when an unidentified person is behind you; you risk being trapped in a blind alley.',
      },
    ],
  },
  {
    id: 'exit',
    title: 'Safe Exit: Night Cab Divergence',
    category: 'Transit Protocol',
    situation:
      'Your booked cab driver ignores the GPS navigation and turns into an unlit industrial bypass road claiming "it avoids the traffic signal". What should you do first?',
    options: [
      {
        text: 'Wait quietly until they complete the bypass to see where it leads.',
        isCorrect: false,
        feedback:
          'Allowing unauthorized route divergence deepens geographic isolation and reduces rescue options.',
      },
      {
        text: 'Loudly start a Fake Call or dial your family: "Dad, the driver took the bypass, I am sharing my live route now."',
        isCorrect: true,
        feedback:
          'Verbal deterrence establishing that an external guardian is tracking the car in real time immediately discourages foul play.',
      },
      {
        text: 'Jump out of the moving car immediately.',
        isCorrect: false,
        feedback:
          'Extremely dangerous while the vehicle is in motion. Instead, command the driver firmly to stop at the next intersection while broadcasting SOS.',
      },
    ],
  },
  {
    id: 'call',
    title: 'Who to Call: Escalating Confrontation',
    category: 'Emergency Dispatch',
    situation:
      'A stranger is aggressively blocking the door to your apartment vestibule and refusing to step aside. Which number offers the fastest direct police dispatch?',
    options: [
      {
        text: '112 (National Emergency Helpline)',
        isCorrect: true,
        feedback:
          '112 is the universal unified emergency responder number with prioritized geolocated dispatch.',
      },
      {
        text: 'Your neighborhood friend who lives 20 minutes away.',
        isCorrect: false,
        feedback:
          'A friend cannot intervene in time during an immediate physical barrier. Contact official law enforcement first.',
      },
    ],
  },
];

export default function PlayGamePage() {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[currentScenarioIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (scenario.options[idx].isCorrect) {
      setScore((s) => s + 100);
    }
  };

  const handleNext = () => {
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIdx(0);
    setSelectedOption(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none pb-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white mb-2 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
        <h1 className="text-[24px] font-black tracking-[-0.5px] leading-[30px] text-[#16161d] dark:text-[#f4f4f8]">
          Safety IQ Trainer
        </h1>
        <p className="text-[13px] text-[#5b5b6e] dark:text-[#a6a6be] mt-0.5">
          Sharpen real-world instinct and crisis decision-making through realistic scenarios.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="flex items-center justify-between p-4 rounded-[16px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] shadow-sm">
        <div className="flex items-center gap-2.5">
          <Award className="h-5 w-5 text-[#d97706]" />
          <div>
            <span className="text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be] block uppercase tracking-wider font-bold">
              Safety Score
            </span>
            <span className="text-[16px] font-black text-[#16161d] dark:text-[#f4f4f8]">
              {score} XP
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be] block uppercase tracking-wider font-bold">
            Scenario
          </span>
          <span className="text-[13.5px] font-bold text-[#6d4aff] dark:text-[#a78bfa]">
            {completed ? SCENARIOS.length : currentScenarioIdx + 1} of {SCENARIOS.length}
          </span>
        </div>
      </div>

      {!completed ? (
        <section className="bg-white dark:bg-[#141420] rounded-[20px] border border-[#e8e8f0] dark:border-[#26263a] p-6 space-y-5 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d4aff] dark:text-[#a78bfa] bg-[#f1edff] dark:bg-[#241a4d] px-2.5 py-1 rounded-full inline-block mb-2">
              {scenario.category}
            </span>
            <h2 className="text-[18px] font-black text-[#16161d] dark:text-[#f4f4f8]">
              {scenario.title}
            </h2>
            <p className="text-[14px] text-[#5b5b6e] dark:text-[#a6a6be] leading-[21px] mt-2">
              {scenario.situation}
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10.5px] font-black uppercase text-[#9797ab] tracking-wider block">
              CHOOSE YOUR RESPONSE
            </span>
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle =
                'bg-[#f7f7fa] dark:bg-[#1d1d2c] border-[#e8e8f0] dark:border-[#26263a] hover:border-[#6d4aff] text-[#16161d] dark:text-[#f4f4f8]';

              if (selectedOption !== null) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-[#ecfdf5] dark:bg-[#064e3b]/30 border-[#059669] text-[#059669]';
                } else if (isSelected) {
                  btnStyle = 'bg-[#fff1f2] dark:bg-[#881337]/30 border-[#e11d48] text-[#e11d48]';
                } else {
                  btnStyle = 'opacity-40 border-transparent bg-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-[16px] border transition flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-[#141420] border border-current flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium leading-[20px]">{opt.text}</p>
                    {selectedOption !== null && (isSelected || opt.isCorrect) && (
                      <p className="text-[12.5px] mt-1.5 font-normal opacity-90">{opt.feedback}</p>
                    )}
                  </div>
                  {selectedOption !== null && opt.isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0 mt-0.5" />
                  )}
                  {selectedOption !== null && isSelected && !opt.isCorrect && (
                    <XCircle className="h-5 w-5 text-[#e11d48] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-[14px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <span>
                  {currentScenarioIdx < SCENARIOS.length - 1 ? 'Next Scenario' : 'View Results'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white dark:bg-[#141420] rounded-[20px] border border-[#e8e8f0] dark:border-[#26263a] p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] flex items-center justify-center mx-auto">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-[22px] font-black text-[#16161d] dark:text-[#f4f4f8]">
            Simulation Completed!
          </h2>
          <p className="text-[14px] text-[#5b5b6e] dark:text-[#a6a6be] max-w-md mx-auto">
            You scored <span className="font-bold text-[#6d4aff]">{score} XP</span> out of{' '}
            {SCENARIOS.length * 100} XP. Consistent scenario preparation builds automatic safety reflexes in real crises.
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-[14px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-xs inline-flex items-center gap-2 transition shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Trainer</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
