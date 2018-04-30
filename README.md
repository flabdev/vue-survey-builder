# vue-survey-builder
This is a survey builder component for vue.js applications.

### How to install
You can install the component using `npm i -S vue-survey-builder`

### Demo
You can see the demo [here](http://vue-survey-builder.s3-website-us-east-1.amazonaws.com/#/)

### Demo Source Code
Please look at the sample code [here](https://github.com/rajeshwarpatlolla/vue-survey-builder-test)

### Steps to use
*Step 1:*
Once you it install, you can import the `SurveyBuilder` by

`import SurveyBuilder from 'SurveyBuilder';`

*Step 2:*
We are using [this JSON](https://github.com/FissionHQ/vue-survey-builder/blob/master/src/survey-builder.json) to build any type of question. Depending on the type of question, only few keys are used in the whole JSON.

*Step 3:*


### Keys of the JSON
- **id** : This is a unique field, which will be created dynamically for every qiestion. This field is required for all type of questions.
- **type** : This represents the type of the question. The supported types are mentioned [here](). This field is required for all type of questions.
- **multiSelect** : This represents whether the question is multi select question or not. This is is `false` by default and will be `true` only for `MULTI_CHOICE` question.
- **characterLimited** : It represents the limit for characters, the user can enter. This is used for text type of questions.
- **hasMinMax** : This represents whether the question has any min and max values or not. This will be used by `NUMBER` type of questions only.
- **allowDecimals** : This represents whether we need to allow the decimals or not. This will be used by `NUMBER` type only.
- **sequence** : This represents the sequence of the question. This field will be used by all the question types.
- **minValue** : This represents the min value. This field will be used by `NUMBER` type of questions only.
- **maxValue** : This represents the max value. This field will be used by `NUMBER` type of questions only.
- **labels** : This represents the labels for scale type of question. This field is required for scale type only.
- **dateFormat** : This represents the date format to be shown. This field is required for `DATE` type of questions.
- **timeFormat** : This represents the date format to be shown. This field is required for `TIME` type of questions. 
- **intervals** : This represents the number of intervals used for `SCALE` type of questions.
- **textLimit** : This represents the number character limit for `TEXT` type of questions.
- **units** : This represents the units to be shown. This field will be used for `NUMBER` type of questions.
- **options** : This represents the options of question. This field is used by `SINGLE_CHOICE` and `MULTI_CHOICE` questions.

### Supported Question types
- BOOLEAN
- SINGLE_CHOICE
- MULTI_CHOICE
- SCALE
- NUMBER
- TEXT
- DATE
- TIME

### Versions
#### 0.1.0
This version is the initial official release of this component. It has all the required functionalities to build the surveys using vue.js

### To-Do List
- Support for rating question
- Improve JSON
- Introduce drag and drop

### Contributors
[Rajeshwar Patlolla](https://github.com/rajeshwarpatlolla)

### Organisation
[Fission Labs](http://fissionlabs.com/)

### LICENSE
Please read it [here]()