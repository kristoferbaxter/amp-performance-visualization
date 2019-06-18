import { Component, h } from 'preact';

interface Props {
  data: { [k: string]: number };
  svgWidth: number;
  svgHeight: number;
}

interface State {
  graphChoice: string;
}

class Chart extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: '',
    };
  }

  public render() {
    if (this.state.graphChoice === '') {
    }
    return <p>hi</p>;
  }
}
