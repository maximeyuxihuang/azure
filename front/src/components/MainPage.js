import React, { Component } from 'react'
import axios from 'axios'

const apiAddress = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/f08a5ca2-4c91-4cbf-8ffb-438b7d873bd3/image'

class MainPage extends Component {
  state = {
    selectedFile: null,
    preview: null,
    hasResponse: false,
    response: {},
    loading: false
  }
  
  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      preview: URL.createObjectURL(event.target.files[0])
    })
  }

  getData = (data, input) => {
    for (let i = 0; i < data.predictions.length; i++)
      if (data.predictions[i].tagName === input)
        return data.predictions[i].probability
    return 0
  }

  fileUploadHandler = () => {
    let data = new FormData()
    data.append('image', this.state.selectedFile, this.state.selectedFile.fileName)
    
    let config = {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Prediction-Key': '777f8c050ef84d36ae5a05152fe6a368'
      }
    }
    this.setState({
      loading: true
    })
    axios.post(apiAddress, data, config)
    .then(response => {
      console.log(response)
      this.setState({
        response: {
          positive: this.getData(response.data, 'Positive'),
          negative: this.getData(response.data, 'Negative')
        },
        hasResponse: true,
        loading: false
      })
    })
    .catch((error) => {
      console.log(error)
      this.seteState({
        loading: false
      })
    })
  }

  render() {
    
    return (
      <div>
        {
          this.state.preview &&
          <img src={this.state.preview} style={{
            maxWidth: "400px"
          }}/>
        }
        <div>
          <input id="upload" type="file" onChange={this.fileSelectedHandler} />
          <button onClick={this.fileUploadHandler}>Test this image</button>
          <button onClick={() => {
            document.getElementById("upload").value = ""
            this.setState({
              selectedFile: null,
              hasResponse: false,
              preview: null,
              response: {},
              loading: false
            })
          }}> Reset </button>
        </div>
        {
          this.state.loading &&
          <div>
            <h1>Fetching ...</h1>
          </div>
        }
        {
          this.state.hasResponse &&
          <div>
            <h1> Image results :</h1>
            <h2> Positive: {this.state.response.positive * 100} %</h2>
            <h2> Negative: {this.state.response.negative * 100} %</h2>
          </div>
        }
      </div>
    )

  }
}

export default MainPage;