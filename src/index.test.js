import EventEmitter from 'events';
import {prompt} from 'inquirer';
import ApplifyPromptPlugin from '.';


jest.mock('inquirer', ()=> ({
  prompt: jest.fn(async ()=> ({answer: 'test-answer'}))
}));

describe('ApplifyPromptPlugin', ()=> {
  it('constructs with empty questions and answers arrays', ()=> {
    const prompter = new ApplifyPromptPlugin();

    expect(prompter.questions).toEqual([]);
    expect(prompter.answers).toEqual([]);
  });

  it('creates a new prompt emmitter if not passed one in the pipe', ()=> {
    const prompter = new ApplifyPromptPlugin();

    prompter.init({}, {});

    expect(prompter.getPipe().prompt).toBeInstanceOf(EventEmitter);
  });

  it('uses pipe and prompt emitter if passed one', ()=> {
    const prompter = new ApplifyPromptPlugin();
    const promptEmitter = new EventEmitter();

    prompter.init({}, {prompt: promptEmitter});

    expect(prompter.getPipe().prompt).toBe(promptEmitter);
  });

  it('adds a question with default format on question event', ()=> {
    const prompter = new ApplifyPromptPlugin();

    prompter.init({});
    prompter.getPipe().prompt.emit('question', 'value', 'Is this a test:');

    expect(prompter.questions).toEqual([{
      message: 'Is this a test:',
      name: 'value',
      type: 'input',
      choices: []
    }]);
  });

  it('adds a question with option parameters', ()=> {
    const prompter = new ApplifyPromptPlugin();

    prompter.init({});
    prompter.getPipe().prompt.emit(
      'question', 'value', 'Is this a test:', 'confirm', true, [1, 2, 3]
    );

    expect(prompter.questions).toEqual([{
      message: 'Is this a test:',
      name: 'value',
      type: 'confirm',
      default: true,
      choices: [1, 2, 3]
    }]);
  });

  it('prompts the user with pending questions on ask', async ()=> {
    const prompter = new ApplifyPromptPlugin();

    prompter.init({});
    prompter.getPipe().prompt.emit(
      'question', 'value', 'Is this a test:', 'confirm', true, [1, 2, 3]
    );

    await prompter.getPipe().prompt.emit('ask');

    expect(prompt).toHaveBeenCalledWith([{
      message: 'Is this a test:',
      name: 'value',
      type: 'confirm',
      default: true,
      choices: [1, 2, 3]
    }]);
  });

  it('can set the pipe', ()=> {
    const prompter = new ApplifyPromptPlugin();

    prompter.init({});

    const newPipe = {};

    prompter.setPipe(newPipe);

    expect(prompter.getPipe()).toBe(newPipe);
  });
});
