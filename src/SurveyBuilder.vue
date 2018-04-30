<template>
  <div class="vue-survey-builder-content vsb-content">
    <select class="vsb-select" v-model="selectedType" v-on:change="questionTypeChanged(selectedType)">
      <option v-for="(questionType, index) in questionTypes" :value="questionType.value" :key="index" :disabled="questionType.value === 'DEFAULT'" :selected="questionType.value === 'DEFAULT'">{{questionType.label}}</option>
    </select>
    <div class="question-section" v-if="selectedType !== 'DEFAULT'">
      <div class="pb-10">
        <div class="vsb-choices-text">Question</div>
        <input type="text" class="" placeholder="Enter question text" v-model="question.body">
      </div>
      <div class="" v-if="selectedType === 'BOOLEAN'">
        <div class="vsb-choices-text">Answer Choices</div>
        <div class="" v-for="(option, index) in question.options" :key="index">
          <div class="clear-both">
            <input type="text" class="width-100 float-left" placeholder="Enter an answer choice" v-model="option.body">
            <button class="vsb-btn-link color-red width-10 mt-10" v-on:click="deleteQuestionOptionItem(question.options, index)" v-if="index > 1">Remove</button>
          </div>
        </div>
      </div>
      <div class="" v-if="selectedType === 'DATE'">
        <div class="">
          <label class="vsb-block"><input type="radio" v-model="question.dateFormat" value="MM/DD/YY"> MM/DD/YY</label>
          <label class="vsb-block"><input type="radio" v-model="question.dateFormat" value="DD/MM/YY"> DD/MM/YY</label>
          <label class="vsb-block"><input type="radio" v-model="question.dateFormat" value="MM/DD/YYYY"> MM/DD/YYYY</label>
          <label class="vsb-block"><input type="radio" v-model="question.dateFormat" value="DD/MM/YYYY"> DD/MM/YYYY</label>
        </div>
      </div>
      <div class="" v-if="selectedType === 'MULTI_CHOICE'">
        <div class="vsb-choices-text">Answer Choices</div>
        <div class="" v-for="(option, index) in question.options" :key="index">
          <div class="clear-both">
            <input type="text" class="width-90 float-left" placeholder="Enter an answer choice" v-model="option.body">
            <button class="vsb-btn-link color-red width-10 mt-10" v-on:click="deleteQuestionOptionItem(question.options, index)" v-if="index > 1">Remove</button>
          </div>
        </div>
        <div class="display-block">
          <button class="vsb-btn-link color-blue" v-on:click="addAnotherAnswer()">Add another answer</button>
        </div>
      </div>

      <div class="" v-if="selectedType === 'NUMBER'">
        <label class="display-block">
          <input type="checkbox" class="" v-model="question.hasUnits" name="hasUnits" />
          <span class="">Answer label <input type="text" class="width-10" placeholder="ex. mins, lbs, days" v-model="question.units" :disabled="!question.hasUnits"></span>
        </label>
        <label class="display-block">
          <input type="checkbox" v-model="question.hasMinMax" name="subType" />
          <span class="">Min/max value
            <input type="number" class="width-10" v-model="question.minValue" placeholder="min" min="1" max="2048" :disabled="!question.hasMinMax">
            <span class="width-10">to</span>
            <input type="number" class="width-10" v-model="question.maxValue" placeholder="max" min="1" max="2048" :disabled="!question.hasMinMax">
          </span>
        </label>
        <label class="display-block">
          <input type="checkbox" v-model="question.allowDecimals" value="Single" name="subType" />
          <span class="">Allow decimals</span>
        </label>
      </div>
      <div class="scale-type" v-if="selectedType === 'SCALE'">
        <div>Scale labels</div>
        <div class="">
          <div class="display-inline-block">Intervals</div>
          <div class="intervals display-inline-block">
            <input type="number" min="2" max="100" v-model="question.intervals" v-on:change="changeLabelsLength(question.intervals)">
          </div>
          <span class="" v-if="question.reportable">Max of 100 intervals can be entered.</span>
        </div>
        <div v-if="question.intervals > 0">
          <div class="" v-for="(value, index) in question.labels" :key="index">
            <div v-if="index === 0">
              <div class="width-10 float-left pt-10">Top</div>
              <div class="width-90">
                <input type="text" class="" placeholder="Enter value" v-model="question.labels[question.labels.length - index - 1]">
              </div>
            </div>
            <div v-else-if="question.labels && (index === question.labels.length - 1)">
              <div class="width-10 float-left pt-10">Bottom</div>
              <div class="width-90">
                <input type="text" name="vertical-labels" class="" placeholder="Enter value" v-model="question.labels[question.labels.length - index - 1]">
              </div>
            </div>
            <div class="text-right" v-if="question.labels && index !== 0 && (index !== question.labels.length - 1)">
              <div class="width-90">
                <input type="text" class="" placeholder="Enter value" v-model="question.labels[question.labels.length - index - 1]">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="" v-if="selectedType === 'SINGLE_CHOICE'">
        <div class="vsb-choices-text">Answer Choices</div>
        <div class="" v-for="(option, index) in question.options" :key="index">
          <div class="">
            <input type="text" class="" placeholder="Enter an answer choice" v-model="option.body">
          </div>
          <div class="">
            <button class="" v-on:click="deleteQuestionOptionItem(question.options, index)" v-if="index > 1">Remove</button>
          </div>
        </div>
        <div class="vsb-add-answer-btn vsb-btn-link color-blue">
          <a v-on:click="addAnotherAnswer()">Add another answer</a>
        </div>
      </div>
      <div class="" v-if="selectedType === 'TEXT'">
        <label class="">
          <input type="checkbox" v-model="question.characterLimited" name="characterLimited" />
          <span class="">Character limit <input type="number" class="char-limit-input" v-model="question.textLimit" placeholder="" min="1" max="2048" :disabled="!question.characterLimited"></span>
        </label>
      </div>
      <div class="" v-if="selectedType === 'TIME'">
        <div class="">
          <label class=""><input type="radio" v-model="question.timeFormat" value="12" v-on:click="timeFormatModified(question.timeFormat)"> 12 hrs</label>
          <label class=""><input type="radio" v-model="question.timeFormat" value="24" v-on:click="timeFormatModified(question.timeFormat)"> 24 hrs</label>
        </div>
      </div>
      <div class="buttons-section">
        <button type="button" class="vsb-btn-link mr-10 color-green" @click="saveQuestion(question)">Save</button>
        <button type="button" class="vsb-btn-link mr-10 color-blue" @click="cancelQuestion(question)">Cancel</button>
        <!-- <button type="button" class="vsb-btn-link mr-10 color-red" @click="deleteQuestion(question)">Delete</button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveyBuilder',
  data() {
    return {
      questionTypes: [
        { value: 'DEFAULT', label: '- Select a question type -' },
        { value: 'BOOLEAN', label: 'Yes or No' },
        { value: 'DATE', label: 'Date' },
        { value: 'MULTI_CHOICE', label: 'Multiple Choice' },
        { value: 'NUMBER', label: 'Number' },
        { value: 'SCALE', label: 'Scale' },
        { value: 'SINGLE_CHOICE', label: 'Single Choice' },
        { value: 'TEXT', label: 'Text' },
        { value: 'TIME', label: 'Time' },
      ],
      question: this.options,
      selectedType: null,
    };
  },
  props: ['options'],
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.question.type = this.question.type ? this.question.type : 'DEFAULT';
    this.selectedType = this.question.type;

    window.console.log(this.question, this.selectedType);
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @desc {String} type
     * @param {String} type
     * @return {null}
     */
    questionTypeChanged(type) {
      this.question.type = this.selectedType;
      switch (type) {
        case 'BOOLEAN':
          this.question.options = [{ body: 'Yes', sequence: 1 }, { body: 'No', sequence: 2 }];
          break;
        case 'SCALE':
          this.question.labels.length = 2;
          break;
        default:
          window.console.log('Question type not matched');
      }
    },

    /**
     * @param {String} format
     * @return {null}
     */
    timeFormatModified(format) {
      window.console.log(format);
    },

    /**
     * @param {null}
     * @return {null}
     */
    addAnotherAnswer() {
      if (!this.question.options) {
        this.question.options = [];
      }
      let maxSequence = Number(Math.max(...this.question.options.map(x => x.sequence)));
      if (!maxSequence) {
        maxSequence = this.question.options.length;
      }
      this.question.options.push({ body: null, sequence: maxSequence + 1, nextQuestion: null, imageUrl: null }); // eslint-disable-line
      this.$forceUpdate();
    },

    /**
     * @param {Object, Number}  options, index
     * @return {null}
     */
    deleteQuestionOptionItem(options, index) {
      this.question.options.splice(index, 1);
    },

    /**
     * @param {null}
     * @return {String} guid
     */
    getGUID() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
    },

    /**
     * @param {Object} question
     * @return {null}
     */
    saveQuestion(question) {
      question.id = question.id ? question.id : this.getGUID(); // eslint-disable-line
      this.$root.$emit('add-update-question', { question, operation: 'save' });
      this.question = { type: 'DEFAULT' };
    },

    /**
     * @param {Object} question
     * @return {null}
     */
    cancelQuestion(question) {
      window.console.log(question);
      this.question = { type: 'DEFAULT' };
    },

    /**
     * @param {Object} question
     * @return {null}
     */
    deleteQuestion(question) {
      window.console.log(question);
    },

    /**
     * @param {Number} intervals
     * @return {null}
     */
    changeLabelsLength(intervals) {
      this.question.labels.length = intervals;
    },
  },
};
</script>

