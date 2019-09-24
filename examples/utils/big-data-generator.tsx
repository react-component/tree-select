import React from 'react';
import { generateData, calcTotal } from './dataUtil';

interface GenProps {
  onGen: Function;
  x: number;
  y: number;
  z: number;
}

class Gen extends React.Component<GenProps> {
  static defaultProps = {
    onGen: () => {},
    x: 20,
    y: 18,
    z: 1,
  };

  xRef = React.createRef<HTMLInputElement>();

  yRef = React.createRef<HTMLInputElement>();

  zRef = React.createRef<HTMLInputElement>();

  state = {
    nums: '',
  };

  componentDidMount() {
    const { onGen } = this.props;
    const vals = this.getVals();
    onGen(generateData(vals.x, vals.y, vals.z));
  }

  onGen = e => {
    const { onGen } = this.props;
    e.preventDefault();
    const vals = this.getVals();
    onGen(generateData(vals.x, vals.y, vals.z));
    this.setState({
      nums: calcTotal(vals.x, vals.y, vals.z),
    });
  };

  getVals = () => ({
    x: parseInt(this.xRef.current.value, 10),
    y: parseInt(this.yRef.current.value, 10),
    z: parseInt(this.zRef.current.value, 10),
  });

  getDefaultValue = (key: string) => {
    if (key in this.props) {
      return String(this.props[key]);
    }
    return null;
  };

  render() {
    const { nums } = this.state;
    const { x, y, z } = this.props;
    return (
      <div style={{ padding: '0 20px' }}>
        <h2>big data generator</h2>
        <form onSubmit={this.onGen}>
          <span style={{ marginRight: 10 }}>
            x:{' '}
            <input
              ref={this.xRef}
              defaultValue={this.getDefaultValue('x')}
              type="number"
              min="1"
              required
              style={{ width: 50 }}
            />
          </span>
          <span style={{ marginRight: 10 }}>
            y:{' '}
            <input
              ref={this.yRef}
              defaultValue={this.getDefaultValue('y')}
              type="number"
              min="1"
              required
              style={{ width: 50 }}
            />
          </span>
          <span style={{ marginRight: 10 }}>
            z:{' '}
            <input
              ref={this.zRef}
              defaultValue={this.getDefaultValue('z')}
              type="number"
              min="1"
              required
              style={{ width: 50 }}
            />
          </span>
          <button type="submit">Generate</button>
          <p>total nodes: {nums || calcTotal(x, y, z)}</p>
        </form>
        <p style={{ fontSize: 12 }}>
          x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
        </p>
      </div>
    );
  }
}

export default Gen;
