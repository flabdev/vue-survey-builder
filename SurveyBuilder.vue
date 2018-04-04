<template>
  <div class="sb-content">
    <select class="sb-select" v-model="question.type" v-on:change="questionTypeChanged(question.type)">
      <option v-for="questionType in questionTypes" :value="questionType"
      :disabled="questionType.value === 'Default'" :selected="questionType.value === 'default'">{{questionType.label}}</option>
    </select>
    <div class="question-section" v-if="selectedType.value !== 'default'">
      <div class="">
        <div class="sb-choices-text">Question Body</div>
        <input type="text" class="" placeholder="Enter question text" v-model="question.body">
      </div>
      <div class="" v-if="selectedType.value === 'boolean'">
        <div class="sb-choices-text">Answer choices</div>
        <div class="sb-pt-20">
          <div class="">Yes</div>
          <div class="">No</div>
        </div>
      </div>
      <div class="" v-if="selectedType.value === 'date'">
        <div class="">
          <label class="sb-block"><input type="radio" v-model="question.dateFormat" value="mm/dd/yy" v-on:click="dateFormatModified(question.dateFormat)"> mm/dd/yy</label>
          <label class="sb-block"><input type="radio" v-model="question.dateFormat" value="dd/mm/yy" v-on:click="dateFormatModified(question.dateFormat)"> dd/mm/yy</label>
          <label class="sb-block"><input type="radio" v-model="question.dateFormat" value="mm/dd/yyyy" v-on:click="dateFormatModified(question.dateFormat)"> dd/mm/yy</label>
          <label class="sb-block"><input type="radio" v-model="question.dateFormat" value="dd/mm/yyyy" v-on:click="dateFormatModified(question.dateFormat)"> dd/mm/yy</label>
        </div>
      </div>
      <div class="" v-if="selectedType.value === 'multiChoice'">
        <div class="sb-choices-text">Answer choices</div>
        <div class="" v-for="(option, index) in question.options">
          <div class="clear-both">
            <input type="text" class="width-90 float-left" placeholder="Enter an answer choice" v-model="option.body">
            <button class="sb-btn-link color-red width-10 mt-10" v-on:click="deleteQuestionOptionItem(question.options, index)" v-if="index > 1">Remove</button>
          </div>
        </div>
        <div class="display-block"><button class="sb-btn-link color-blue" v-on:click="addAnotherAnswer()">Add another answer</button></div>
      </div>

      <div class="" v-if="selectedType.value === 'number'">
        <label class="">
          <input type="checkbox" v-model="question.hasUnits" name="hasUnits"/>
          <span class="">Answer label <input type="text" class="" placeholder="ex. mins, lbs, days" v-model="question.units" :disabled="!question.hasUnits"></span>
        </label>
        <label class="">
          <input type="checkbox" v-model="question.hasMinMax" name="subType"/>
          <span class="">Min/max value
            <input type="number" class="" v-model="question.minValue" placeholder="min" min="1" max="2048" :disabled="!question.hasMinMax">
            <span class="">to</span>
            <input type="number" class="" v-model="question.maxValue" placeholder="max" min="1" max="2048" :disabled="!question.hasMinMax">
          </span>
        </label>
        <label class="">
          <input type="checkbox" v-model="question.allowDecimals" value="Single" name="subType"/>
          <span class="">Allow decimals</span>
        </label>
      </div>
      <div class="" v-if="selectedType.value === 'scale'">
        <h5>Scale labels</h5>
        <div class="">
          <div class="">Intervals</div>
          <div class="">
            <input type="number" class="" min="2" max="8" v-model="question.intervals" v-on:change="changeLabelsLength(question.intervals)">
          </div>
          <span class="" v-if="question.reportable">Max of 8 intervals can be entered when dashboard graph option is selected.</span>
        </div>
        <div v-if="question.intervals > 0">
          <div class="" v-for="(value, index) in question.labels">
            <div v-if="index === 0">
              <div class="">
                <span v-if="question.verticalScale">Top</span>
                <span v-if="!question.verticalScale">Right</span>
              </div>
              <div class="">
                <input type="text" v-on:blur="validateLabels(question.labels.length - index - 1)" class="" placeholder="Enter value" v-model="question.labels[question.labels.length - index - 1]">
                <span v-if="validLabels.includes(question.labels.length - index - 1)" class="">Labels cannot exceed 16 characters in length</span>
              </div>
            </div>
            <div v-else-if="question.labels && (index === question.labels.length - 1)">
              <div class="">
                <span v-if="question.verticalScale">Bottom</span>
                <span v-if="!question.verticalScale">Left</span>
              </div>
              <div class="">
                <input type="text" name="vertical-labels" class="" placeholder="Enter value" v-on:blur="validateLabels(question.labels.length - index - 1)"
                  v-model="question.labels[question.labels.length - index - 1]">
                <span v-if="validLabels.includes(question.labels.length - index - 1)" class="">Labels cannot exceed 16 characters in length</span>
              </div>
            </div>
            <div v-if="question.labels && index !== 0 && (index !== question.labels.length - 1)">
              <div class=""></div>
              <div class="">
                <input type="text" class="" placeholder="Enter value" v-on:blur="validateLabels(question.labels.length - index - 1)" v-model="question.labels[question.labels.length - index - 1]"
                  v-if="!question.reportable">
                <input type="text" class="" placeholder="Enter value" v-on:blur="validateLabels(question.labels.length - index - 1)" v-model="question.labels[question.labels.length - index - 1]"
                  v-if="question.reportable">
                <span v-if="validLabels.includes(question.labels.length - index - 1)" class="">Labels cannot exceed 16 characters in length</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="" v-if="selectedType.value === 'singleChoice'">
        <div class="sb-choices-text">Answer choices</div>
        <div class="" v-for="(option, index) in question.options">
          <div class="">
            <input type="text" class="" placeholder="Enter an answer choice" v-model="option.body">
          </div>
          <div class="">
            <button class="" v-on:click="deleteQuestionOptionItem(question.options, index)" v-if="index > 1">Remove</button>
          </div>
        </div>
        <div class="sb-add-answer-btn sb-btn-link color-blue"><a v-on:click="addAnotherAnswer()">Add another answer</a></div>
      </div>
      <div class="" v-if="selectedType.value === 'text'">
        <label class="">
          <input type="checkbox" v-model="question.characterLimited" name="characterLimited"/>
          <span class="">Character limit <input type="number" class="char-limit-input" v-model="question.textLimit" placeholder="" min="1" max="2048" :disabled="!question.characterLimited"></span>
        </label>
      </div>
      <div class="" v-if="selectedType.value === 'time'">
        <div class="">
          <label class=""><input type="radio" v-model="question.timeFormat" value="12" :disabled="!question.showTime" v-on:click="timeFormatModified(question.timeFormat)"> 12 hrs</label>
          <label class=""><input type="radio" v-model="question.timeFormat" value="24" :disabled="!question.showTime" v-on:click="timeFormatModified(question.timeFormat)"> 24 hrs</label>
        </div>
      </div>
      <div class="buttons-section">
        <button type="button" class="sb-btn-link mr-10 color-green">Save</button>
        <button type="button" class="sb-btn-link mr-10 color-blue">Cancel</button>
        <button type="button" class="sb-btn-link mr-10 color-red">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import surveyBuilderJson from './survey-builder.json';

  export default {
    name: 'add-edit-questions',
    data() {
      return {
        selectedType: { value: 'default', lebel: '' },
        question: { type: 'default' },
        questionTypes: [
          { value: 'default', label: '- Select a question type -' },
          { value: 'boolean', label: 'Yes or No' },
          { value: 'date', label: 'Date' },
          { value: 'multiChoice', label: 'Multiple Choice' },
          { value: 'number', label: 'Number' },
          { value: 'scale', label: 'Scale' },
          { value: 'singleChoice', label: 'Single Choice' },
          { value: 'text', label: 'Text' },
          { value: 'time', label: 'Time' },
        ],
      };
    },
    props: ['options'],
    computed: {},
    watch: {},
    beforeCreate() { },
    created() { },
    beforeMount() { },
    mounted() {
      this.question = surveyBuilderJson;
      window.console.log(this.question);
    },
    beforeUpdate() { },
    updated() { },
    beforeDestroy() { },
    destroyed() { },
    methods: {

      /**
       * @param {Number} val1
       * @param {Number} val2
       * @return {null}
       */
      clicked(inputValue) {
        window.console.log('clicked and, now in side survey builder');
        this.$root.$emit('send', inputValue);
      },

      /**
       * @param {String} type
       * @return {null}
       */
      questionTypeChanged(type) {
        this.selectedType = type;
        window.console.log(this.selectedType);
      },

      /**
       * @param {String} format
       * @return {null}
       */
      dateFormatModified(format) {
        window.console.log(format);
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
        let maxSequence = Number(_.max(_.map(this.question.options, 'sequence')));
        if (!maxSequence) {
          maxSequence = this.question.options.length;
        }
        this.question.options.push({ body: null, sequence: maxSequence + 1, nextQuestion: null, imageUrl: null }); // eslint-disable-line
        this.$forceUpdate();
      },

    },
  };

