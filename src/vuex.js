import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
    return new Vuex.Store({
        state: {
            projects: ''
        },
        mutations: {
            initialiseStore(state) {
                if(localStorage && localStorage.getItem('projects') != null){
                    state.projects = JSON.parse(localStorage.getItem('projects'))
                }

                axios.get(`/data/projects.json`).then(response => {
                    state.projects = response.data
                    localStorage.setItem('projects', JSON.stringify(response.data));
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    });
}

export default createStore;
