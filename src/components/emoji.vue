<template>
  <quill-editor id="editor" class="uploadImage"
                @change="onEditorChange($event)"
                :content="content"
                :style="`height:${height}`"
                ref="myQuillEditor"
                :options="editorOption"
  >
  </quill-editor>

</template>

<script setup>
import { quillEditor, Quill } from 'vue-quill-editor'

import 'quill/dist/quill.core.css';

import 'quill/dist/quill.snow.css';

import 'quill/dist/quill.bubble.css';

import quillEmoji from 'quill-emoji'

import "quill-emoji/dist/quill-emoji.css";

Quill.register('modules/quillEmoji', quillEmoji)//将emoji插件注册进富文本

const editorOption = {//配置
  modules: {
    "emoji-toolbar": true,

    "emoji-textarea": true,

    "emoji-shortname": true,

    toolbar: {
      container: [  //功能项

        ['bold', 'italic', 'underline'],//加粗，切斜，下划线

        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

        [{ 'font': [] }],

        [{ 'align': [] }],

        ['link', 'image', 'video'],

        ['emoji'],

        ['clean']

      ],  // 工具栏

      handlers: {
        emoji: function () { },

      'image': function (value) {
          if (value) {
            document.querySelector('.uploadImage input').click()

          } else {
            this.quill.format('image', false);

          }
        }
      }
    }
  }
}

const onEditorChange = ()=>{

}
</script>

<style scoped>

</style>
