<template>
  <q-table
    :title="title"
    :columns="columns"
    :rows="data"
    :loading="loading"
    @row-dblclick="editRow"
    v-model:pagination="store.pagination"
    @request="onRequest"
    binary-state-sort
  >
    <template v-slot:body-cell-remove="props">
      <q-td :props="props">
        <q-btn
          color="negative"
          icon-right="delete"
          no-caps
          flat
          dense
          @click="deleteRow(props.row.id)"
        />
      </q-td>
    </template>
    <template v-slot:top-right>
      <q-btn @click="addNewData" rounded color="primary" icon-right="add">Додати</q-btn>
    </template>
    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span>
            Немає даних
          </span>
        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
      </div>
    </template>
  </q-table>
</template>

<script>

import {mainStore} from 'stores/mainStore'
import {computed, ref, watch} from "vue";

export default {
  name: "Table",
  props:{
    api:{
      required:true
    },
    columns:{
      required: true
    },
    title:{
      required: true
    }
  },
  async setup(props, { emit }){
    const store = mainStore()

    // const pagination = ref({
    //   sortBy: 'desc',
    //   descending: false,
    //   page: 1,
    //   rowsPerPage: 3,
    //   rowsNumber: 10
    // })

    const loading = ref(false)
    const sortData = ref([])
    const title = ref(props.title)


    const data = computed(() => {
      return store.data
    })
    // watch(pagination, value => {
    //   options.request.limit = value.rowsPerPage
    //   options.request.offset = (value.page - 1) * value.rowsPerPage
    //   store.getData(props.api, options)
    // }, {deep:true})

    const deleteRow = (id) => {
      emit('deleteElement', id)
    }

    const editRow = (evt, row) => {
      store.edit_data = row
      emit('editElement')
    }

    const addNewData = () => {
      emit('addNewElement')
    }

    const onRequest = async (props1) => {
      loading.value = true
      const {page, rowsPerPage, sortBy, descending} = props1.pagination

      const dictSort = {
        field: sortBy,
      }

      dictSort['order'] = descending ? 'desc' : 'asc'

      const isExistElementInArray = sortData.value.some(element => element['field'] === sortBy ? true : false)

      if (isExistElementInArray) {
        sortData.value = sortData.value.filter(e => e['field'] !== dictSort['field'])
      }

      sortData.value.unshift(dictSort)

      sortData.value = sortData.value.filter(i => {
        return i['field'] !== 'desc'
      })

      store.options.request.limit = rowsPerPage
      store.options.request.offset = (page - 1) * rowsPerPage
      store.options.request.order_by = sortData.value

      await store.getData(props.api, store.options)

      loading.value = false
      store.pagination.page = page
      store.pagination.rowsPerPage = rowsPerPage
      store.pagination.sortBy = sortBy
      store.pagination.descending = descending
    }

    await onRequest({
      pagination:store.pagination
    })

    return {
      props,
      title,
      loading,
      onRequest,
      store,
      addNewData,
      data,
      deleteRow,
      editRow
    }
  }
}
</script>

<style scoped>

</style>
