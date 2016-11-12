import React, { Component } from 'react';
import { Button, Panel, Glyphicon } from 'react-bootstrap';

export default class Entry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render () {
    const context = this;
    const thumbnail = context.props.data.data.thumbnail !== 'self' ? <td><Button bsSize="xsmall" onClick={()=>{context.setState({open: !context.state.open})}}><Glyphicon glyph="picture" /> Preview</Button><Panel collapsible expanded={context.state.open}><img src={context.props.data.data.thumbnail} /></Panel></td> : <td></td>;
    return (
      <tr>
        <td>{context.props.index}</td>
        <td>{context.props.data.data.subreddit}</td>
        <td>{context.props.data.data.title}</td>
        {thumbnail}
        <td><Button bsSize="xsmall" href={context.props.data.data.url}><Glyphicon glyph="link" /> Link</Button></td>
        <td><Button bsSize="xsmall" href={'https://www.reddit.com' + context.props.data.data.permalink}><Glyphicon glyph="comment" /> Thread Link</Button> </td>
        <td>{context.props.data.data.author}</td>
      </tr>
    );
  }
  
}
