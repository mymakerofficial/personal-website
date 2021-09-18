import Vuex from "vuex";
import axios from "axios";
import {markdown} from "@/js/markdown";

const readme = {
    namespaced: true,
    state: {

    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('readmes') != null){
                JSON.parse(localStorage.getItem('readmes')).forEach((d) => {state[d.key] = {markdown: d.readme, html: markdown(d.readme)}})
            }
        },
        update(state , payload) {
            state[payload.key] = {markdown: payload.readme, html: markdown(payload.readme)}

            let list = []

            Object.keys(state).forEach((key) => {
                list.push({"key": key, "readme": state[key].markdown})
            })

            localStorage.setItem('readmes', JSON.stringify(list));
        }
    },
    actions: {
        load({ commit, state }, name){
            return new Promise((resolve, reject) => {
                // check if readme is already loaded
                if(state[name]) {
                    resolve(state[name])
                }else {
                    // load readme if not already loaded
                    axios.get(`/data/readme/${name}.md`).then(response => {
                        commit('update', {key: name, readme: response.data})

                        resolve(response.data)
                    }).catch(error => {
                        console.log(error)
                        reject(null)
                    })
                }
            })
        }
    },
}

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
    },
    modules: {
        readme
    }
}

const createStore = () => {
    return new Vuex.Store({
        actions: {
            initialiseStore({ commit }){
                commit("projects/initialiseStore")
                commit("projects/readme/initialiseStore")
            }
        },
        modules: {
            projects
        }
    });
}

export default createStore;
