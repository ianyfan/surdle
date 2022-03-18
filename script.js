'use strict';

const WIDTH = 5;
const PRECISION = WIDTH - 1;  // 1 for decimal point
const INPUT_LENGTH = 4;

function disable(row) {
  row.getElementsByTagName('fieldset')[0].disabled = true;
}

function enable(row) {
  row.getElementsByTagName('fieldset')[0].disabled = false;
  row.getElementsByTagName('input')[0].focus();
}

window.onload = () => {
  // const index = 3;
  // document.getElementsByTagName('sup')[0].textContent = index;

  function evaluate(radicand) {
    const result = Math.sqrt(radicand); // Math.pow(radicand, 1 / index);
    const truncation = result.toString().slice(0, 5);
    return truncation.length == 5 ? truncation : result.toPrecision(PRECISION);
  }

  const mainEl = document.getElementsByTagName('main')[0];
  const rowEl = document.getElementsByClassName('guess')[0];
  for (let i = 0; i < 5; ++i) mainEl.appendChild(rowEl.cloneNode(true));

  enable(rowEl);

  const answer = 557;
  const target = evaluate(answer);

  document.onbeforeinput = e => {
    if (e.data != null && (/^\D+$/.test(e.data) || e.data.length > INPUT_LENGTH)) {
      e.preventDefault();
    }
  };

  let guessCount = 0;
  document.body.onsubmit = e => {
    guessCount += 1;
    const guess = evaluate(e.target.getElementsByTagName('input')[0].value);
    console.log(target, guess);

    let win = true;
    const status = [];
    const unmatched = [];
    for (let i = 0; i < WIDTH; ++i) {
      if (guess[i] == target[i]) {
        status.push('=');
      } else {
        status.push(null);
        unmatched.push(target[i]);
        win = false;
      }
    }

    for (let i = 0; i < WIDTH; ++i) {
      if (status[i] != '=') {
        const idx = unmatched.indexOf(guess[i]);
        if (idx > -1) {
          unmatched.splice(idx, 1);
          status[i] = '~';
        } else {
          status[i] = '_';
        }
      }
    }

    const rowEl = e.target.parentNode;
    const digits = rowEl.getElementsByClassName('digit');
    for (let i = 0; i < WIDTH; ++i) {
      digits[i].textContent = guess[i];
      if (status[i] == '=') {
        digits[i].classList.add('right');
      } else if (status[i] == '~') {
        digits[i].classList.add('close');
      } else if (status[i] == '_') {
        digits[i].classList.add('wrong');
      } else {
        throw new Error();
      }
    }

    disable(rowEl);

    if (!win) {
      enable(mainEl.children[guessCount]);
    }

    return false;
  };
}
