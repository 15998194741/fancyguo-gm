<template>
  <!-- 富文本 -->
  <div :data-editor-id="id">
    <textarea v-once :id="id" ref="tinymceTextarea" v-text="value"></textarea>
  </div>
</template>

<script>
import request from '@/utils/request';
import tinymce from 'fancy-tinymce/tinymce';
// 主题
import 'fancy-tinymce/themes/silver';
// 图标
import 'fancy-tinymce/icons/default/icons';
  
// 插件-图片
// import 'fancy-tinymce/plugins/image';
// // 插件-多媒体
// import 'fancy-tinymce/plugins/media';
// 插件-表格
import 'fancy-tinymce/plugins/table';
// 插件-列表
import 'fancy-tinymce/plugins/lists';
// 插件-上下文菜单
import 'fancy-tinymce/plugins/contextmenu';
// 插件-字数同级
import 'fancy-tinymce/plugins/wordcount';
// 插件-颜色选择器
import 'fancy-tinymce/plugins/colorpicker';
// 插件-文本颜色
import 'fancy-tinymce/plugins/textcolor';
// 插件-预览
import 'fancy-tinymce/plugins/preview';
// 插件-粘贴
import 'fancy-tinymce/plugins/paste';
// 插件-代码
import 'fancy-tinymce/plugins/code';
// 插件-超链接
import 'fancy-tinymce/plugins/link';
// 插件-高级列表
import 'fancy-tinymce/plugins/advlist';
// 插件-代码示例
import 'fancy-tinymce/plugins/codesample';
// 插件-换行线
import 'fancy-tinymce/plugins/hr';
// 插件-全屏
import 'fancy-tinymce/plugins/fullscreen';
// 插件-快速排版
import 'fancy-tinymce/plugins/textpattern';
// 插件-搜索替换
import 'fancy-tinymce/plugins/searchreplace';
// 插件-自动链接
import 'fancy-tinymce/plugins/autolink';
// 插件-文字方向
import 'fancy-tinymce/plugins/directionality';
// 插件-显示元素范围
import 'fancy-tinymce/plugins/visualblocks';
// 插件-显示隐藏字符
import 'fancy-tinymce/plugins/visualchars';
// 插件-内容模板
import 'fancy-tinymce/plugins/template';
// 插件-特殊字符
import 'fancy-tinymce/plugins/charmap';
// 插件-插入不间断空格
import 'fancy-tinymce/plugins/nonbreaking';
// 插件-插入日期时间
import 'fancy-tinymce/plugins/insertdatetime';
// 插件-图片工具
import 'fancy-tinymce/plugins/imagetools';
// 插件-自动保存
import 'fancy-tinymce/plugins/autosave';
// 插件-编辑器尺寸自适应
import 'fancy-tinymce/plugins/autoresize';
  
//导入MD5校验
import SparkMD5 from 'spark-md5';
// 引入图片上传 api
// import { uploadImg } from '@/api/file-server';

let count = 0;

