import React, { Component } from 'react';
import Entry from './Entry';
import axios from 'axios';

import { Jumbotron, Table, Well, Form, FormGroup, FormControl, ControlLabel, Button }  from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      sources: ['FrontPage'],
      inputVal: null
    }
    this.addSource = this.addSource.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.fetchEntries = this.fetchEntries.bind(this);
  }

  updateInputValue (val) {
    this.setState({
      ...this.state,
      inputVal: val
    })
  }

  addSource(source) {
    if(this.state.sources.indexOf(source) > 0) {
      return;
    } else {
      this.setState({
        ...this.state,
        sources: this.state.sources.concat(source)
      })
      this.fetchEntries(source);
    }

  }

  fetchEntries(source) {
    const context = this;
    
    axios.get('https://www.reddit.com/r/' + source + '.json')
    .then((response) => {
      context.setState({
        data: context.state.data.concat(response.data.data.children)
      })
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  componentWillMount () {
    this.fetchEntries(this.state.sources[0]);
  }

  render() {
    const context = this;
    const styles = {
      jumbotron: {
        textAlign: 'center'  
      },
      well: {
        margin:'0 auto',
        width: '50%',
        textAlign: 'center'
      }
    }
    return (
      <div>
        <Jumbotron> 
          <h1 style={styles.jumbotron}>Welcome to Lex-Reddit-Reader!</h1>
          <p style={styles.jumbotron}>A simple reader for reddit.com!</p>
          <Well style={styles.well}>
            <Form inline>
              <FormGroup controlId='addSubreddit'>
                <ControlLabel> Add Subreddit source</ControlLabel>
                {' '}
                <FormControl type="text" placeholder="enter subreddit" onChange={(event)=>{context.updateInputValue(event.target.value)}} />
              </FormGroup>
              {' '}
              <Button onClick={()=>{context.addSource(context.state.inputVal)}} >Add</Button>
            </Form>
          </Well>

        </Jumbotron>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Subreddit</th>
              <th>Title</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
        {
          context.state.data.map((data, index) => {
            return (
              <Entry data={data} key={index} index={index} />
            );
          })
        }
          </tbody>
        </Table>
      </div>
    );
  }
}
