import React from 'react';
import PropTypes from 'prop-types';

import Timer from './utils/Timer';
import arrayUtils from './utils/array';

export interface KonamiProps {
  className?: string;
  code?: number[];
  disabled?: boolean;
  resetDelay?: number;
  action?: () => void;
  timeout?: number;
  onTimeout?: () => void;
}

export interface KonamiState {
  done: boolean;
  input: number[];
}

const propTypes = {
  action: PropTypes.func,
  className: PropTypes.string,
  code: PropTypes.arrayOf(PropTypes.number),
  disabled: PropTypes.bool,
  onTimeout: PropTypes.func,
  resetDelay: PropTypes.number,
  timeout: PropTypes.number,
};

class Konami extends React.Component<KonamiProps, KonamiState> {
  private timeoutID: ReturnType<typeof setTimeout> | null | undefined;
  private _timer: any;
  static defaultProps: KonamiProps;

  static propTypes: typeof propTypes;

  constructor(props: KonamiProps) {
    super(props);

    this.state = {
      done: false,
      input: [],
    };

    this.timeoutID = null;
    this.onKeyUp = this.onKeyUp.bind(this);
    this.resetInput = this.resetInput.bind(this);
  }

  componentDidMount() {
    const { resetDelay } = this.props;

    document.addEventListener('keyup', this.onKeyUp);
    const delay = Number(resetDelay);
    if (delay !== 0) {
      this._timer = new Timer(() => this.resetInput(), delay);
    }
  }

  componentWillUnmount() {
    const { resetDelay } = this.props;

    if (this.timeoutID) clearTimeout(this.timeoutID);

    if (resetDelay !== 0) {
      this._timer.stop();
    }
    document.removeEventListener('keyup', this.onKeyUp);
  }

  shouldComponentUpdate(nextProps: KonamiProps, nextState: KonamiState) {
    if (this.props.className !== nextProps.className ||
        this.props.disabled !== nextProps.disabled
    ) {
      return true;
    }
    return this.state.done !== nextState.done;
  }

  onKeyUp(e: KeyboardEvent) {
    const { done, input } = this.state;
    const {
      action,
      code,
      disabled,
      onTimeout,
      resetDelay,
      timeout,
    } = this.props;

    const delay = Number(resetDelay);

    if (disabled) {
      return;
    }

    if (delay !== 0) {
      this._timer.reset(delay);
    }

    input.push(e.keyCode);

    if (code) {
      input.splice(-code.length - 1, input.length - code.length);
    }

    this.setState({ input }, () => {
      if (arrayUtils.equals(this.state.input, code) && !done) {
        if (delay !== 0) {
          this._timer.stop();
        }
        this.setState({ done: true }, () => {
          if (typeof action === 'function') {
            action();
          }
        });

        if (timeout) {
          this.timeoutID = setTimeout(() => {
            this.setState({ done: false });
            if (typeof onTimeout === 'function') {
              onTimeout();
            }
          }, Number(timeout));
        }
      }
    });
  }

  resetInput() {
    this.setState({ input: [] });
  }

  render() {
    const { children, className, disabled } = this.props;
    const { done } = this.state;

    return (
      <div
        className={`konami ${className ?? ''}`}
        style={{ display: !done || disabled ? 'none' : 'block' }}
      >
        {children}
      </div>
    );
  }
}

Konami.defaultProps = {
  className: '',
  code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
  disabled: false,
  resetDelay: 1000,
};

Konami.propTypes = propTypes;

export default Konami;
