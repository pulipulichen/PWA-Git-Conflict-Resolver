let app = {
  props: ['db'],
  components: {
    // DataTaskManager: () => import(/* webpackChunkName: "components/DataTaskManager" */ './DataTaskManager/DataTaskManager.vue')
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    // 'db.localConfig.header'() {
    //   this.updateDocumentTitle()
    // },
  },
  computed: {
    computedColumns () {
      if (this.db.config.inited === false) {
        return []
      }
      return this.$parent.computedColumns
    }
  },
  mounted() {
  },
  methods: {
    resolveConflict() {
      const {inputText} = this.db.localConfig
      const selectedVersion = this.db.localConfig.checkout
      // const regexOurs = /<<<<<<< HEAD[\s\S]*?=======/;
      // const regexTheirs = /=======([\s\S]*?)>>>>>>>/;
      
      let headNeedle = `\n<<<<<<< HEAD\n`

      let parts = inputText.split(headNeedle)
      let outputParts = []
      for (let i = 0; i < parts.length; i++) {
        let part = parts[i]

        if (i === 0) {
          outputParts.push(part)
          continue
        }

        let lines = part.split('\n')

        let oursLines = []
        let theirsLines = []
        let othersLines = []

        let status = 'ours'
        for (let j = 0; j < lines.length; j++) {
          let line = lines[j]
          if (status === 'ours' && line === '=======') {
            status = 'theirs'
          }
          else if (status === 'theirs' && line.startsWith('>>>>>>> ')) {
            status = 'others'
            othersLines = lines.slice(j+1)
          }
          else if (status === 'ours') {
            oursLines.push(line)
          }
          else if (status === 'theirs') {
            theirsLines.push(line)
          }
        }

        let outputLines = []
        if (selectedVersion === 'ours') {
          outputLines = oursLines
        }
        else {
          outputLines = theirsLines
        }
        outputLines = outputLines.concat(othersLines)
        outputParts.push(outputLines.join('\n'))
      }

      let resolvedText = outputParts.join('\n')
      
      this.db.localConfig.outputText = resolvedText;
    }
  }
}

export default app