import EventEmitter from 'events';
import {prompt} from 'inquirer';


/*
  Note all plugins have init(config, pipe), getPipe(), and setPipe(pipe)
  funtions.  They may also have an optional run() function if needed.

  The plugins will talk to each other via the various pipe and config
  objects. The pipe can hold data or event emitters.
 */


/**
 * An event emitter prompt plugin.  Initialise the plugin with a pipe object.
 * The plugin will attach a prompt EventEmitter, that will listen for
 * 'question' and 'ask' events, and will emit a 'response' event.
 *
 * The 'question' event will add a question to the pending questions list.
 * The 'ask' event will trigger all the questions to be asked.
 * The 'response' will be emitted with an answers object.
 *
 * Example:
 * ```js
 * const promptPlugin = new ApplifyPromptPlugin();
 * const config = {};
 * const pipe = {};
 *
 * promptPlugin.init(config, pipe);
 *
 * pipe.prompt.emit('question', 'myQuestion', 'Some question?');
 * pipe.prompt.on('response', (answers)=> // do something with answers));
 * pipe.prompt.emit('ask');
 * ```
 *
 * @event question question
 * @event ask
 * @emit  response answers
 */
class ApplifyPromptPlugin extends EventEmitter {
  constructor() {
    super();

    this.questions = [];
    this.answers = [];
  }

  async prompt() {
    this.answers = await prompt(this.questions);
    this.pipe.prompt.emit('response', this.answers);
    this.questions = [];
  }

  // eslint-disable-next-line max-params
  formatQuestion(name, question, defaultValue, type='input', choices=[]) {
    return {
      name,
      message: question,
      default: defaultValue,
      type,
      choices
    };
  }

  // eslint-disable-next-line max-params
  addQuestion(name, question, type, defaultValue, choices) {
    this.questions.push(
      this.formatQuestion(name, question, defaultValue, type, choices)
    );
  }

  async init(config, pipe={}) {
    this.config = config;
    this.pipe = pipe;

    if (!this.pipe.prompt) {
      this.pipe.prompt = new EventEmitter();
    }

    this.pipe.prompt.on('question', this.addQuestion.bind(this));
    this.pipe.prompt.on('ask', this.prompt.bind(this));
  }

  getPipe() {
    return this.pipe;
  }

  setPipe(pipe) {
    this.pipe = pipe;
  }
}

export default ApplifyPromptPlugin;
