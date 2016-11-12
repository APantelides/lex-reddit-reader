import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';

export default class Entry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render () {
    const context = this;
    console.log(context.props)
    const thumbnail = context.props.data.data.thumbnail !== 'self' ? <td><Button bsSize="xsmall" onClick={()=>{context.setState({open: !context.state.open})}}>Preview</Button><Panel collapsible expanded={context.state.open}><img src={context.props.data.data.thumbnail} /></Panel></td> : <td>None</td>;
    return (
      <tr>
        <td>{context.props.index}</td>
        <td>{context.props.data.data.subreddit}</td>
        <td>{context.props.data.data.title}</td>
        <td><Button bsSize="xsmall" href={context.props.data.data.url}>Link</Button></td>
        <td><Button bsSize="xsmall" href={'https://www.reddit.com' + context.props.data.data.permalink}>Thread Link</Button> </td>
        {thumbnail}
        <td>{context.props.data.data.author}</td>
      </tr>
    );
  }
  
}
