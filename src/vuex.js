import Vuex from "vuex";
import axios from "axios";
import eventBus from './eventBus.js'

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

const mouse = {
    namespaced: true,
    state: {
        position: {x: 0, y: 0}
    },
    mutations: {
        updatePosition(state, payload){
            state.position.x = payload.x;
            state.position.y = payload.y;
            eventBus.$emit('mouse-position-changed')
        }
    },
    getters: {
        pagePosition: (state) => {
            return {
                x: state.position.x + 1,
                y: state.position.y + 1
            }
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
            projects,
            mouse
        }
    });
}

export default createStore;
