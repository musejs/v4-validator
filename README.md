## v4-validator

This package is part of the [musejs](https://github.com/musejs) suite of components.

This validator was inspired heavily by Laravel's [validator](http://laravel.com/docs/5.1/validation), in that it incorporates every rule present in that validator,
and implements similar functionality.

## Installation

`npm install v4-validator`

Note: requires node.js 4.0 or higher.

## Usage

### Quickstart
```
var V4Validator = require('v4-validator')();

/*
 * This data would probably come from a request, instead of laid out like this.
 * /
var data = {
    preferred_greeting: 'hello',
    secondary_greeting: 'hola',
    password: 'something',
    password_confirmation: 'something',
    superheroes: ['batman', 'superman'],
    preferences: {
        color: 'black'
    },
    best_friend: 'Jenn',
    underwear: 'boxers'
};

var rules = {
    preferred_greeting: 'required|string',
    secondary_greeting: ['required', 'in:hello,hola,aloha'],
    password: 'required|min:6|confirmed',
    superheroes: 'array|min:1',
    ['superheroes[0]']: 'required',
    ['preferences.color']: 'in:blue,black,pink,purple',
    best_friend: {
        rule: 'in',
        args: 'Jenn,Jill,Alcibiades'
    },
    underwear: {
        rule: 'in',
        args: ['boxers', 'briefs']
    }
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {

    // handle err

});
```

### Details

`require('v4-validator')` yields a factory function, with the following arguments: `config` and `DB`.
All arguments are optional.

Once the factory function is called, it will return a `V4Validator` class, which you may then use to create a new
validator instance whenever you wish to validate some data.  This can be done by calling either `new V4Validator(data, rules, messages)`
or `V4Validator.make(data, rules, messages)`.

- The `data` argument is a required plain javascript object; usually the input params from a request.
- The `rules` argument is a required plain javascript object whose keys are the fields in `data` you wish to assign rules to, and the corresponding
values are either an array of rules, or a string of rules separated by a pipe (`|`). If the rule requires arguments, add a colon (`:`) to the end of the rule name, 
followed by a comma-separated list of the arguments.
- Alternatively, each rule can be defined as a plain javascript object with the keys `rule` and `args`.
    - This becomes useful when an argument contains a comma and thus must be specified as an array. See the `date_format` example.
- `messages` is an optional plain javascript object whose keys are the fields in `data` you wish to assign a custom message to,
and the corresponding values are a string.

Nested fields in `data` can be referenced with path notation, as shown [here](https://lodash.com/docs#get).



### Rules

#### accepted
The field under validation must be yes, on, 1, or true.
This is useful for validating "Terms of Service" acceptance.

#### active_url
The field under validation must be a valid, active URL (determined by sending a HEAD request).

#### after:date[, should_transform]
The field under validation must be a value after a given `date`.
The dates will be passed into moment.js, and must therefore be [ISO-8601](http://momentjs.com/docs/##supported-iso-8601-strings) formatted.
If `should_transform` is set to "true", the field under validation in `data` will be transformed to a moment.js object.
```
var data = {
    field_1: '2015-11-03T01:27:33.153Z',
    field_2: '2015-11-05T01:27:33.153Z'
};
var rules = {
    field_1: 'after:2015-11-02',
    field_2: 'after:2015-11-02,true',

}
validator.validate(function(err) {
    // this will pass, and data.field_2 will become a moment.js object.
});
```

#### alpha
The field under validation must be entirely alphabetic characters.

#### alpha_num
The field under validation must be entirely alpha-numeric characters.

#### alpha_num_dash
The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### array
The field under validation must be an array.

#### before:date[, should_transform]
The field under validation must be a value before a given `date`.
The dates will be passed into moment.js, and must therefore be [ISO-8601](http://momentjs.com/docs/##supported-iso-8601-strings) formatted.
If `should_transform` is set to "true", the field under validation in `data` will be transformed to a moment.js object.
```
var data = {
    field_1: '2015-11-03T01:27:33.153Z',
    field_2: '2015-11-01T01:27:33.153Z'
};
var rules = {
    field_1: 'before:2015-11-04',
    field_2: 'before:2015-11-04,true'    
}
validator.validate(function(err) {
    // this will pass, and data.field_2 will become a moment.js object.
});
```
#### between:min,max
The field under validation must have a size between the given `min` and `max` (inclusive). Data is evaluated in the same fashion as the size rule.
```
var data = {
    field_1: 'hello',
    field_2: 5,
    field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
};
var rules = {
    field_1: 'between:4,6|between:4,5|between:5,6',
    field_2: 'between:4,6|between:4,5|between:5,6',
    field_3: 'between:4,6|between:4,5|between:5,6'

};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### boolean[, should_transform]
The field under validation must be able to be cast as a boolean. Accepted input are true, false, "true", "false", 1, 0, "1", and "0".
If `should_transform` is set to "true", the field under validation in `data` will be transformed to a strict boolean value (true or false).
```
var data = {
    field_1: true,
    field_2: false,
    field_3: 1,
    field_4: 0,
    field_5: '1',
    field_6: '0',
    field_7: 'true',
    field_8: 'false',
    field_9: '1',
    field_10: '0'
};
var rules = {
    field_1: 'boolean',
    field_2: 'boolean',
    field_3: 'boolean',
    field_4: 'boolean',
    field_5: 'boolean',
    field_6: 'boolean',
    field_7: 'boolean',
    field_8: 'boolean',
    field_9: 'boolean: true',
    field_10: 'boolean: true'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, and data.field_9 will become a boolean (true), and data.field_10 will become a boolean (false).
});
```

#### confirmed
The field under validation must have a matching field of foo_confirmation.
For example, if the field under validation is password, a matching password_confirmation field must be present in the input.

#### date[, should_transform]
The field under validation must be a valid date according to moment.js, and must therefore be [ISO-8601](http://momentjs.com/docs/##supported-iso-8601-strings) formatted.
If `should_transform` is set to "true", the field under validation in `data` will be transformed to a moment.js object.
```
var now = moment();

var data = {
    field_1: now.toISOString(),
    field_2: now.format(),
    field_3: '2015-10-31',
    field_4: 12334
};
var rules = {
    field_1: 'date:true',
    field_2: 'date',
    field_3: 'date',
    field_4: 'date'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, and data.field_1 will become a moment.js object.
});
```

#### date_format:format[, should_transform]
The field under validation must match the given `format`.
The format will be evaluated using moment.js. You should use either date or date_format when validating a field, not both.
This rule gives greater flexibility, since the date rule requires ISO-8601 formatting.

Further formatting details found [here](http://momentjs.com/docs/#/parsing/string-format/).

If `should_transform` is set to "true", the field under validation in `data` will be transformed to a moment.js object.

Note: date formats that contain a comma should use the longer form of rule definition.  See `field_7` in the example below.
```
var now = moment();

var data = {
    field_1: '10-31-2015',
    field_2: '10-31-15',
    field_3: '01-01-2015',
    field_4: '1-1-2015',
    field_5: 'Jan 1 2015',
    field_6: 'Jan 1st 2015',
    field_7: 'January 1st, 2015',
    field_8: now.unix(),
    field_9: 'Mon',
    field_10: 'Monday',
    field_11: '3:45pm',
    field_12: '15:45',
    field_13: '5:45'
};
var rules = {
    field_1: 'date_format:MM-DD-YYYY,true',
    field_2: 'date_format:MM-DD-YY',
    field_3: 'date_format:MM-DD-YYYY',
    field_4: 'date_format:M-D-YYYY',
    field_5: 'date_format:MMM D YYYY',
    field_6: 'date_format:MMM Do YYYY',
    field_7: {
        rule: 'date_format',
        args: ['MMMM Do, YYYY']
    },
    field_8: 'date_format:X',
    field_9: 'date_format:ddd',
    field_10: 'date_format:dddd',
    field_11: 'date_format:h:mma',
    field_12: 'date_format:HH:mm',
    field_13: 'date_format:H:mm'

};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, and data.field_1 will become a moment.js object.
});
```

#### different:field
The field under validation must have a different value than `field`.
```
var data = {
    field_1: 'hello',
    field_2: 'hi'
};
var rules = {
    field_1: 'different:field_2'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```
#### digits:value
The field under validation must be numeric and must have an exact length of `value`.
This counts non-numeric characters in its length.
```
var data = {
    field_1: '123',
    field_2: 123,
    field_3: '123.45',
    field_4: 123.45
};
var rules = {
    field_1: 'digits:3',
    field_2: 'digits:3',
    field_3: 'digits:6',
    field_4: 'digits:6'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### digits_between:min,max
The field under validation must have a length between the given min and max (inclusive).
```
var data = {
    field_1: '123',
    field_2: 123,
    field_3: '123.45',
    field_4: 123.45
};
var rules = {
    field_1: 'digits_between:2,4',
    field_2: 'digits_between:3,4',
    field_3: 'digits_between:5,6',
    field_4: 'digits_between:4,7'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### email
The field under validation must be formatted as an e-mail address.

#### exists:table[, column,...wheres]
//TODO

#### image
The field under validation must be an image (jpeg, png, bmp, gif, or svg).
This accepts either a file path or a URL. MIME is checked in both instances. If the field is a file path, it must exist
in the filesystem. If it is a URL, it must be an active URL.

#### in:...values
The field under validation must be included in the given list of `values`.
```
var data = {
    field_1: 'hello',
    field_2: 'hello'
};
var rules = {
    field_1: 'in:hello,hey,hi',
    field_2: 'in:hello'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### integer[, should_transform]
The field under validation must be an integer.
If `should_transform` is set to "true", the field under validation in `data` will be transformed to a Number.
```
var data = {
    field_1: '1',
    field_2: 1,
    field_3: '2'
};
var rules = {
    field_1: 'integer',
    field_2: 'integer',
    field_3: 'integer:true'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, and data.field_3 will become a Number.
});
```

#### ip
The field under validation must be an IP address.

#### json[, should_transform]
The field under validation must a valid JSON string.
If `should_transform` is set to "true", the field under validation in `data` will be transformed to its JSON-parsed equivalent.
```
var data = {
    field_1: JSON.stringify('hello'),
    field_2: JSON.stringify({greeting: 'hello'}),
    field_3: JSON.stringify(true),
    field_4: JSON.stringify(false),
    field_5: JSON.stringify([1, 2, 3]),
    field_6: JSON.stringify(1),
    field_7: JSON.stringify(0),
    field_8: JSON.stringify(''),
    field_9: JSON.stringify({greeting: 'hello'})
};
var rules = {
    field_1: 'json',
    field_2: 'json',
    field_3: 'json',
    field_4: 'json',
    field_5: 'json',
    field_6: 'json',
    field_7: 'json',
    field_8: 'json',
    field_9: 'json:true'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, and data.field_9 will become a plain javascript object.
});
```

#### max:value
The field under validation must be less than or equal to a maximum `value`.
Data is evaluated in the same fashion as the size rule.
```
var data = {
    field_1: 'hello',
    field_2: 5,
    field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
};
var rules = {
    field_1: 'max:5|max:6',
    field_2: 'max:5|max:6',
    field_3: 'max:5|max:6'

};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### mimes:...extensions
The file under validation must have a MIME type corresponding to one of the listed `extensions`.
This accepts either a file path or a URL. MIME is checked in both instances, but may fall back to string parsing.
If the field is a file path, it must exist in the filesystem. If it is a URL, it must be an active URL.

Alternatively, you may use actual MIME types, rather than extensions, e.g. "text/html" instead of "html".
```
var data = {
    field_1: 'sample-bmp.bmp',
    field_2: 'sample-gif.gif',
    field_3: 'sample-jpg.jpg',
    field_4: 'sample-png.png',
    field_5: 'http://www.bestmotherofthegroomspeeches.com/wp-content/themes/thesis/rotator/sample-1.jpg',
    field_6: 'sample-png-2.PNG',
    field_7: 'sample-txt.txt',
    field_8: 'sample-html.html',
    field_9: 'sample-html.html'

};
var rules = {
    field_1: 'mimes:bmp,gif,jpg,png',
    field_2: 'mimes:bmp,gif,jpg,png',
    field_3: 'mimes:bmp,gif,jpg,png',
    field_4: 'mimes:bmp,gif,jpg,png',
    field_5: 'mimes:bmp,gif,jpg,png',
    field_6: 'mimes:bmp,gif,jpg,png',
    field_7: 'mimes:txt',
    field_8: 'mimes:html',
    field_9: 'mimes:text/html'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```
#### min:value
The field under validation must have a minimum `value`.
Data is evaluated in the same fashion as the size rule.
```
var data = {
    field_1: 'hello',
    field_2: 5,
    field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
};
var rules = {
    field_1: 'min:5|min:4',
    field_2: 'min:5|min:4',
    field_3: 'min:5|min:4'

};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### not_in:...values
The field under validation must not be included in the given list of `values`.
```
var data = {
    field_1: 'hello',
    field_2: 'hello'
};
var rules = {
    field_1: 'not_in:hola,hey,hi',
    field_2: 'not_in:hola'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### numeric
The field under validation must be numeric.

#### object
The field under validation must be a plain object.

#### regex:pattern[,...flags]
The field under validation must match the given regular expression `pattern`, with optional `flags`.
```
var data = {
    field_1: '123',
    field_2: 123,
    field_3: 'abc123',
    field_4: 'abc123'
};
var rules = {
    field_1: 'regex:^[a-z0-9]+$,i',
    field_2: 'regex:^[a-z0-9]+$,i',
    field_3: 'regex:^[a-z0-9]+$,i',
    field_4: 'regex:^[a-z0-9]+$'

};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### required
The field under validation must be present in the input data.

#### required_if:another_field[,...values]
The field under validation must be present if `another_field` is equal to any `values`.
```
var data = {
    field_1: 'hello',
    field_2: 'hi',
    field_3: 'hola',
    field_4: null,
    field_5: 'hey',
    field_6: 'howdy',
    field_7: 'yo',
    field_8: false,
    field_9: 'bro',
    field_10: 0
};
var rules = {
    field_1: 'required_if:field_2,hi',
    field_3: 'required_if:field_4,null',
    field_5: 'required_if:field_6,sup,howdy',
    field_7: 'required_if:field_8,false',
    field_9: 'required_if:field_10,0'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### required_with:...fields
The field under validation must be present only if any of the other specified `fields` are present.
```
var data = {
    field_1: 'hello',
    field_2: 'hi',
    field_3: 'hola',
    field_4: 'hey',
    field_5: null,
    field_6: 'yo',
    field_7: ''
};
var rules = {
    field_1: 'required_with:field_2',
    field_3: 'required_with:field_4,field_5,field_6'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### required_with_all:...fields
The field under validation must be present only if all of the other specified `fields` are present.
```
var data = {
    field_1: 'hello',
    field_2: 'hi',
    field_3: 'hola',
    field_4: 'hey',
    field_5: 'sup',
    field_6: 'yo'
};
var rules = {
    field_1: 'required_with_all:field_2',
    field_3: 'required_with_all:field_4,field_5,field_6'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### required_without:...fields
The field under validation must be present only when any of the other specified `fields` are not present.
```
var data = {
    field_1: 'hello',
    field_2: 'hi',
    field_3: 'hola',
    field_4: 'hey',
    field_5: null,
    field_6: 'yo',
    field_7: ''
};
var rules = {
    field_1: 'required_without:field_2,field_5',
    field_3: 'required_without:field_4,field_6,field_7'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### required_without_all
The field under validation must be present only when all of the other specified fields are not present.
```
var data = {
    field_1: 'hello',
    field_3: 'hola',
    field_4: undefined,
    field_5: null,
    field_6: [],
    field_7: ''
};
var rules = {
    field_1: 'required_without_all:field_2,field_5',
    field_3: 'required_without_all:field_4,field_6,field_7'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### same:field
The given `field` must match the field under validation.
```
var data = {
    field_1: 'hello',
    field_2: 'hello'
};
var rules = {
    field_1: 'same:field_2'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### size:value
The field under validation must have a size matching the given `value`.
For numeric data, value corresponds to a given number value.
For all other values, corresponds to the value of a "length" parameter.
```
var data = {
    field_1: 'hello',
    field_2: 5,
    field_3: ['one', 'two', 'three', 'four', 'five']
};
var rules = {
    field_1: 'size:5',
    field_2: 'size:5',
    field_3: 'size:5'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});
```

#### string
The field under validation must be a string.

#### timezone
The field under validation must be a valid timezone identifier according to moment.js.

#### unique
// TODO
#### url
The field under validation must be a valid URL.

## API

#### `validator.validate(callback)` 
Validates the given data.

If validation fails, `err` will be whatever is returned by the `errorHandler`. The default `errorHandler` returns an instance of `ValidationError`.

More details [here](#custom-error-handling).

#### `validator.sometimes(field, rules, condition)`
Conditionally adds rules.

More details [here](#conditional-rules).

#### `validator.failed()`
Returns a plain javascript object, whose keys are the failed fields, and the values are an array of the rules that failed.

#### `V4Validator.make(data, rules, messages)`
Creates a new validator instance.

#### `V4Validator.rule(rule, closure)`
Adds a new rule, or replaces an existing rule.

More details [here](#adding-new-rules).

#### `V4Validator.replacer(rule, closure)`
Adds a new message replacer for a rule, or replaces an existing replacer.

More details [here](#message-placeholders)

#### `V4Validator.errorHandler(closure)`
Sets a new errorHandler function. This function should return the `err` object that will be created when validation fails.

More details [here](#custom-error-handling)

## Advanced Usage

### The factory function

The full factory function with all its (optional) arguments are as follows:
```
var V4Validator = require('v4-validator')(config, DB);
```

`config` is an object that can be used to override the defaults used. Any and all properties supplied are optional.
Under the hood, [_.defaultsDeep](https://lodash.com/docs#defaultsDeep) is used. Here's the full possible structure:
```
{
    messages: {
        [rule]: 'The message for this rule.'
    },
    rules: {
        [rule]: function(data, field, value, parameters, callback) {}
    },
    replacers: {
        [rule]: function(field, constraint) {}
    },
    errorHandler: function(errors) {}
}
```

`errorHandler` is a function that can be used to override the default handling of errors. Whatever is returned from this
function will be passed as the error in a failed validation. The signature is as follows:
```
function(errors) {}
```

`DB` is a class adhering to inspirationjs's "DB" contract.  [babylon-db](https://github.com/musejs/babylon-db) fits right in.
Supplying this allows use of the "exists" and "unique" rules.

### Adding new rules

You may either add new rules or override existing rule implementations by supplying it in the factory's `config` object,
or if you already have a `V4Validator` class, you may call the `rule` method:
```
var V4Validator = require('v4-validator')();

V4Validator.rule('equals_something', function(data, field, value, parameters, callback) {

    callback(null, value === 'something');
});

var data = {
    field_1: 'something'
};
var rules = {
    field_1: 'equals_something'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass.
});

```

### Conditional rules

Conditional rules can be applied in one of two ways. The first way works for rules you wish to add only if a field
is present in the data. You do this by adding the "sometimes" rule before any others.

##### Example 1:
```
var data = {
    meal_selection: 'meat'
};

var rules = {
    meal_selection: ['required', 'in:vegetables,meat'],
    type_of_meat: ['sometimes', 'required', 'in:beef,chicken,pork']
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    // this will pass, because "type_of_meat" is not present in the data.
});
```
##### Example 2:
```
var data = {
    meal_selection: 'meat',
    type_of_meat: 'turkey'
};

var rules = {
    meal_selection: 'required|in:vegetables,meat',
    type_of_meat: ['sometimes', 'required', 'in:beef,chicken,pork']
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    /**
     * this will fail,
     * because the "type_of_meat" field was present in the data,
     * so its conditional rules kicked in.
     */
});
```

For cases that require more complex conditions, you may use the `sometimes` method of the validator instance.

It's signature is:
```
validator.sometimes(field, rules, condition);
```
- `field` is the name of the field to apply the rules.
- `rules` are the rules to apply.
- `condition` is a function that should return a boolean to indicate if to apply the `rules` or not. It is supplied with the `data` object as an argument.

##### Example 1:
```
var data = {
    meal_selection: 'meat'
};

var rules = {
    meal_selection: ['required', 'in:vegetables,meat']
};

var validator = V4Validator.make(data, rules);

/**
 * This will require a "type_of_meat" field in the data,
 * if the "meal_selection" field equals "meat".
 */
validator.sometimes('type_of_meat', ['required', 'in:beef,chicken,pork'], function(data) {

    return data.meal_selection == 'meat';
});

validator.validate(function(err) {
    /**
     * this will fail,
     * because "meal_selection" was "meat",
     * causing the conditional rules for "type_of_meat" to kick in.
     */
});
```

### Message placeholders

Every message supplied (either in the factory's `config` object or in the `messages` object in `V4Validator.make(data, rules, messages)`)
can include placeholders. Placeholders are identified by a colon (":") before it. The most commonly found placeholder in
the default messages is ":attribute", which maps to the name of the field under validation.

Whenever an error message needs to be generated for a rule, it is first passed through functions called "replacers".
These functions are keyed by the rule they run on. Additionally, there is a default replacer called before the rule-specific
replacers are called.

You may add or overwrite the default replacers with your own functions by either supplying them in the factory's `config` object,
or if you already have a `V4Validator` class, you may call the `replacer` method:
```
var V4Validator = require('../src/factory')();

V4Validator.replacer('required', function(field, constraint) {

    constraint.message = constraint.message.replace(new RegExp(':attribute'), 'XXX');
});

var data = {};

var rules = {
    field_1: 'required'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {

});
```
The above example will replace the ":attribute" placeholder with the string "field", e.g. "The XXX is required.".  The original `required` replacer
replaced ":attribute" with the field name with spaces instead of non-alphanumeric characters, e.g. "The field 1 is required.".

To overwrite the default replacer, you must first get the default replacer's key, which is actually a Symbol object (to prevent key collisions).
You may do so by first calling `V4Validator.defaultReplacerKey()`.
```
var default_replacer_key = V4Validator.defaultReplacerKey();
V4Validator.replacer(default_replacer_key, function(field, constraint) {
    // do your replacing
});

```

### Custom error handling

The error handler is a function that takes in the resulting validation errors, and returns *something*.
That *something* will be returned when `validator.validate` is called.

You may replace the default error handler function by supplying it in the factory's `config` object,
or if you already have a `V4Validator` class, you may call the `errorHandler` method:
```
var V4Validator = require('v4-validator')();

V4Validator.errorHandler(function(errors) {

    return new CustomError(errors);
});

var data = {};

var rules = {
    field_1: 'required'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {
    
    //err is the instance of "CustomError" created by the error handler.
});

```