<style scoped lang="scss">
$color-primary: #f8f8f8;
$color-secondary: #eaf0f4;
$color-blue: #4c8ce4;
$color-orange: #ff9635;
$color-red: #f06559;
$color-green: #48bf7a;

@for $i from 0 through 5 {
  .p-#{$i * 2} {
    padding: #{$i * 2}px !important;
  }
  .pt-#{$i * 2} {
    padding-top: #{$i * 2}px !important;
  }
  .pr-#{$i * 2} {
    padding-right: #{$i * 2}px !important;
  }
  .pb-#{$i * 2} {
    padding-bottom: #{$i * 2}px !important;
  }
  .pl-#{$i * 2} {
    padding-left: #{$i * 2}px !important;
  }
  .m-#{$i * 2} {
    margin: #{$i * 2}px !important;
  }
  .mt-#{$i * 2} {
    margin-top: #{$i * 2}px !important;
  }
  .mr-#{$i * 2} {
    margin-right: #{$i * 2}px !important;
  }
  .mb-#{$i * 2} {
    margin-bottom: #{$i * 2}px !important;
  }
  .ml-#{$i * 2} {
    margin-left: #{$i * 2}px !important;
  }
  .fs-#{$i * 2} {
    font-size: #{$i * 2}px !important;
  }
}

