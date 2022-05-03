<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      {{ autocomplete }}
      <q-card-section>
        <q-input v-model="formEdit.name" label="name" />
        <q-input type="textarea" v-model="formEdit.name_aliases" label="alias" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" label="OK" @click="editData(formEdit)"  :disable="disableButtonOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {mainStore} from '../../stores/mainStore'
import api from '../../api/districts'
import { useDialogPluginComponent } from 'quasar'
import {computed, ref} from 'vue'
import http from "src/lib/http";

export default {
  name: "DistrictEdit",
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup(){
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const store = mainStore()
    console.log(store.edit_data)
    const formEdit = ref({
      id: store.edit_data.id,
      region_id: store.edit_data.region_id,
      name: store.edit_data.name,
      schema: store.edit_data.schema,
      name_aliases: store.edit_data.name_aliases.join(', ')
    })

    const editData = async (data) => {
      const infoEdit = {
        id: data.id,
        region_id: data.region_id,
        name: data.name,
        schema: data.schema,
        name_aliases: data.name_aliases.split(', ')
      }
      console.log(infoEdit)
      await store.editData(api, infoEdit)
      onDialogOK()
    }

    const setFilter = (data, update) => {
      update(() => {
        // if (data.length < 3) return;
        http.post('/region/region-by-name', {name:data})
          .then(response => {
            options.value = response.data
          })
          .catch(error => {
            console.log(error)
          })
      })
    }


    return{
      setFilter,
      editData,
      formEdit,
      store,
      dialogRef,
      onDialogHide,
      onOKClick:onDialogOK,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>

</style>