export default {
  model: {
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    imageUploadUrl: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    // 默认插件
    plugins: {
      type: [String, Array],
      default:
          'fullscreen paste preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize'
    },
    // 默认工具栏
    toolbar: {
      type: [String, Array],
      default: `fullscreen code undo redo |forecolor backcolor bold italic underline strikethrough link codesample | alignment outdent indent formatpainter | \
              bullist numlist | inserting | formatting`
    },
    // 工具栏组
    'toolbar_groups': {
      type: Object,
      default() {
        return {
          alignment: {
            icon: 'align-left',
            tooltip: '对齐方式',
            items: 'alignleft aligncenter alignright alignjustify'
          },
          formatting: {
            text: '文字格式',
            tooltip: '文字格式',
            items: 'styleselect fontselect fontsizeselect'
          },
          inserting: {
            text: '插入',
            tooltip: '插入',
            items: 'table image media hr pagebreak insertdatetime'
          }
        };
      }
    }
  },
  data() {
    let orgId = this.$store.getters.gameid;
    // let orgId = '1';
    let origin = this.$store.state.app.qiankunPublicPath || location.origin + '/';
    let id = 'editor-' + ++count;
    let _this = this;
    return {
      id,
      textData: '',
      //初始化配置
      init: {
        'selector': '#' + id,
        // 中文语言包路径
        'language_url': `${origin}static/tinymce/langs/zh_CN.js`,
        // 语言
        'language': 'zh_CN',
        // 图标地址
        'skin_url': `${origin}static/tinymce/skins/ui/oxide`,
        // 高度
        'height': 260,
        // 最小高度
        'min_height': 260,
        // 最大高度
        // 'max_height': 770,
        // 菜单栏使用的元素 css 选择器，设为 false 则隐藏菜单栏
        'menubar': false,
        // 插件
        'plugins': this.plugins,
        // 占位提示信息
        'placeholder': this.placeholder,
        // 工具栏
        'toolbar': this.toolbar,
        // 工具栏呈现模式
        'toolbar_mode': 'floating',
        // 工具栏分组
        'toolbar_groups': this.toolbar_groups,
        // 隐藏底部状态栏
        'statusbar': false,
        // 字体大小可选列表
        'fontsize_formats': '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        // 字体可选列表
        'font_formats': '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        // 是否显示编辑器品牌提示信息 (由 Tiny 驱动)
        'branding': false,
        // 设置不过滤 data 格式的图像
        'paste_data_images': true,
        // 允许跨域
        'images_upload_credentials': true,
        // 复制过来的文本带上格式
        'paste_retain_style_properties': 'all',
        'paste_webkit_styles': 'all',
        // 粘性工具栏
        // 'toolbar_sticky': true,
        // 图片处理
        'relative_urls': false,
        'remove_script_host': false,
        // 编辑区样式
        'content_style': 'p {margin: 5px 0;} img {max-width:100%;}', // 控制上传图片最大宽度
        // 粘性吸附
        // 'toolbar_sticky': true,
        // 自定义图片上传方法
        'images_upload_handler': async(blobInfo, success, failure) => {
         
          var dataFile = blobInfo.blob();
          var fileReader = new FileReader();
          var spark = new SparkMD5.ArrayBuffer();
          fileReader.readAsArrayBuffer(dataFile);
          let a = async(formData, md5, kz)=> {
            let url = `${origin}api/server/upload`;
            let { code, message } = await request({
              url: url,
              method: 'post',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: formData
            });
            if (code === 200) {
            // console.log(data.imageUrl);
              // success(data.imageUrl);
              success(`http://${window.location.host}/images/upload/${kz.slice(1)}/${md5}${kz}`);
            } else {
              failure(`HTTP Error: ${message}`);
            }
          };
      
          fileReader.onload = async e => {
            spark.append(e.target.result);
            var md5 = spark.end();
            
            //此处this指向发生改变，需提前声明const _this = this
            // _this.imgdata.md5 = md5; //此处是将文件的md5值放入imgdata中
            //上传图片，如手动上传可不在此处执行
            // 创建 formData
            let formData = new FormData();
            // 添加文件
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            console.log(blobInfo);
            formData.append('md5', md5);
            a(formData, md5, blobInfo.filename().slice(blobInfo.name().length));
          };
        

          // var md5 = 
          // formData.append('md5', blobInfo.blob(), blobInfo.filename());
          // 发送请求
          // let url = `${origin}api/server/upload/${orgId}`;
          // let url = `${origin}api/server/upload`;
          // let { code, data, message } = await request({
          //   url: url,
          //   method: 'post',
          //   headers: { 'Content-Type': 'multipart/form-data' },
          //   data: formData
          // });
          // if (code === 200) {
          //   // console.log(data.imageUrl);
          //   success(data.imageUrl);
          // } else {
          //   failure(`HTTP Error: ${message}`);
          // }
        },
        'init_instance_callback': (editor) =>{
          editor.on('input change keydown blur focus paste', ({ type }) => {
            let content = editor.getContent();
            if (type === 'change') {
              _this.textData = content;
            }
            _this.$emit(type, content); // 向外抛出
          });
        }
      }
    };
  },
  watch: {
    value: function(val) {
      if (val !== this.getContent()) {
        this.setContent(val);
      }
    }, 
    textData: function(val) {
      this.$emit('input', this.getContent());
    }
  },
  mounted() {
    tinymce.init(this.init);
    tinymce.EditorManager.execCommand('mceAddEditor', true, this.id);
  },
  methods: {
    blurHandler(...args) {
      this.$emit('blur', ...args);
    },
    setContent(val) {
      return tinymce.editors[this.id].setContent(val);
    },
    getContent() {
      return tinymce.editors[this.id].getContent();
    }
  },
  beforeDestroy() {
    tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
  }
};
</script>

<style>
  /* 授权信息 */
  .tox .tox-notifications-container .tox-notification {
    display: none;
  }
  /* 编辑器提示栏，提高层级 */
  .tox.tox-silver-sink.tox-tinymce-aux {
    z-index: 3000;
  }
  .tox.tox-tinymce {
    /* 圆角设置 */
    border-radius: 10px 10px 0 0;;
  }
</style>
