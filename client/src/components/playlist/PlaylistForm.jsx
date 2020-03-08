import React from "react";
import "../../assets/stylesheets/modal.css"
import { Mutation, Query, ApolloConsumer } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
const { NEW_PLAYLIST } = Mutations;
const { GET_CURRENT_USER_ID, FETCH_PLAYLISTS } = Queries;

class PlaylistForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    };
  }

  handleSubmit(e, newPlaylist, userId) {
    e.preventDefault();
    newPlaylist({
      variables: {
        name: this.state.name,
        creator: userId
      }
    });
  }

  updateCache(cache, { data }) {
    let playlists;
    try {
      playlists = cache.readQuery({ query: FETCH_PLAYLISTS });
    } catch (err) {
      return;
    }
  
    if (playlists) {
      let playlistsArray = playlists.playlists;
      let newPlaylist = data.playlist;
      cache.writeQuery({
        query: FETCH_PLAYLISTS,
        data: { playlists: playlistsArray.concat(newPlaylist) }
      });
    }
  }

  render() {
    return (
      <Query query={GET_CURRENT_USER_ID}>
        {({data}) => {
          const userId = data.userId
          return(
            <Mutation mutation={NEW_PLAYLIST}
              update={(cache, data) => this.updateCache(cache, data)}
              onCompleted={this.props.closeModal}
            >
              {(newPlaylist, { data }) => {
                return (
                  <div className="modal-background">
                    <div className="modal-child create-playlist-center">
                      <form onSubmit={e => this.handleSubmit(e, newPlaylist, userId)} className="modal-child">
                        <div onClick={this.props.closeModal}>X</div>
                        <div className="modal-no-close">Create New Playlist</div>
                        <div className="modal-no-close create-playlist-grey">
                          <div className="modal-no-close">Playlist Name</div>
                          <input 
                            placeholder="New Playlist" 
                            className="modal-no-close" 
                            onChange={e => this.setState({name: e.target.value})}
                            value={this.state.name}  
                          />
                        </div>
                        <div className="modal-no-close create-playlist-buttons">
                          <div>CANCEL</div>
                          <button type="submit">CREATE</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default PlaylistForm;