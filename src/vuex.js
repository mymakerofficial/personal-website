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

/*
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

 */

let setMessageDismissedValue = (state, value) => {
    state.messageDismissed = value;
    eventBus.$emit('cookie-message-dismissed-changed');

    if(value == false){
        state.currentKey = state.nextKey;
        state.nextKey = "";
    }else if(value == true) {
        state.currentKey = "";
    }

    localStorage.setItem('cookieDialogue', JSON.stringify(state));
}

const cookieDialogue = {
    namespaced: true,
    state: {
        dialogue: {},
        messageDismissed: false,
        messageDismissedTime: 0,
        messageCount: 0,
        currentKey: "start",
        nextKey: "start",
        messageTimeout: 5
    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('cookieDialogue') != null){
                let jsonData = JSON.parse(localStorage.getItem('cookieDialogue'))
                state.messageDismissed = jsonData.messageDismissed
                state.messageDismissedTime = jsonData.messageDismissedTime
                state.messageCount = jsonData.messageCount
                state.currentKey = jsonData.currentKey
                state.nextKey = jsonData.nextKey
                state.messageTimeout = jsonData.messageTimeout
            }else {
                localStorage.setItem('cookieDialogue', JSON.stringify(state));
            }

            if(state.messageDismissed){
                let timeSinceDismissed = (Date.now() / 1000 | 0) - state.messageDismissedTime
                let timeLeft = state.messageTimeout - timeSinceDismissed
                if(timeSinceDismissed > state.messageTimeout) {
                    // show message again
                    setMessageDismissedValue(state, false)
                } else {
                    // wait for time that is left
                    setTimeout(() => {
                        setMessageDismissedValue(state,false)
                    }, timeLeft * 1000)
                }
            }

            if(!state.messageDismissed && state.messageCount === 0){
                //setMessageDismissedValue(state,true)
                state.messageDismissed = true
                localStorage.setItem('cookieDialogue', JSON.stringify(state));

                setTimeout(() => {
                    setMessageDismissedValue(state,false)
                }, 10000)
            }
        },
        updateDialogue(state, payload) {
            state.dialogue = payload;
        },
        setMessageDismissed(state, payload){
            setMessageDismissedValue(state, payload)

            if(payload == true) {
                state.messageDismissedTime = Date.now() / 1000 | 0
                state.messageCount++;

                localStorage.setItem('cookieDialogue', JSON.stringify(state));

                // reset after timeout
                setTimeout(() => {
                    setMessageDismissedValue(state,false)
                }, state.messageTimeout * 1000)
            }
        },
        setNextMessage(state, payload){
            state.nextKey = payload
            localStorage.setItem('cookieDialogue', JSON.stringify(state));
        },
        setMessageTimeout(state, payload){
            state.messageTimeout = payload
            localStorage.setItem('cookieDialogue', JSON.stringify(state));
        }
    },
    actions: {
        dismissMessage({commit}, payload) {
            commit('setMessageTimeout', payload.delay)
            commit('setMessageDismissed', true)
            commit('setNextMessage', payload.target)
        },
        load({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(`/data/cookie-dialogue.json`).then(response => {
                    commit('updateDialogue', response.data)
                    resolve(response.data)
                }).catch(error => {
                    console.log(error)
                    reject()
                })
            })
        }
    },
    getters: {
        getCurrentMessage: (state) => {
            return state.dialogue[state.currentKey]
        }
    }
}

const createStore = () => {
    return new Vuex.Store({
        actions: {
            initialiseStore({ commit }){
                commit("projects/initialiseStore")
                commit("cookieDialogue/initialiseStore")
            }
        },
        modules: {
            projects,
            mouse,
            cookieDialogue
        }
    });
}

export default createStore;
