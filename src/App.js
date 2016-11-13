import React, { Component } from 'react';
import Entry from './Entry';
import axios from 'axios';

import { Jumbotron, Table, Well, Form, FormGroup, FormControl, ControlLabel, Button, ListGroup, ListGroupItem, Glyphicon, Col }  from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      dataHot: [],
      dataTop: [],
      sources: ['FrontPage'],
      inputVal: null,
      sortByHot: false
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
    } else if (source.toUpperCase() === 'all'.toUpperCase()) {
      alert('The all subreddit is not allowed!');
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
      this.setState({sources: this.state.sources.slice(1),
      dataHot: this.state.dataHot.filter((data)=>{
          return data.data.subreddit.toUpperCase() !== source.toUpperCase()
        }),
      dataTop: this.state.dataTop.filter((data)=>{
            return data.data.subreddit.toUpperCase() !== source.toUpperCase()
          })})
      
    } else {
      this.setState({
        sources: this.state.sources.splice(this.state.sources.indexOf(source), 1),
        dataHot: this.state.dataHot.filter((data)=>{
          return data.data.subreddit !== source
        }),
        dataTop: this.state.dataTop.filter((data)=>{
          return data.data.subreddit !== source
        })
      })
      console.log(this.state)
    }
  }

  fetchEntries(source) {
    const context = this;
    
    axios.get('https://www.reddit.com/r/' + source + '/top.json')
    .then((response) => {
      console.log(response.data.data.children)
      context.setState({
        dataTop: context.state.dataTop.concat(response.data.data.children).sort((a, b) => {
          return b.data.score - a.data.score;
        })
      })

    })
    .catch((error) => {
      console.log(error)
    })
    axios.get('https://www.reddit.com/r/' + source + '/hot.json')
    .then((response) => {
      console.log(response.data.data.children)
      context.setState({
        dataHot: context.state.dataHot.concat(response.data.data.children).sort((a, b) => {
          console.log(a, b)
          return b.data.score - a.data.score;
        })
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
    var subredditList, data;
    if(context.state.sources.length > 0) {
      subredditList = context.state.sources.map((source, index) => {
        return (
          <ListGroupItem key={index}><Button onClick={()=>{this.removeSource(source)}}><Glyphicon glyph="remove" /></Button>{' ' + source}</ListGroupItem>
        )
      }) 
    } else {
      subredditList = <ListGroupItem>No subreddits selected</ListGroupItem>
    }
    if(context.state.sortByHot) {
      data = context.state.dataHot.map((data, index) => {
        return (
          <Entry data={data} key={index} index={index} />
        );
      })
    } else {
      data = context.state.dataTop.map((data, index) => {
        return (
          <Entry data={data} key={index} index={index} />
        );
      })
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
               {' Sort by:   '} <Button onClick={()=>{context.setState({sortByHot: !context.state.sortByHot})}}> {context.state.sortByHot === true ? 'Top' : 'Hot'} </Button>              <ListGroup>
                <ListGroupItem><h4>Subreddits</h4></ListGroupItem>
                {subredditList}
              </ListGroup>
            </Form>
          </Well>

        </Jumbotron>
        <Table responsive>
          <thead>
            <tr>
              <th>Score</th>
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
          data
        }
          </tbody>
        </Table>
      </div>
    );
  }
}
