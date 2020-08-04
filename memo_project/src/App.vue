<template>
  <div id="app">
    <div id="memo">
      <a-input placeholder="Please input the memo" class="my_ipt" :value="inputData" @change="handleInputChange" />
      <a-button type="primary" class="my_btn" @click="addToList">Add</a-button>

      <a-list bordered :dataSource="filteredList" class="dt_list">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- 复选框 -->
          <a-checkbox :checked="item.done" @change="checkboxChanged($event, item.id)">{{item.info}}</a-checkbox>
          <!-- 删除链接 -->
          <a slot="actions" @click="removeById(item.id)">Delete</a>
        </a-list-item>

        <!-- footer区域 -->
        <div slot="footer" class="footer">
          <!-- 未完成的任务个数 -->
          <span>{{totalRemaining}}</span>
          <!-- 操作按钮 -->
          <a-button-group>
            <a-button :type="viewContent === 'all' ? 'primary' : 'default'" @click="changeList('all')">All</a-button>
            <a-button :type="viewContent === 'undone' ? 'primary' : 'default'" @click="changeList('undone')">Undone</a-button>
            <a-button :type="viewContent === 'done' ? 'primary' : 'default'" @click="changeList('done')">Completed</a-button>
          </a-button-group>
          <!-- 把已经完成的任务清空 -->
          <a @click="clearAllDone">Clear all done tasks</a>
        </div>
      </a-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'app',
  data: function () {
    return {
    }
  },
  computed: {
    ...mapState(['inputData', 'viewContent']),
    ...mapGetters(['totalRemaining', 'filteredList'])
  },
  created: function () {
    this.$store.dispatch('getList')
  },
  methods: {
    ...mapMutations(['setListValue', 'addItem', 'removeItem', 'changeStatus', 'clearDone', 'changeView']),
    handleInputChange: function (e) {
      this.setListValue(e.target.value)
    },
    addToList: function () {
      if (this.inputData.trim().length > 0) {
        this.addItem()
      } else {
        this.$message.warning('please input the content')
      }
    },
    removeById(id) {
      this.removeItem(id)
    },
    checkboxChanged: function (e, id) {
      const objStatus = {
        id: id,
        status: e.target.checked
      }
      this.changeStatus(objStatus)
    },
    clearAllDone: function () {
      this.clearDone()
    },
    changeList: function (range) {
      this.changeView(range)
    }
  }
}
</script>

<style scope>
#memo {
  width: 700px;
  padding: 10px;
  left: 50%;
  top: 50%;
}

.my_ipt {
  width: 500px !important;
  margin-right: 15px !important;
}

.dt_list {
  width: 500px !important;
  margin-top: 15px !important;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
