import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputData: '',
    nextId: 5,
    viewContent: 'all'
  },
  getters: {
    totalRemaining: state => {
      const num = state.list.filter(item => item.done === false).length
      return num + ' remaining'
    },
    filteredList: state => {
      if (state.viewContent === 'all') {
        const allInList = state.list
        return allInList
      } else if (state.viewContent === 'undone') {
        const undoneInList = state.list.filter(item => item.done === false)
        return undoneInList
      } else if (state.viewContent === 'done') {
        const doneInList = state.list.filter(item => item.done === true)
        return doneInList
      }
    }
  },
  mutations: {
    initList: function (state, data) {
      state.list = data
    },
    setListValue: function (state, data) {
      state.inputData = data
    },
    addItem: function (state) {
      const obj = {
        id: state.nextId++,
        info: state.inputData.trim(),
        done: false
      }
      state.list.push(obj)
      state.inputData = ''
    },
    removeItem: function (state, id) {
      const index = state.list.findIndex(x => {
        return x.id === id
      })
      if (index !== -1) {
        state.list.splice(index, 1)
      }
    },
    changeStatus: function (state, data) {
      const indexStatus = state.list.findIndex(x => {
        return x.id === data.id
      })
      if (indexStatus !== -1) {
        state.list[indexStatus].done = data.status
      }
    },
    clearDone: function (state) {
      state.list = state.list.filter(item => item.done === false)
    },
    changeView: function (state, view) {
      state.viewContent = view
    }
  },
  actions: {
    getList(context) {
      axios.get('./list.json')
        .then(({
          data
        }) => {
          context.commit('initList', data)
          // console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  modules: {}
})