</script>

<style scoped lang="scss">
  $color-primary: #f5f8fa;
  $color-secondary: #eaf0f4;
  $color-blue: #4c8ce4;
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
  .color-red {
    color: $color-red;
  }
  .color-green {
    color: $color-green;
  }

  .sb-content {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: normal;
    border: 1px solid #d3dee3;
    padding: 10px;
    box-shadow: 1px 1px 5px 0px #d3dee3;
    background-color: $color-primary;
    border-radius: 2px;

    input[type=text], input[type=number], select {
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
      /*-webkit-appearance: none;
      -moz-appearance: none;
      background-position: right 50%;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFW…zTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=);
      border-radius: 2px;*/
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
    .width-90 {
      width: 85% !important;
    }
    .width-10 {
      width: 10% !important;
    }
    .display-block {
      display: block;
      clear: both;
    }
    .clear-both {
      clear: both;
    }
    .sb-btn-link {
      border: none;
      background: none;
      padding: 5px;
    }
    
    .question-section {
      border: 1px solid $color-secondary;
      padding: 10px;
      margin: auto;
    }

    .sb-block {
      display: block;
      padding: 5px 0;
    }

    .sb-choices-text {
      font-size: 16px;
    }

    .sb-select {
      max-width: 200px;
    }
    .char-limit-input {
      max-width: 100px;
    }
    input:disabled, textarea:disabled {
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
  }
</style>
