import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useQuasar} from "quasar";

export const mainStore = defineStore('mainStore', () => {
  let data = ref([]);
  let selected_row = ref([])
  let edit_data = ref({})
  let options = ref({
    "request": {
      "limit": 50,
      "offset": 0,
      "order_by": [],
      "filter_by": []
    },
    "uselist": true
  })

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3,
    rowsNumber: 10
  })

  let $q = useQuasar()

  async function getData(api, options) {
    try {
      const response = await api.list(options);
      this.data = response.data;
      // console.log(response)
    } catch (e) {
      console.log(e);
    }
  }

  async function createData(api, objects){
    try {
      $q.loading.show({
        message: '<span>Створення...</span>',
        html: true
      })
      const response = await api.create(objects)
      $q.loading.hide()
      data.value.unshift(response.data)
        $q.notify({
          type: 'positive',
          message: 'Дані створенно'
        })
    } catch (e) {
      let timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
        $q.notify({
          type: 'negative',
          message: "Помилка в створенні"
        })
      }, 2000)
    }
  }

  async function deleteData(api, dataDelete, id){
    try {
      $q.loading.show({
        message: '<span>Видалення...</span>',
        html: true
      })
      const response = await api.del(dataDelete)
      $q.loading.hide()
      data.value = data.value.filter(i => i.id !== id)
      $q.notify({
        type: 'positive',
        message: 'Дані видалено'
      })
    } catch (e) {
      let timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
        let errors = e.response === undefined ? 'Помилка у видалені' : e.response.data.errors
        $q.notify({
          type: 'negative',
          message: errors
        })
      }, 2000)
    }
  }

  async function editData(api, objects){
    try {
      $q.loading.show({
        message: '<span>Редагування...</span>',
        html: true
      })
      const response = await api.edit(objects)
      let index = data.value.findIndex(obj => obj.id === objects.id)
      data.value[index] = response.data
      $q.loading.hide()
      $q.notify({
        type:'positive',
        message:'Дані відредаговані'
      })

    } catch (e) {
      console.log(e)
      let timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
        $q.notify({
          type:'negative',
          message:'Помилка в редагуванні'
        })
      }, 2000)
    }
  }

  return{
    pagination,
    options,
    edit_data,
    selected_row,
    data,

    getData,
    createData,
    deleteData,
    editData
  }
})
