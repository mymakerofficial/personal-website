import Vuex from "vuex";
import axios from "axios";

const projects = {
    namespaced: true,
    state: {
        list: []
    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('projects') != null){
                state.list = JSON.parse(localStorage.getItem('projects'))
            }
        },
        updateProjects(state, payload){
            state.list = payload
            localStorage.setItem('projects', JSON.stringify(payload));
        }
    },
    actions: {
        load({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(`/data/projects.json`).then(response => {
                    commit('updateProjects', response.data)
                    resolve(response.data)
                }).catch(error => {
                    console.log(error)
                    reject()
                })
            })
        }
    },
    getters: {
        getByName: (state) => (name) => {
            return state.list.find(project => project.name === name)
        },
        getNames: (state) => {
            return state.list.map(p => p.name)
        }
    }
}

const createStore = () => {
    return new Vuex.Store({
        actions: {
            initialiseStore({ commit }){
                commit("projects/initialiseStore")
            }
        },
        modules: {
            projects
        }
    });
}

export default createStore;