.color-blue {
  color: $color-blue;
}
.color-orange {
  color: $color-orange;
}
.color-red {
  color: $color-red;
}
.color-green {
  color: $color-green;
}

.vue-survey-builder-content {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 1px 1px 5px 0px #ddd;
  background-color: $color-primary;
  border-radius: 2px;
  margin: 12px 0;

  input[type='text'],
  input[type='number'],
  select {
    width: 100%;
    padding: 0 10px;
    height: 38px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 2px;
    box-sizing: border-box;
    font-size: 12px;
    background-color: #fff;
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=);
  }

  button {
    padding: 10px;
    text-align: center;
    font-size: 14px;
    margin: 2px 0;
    cursor: pointer;
    border: 1px solid $color-primary;
  }
  .float-left {
    float: left;
  }
  .float-right {
    float: right;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .width-90 {
    width: 90% !important;
    display: inline-block;
  }
  .width-10 {
    width: 10% !important;
    display: inline-block;
  }
  .display-block {
    display: block;
    clear: both;
  }
  .display-inline-block {
    display: inline-block;
    clear: both;
  }
  .clear-both {
    clear: both;
  }
  .vsb-btn-link {
    border: none;
    background: none;
    padding: 5px;
  }

  .question-section {
    border: 1px solid $color-secondary;
    padding: 10px;
    margin: auto;
  }

  .vsb-block {
    display: block;
    padding: 5px 0;
  }

  .vsb-choices-text {
    font-size: 16px;
  }

  .vsb-select {
    max-width: 200px;
  }
  .char-limit-input {
    max-width: 100px;
  }
  input:disabled,
  textarea:disabled {
    background: $color-primary;
    pointer-events: none;
    cursor: no-drop;
  }
  .buttons-section {
    padding-top: 20px;
    clear: both;
  }
  *:focus {
    outline: none;
  }
  .scale-type {
    .intervals input {
      width: 60px;
    }
  }
}
</style>
