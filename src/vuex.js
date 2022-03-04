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
        messageMinimised: false,
        messageCount: 0,
        currentKey: "start",
        nextKey: "start",
        messageTimeout: 1
    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('cookieDialogue') != null){
                let jsonData = JSON.parse(localStorage.getItem('cookieDialogue'))
                state.messageDismissed = jsonData.messageDismissed
                state.messageDismissedTime = jsonData.messageDismissedTime
                state.messageMinimised = jsonData.messageMinimised
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
                }, 3000)
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
        },
        setMessageMinimised(state, payload){
            state.messageMinimised = payload
            localStorage.setItem('cookieDialogue', JSON.stringify(state));
        }
    },
    actions: {
        dismissMessage({commit}, payload) {
            commit('setMessageTimeout', payload.delay)
            commit('setMessageDismissed', true)
            commit('setNextMessage', payload.target)
        },
        unhideMessage({commit}){
            commit('setMessageMinimised', false)
        },
        hideMessage({commit}){
            commit('setMessageMinimised', true)
        },
        setReturnMessage({commit}){
            commit('setMessageTimeout', 10)
            commit('setMessageDismissed', true)

            let keys = ["onzjd5","SrQdQu","CHPLbl"]

            commit('setNextMessage', keys[Math.floor(Math.random()*keys.length)])

            commit('setMessageMinimised', true)
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

const user = {
    namespaced: true,
    state: {
        lastPageLoad: 0,
        lastPageExit: 0,
        gitCommitSha: null,
    },
    mutations: {
        initialiseStore(state) {
            if(localStorage && localStorage.getItem('user') != null){
                let jsonData = JSON.parse(localStorage.getItem('user'))
                state.lastPageLoad = jsonData.lastPageLoad
                state.lastPageExit = jsonData.lastPageExit
                state.gitCommitSha = jsonData.gitCommitSha
            }
        },
        updateLastPageLoad(state, payload){
            state.lastPageLoad = payload
            localStorage.setItem('user', JSON.stringify(state));
        },
        updateLastPageExit(state, payload){
            state.lastPageExit = payload
            localStorage.setItem('user', JSON.stringify(state));
        },
        updateGitCommitSha(state, payload){
            if(payload !== state.gitCommitSha) {
                eventBus.$emit('site-version-changed');

                state.gitCommitSha = payload
                localStorage.setItem('user', JSON.stringify(state));
            }
        }
    },
    actions: {
        load({commit}) {
            commit("updateLastPageLoad", new Date().getTime() / 1000)
        },
        exit({commit}) {
            commit("updateLastPageExit", new Date().getTime() / 1000)
        },
        setGitCommitSha({commit}, payload){
            commit("updateGitCommitSha", payload)
        }
    }
}

const createStore = () => {
    return new Vuex.Store({
        actions: {
            initialiseStore({ commit }){
                commit("user/initialiseStore")
                commit("projects/initialiseStore")
                commit("cookieDialogue/initialiseStore")
            }
        },
        modules: {
            user,
            projects,
            mouse,
            cookieDialogue,
        }
    });
}

export default createStore;
