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
        },
        getters: {
            getProject: (state) => (name) => {
                return state.projects.find(project => project.name === name)
            },
            getProjectNames: (state) => {
                return state.projects.map(p => p.name)
            }
        }
    });
}

export default createStore;
