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
        },
        getFeatured: (state) => {
            return state.list.filter(p => p.featured === true)
        }
    }
}

const mouse = {
    namespaced: true,
    state: {
        position: {x: 0, y: 0},
        pagePosition: {x: 0, y: 0}
    },
    mutations: {
        updatePosition(state, payload){
            state.position.x = payload.x;
            state.position.y = payload.y;
            eventBus.$emit('mouse-position-changed')
        }
    },
    actions: {
        updateScroll({state}){
            state.pagePosition.x = state.position.x + window.pageXOffset
            state.pagePosition.y = state.position.y + window.pageYOffset
            eventBus.$emit('mouse-position-changed')
        }
    }
}

const cookieTimeout = 10

const userPreferences = {
    namespaced: true,
    state: {
        cookiesDismissed: false,
        cookiesDismissedTime: 0,
        cookiesDismissCounter: 0,
        cookiesDontShowAgain: false
    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('userPreferences') != null){
                let jsonData = JSON.parse(localStorage.getItem('userPreferences'))
                state.cookiesDismissed = jsonData.cookiesDismissed
                state.cookiesDismissedTime = jsonData.cookiesDismissedTime
                state.cookiesDismissCounter = jsonData.cookiesDismissCounter
                state.cookiesDontShowAgain = jsonData.cookiesDontShowAgain
            }else {
                localStorage.setItem('userPreferences', JSON.stringify(state));
            }

            if(state.cookiesDismissed && !state.cookiesDontShowAgain){
                let timeSinceDismissed = (Date.now() / 1000 | 0) - state.cookiesDismissedTime
                let timeLeft = cookieTimeout - timeSinceDismissed
                if(timeSinceDismissed > cookieTimeout) {
                    // show message again
                    state.cookiesDismissed = false;
                    localStorage.setItem('userPreferences', JSON.stringify(state));
                } else {
                    // wait for time that is left
                    setTimeout(() => {
                        state.cookiesDismissed = false;
                        eventBus.$emit('cookies-dismissed-changed')
                        localStorage.setItem('userPreferences', JSON.stringify(state));
                    }, timeLeft * 1000)
                }
            }

            if(!state.cookiesDismissed && state.cookiesDismissCounter === 0){
                state.cookiesDismissed = true;
                localStorage.setItem('userPreferences', JSON.stringify(state));

                setTimeout(() => {
                    state.cookiesDismissed = false;
                    eventBus.$emit('cookies-dismissed-changed')
                    localStorage.setItem('userPreferences', JSON.stringify(state));
                }, 10000)
            }
        },
        setCookies(state, payload){
            state.cookiesDismissed = payload
            eventBus.$emit('cookies-dismissed-changed')

            if(payload) {
                state.cookiesDismissedTime = Date.now() / 1000 | 0
                state.cookiesDismissCounter++;

                if(!state.cookiesDontShowAgain){
                    // reset after timeout
                    setTimeout(() => {
                        state.cookiesDismissed = false;
                        eventBus.$emit('cookies-dismissed-changed')
                        localStorage.setItem('userPreferences', JSON.stringify(state));
                    }, cookieTimeout * 1000)
                }
            }
            localStorage.setItem('userPreferences', JSON.stringify(state));
        },
        setCookiesDontShowAgain(state, payload) {
            state.cookiesDontShowAgain = payload;
            localStorage.setItem('userPreferences', JSON.stringify(state));
        }
    },
    actions: {
        dismissCookies({commit}) {
            commit('setCookies', true)
        },
        dontShowCookiesAgain({commit}) {
            commit('setCookiesDontShowAgain', true)
        }
    }
}

const createStore = () => {
    return new Vuex.Store({
        actions: {
            initialiseStore({ commit }){
                commit("projects/initialiseStore")
                commit("userPreferences/initialiseStore")
            }
        },
        modules: {
            projects,
            mouse,
            userPreferences
        }
    });
}

export default createStore;
