import React, { Component } from 'react';
import Entry from './Entry';
import axios from 'axios';

import { Jumbotron, Table, Well, Form, FormGroup, FormControl, ControlLabel, Button, ListGroup, ListGroupItem, Glyphicon, Col }  from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      sources: ['FrontPage'],
      inputVal: null
    }
    this.addSource = this.addSource.bind(this);
    this.removeSource = this.removeSource.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.fetchEntries = this.fetchEntries.bind(this);
  }

  updateInputValue (val) {
    this.setState({
      inputVal: val
    })
  }

  addSource(source) {
    if(this.state.sources.indexOf(source) > 0) {
      return;
    } else {
      this.setState({
        sources: this.state.sources.concat(source)
      })
      this.fetchEntries(source);
    }
  }

  removeSource(source) {
    if(this.state.sources.indexOf(source) < 0) {
      return;
    } else if(this.state.sources.indexOf(source) === 0) {
      this.setState({sources: [],
      data: this.state.data.filter((data)=>{
          return data.data.subreddit !== source
        })})
    } else {
      this.setState({
        sources: this.state.sources.splice(this.state.sources.indexOf(source), 1),
        data: this.state.data.filter((data)=>{
          return data.data.subreddit !== source
        })
      })
      console.log(this.state)
    }
  }

  fetchEntries(source) {
    const context = this;
    
    axios.get('https://www.reddit.com/r/' + source + '.json')
    .then((response) => {
      context.setState({
        data: context.state.data.concat(response.data.data.children)
      })
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
    var list;
    if(context.state.sources.length > 0) {
      list = context.state.sources.map((source, index) => {
        return (
          <ListGroupItem key={index}><Button onClick={()=>{this.removeSource(source)}}><Glyphicon glyph="remove" /></Button>{' ' + source}</ListGroupItem>
        )
      }) 
    } else {
      list = <ListGroupItem>No subreddits selected</ListGroupItem>
    }
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
              <div> Note: Additional entries show up at the bottom of the page. Sorting functionality to be implemented </div>
              <ListGroup>
                <ListGroupItem><h4>Subreddits</h4></ListGroupItem>
                {
                  list
                }
              </ListGroup>
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
