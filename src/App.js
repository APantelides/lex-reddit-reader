import React, { Component } from 'react';
import Entry from './Entry';
import axios from 'axios';

import { Jumbotron, Table }  from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    const context = this;
    console.log('Mounted')
    axios.get('https://www.reddit.com/r/FrontPage/hot.json')
      .then((response) => {
        context.setState({
          data: response.data.data.children
        })
        console.log(response)
        console.log(context.state)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    const context = this;
    const styles = {
      jumbotron: {
        textAlign: 'center'  
      }
    }
    return (
      <div>
        <Jumbotron> 
          <h1 style={styles.jumbotron}>Welcome to Lex-Reddit-Reader!</h1>
          <p style={styles.jumbotron}>A simple reader for reddit.com!</p>
        </Jumbotron>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Subreddit</th>
              <th>Title</th>
              <th></th>
              <th></th>
              <th>Preview</th>
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
