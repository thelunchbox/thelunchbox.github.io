let timer = window.setTimeout(async () => {
  const input = document.querySelector('#command');
  input.value = 'help';
}, 10000);

window.addEventListener('load', () => {
  document.querySelector('#command').focus();
});

const makeDiv = (content) => {
  const div = document.createElement('div');
  div.innerHTML = content;
  return div;
}

const commandHistory = [];
let commandPointer = 0;

async function submitCommand(command) {
  commandHistory.push(command);
  commandPointer = commandHistory.length;

  const output = document.querySelector('.output');
  const echo = makeDiv(`&gt;${command}`);
  output.appendChild(echo);

  const [base, ...args] = command.split(' ');
  const insensitiveCommand = base.toLowerCase();

  switch(insensitiveCommand) {
    case 'about':
    case 'bio':
    case 'resume':
    case 'contact':
    case 'help':
    case 'readme':
    case 'projects':
      const content = await loadContent(insensitiveCommand);
      output.appendChild(makeDiv(resolveContent(content)));
      break;
    case 'clear':
      output.innerHTML = '';
      break;
    case 'exit':
      document.location.assign('./');
    case '':
      break;
    default:
      output.appendChild(makeDiv(`Sorry, I don't understand '${command}'`));
      break;
  }

  output.scroll(0, output.scrollHeight);
  const echoPosition = echo.offsetTop;
  if (echoPosition < output.scrollTop) {
    echo.scrollIntoView();
  }
}

function handleInput(event) {
  window.clearTimeout(timer);
  const { keyCode, target } = event;
  switch(keyCode) {
    case 13: // enter
      submitCommand(target.value);
      target.value = '';
      break;
    case 38: // up arrow
      commandPointer = Math.max(0, commandPointer - 1);
      target.value = commandHistory[commandPointer];
      break;
    case 40: // down arrow
      commandPointer = Math.min(commandHistory.length, commandPointer + 1);
      target.value = commandHistory[commandPointer] || '';
      break;
    default:
      break;
  }
}